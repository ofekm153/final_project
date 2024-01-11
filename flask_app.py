from flask import Flask, request, jsonify
from joblib import load
from flask_cors import CORS
from sklearn.feature_extraction.text import CountVectorizer
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def custom_tokenizer(text):
    tokens = re.findall(r'\b\w+\b', text)
    tokens = [token.lower() for token in tokens]  # Convert to lowercase
    return tokens

# Load the vectorizer and classifier
loaded_vectorizer = load('Count_Vectorizer.joblib')
classifier = load('Classifier.joblib')

@app.route('/classify', methods=['POST'])
def classify_content():
    data = request.json
    titles = data.get('titles', [])  # Use get to handle missing key
    comments = data.get('comments', [])  # Use get to handle missing key

    # Transform the titles using the loaded vectorizer
    title_counts = loaded_vectorizer.transform(titles)
    # Predict using the classifier
    title_results = classifier.predict(title_counts).tolist()

    # Transform the comments using the loaded vectorizer
    comment_results = []
    if comments:  # Check if comments is not empty
        comment_counts = loaded_vectorizer.transform(comments)
        # Predict using the classifier
        comment_results = classifier.predict(comment_counts).tolist()


    return jsonify({
        'titleResults': title_results,
        'commentResults': comment_results
    })

if __name__ == '__main__':
    app.run(debug=True)
