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
     * Fetches and returns a random fatherly wisdom quote from a custom JSON path or default.
     * @returns {Promise<string>} - A promise that resolves to a random fatherly wisdom quote.
     */
    function getRandomWisdom() {
        const customJsonUrl = getQueryParam('json') || 'https://korczis.github.io/bubbler/js/wisdoms16k.json';

        return fetch(customJsonUrl)
            .then(response => response.json())
            .then(data => {
                const wisdoms = data.wisdoms;
                return wisdoms[Math.floor(Math.random() * wisdoms.length)];
            })
            .catch(error => {
                console.error('Error fetching wisdom:', error);
                return "Nikdy se nevzdávej.";  // Default quote in case of error
            });
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

        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Extract parameters and draw content
            extractParameters().then(params => {
                drawSpeechBubbles(ctx, canvas, params);

                // Draw full-width paragraph text if provided
                if (params.text) {
                    drawParagraph(ctx, canvas, params);
                }
            });
        };

        // Set dynamic OG meta tags
        setOGMetaTags();
    }

    /**
     * Function to extract all parameters related to speech bubbles, overlay text, font size, boldness, etc.
     * @returns {Promise<object>} - A promise that resolves to a dictionary of relevant parameters.
     */
    function extractParameters() {
        return getRandomWisdom().then(randomWisdom => ({
            topText: getQueryParam('top') || 'Teď mě dobře poslouchej, synu.',  // Default top text
            bottomText: getQueryParam('bottom') || randomWisdom,  // Dynamic random wisdom for bottom text
            topFontSize: getQueryParam('topFontSize') || '40',  // Font size for top text
            bottomFontSize: getQueryParam('bottomFontSize') || '40',  // Font size for bottom text
            topFontStyle: getQueryParam('topFontStyle') || 'bold',  // Font style for top text
            bottomFontStyle: getQueryParam('bottomFontStyle') || 'italic',  // Font style for bottom text
            topPosition: getQueryParam('topPosition') || '50',  // Default top position
            bottomPosition: getQueryParam('bottomPosition') || '150',  // Default bottom position
            topFont: getQueryParam('topFont') || 'Arial',  // Font family for top
            bottomFont: getQueryParam('bottomFont') || 'Arial',  // Font family for bottom
            text: getQueryParam('text') || '',  // Full-width paragraph text
            fontSize: getQueryParam('fontSize') || '40',  // Default paragraph font size
            fontStyle: getQueryParam('fontStyle') || 'bold',  // Default paragraph font style
            fontFamily: getQueryParam('fontFamily') || 'Arial',  // Default paragraph font family
            textColor: getQueryParam('textColor') || 'white',  // Default paragraph text color
            textAlign: getQueryParam('textAlign') || 'center'  // Default text alignment for paragraph
        }));
    }

    /**
     * Function to dynamically set Open Graph meta tags based on query parameters.
     */
    function setOGMetaTags() {
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        const ogImage = document.querySelector('meta[property="og:image"]');

        const title = getQueryParam('top') || 'Teď mě dobře poslouchej, synu.';
        const description = getQueryParam('bottom') || 'Rada otce';  // Default OG description
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

        // Calculate the bottom position for the bottom text bubble
        const bottomTextHeight = getTextHeight(ctx, params.bottomText, bubbleWidth, parseInt(params.bottomFontSize));
        const bottomPosition = canvas.height - bottomTextHeight - bubblePadding;

        // Draw the bottom text bubble at the bottom of the canvas
        drawSpeechBubble(ctx, bubblePadding, bottomPosition, bubbleWidth, params.bottomText, params.bottomFontStyle, params.bottomFont, parseInt(params.bottomFontSize));
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
        ctx.fillRect(x, y, width, bubbleHeight);

        ctx.strokeStyle = 'black';  // Bubble border color
        ctx.strokeRect(x, y, width, bubbleHeight);  // Draw border for bubble

        ctx.fillStyle = 'black';  // Text color

        // Draw each line of text inside the bubble
        lines.forEach((line, index) => {
            ctx.fillText(line, x + width / 2, y + bubblePadding + (index + 1) * lineHeight);
        });
    }

    /**
     * Splits long text into multiple lines that fit within the maximum width.
     * Also handles manual newlines using '%0A' or '\n'.
     * @param {object} ctx - The canvas rendering context.
     * @param {string} text - The text to split into lines.
     * @param {number} maxWidth - The maximum width of a line.
     * @returns {string[]} - An array of text lines that fit within the specified width.
     */
    function getLines(ctx, text, maxWidth) {
        const lines = [];
        const paragraphs = text.split(/%0A|\n/);

        paragraphs.forEach(paragraph => {
            const words = paragraph.split(' ');
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
            lines.push(currentLine); // Push the last line
            lines.push('');  // Add an empty line for manual line breaks
        });

        return lines;
    }

    /**
     * Calculates the height of the text block that will be rendered.
     * @param {object} ctx - The canvas rendering context.
     * @param {string} text - The text to measure.
     * @param {number} maxWidth - The maximum width of the text block.
     * @param {number} fontSize - The font size for the text.
     * @returns {number} - The height of the text block.
     */
    function getTextHeight(ctx, text, maxWidth, fontSize) {
        const bubblePadding = 20;
        const lineHeight = fontSize + 10;
        const lines = getLines(ctx, text, maxWidth - bubblePadding * 2);
        return lines.length * lineHeight + bubblePadding * 2;
    }

    /**
     * Function to draw paragraph text centered vertically across the canvas.
     * @param {object} ctx - The canvas rendering context.
     * @param {object} canvas - The canvas element.
     * @param {object} params - The parameters including text, fontSize, fontStyle, textColor, etc.
     */
    function drawParagraph(ctx, canvas, params) {
        const padding = 20;
        const lineHeight = parseInt(params.fontSize) + 10;
        const maxWidth = canvas.width - padding * 2;

        // Calculate total height of the text block
        const lines = getLines(ctx, params.text, maxWidth);
        const totalTextHeight = lines.length * lineHeight;

        // Calculate the starting Y-coordinate to center the text vertically
        const textY = (canvas.height - totalTextHeight) / 2;

        // Set font styles
        ctx.font = `${params.fontStyle} ${params.fontSize}px ${params.fontFamily}`;
        ctx.fillStyle = params.textColor;
        ctx.textAlign = params.textAlign;

        // Draw each line of the paragraph text, vertically centered
        lines.forEach((line, index) => {
            ctx.fillText(line, canvas.width / 2, textY + index * lineHeight);
        });
    }

    // Initialize the canvas and drawing when the window is loaded
    window.onload = initCanvas;
})();
