from http.server import BaseHTTPRequestHandler
import json, os, io, base64, cgi
from PIL import Image

VISION_API_KEY = os.environ.get('VISION_API_KEY', '')
VISION_MODEL   = "meta/llama-3.2-11b-vision-instruct"
ENDPOINT       = "https://integrate.api.nvidia.com/v1/chat/completions"

def call_vision(messages):
    import urllib.request
    payload = json.dumps({"model": VISION_MODEL, "max_tokens": 800, "messages": messages}).encode()
    req = urllib.request.Request(ENDPOINT, data=payload, headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + VISION_API_KEY
    }, method='POST')
    with urllib.request.urlopen(req, timeout=55) as res:
        result = json.loads(res.read().decode())
        choice = result['choices'][0]['message']
        return (choice.get('content') or choice.get('reasoning_content') or '').strip()

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.end_headers()

    def do_POST(self):
        try:
            form = cgi.FieldStorage(fp=self.rfile, headers=self.headers,
                environ={'REQUEST_METHOD': 'POST',
                         'CONTENT_TYPE': self.headers.get('Content-Type', '')})
            if 'file' not in form:
                return self._err('No file uploaded')
            file_item = form['file']
            filename   = file_item.filename.lower()
            file_bytes = file_item.file.read()

            if filename.endswith('.pdf'):
                from pypdf import PdfReader
                reader = PdfReader(io.BytesIO(file_bytes))
                text = ''.join(p.extract_text() + '\n' for p in reader.pages).strip()
                if not text:
                    return self._err('Image-based PDF — upload as image instead.')
                text = text[:3000].rsplit('.', 1)[0] + '.'
                self._ok({'text': text, 'type': 'pdf'})

            elif filename.endswith(('.jpg', '.jpeg', '.png', '.webp')):
                img = Image.open(io.BytesIO(file_bytes))
                img.thumbnail((1024, 1024))
                img = img.convert('RGB')
                buf = io.BytesIO()
                img.save(buf, format='JPEG', quality=85)
                b64 = base64.b64encode(buf.getvalue()).decode()
                messages = [{"role": "user", "content": [
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}},
                    {"type": "text", "text": "Extract all text from this image. Describe diagrams in detail. Format as learning material."}
                ]}]
                self._ok({'text': call_vision(messages), 'type': 'image'})
            else:
                self._err('Only PDF or image files supported.')
        except Exception as e:
            self._err(str(e), 500)

    def _ok(self, data):
        self._send(200, data)

    def _err(self, msg, code=400):
        self._send(code, {'error': msg})

    def _send(self, code, data):
        body = json.dumps(data).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(body)
