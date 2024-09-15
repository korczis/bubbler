(function() {
    /**
     * Utility function to extract query parameters from the URL
     * @param {string} param - The name of the parameter to extract.
     * @returns {string|null} - The value of the parameter or null if not present.
     */
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    /**
     * Main function to initialize the canvas, draw the image and the speech bubbles (top and bottom).
     */
    function initCanvas() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        // Load the image dynamically
        const imgSrc = 'images/image.png';  // Replace with your image path
        const img = new Image();
        img.src = imgSrc;

        // When the image is loaded, adjust canvas and draw elements
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Extract parameters from the URL
            const params = extractParameters();

            // Draw top and bottom speech bubbles based on parameters
            drawSpeechBubbles(ctx, canvas, params);
        };
    }

    /**
     * Function to extract all parameters related to speech bubble, positioning, and font size.
     * @returns {object} - A dictionary of relevant parameters.
     */
    function extractParameters() {
        return {
            topText: getQueryParam('top') || '',
            bottomText: getQueryParam('bottom') || '',
            fontSize: getQueryParam('font') || '30',  // Default font size
        };
    }

    /**
     * Draws the speech bubbles based on the parameters for top and bottom.
     * @param {object} ctx - The canvas rendering context.
     * @param {object} canvas - The canvas element.
     * @param {object} params - The parameters including text, and font size.
     */
    function drawSpeechBubbles(ctx, canvas, params) {
        // Define common bubble properties
        const bubblePadding = 20;
        const bubbleWidth = canvas.width - 2 * bubblePadding;
        const bubbleHeight = 100;

        // Set up font properties
        ctx.font = `${params.fontSize}px Arial`;
        ctx.textAlign = 'center';

        // Draw the top text bubble if it exists
        if (params.topText) {
            const topY = bubblePadding;
            drawSpeechBubble(ctx, bubblePadding, topY, bubbleWidth, bubbleHeight, params.topText);
        }

        // Draw the bottom text bubble if it exists
        if (params.bottomText) {
            const bottomY = canvas.height - bubbleHeight - bubblePadding;
            drawSpeechBubble(ctx, bubblePadding, bottomY, bubbleWidth, bubbleHeight, params.bottomText);
        }
    }

    /**
     * Draws a speech bubble at a given position.
     * @param {object} ctx - The canvas rendering context.
     * @param {number} x - The X-coordinate of the bubble.
     * @param {number} y - The Y-coordinate of the bubble.
     * @param {number} width - The width of the bubble.
     * @param {number} height - The height of the bubble.
     * @param {string} text - The text to display inside the bubble.
     */
    function drawSpeechBubble(ctx, x, y, width, height, text) {
        ctx.fillStyle = 'white';  // Bubble background color
        ctx.fillRect(x, y, width, height);  // Draw rectangle for bubble

        ctx.strokeStyle = 'black';  // Bubble border color
        ctx.strokeRect(x, y, width, height);  // Draw border for bubble

        ctx.fillStyle = 'black';  // Text color
        ctx.fillText(text, x + width / 2, y + (height / 2) + 10);  // Draw centered text
    }

    // Initialize the canvas and drawing when the window is loaded
    window.onload = initCanvas;
})();
