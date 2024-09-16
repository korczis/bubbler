(function() {
    const JSONBIN_URL = 'https://api.jsonbin.io/v3/b';
    const JSONBIN_TOKEN = '$2a$10$NTJ/5N3/eE/huUqqFZo5TOMRJvqdiDvgBamire50REBHTimpPnJh2';


    /**
     * Array of image paths for random selection.
     */
    const imageArray = [
        './images/image.png',
        './images/image1.webp',
        './images/image2.webp',
        './images/image3.webp',
        './images/image4.webp',
        './images/image5.webp',
        './images/image6.webp',
        './images/image7.webp',
        './images/image8.webp',
        './images/image9.webp',
        './images/image10.webp'
    ];

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
     * Function to save current settings to JSONbin.io
     */
    function saveToJsonBin() {
        getParametersFromJson().then(params => {
            const settings = {
                topText: params.topText,
                centerText: params.centerText,
                bottomText: params.bottomText,
                bg: params.bg,
                topFontSize: params.topFontSize,
                bottomFontSize: params.bottomFontSize,
                topFontStyle: params.topFontStyle,
                bottomFontStyle: params.bottomFontStyle,
                topPosition: params.topPosition,
                bottomPosition: params.bottomPosition,
                centerPosition: params.centerPosition,
                topFont: params.topFont,
                bottomFont: params.bottomFont,
                textColor: params.textColor,
                textAlign: params.textAlign
            };

            fetch(JSONBIN_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Access-Key': JSONBIN_TOKEN
                },
                body: JSON.stringify(settings)
            })
            .then(response => response.json())
            .then(data => console.log('Settings saved to JSONbin.io:', data))
            .catch(error => console.error('Error saving to JSONbin.io:', error));
        });
    }

    /**
     * Utility function to update the URL with current parameters (top, center, bottom, bg).
     * This enables the user to bookmark or share the URL with permanent values.
     * @param {object} params - The parameters to include in the URL.
     */
    function updateURL(params) {
        const url = new URL(window.location.href);
        if (params.topText) {
            url.searchParams.set('top', params.topText);
        } else {
            url.searchParams.delete('top');
        }
        if (params.centerText) {
            url.searchParams.set('center', params.centerText);
        } else {
            url.searchParams.delete('center');
        }
        if (params.bottomText) {
            url.searchParams.set('bottom', params.bottomText);
        } else {
            url.searchParams.delete('bottom');
        }
        if (params.bg) {
            url.searchParams.set('bg', params.bg);
        }
        // history.pushState(null, '', url);  // Ensure the URL is updated
    }

    /**
     * Returns random text for top, center, and bottom based on available wisdoms.
     * @param {Array} wisdoms - The array of wisdoms.
     * @returns {object} - Randomly chosen top, center, and bottom text.
     */
    function getRandomText(wisdoms) {
        const wisdomEntry = wisdoms[Math.floor(Math.random() * wisdoms.length)];

        if (typeof wisdomEntry === 'string') {
            return { top: '', center: '', bottom: wisdomEntry };
        } else if (Array.isArray(wisdomEntry)) {
            if (wisdomEntry.length === 2) {
                return { top: wisdomEntry[0], center: '', bottom: wisdomEntry[1] };
            } else if (wisdomEntry.length === 3) {
                return { top: wisdomEntry[0], center: wisdomEntry[1], bottom: wisdomEntry[2] };
            }
        }
        return { top: wisdomEntry.topText || '', center: wisdomEntry.centerText || '', bottom: wisdomEntry.bottomText || '' };
    }

    /**
     * Fetches and returns all parameters from a custom JSON path or defaults to random image and wisdom.
     * If a query parameter exists, it takes precedence over the JSON.
     * @returns {Promise<object>} - A promise that resolves to a dictionary of parameters.
     */
     function getParametersFromJson() {
        const dataUrl = getQueryParam('data');
        const customJsonUrl = getQueryParam('json') || './js/wisdoms16k.json';

        const fetchData = dataUrl ? fetch(dataUrl, {
            headers: { 'X-Access-Key': JSONBIN_TOKEN }
        }) : fetch(customJsonUrl);

        return fetchData
            .then(response => response.json())
            .then(data => {
                const settings = data.record || data;  // For JSONbin data, `record` will hold the data

                let topText = getQueryParam('top') || settings.topText || 'Teď mě dobře poslouchej, mé dítě.';  // Default value

                let centerText = getQueryParam('center') || settings.centerText;
                let bottomText = getQueryParam('bottom') || settings.bottomText || getRandomText(settings.wisdoms || []).bottom;
                let bg = getQueryParam('bg') || settings.bg;

                if (!topText && !centerText && !bottomText) {
                    const randomText = getRandomText(settings.wisdoms || []);
                    topText = randomText.top;
                    centerText = randomText.center;
                    bottomText = randomText.bottom;
                }

                // Handle random() for background image
                if (bg === 'random()') {
                    bg = imageArray[Math.floor(Math.random() * imageArray.length)];
                } else {
                    bg = bg || imageArray[Math.floor(Math.random() * imageArray.length)];
                }

                // Update URL with the selected values
                updateURL({ topText, centerText, bottomText, bg });

                return {
                    topText,
                    centerText,
                    bottomText,
                    bg,
                    topFontSize: getQueryParam('topFontSize') || settings.topFontSize || '40',
                    bottomFontSize: getQueryParam('bottomFontSize') || settings.bottomFontSize || '40',
                    topFontStyle: getQueryParam('topFontStyle') || settings.topFontStyle || 'bold',
                    bottomFontStyle: getQueryParam('bottomFontStyle') || settings.bottomFontStyle || 'italic',
                    topPosition: getQueryParam('topPosition') || settings.topPosition || '50',
                    bottomPosition: getQueryParam('bottomPosition') || settings.bottomPosition || '150',
                    centerPosition: getQueryParam('centerPosition') || settings.centerPosition || '100',
                    topFont: getQueryParam('topFont') || settings.topFont || 'Arial',
                    bottomFont: getQueryParam('bottomFont') || settings.bottomFont || 'Arial',
                    text: getQueryParam('text') || '',
                    fontSize: getQueryParam('fontSize') || settings.fontSize || '40',
                    fontStyle: getQueryParam('fontStyle') || settings.fontStyle || 'bold',
                    fontFamily: getQueryParam('fontFamily') || settings.fontFamily || 'Arial',
                    textColor: getQueryParam('textColor') || settings.textColor || 'white',
                    textAlign: getQueryParam('textAlign') || settings.textAlign || 'center'
                };
            })
            .catch(error => {
                console.error('Error fetching parameters:', error);
                return {
                    topText: 'Teď mě dobře poslouchej, mé dítě.',
                    bottomText: 'Nikdy se nevzdávej.',
                    centerText: '',
                    bg: imageArray[Math.floor(Math.random() * imageArray.length)],
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

        // Extract parameters and load the image
        getParametersFromJson().then(params => {
            const img = new Image();
            img.src = params.bg;

            img.onload = function() {
                const scale = calculateCanvasSize(canvas, img.width, img.height);

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                params.topFontSize = Math.floor(parseInt(params.topFontSize) * scale);
                params.bottomFontSize = Math.floor(parseInt(params.bottomFontSize) * scale);
                params.topPosition = Math.floor(parseInt(params.topPosition) * scale);
                params.bottomPosition = Math.floor(parseInt(params.bottomPosition) * scale);
                params.centerPosition = Math.floor(parseInt(params.centerPosition) * scale);

                drawSpeechBubbles(ctx, canvas, params);

                if (params.text) {
                    drawParagraph(ctx, canvas, params);
                }
            };
        });

        // Set dynamic OG meta tags
        setOGMetaTags();
    }

    /**
     * Calculate canvas size to fit the screen while maintaining aspect ratio.
     * @param {object} canvas - The canvas element.
     * @param {number} imgWidth - The original image width.
     * @param {number} imgHeight - The original image height.
     * @returns {number} - The scale factor used to adjust text and elements.
     */
    function calculateCanvasSize(canvas, imgWidth, imgHeight) {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        const widthRatio = screenWidth / imgWidth;
        const heightRatio = screenHeight / imgHeight;

        const scaleFactor = Math.min(widthRatio, heightRatio); // Maintain aspect ratio

        canvas.width = imgWidth * scaleFactor;
        canvas.height = imgHeight * scaleFactor;

        return scaleFactor;
    }

    /**
     * Function to dynamically set Open Graph meta tags based on query parameters.
     */
    function setOGMetaTags() {
        const ogTitle = document.querySelector('meta[property="og:title"]');
        const ogDescription = document.querySelector('meta[property="og:description"]');
        const ogImage = document.querySelector('meta[property="og:image"]');

        const title = getQueryParam('top') || 'Teď mě dobře poslouchej, mé dítě.';
        const description = getQueryParam('bottom') || 'Rada otce';
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

        if (params.topText) {
            drawSpeechBubble(ctx, bubblePadding, params.topPosition, bubbleWidth, params.topText, params.topFontStyle, params.topFont, params.topFontSize);
        }
        if (params.centerText) {
            drawSpeechBubble(ctx, bubblePadding, params.centerPosition, bubbleWidth, params.centerText, params.topFontStyle, params.topFont, params.topFontSize);
        }
        if (params.bottomText) {
            const bottomTextHeight = getTextHeight(ctx, params.bottomText, bubbleWidth, params.bottomFontSize);
            const bottomPosition = canvas.height - bottomTextHeight - bubblePadding;
            drawSpeechBubble(ctx, bubblePadding, bottomPosition, bubbleWidth, params.bottomText, params.bottomFontStyle, params.bottomFont, params.bottomFontSize);
        }
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
        const lineHeight = fontSize + 10;
        ctx.font = `${fontStyle} ${fontSize}px ${font}`;
        ctx.textAlign = 'center';

        const lines = getLines(ctx, text, width - bubblePadding * 2);
        const bubbleHeight = lines.length * lineHeight + bubblePadding;

        ctx.fillStyle = 'white';
        ctx.fillRect(x, y, width, bubbleHeight);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(x, y, width, bubbleHeight);

        ctx.fillStyle = 'black';
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
            lines.push(currentLine);
            lines.push('');
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
        const bubblePadding = 10; // Updated padding
        const lineHeight = fontSize + 5; // Updated line height
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

        const lines = getLines(ctx, params.text, maxWidth);
        const totalTextHeight = lines.length * lineHeight;

        const textY = (canvas.height - totalTextHeight) / 2;

        ctx.font = `${params.fontStyle} ${params.fontSize}px ${params.fontFamily}`;
        ctx.fillStyle = params.textColor;
        ctx.textAlign = params.textAlign;

        lines.forEach((line, index) => {
            ctx.fillText(line, canvas.width / 2, textY + index * lineHeight);
        });
    }

    // Initialize the canvas and drawing when the window is loaded
    window.onload = initCanvas;

    // Expose save function globally so it can be triggered from developer tools
    window.saveToJsonBin = saveToJsonBin;
})();
