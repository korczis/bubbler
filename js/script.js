// Function to extract the "says" parameter from the URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Create a canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Image URL (relative path to the image in the repository)
const imgSrc = 'images/image.png';  // The path to your image file
const img = new Image();
img.src = imgSrc;

// When the image is loaded, draw it on the canvas
img.onload = function() {
  // Draw the image to fill the canvas
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Get the text from the "says" query parameter
  const bubbleText = getQueryParam('says') || 'Hello!';

  // Draw the speech bubble rectangle
  ctx.fillStyle = 'white';  // Background of the bubble
  ctx.fillRect(150, 50, 500, 100);  // x, y, width, height for the rectangle

  // Draw the bubble border
  ctx.strokeStyle = 'black';  // Border color
  ctx.strokeRect(150, 50, 500, 100);  // Same x, y, width, height for the border

  // Set up text properties for the speech
  ctx.fillStyle = 'black';  // Text color
  ctx.font = '30px Arial';  // Text style
  ctx.textAlign = 'center';  // Center the text horizontally

  // Draw the speech text inside the bubble
  ctx.fillText(bubbleText, canvas.width / 2, 100);  // Center horizontally, set y at 100
};
