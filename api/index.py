from flask import Flask, request, jsonify
import urllib.request
import json
import os
import io
import base64

app = Flask(__name__)

TEXT_API_KEY = os.environ.get("TEXT_API_KEY", "")
VISION_API_KEY = os.environ.get("VISION_API_KEY", "")

TEXT_MODEL = "nvidia/nemotron-3-ultra-550b-a55b"
VISION_MODEL = "meta/llama-3.2-11b-vision-instruct"

NVIDIA_ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions"


def nvidia_request(api_key, model, messages, max_tokens=800, timeout=55):
    payload = json.dumps({
        "model": model,
        "max_tokens": max_tokens,
        "messages": messages
    }).encode()

    req = urllib.request.Request(
        NVIDIA_ENDPOINT,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": "Bearer " + api_key
        },
        method="POST"
    )

    with urllib.request.urlopen(req, timeout=timeout) as response:
        result = json.loads(response.read().decode())

    message = result["choices"][0]["message"]

    return (
        message.get("content")
        or message.get("reasoning_content")
        or ""
    ).strip()


@app.route("/api/chat", methods=["POST", "OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        return "", 200

    try:
        body = request.get_json(silent=True) or {}
        messages = body.get("messages", [])

        if not messages:
            return jsonify({"error": "No messages provided"}), 400

        content = nvidia_request(
            TEXT_API_KEY,
            TEXT_MODEL,
            messages
        )

        response = jsonify({
            "content": content
        })

        response.headers["Access-Control-Allow-Origin"] = "*"

        return response

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


@app.route("/api/upload", methods=["POST", "OPTIONS"])
def upload():
    if request.method == "OPTIONS":
        return "", 200

    try:
        if "file" not in request.files:
            return jsonify({
                "error": "No file uploaded"
            }), 400

        file = request.files["file"]

        if not file.filename:
            return jsonify({
                "error": "No file selected"
            }), 400

        filename = file.filename.lower()
        file_bytes = file.read()

        # PDF
        if filename.endswith(".pdf"):
            from pypdf import PdfReader

            reader = PdfReader(
                io.BytesIO(file_bytes)
            )

            text_parts = []

            for page in reader.pages:
                text_parts.append(
                    page.extract_text() or ""
                )

            text = "\n".join(text_parts).strip()

            if not text:
                return jsonify({
                    "error": "Could not extract text from PDF"
                }), 400

            return jsonify({
                "text": text[:10000],
                "type": "pdf"
            })

        # Images
        elif filename.endswith(
            (".jpg", ".jpeg", ".png", ".webp")
        ):
            from PIL import Image

            image = Image.open(
                io.BytesIO(file_bytes)
            )

            image.thumbnail((1024, 1024))
            image = image.convert("RGB")

            buffer = io.BytesIO()

            image.save(
                buffer,
                format="JPEG",
                quality=85
            )

            encoded = base64.b64encode(
                buffer.getvalue()
            ).decode()

            messages = [{
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url":
                            f"data:image/jpeg;base64,{encoded}"
                        }
                    },
                    {
                        "type": "text",
                        "text":
                        "Extract all text from this image. "
                        "Describe diagrams and important visual "
                        "information as learning material."
                    }
                ]
            }]

            text = nvidia_request(
                VISION_API_KEY,
                VISION_MODEL,
                messages,
                max_tokens=800,
                timeout=120
            )

            return jsonify({
                "text": text,
                "type": "image"
            })

        else:
            return jsonify({
                "error":
                "Only PDF and image files are supported."
            }), 400

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "learn-your-way"
    })


handler = app
