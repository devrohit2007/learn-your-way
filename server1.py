from flask import Flask, request, jsonify
import urllib.request
import json
import os
import io
from PIL import Image

app = Flask(__name__)

TEXT_API_KEY = os.environ.get("TEXT_API_KEY", "")
VISION_API_KEY = os.environ.get("VISION_API_KEY", "")
TEXT_MODEL = "nvidia/nemotron-3-ultra-550b-a55b"
VISION_MODEL = "meta/llama-3.2-11b-vision-instruct"
ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions"

def call_api(messages, model, api_key):
    payload = json.dumps({
        "model": model,
        "max_tokens": 800,
        "messages": messages
    }).encode('utf-8')
    req = urllib.request.Request(
        ENDPOINT,
        data=payload,
        headers={
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + api_key
        },
        method='POST'
    )
    with urllib.request.urlopen(req, timeout=90) as res:
        result = json.loads(res.read().decode('utf-8'))
        choice = result['choices'][0]['message']
        content = choice.get('content') or choice.get('reasoning_content') or ''
        return content.strip()

@app.route('/api/chat', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        return response
    data = request.get_json()
    messages = data.get('messages', [])
    try:
        content = call_api(messages, TEXT_MODEL, TEXT_API_KEY)
        response = jsonify({'content': content})
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response
    except Exception as e:
        response = jsonify({'error': str(e)})
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response, 500

@app.route('/api/upload', methods=['POST', 'OPTIONS'])
def upload():
    if request.method == 'OPTIONS':
        response = jsonify({})
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        return response

    if 'file' not in request.files:
        response = jsonify({'error': 'No file uploaded'})
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response, 400

    file = request.files['file']
    filename = file.filename.lower()

    if filename.endswith('.pdf'):
        try:
            from pypdf import PdfReader
            reader = PdfReader(io.BytesIO(file.read()))
            text = ''
            for page in reader.pages:
                text += page.extract_text() + '\n'
            text = text.strip()
            if not text:
                response = jsonify({'error': 'This PDF is image-based. Try uploading as an image instead.'})
                response.headers['Access-Control-Allow-Origin'] = '*'
                return response, 400
            response = jsonify({'text': text[:3000], 'type': 'pdf'})
            response.headers['Access-Control-Allow-Origin'] = '*'
            return response
        except Exception as e:
            response = jsonify({'error': str(e)})
            response.headers['Access-Control-Allow-Origin'] = '*'
            return response, 500

    elif filename.endswith(('.jpg', '.jpeg', '.png', '.webp')):
        try:
            import base64
            file_bytes = file.read()
            img = Image.open(io.BytesIO(file_bytes))
            img.thumbnail((1024, 1024))
            img = img.convert("RGB")
            buf = io.BytesIO()
            img.save(buf, format='JPEG', quality=85)
            b64 = base64.b64encode(buf.getvalue()).decode('utf-8')
            messages = [{
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}},
                    {"type": "text", "text": "Extract all text from this image. Describe any diagrams or visual elements in detail. Format it clearly as learning material."}
                ]
            }]
            content = call_api(messages, VISION_MODEL, VISION_API_KEY)
            response = jsonify({'text': content, 'type': 'image'})
            response.headers['Access-Control-Allow-Origin'] = '*'
            return response
        except Exception as e:
            response = jsonify({'error': str(e)})
            response.headers['Access-Control-Allow-Origin'] = '*'
            return response, 500

    else:
        response = jsonify({'error': 'Only PDF or image files (JPG, PNG) are supported'})
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response, 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
