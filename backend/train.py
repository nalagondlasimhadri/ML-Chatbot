import json
import pickle

import nltk
from nltk.stem import WordNetLemmatizer

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report


# ========================================
# 1. Download required NLTK data
# ========================================

nltk.download("punkt")
nltk.download("punkt_tab")
nltk.download("wordnet")


# ========================================
# 2. Load chatbot intents
# ========================================

with open("intents.json", "r", encoding="utf-8") as file:
    data = json.load(file)


# ========================================
# 3. Prepare training data
# ========================================

lemmatizer = WordNetLemmatizer()

patterns = []
tags = []


for intent in data["intents"]:

    for pattern in intent["patterns"]:

        words = nltk.word_tokenize(pattern.lower())

        words = [
            lemmatizer.lemmatize(word)
            for word in words
            if word.isalnum()
        ]

        cleaned_sentence = " ".join(words)

        patterns.append(cleaned_sentence)
        tags.append(intent["tag"])


# ========================================
# 4. Display dataset information
# ========================================

print("\n========================================")
print("🤖 ML CHATBOT TRAINING")
print("========================================")

print(f"📚 Total examples : {len(patterns)}")
print(f"🎯 Total intents  : {len(set(tags))}")


# ========================================
# 5. Split dataset
# ========================================

X_train, X_test, y_train, y_test = train_test_split(
    patterns,
    tags,
    test_size=0.20,
    random_state=42,
    stratify=tags
)


print(f"🧠 Training data  : {len(X_train)}")
print(f"🧪 Testing data   : {len(X_test)}")


# ========================================
# 6. TF-IDF Vectorization
# ========================================

vectorizer = TfidfVectorizer()

X_train_vectorized = vectorizer.fit_transform(X_train)

X_test_vectorized = vectorizer.transform(X_test)


# ========================================
# 7. Train Logistic Regression
# ========================================

model = LogisticRegression(max_iter=1000)

model.fit(X_train_vectorized, y_train)


# ========================================
# 8. Make predictions
# ========================================

predictions = model.predict(X_test_vectorized)


# ========================================
# 9. Calculate accuracy
# ========================================

accuracy = accuracy_score(y_test, predictions)


# ========================================
# 10. Display model performance
# ========================================

print("\n========================================")
print("📊 MODEL EVALUATION")
print("========================================")

print(f"✅ Accuracy : {accuracy * 100:.2f}%")


print("\n========================================")
print("📋 CLASSIFICATION REPORT")
print("========================================")

print(
    classification_report(
        y_test,
        predictions,
        zero_division=0
    )
)


# ========================================
# 11. Train final model
# ========================================

print("========================================")
print("🔄 Training final model...")
print("========================================")

final_vectorizer = TfidfVectorizer()

X_full = final_vectorizer.fit_transform(patterns)

final_model = LogisticRegression(max_iter=1000)

final_model.fit(X_full, tags)


# ========================================
# 12. Save final model
# ========================================

with open("chatbot_model.pkl", "wb") as file:
    pickle.dump(final_model, file)


with open("vectorizer.pkl", "wb") as file:
    pickle.dump(final_vectorizer, file)


# ========================================
# 13. Training complete
# ========================================

print("\n========================================")
print("🎉 TRAINING COMPLETE!")
print("========================================")

print("💾 Model saved    : chatbot_model.pkl")
print("💾 Vectorizer saved : vectorizer.pkl")

print("========================================")