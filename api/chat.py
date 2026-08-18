from http.server import BaseHTTPRequestHandler
import urllib.request
import json
import os

TEXT_API_KEY = os.environ.get("TEXT_API_KEY", "")
TEXT_MODEL = "nvidia/nemotron-3-ultra-550b-a55b"
ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions"

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.end_headers()

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length))
        messages = body.get("messages", [])
        try:
            payload = json.dumps({"model": TEXT_MODEL, "max_tokens": 800, "messages": messages}).encode()
            req = urllib.request.Request(ENDPOINT, data=payload, headers={"Content-Type": "application/json", "Authorization": "Bearer " + TEXT_API_KEY}, method="POST")
            with urllib.request.urlopen(req) as res:
                result = json.loads(res.read().decode())
                choice = result["choices"][0]["message"]
                content = choice.get("content") or choice.get("reasoning_content") or ""
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"content": content.strip()}).encode())
        except Exception as e:
            self.send_response(500)
            self.send_header("Content-Type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
