from flask import Flask, request, jsonify
from flask_cors import CORS

import json
import pickle
import random

import nltk
from nltk.stem import WordNetLemmatizer


# --------------------------------
# Create Flask application
# --------------------------------

app = Flask(__name__)
CORS(app)


# --------------------------------
# NLTK setup
# --------------------------------

nltk.download("punkt")
nltk.download("punkt_tab")
nltk.download("wordnet")

lemmatizer = WordNetLemmatizer()


# --------------------------------
# Load trained ML model
# --------------------------------

with open("chatbot_model.pkl", "rb") as file:
    model = pickle.load(file)

with open("vectorizer.pkl", "rb") as file:
    vectorizer = pickle.load(file)


# --------------------------------
# Load chatbot responses
# --------------------------------

with open("intents.json", "r", encoding="utf-8") as file:
    intents_data = json.load(file)


# --------------------------------
# Home route
# --------------------------------

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "status": "success",
        "message": "ML Chatbot Backend is running! 🤖"
    })


# --------------------------------
# Chat API
# --------------------------------

@app.route("/api/chat", methods=["POST"])
def chat():

    data = request.get_json(silent=True) or {}

    user_message = data.get("message", "").strip()

    if not user_message:

        return jsonify({
            "status": "error",
            "message": "Please enter a message."
        }), 400


    # --------------------------------
    # Preprocess user message
    # --------------------------------

    words = nltk.word_tokenize(user_message.lower())

    words = [
        lemmatizer.lemmatize(word)
        for word in words
        if word.isalnum()
    ]

    cleaned_message = " ".join(words)


    # --------------------------------
    # Convert text into numbers
    # --------------------------------

    message_vector = vectorizer.transform(
        [cleaned_message]
    )


    # --------------------------------
    # Predict intent
    # --------------------------------

    predicted_intent = model.predict(
        message_vector
    )[0]


    # --------------------------------
    # Find response
    # --------------------------------

    response = "Sorry, I don't understand that yet. 🤔"

    for intent in intents_data["intents"]:

        if intent["tag"] == predicted_intent:

            response = random.choice(
                intent["responses"]
            )

            break


    # --------------------------------
    # Send response to React
    # --------------------------------

    return jsonify({

        "status": "success",

        "user_message": user_message,

        "intent": predicted_intent,

        "response": response

    })


# --------------------------------
# Start Flask server
# --------------------------------

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )