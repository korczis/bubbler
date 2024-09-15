(function() {
    /**
     * Utility function to extract query parameters from the URL.
     * @param {string} param - The name of the parameter to extract.
     * @returns {string|null} - The value of the parameter or null if not present.
     */
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    /**
     * Returns a random fatherly wisdom quote (moudro) when needed.
     * @returns {string} - A random fatherly wisdom quote.
     */
    function getRandomWisdom() {
        const quotes = [
            "Čas jsou peníze.",
            "Snaž se být lepší verzí sebe sama.",
            "Život není fér, zvykni si.",
            "Neodkládej na zítra to, co můžeš udělat dnes.",
            "Nikdy se nevzdávej."
        ];
        return quotes[Math.floor(Math.random() * quotes.length)];
    }

    /**
     * Main function to initialize the canvas, draw the image, the speech bubbles, and overlay text.
     */
    function initCanvas() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        // Load the background image dynamically via query parameter
        const imgSrc = getQueryParam('bg') || 'images/image.png';
        const img = new Image();
        img.src = imgSrc;

        // When the image is loaded, adjust canvas and draw elements
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Extract parameters from the URL
            const params = extractParameters();

            // Draw speech bubbles based on provided or default parameters
            drawSpeechBubbles(ctx, canvas, params);

            // Draw full-width paragraph text if provided
            if (params.text) {
                drawParagraph(ctx, canvas, params);
            }
        };

        // Set dynamic OG meta tags
        setOGMetaTags();
    }

    /**
     * Function to extract all parameters related to speech bubbles, overlay text, font size, boldness, etc.
     * @returns {object} - A dictionary of relevant parameters.
     */
    function extractParameters() {
        return {
            topText: getQueryParam('top') || 'Ted me dobře poslouchej synu',  // "Listen to me well, son" as default top text
            bottomText: getQueryParam('bottom') || getRandomWisdom(),  // Dynamic random wisdom for bottom text
            topFontSize: getQueryParam('topFontSize') || '40',  // Font size for top text
            bottomFontSize: getQueryParam('bottomFontSize') || '40',  // Font size for bottom text
            topFontStyle: getQueryParam('topFontStyle') || 'bold',  // Font style for top text
            bottomFontStyle: getQueryParam('bottomFontStyle') || 'italic',  // Font style for bottom text
            topPosition: getQueryParam('topPosition') || '50',  // Default top position
            bottomPosition: getQueryParam('bottomPosition') || (canvas.height - 150),  // Default bottom position
            topFont: getQueryParam('topFont') || 'Arial',  // Font family for top
            bottomFont: getQueryParam('bottomFont') || 'Arial',  // Font family for bottom
            text: getQueryParam('text') || '',  // Full-width paragraph text
            fontSize: getQueryParam('fontSize') || '40',  // Default paragraph font size
            fontStyle: getQueryParam('fontStyle') || 'bold',  // Default paragraph font style
            fontFamily: getQueryParam('fontFamily') || 'Arial',  // Default paragraph font family
            textColor: getQueryParam('textColor') || 'white',  // Default paragraph text color
            textAlign: getQueryParam('textAlign') || 'center'  // Default text alignment for paragraph
        };
    }

    /**
     * Function to dynamically set Open Graph meta tags based on query parameters.
     */
    function setOGMetaTags() {
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        const ogImage = document.querySelector('meta[property="og:image"]');

        const title = getQueryParam('top') || 'Ted me dobře poslouchej synu';
        const description = getQueryParam('bottom') || getRandomWisdom();
        const image = getQueryParam('bg') || 'images/image.png';

        if (ogTitle) ogTitle.setAttribute('content', title);
        if (ogDescription) ogDescription.setAttribute('content', description);
        if (ogImage) ogImage.setAttribute('content', image);
    }

    /**
     * Draws the speech bubbles based on the parameters for top and bottom.
     * @param {object} ctx - The canvas rendering context.
     * @param {object} canvas - The canvas element.
     * @param {object} params - The parameters including text, font size, and boldness.
     */
    function drawSpeechBubbles(ctx, canvas, params) {
        const bubblePadding = 20;
        const bubbleWidth = canvas.width - 2 * bubblePadding;

        // Draw the top text bubble
        drawSpeechBubble(ctx, bubblePadding, parseInt(params.topPosition), bubbleWidth, params.topText, params.topFontStyle, params.topFont, parseInt(params.topFontSize));

        // Draw the bottom text bubble
        drawSpeechBubble(ctx, bubblePadding, parseInt(params.bottomPosition), bubbleWidth, params.bottomText, params.bottomFontStyle, params.bottomFont, parseInt(params.bottomFontSize));
    }

    /**
     * Draws a speech bubble at a given position with multiline support and custom font style.
     * @param {object} ctx - The canvas rendering context.
     * @param {number} x - The X-coordinate of the bubble.
     * @param {number} y - The Y-coordinate of the bubble.
     * @param {number} width - The width of the bubble.
     * @param {string} text - The text to display inside the bubble.
     * @param {string} fontStyle - The font style (e.g., bold, italic).
     * @param {string} font - The font family (e.g., Arial).
     * @param {number} fontSize - The font size.
     */
    function drawSpeechBubble(ctx, x, y, width, text, fontStyle, font, fontSize) {
        const bubblePadding = 20;
        const lineHeight = fontSize + 10;  // Adjust line height based on font size
        ctx.font = `${fontStyle} ${fontSize}px ${font}`;
        ctx.textAlign = 'center';
        const lines = getLines(ctx, text, width - bubblePadding * 2);

        const bubbleHeight = lines.length * lineHeight + bubblePadding * 2;

        // Draw the speech bubble rectangle
        ctx.fillStyle = 'white';  // Bubble background color
        ctx.fillRect(x, y, width, bubbleHeight);  // Draw rectangle for bubble

        ctx.strokeStyle = 'black';  // Bubble border color
        ctx.strokeRect(x, y, width, bubbleHeight);  // Draw border for bubble

        ctx.fillStyle = 'black';  // Text color

        // Draw each line of text inside the bubble
        lines.forEach((line, index) => {
            ctx.fillText(line, x + width / 2, y + bubblePadding + (index + 1) * lineHeight);  // Draw centered text line by line
        });
    }

    /**
     * Draws a full-width paragraph, spanning the full width of the image and centered.
     * @param {object} ctx - The canvas rendering context.
     * @param {object} canvas - The canvas element.
     * @param {object} params - The text parameters including font, style, and alignment.
     */
    function drawParagraph(ctx, canvas, params) {
        const bubblePadding = 20;
        const maxWidth = canvas.width - 2 * bubblePadding;  // Full width minus padding
        const lineHeight = parseInt(params.fontSize) + 10;  // Line height adjusted for font size

        ctx.font = `${params.fontStyle} ${params.fontSize}px ${params.fontFamily}`;
        ctx.fillStyle = params.textColor;
        ctx.textAlign = params.textAlign;

        const lines = getLines(ctx, params.text, maxWidth);

        // Calculate starting Y position for vertical centering
        const totalTextHeight = lines.length * lineHeight;
        const startY = (canvas.height - totalTextHeight) / 2;

        // Draw each line of text centered on the image
        lines.forEach((line, index) => {
            ctx.fillText(line, canvas.width / 2, startY + (index + 1) * lineHeight);
        });
    }

    /**
     * Splits long text into multiple lines that fit within the maximum width.
     * @param {object} ctx - The canvas rendering context.
     * @param {string} text - The text to split into lines.
     * @param {number} maxWidth - The maximum width of a line.
     * @returns {string[]} - An array of text lines that fit within the specified width.
     */
    function getLines(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = ctx.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
                currentLine += " " + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    // Initialize the canvas and drawing when the window is loaded
    window.onload = initCanvas;
})();
