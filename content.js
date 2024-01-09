// Collect post titles
const postTitles = document.querySelectorAll('.title a.title');
let titles = [];
postTitles.forEach((titleElement) => {
    titles.push(titleElement.textContent);
});

// Collect comments. We're considering only top-level comments for simplicity.
const comments = document.querySelectorAll('.comment .usertext-body .md p');
let commentTexts = [];
comments.forEach((commentElement) => {
    commentTexts.push(commentElement.textContent);
});

// Send titles and comments to your Flask API for classification
fetch('http://127.0.0.1:5000/classify', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ titles: titles, comments: commentTexts })
})
    .then(response => response.json())
    .then(data => {
        // Display results for titles
        postTitles.forEach((titleElement, index) => {
            const marker = document.createElement('span');
            marker.textContent = data.titleResults[index] ? '🟢 Real' : '🔴 Fake';  // Adjust based on your classifier's output for titles
            titleElement.parentNode.insertBefore(marker, titleElement.nextSibling);
        });

        // Display results for comments
        comments.forEach((commentElement, index) => {
            const marker = document.createElement('span');
            marker.textContent = data.commentResults[index] ? '🟢 Real' : '🔴 Fake';  // Adjust based on your classifier's output for comments
            commentElement.parentNode.insertBefore(marker, commentElement.nextSibling);
        });
    });
