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
     * Fetches and returns all the parameters from a custom JSON path or uses default values.
     * If a query parameter exists, it takes precedence over the JSON.
     * @returns {Promise<object>} - A promise that resolves to a dictionary of parameters.
     */
    function getParametersFromJson() {
        const customJsonUrl = getQueryParam('json') || './js/wisdoms16k.json';

        return fetch(customJsonUrl)
            .then(response => response.json())
            .then(data => {
                // Choose a random entry from the wisdoms array
                const wisdomEntry = data.wisdoms[Math.floor(Math.random() * data.wisdoms.length)];

                // Handle different formats: plain string, array with two strings, or array with three strings
                let topText = getQueryParam('top') || 'Teď mě dobře poslouchej, synu.';
                let centerText = '';
                let bottomText = 'Nikdy se nevzdávej.';
                let bg = getQueryParam('bg') || './images/image.png';  // Default background

                if (typeof wisdomEntry === 'string') {
                    bottomText = getQueryParam('bottom') || wisdomEntry; // Plain string -> bottom text
                } else if (Array.isArray(wisdomEntry)) {
                    if (wisdomEntry.length === 2) {
                        topText = getQueryParam('top') || wisdomEntry[0];
                        bottomText = getQueryParam('bottom') || wisdomEntry[1];
                    } else if (wisdomEntry.length === 3) {
                        topText = getQueryParam('top') || wisdomEntry[0];
                        centerText = getQueryParam('center') || wisdomEntry[1];
                        bottomText = getQueryParam('bottom') || wisdomEntry[2];
                    }
                } else if (typeof wisdomEntry === 'object') {
                    topText = getQueryParam('top') || wisdomEntry.topText || topText;
                    centerText = getQueryParam('center') || wisdomEntry.centerText || centerText;
                    bottomText = getQueryParam('bottom') || wisdomEntry.bottomText || bottomText;
                    bg = getQueryParam('bg') || wisdomEntry.bg || bg;  // Custom background from JSON
                }

                // Extract parameters from JSON entry or fall back to defaults/URL parameters
                return {
                    topText,
                    centerText,
                    bottomText,
                    bg,  // Use background from JSON if available
                    topFontSize: getQueryParam('topFontSize') || wisdomEntry.topFontSize || '40',
                    bottomFontSize: getQueryParam('bottomFontSize') || wisdomEntry.bottomFontSize || '40',
                    topFontStyle: getQueryParam('topFontStyle') || wisdomEntry.topFontStyle || 'bold',
                    bottomFontStyle: getQueryParam('bottomFontStyle') || wisdomEntry.bottomFontStyle || 'italic',
                    topPosition: getQueryParam('topPosition') || wisdomEntry.topPosition || '50',
                    bottomPosition: getQueryParam('bottomPosition') || wisdomEntry.bottomPosition || '150',
                    centerPosition: getQueryParam('centerPosition') || '100', // Default center position
                    topFont: getQueryParam('topFont') || wisdomEntry.topFont || 'Arial',
                    bottomFont: getQueryParam('bottomFont') || wisdomEntry.bottomFont || 'Arial',
                    text: getQueryParam('text') || wisdomEntry.text || '',
                    fontSize: getQueryParam('fontSize') || wisdomEntry.fontSize || '40',
                    fontStyle: getQueryParam('fontStyle') || wisdomEntry.fontStyle || 'bold',
                    fontFamily: getQueryParam('fontFamily') || wisdomEntry.fontFamily || 'Arial',
                    textColor: getQueryParam('textColor') || wisdomEntry.textColor || 'white',
                    textAlign: getQueryParam('textAlign') || wisdomEntry.textAlign || 'center'
                };
            })
            .catch(error => {
                console.error('Error fetching parameters:', error);
                // Use defaults if error occurs while fetching JSON
                return {
                    topText: 'Teď mě dobře poslouchej, synu.',
                    bottomText: 'Nikdy se nevzdávej.',
                    centerText: '',
                    bg: './images/image.png',  // Default background
                    topFontSize: '40',
                    bottomFontSize: '40',
                    topFontStyle: 'bold',
                    bottomFontStyle: 'italic',
                    topPosition: '50',
                    bottomPosition: '150',
                    centerPosition: '100',
                    topFont: 'Arial',
                    bottomFont: 'Arial',
                    text: '',
                    fontSize: '40',
                    fontStyle: 'bold',
                    fontFamily: 'Arial',
                    textColor: 'white',
                    textAlign: 'center'
                };
            });
    }

    /**
     * Main function to initialize the canvas, draw the image, the speech bubbles, and overlay text.
     */
    function initCanvas() {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');

        // Extract parameters from JSON and load the image
        getParametersFromJson().then(params => {
            const img = new Image();
            img.src = params.bg;  // Use the background from JSON or fallback

            img.onload = function() {
                const scale = getScaleFactor(img.width, img.height);
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Adjust font sizes and positions according to scale
                params.topFontSize = parseInt(params.topFontSize) * scale;
                params.bottomFontSize = parseInt(params.bottomFontSize) * scale;
                params.topPosition = parseInt(params.topPosition) * scale;
                params.bottomPosition = parseInt(params.bottomPosition) * scale;
                params.centerPosition = parseInt(params.centerPosition) * scale;

                // Draw the speech bubbles
                drawSpeechBubbles(ctx, canvas, params);

                // Draw full-width paragraph text if provided
                if (params.text) {
                    drawParagraph(ctx, canvas, params);
                }
            };
        });

        // Set dynamic OG meta tags
        setOGMetaTags();
    }

    /**
     * Calculate scale factor based on screen size for mobile responsiveness.
     * @param {number} imgWidth - The original image width.
     * @param {number} imgHeight - The original image height.
     * @returns {number} - The scale factor.
     */
    function getScaleFactor(imgWidth, imgHeight) {
        const maxWidth = window.innerWidth;
        const maxHeight = window.innerHeight;

        const widthRatio = maxWidth / imgWidth;
        const heightRatio = maxHeight / imgHeight;

        return Math.min(widthRatio, heightRatio); // Scale to fit within the screen
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
        const image = getQueryParam('bg') || './images/image.png';

        if (ogTitle) ogTitle.setAttribute('content', title);
        if (ogDescription) ogDescription.setAttribute('content', description);
        if (ogImage) ogImage.setAttribute('content', image);
    }

    /**
     * Draws the speech bubbles based on the parameters for top, center, and bottom.
     * @param {object} ctx - The canvas rendering context.
     * @param {object} canvas - The canvas element.
     * @param {object} params - The parameters including text, font size, and boldness.
     */
    function drawSpeechBubbles(ctx, canvas, params) {
        const bubblePadding = 20;
        const bubbleWidth = canvas.width - 2 * bubblePadding;

        // Draw the top text bubble
        drawSpeechBubble(ctx, bubblePadding, parseInt(params.topPosition), bubbleWidth, params.topText, params.topFontStyle, params.topFont, parseInt(params.topFontSize));

        // Draw the center text bubble if available
        if (params.centerText) {
            drawSpeechBubble(ctx, bubblePadding, parseInt(params.centerPosition), bubbleWidth, params.centerText, params.topFontStyle, params.topFont, parseInt(params.topFontSize));
        }

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
