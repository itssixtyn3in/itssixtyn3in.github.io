// Get references to HTML elements
const commentInput = document.getElementById('commentInput');
const submitButton = document.getElementById('submitButton');
const commentContainer = document.getElementById('commentContainer');

// Event listener for the submit button
submitButton.addEventListener('click', () => {
    // Get the user's comment from the input field
    const userComment = commentInput.value;

    // Clear the input field
    commentInput.value = '';

    // Create a new comment element
    const commentElement = document.createElement('div');
    commentElement.classList.add('comment');

// Detect and format all URLs in the comment text as hyperlinks, including flag://
const formattedComment = userComment.replace(
    /(https?:\/\/\S+|ftp:\/\/\S+|file:\/\/\S+|search-ms:\/\/\S+|flag:\/\/\S+)/gi,
    (match) => `<a href="${match}" target="_blank">${match}</a>`
);
    // Set the innerHTML of the comment element with the formatted comment
    commentElement.innerHTML = formattedComment;

    // Append the comment to the comment container
    commentContainer.appendChild(commentElement);
});
