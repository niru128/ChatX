import os
import numpy as np
import tensorflow as tf
from flask import Flask, request, jsonify
from transformers import pipeline, DistilBertTokenizerFast
from transformers import WhisperForConditionalGeneration, WhisperProcessor

# Flask app
app = Flask(__name__, static_url_path="/static", static_folder="static")

# ==============================
# Load Whisper (Speech → Text)
# ==============================
whisper_path = "openai/whisper-small"

processor = WhisperProcessor.from_pretrained(whisper_path)
whisper_model = WhisperForConditionalGeneration.from_pretrained(whisper_path)

# ASR pipeline
asr = pipeline(
    "automatic-speech-recognition",
    model=whisper_model,
    tokenizer=processor.tokenizer,
    feature_extractor=processor.feature_extractor
)

# ==============================
# Load Toxicity Model
# ==============================
MODEL_DIR = os.path.join(
    os.getcwd(), "model", "models", "multi_label_hate_speech_model_saved_model"
)

if not os.path.isdir(MODEL_DIR):
    raise FileNotFoundError(f"❌ SavedModel dir not found: {MODEL_DIR}")

saved = tf.saved_model.load(MODEL_DIR)
inference_fn = saved.signatures["serving_default"]

tokenizer = DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased")

label_names = [
    "toxic", "severe_toxic", "obscene",
    "threat", "insult", "identity_hate", "non_toxic"
]

# ==============================
# Moderate Message Function
# ==============================
def moderate_message(text: str, threshold=0.75):
    encoded = tokenizer(
        text,
        padding="max_length",
        truncation=True,
        max_length=128,
        return_tensors="tf"
    )
    outputs = inference_fn(
        input_ids=encoded["input_ids"],
        attention_mask=encoded["attention_mask"]
    )
    scores = outputs["classifier"].numpy()[0]

    action = "block" if scores[0] > threshold else "allow"
    top_idxs = np.argsort(scores)[-3:][::-1]
    top_scores = {label_names[i]: float(scores[i]) for i in top_idxs}

    return {"action": action, "top_scores": top_scores}

# ==============================
# API Endpoints
# ==============================

# 1) Audio transcription
@app.route("/api/audio/transcribe", methods=["POST"])
def transcribe_audio():
    file = request.files.get("audio")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    filepath = os.path.join("static", file.filename)
    file.save(filepath)

    try:
        result = asr(filepath)
        return jsonify({"text": result["text"]})
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)

# 2) Text moderation
@app.route("/moderate", methods=["POST"])
def moderate():
    data = request.json or {}
    text = data.get("text", "").strip()
    if not text:
        return jsonify({"error": "No text provided"}), 400
    return jsonify(moderate_message(text))

# 3) Audio upload (get file URL back)
@app.route("/upload/audio", methods=["POST"])
def upload_audio():
    file = request.files.get("audio")
    if not file:
        return jsonify({"error": "No audio file provided"}), 400

    static_dir = os.path.join(os.getcwd(), "static")
    os.makedirs(static_dir, exist_ok=True)
    filepath = os.path.join(static_dir, file.filename)
    file.save(filepath)

    file_url = f"http://localhost:5000/static/{file.filename}"
    return jsonify({"fileUrl": file_url})

# ==============================
# Run server
# ==============================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
