from flask import Flask, request, jsonify
import urllib.request
import json
import os

app = Flask(__name__)

API_KEY = "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"
MODEL = "nvidia/nemotron-3-ultra-550b-a55b"
ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions"

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

    payload = json.dumps({
        "model": MODEL,
        "max_tokens": 800,
        "messages": messages
    }).encode('utf-8')

    req = urllib.request.Request(
        ENDPOINT,
        data=payload,
        headers={
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + API_KEY
        },
        method='POST'
    )

    try:
        with urllib.request.urlopen(req) as res:
            result = json.loads(res.read().decode('utf-8'))
            response = jsonify({'content': result['choices'][0]['message']['content']})
            response.headers['Access-Control-Allow-Origin'] = '*'
            return response
    except Exception as e:
        response = jsonify({'error': str(e)})
        response.headers['Access-Control-Allow-Origin'] = '*'
        return response, 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
