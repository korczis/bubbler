
# Bubbler - Speech Bubble Generator

**Bubbler** is a JavaScript-based application that generates speech bubbles with dynamic text over an image. The text, font, color, and positioning are fully customizable via URL query parameters, allowing for easy configuration of the speech content and the overall layout of the image.

## Demo

You can test the application live via **GitHub Pages**. To generate speech bubbles with custom text, simply use the following URL format:

```
https://korczis.github.io/bubbler/?top=Your+Top+Text&bottom=Your+Bottom+Text&text=Full+Width+Text
```

For example:

```
https://korczis.github.io/bubbler/?top=Hello+World&bottom=This+is+a+test&text=A+big+paragraph
```

## How It Works

The application uses an HTML5 `<canvas>` element to draw an image and overlay speech bubbles. You can pass text and styling through URL query parameters to customize the top and bottom speech bubbles as well as full-width paragraph text.

### Example

![Bubbler Example](https://korczis.github.io/bubbler/images/image.png)

## URL Parameters

### Speech Bubble Parameters
- **top**: Sets the text for the top speech bubble. Default: `"Říká otec"`.
- **bottom**: Sets the text for the bottom speech bubble. Default: `"Ano, tatínku"`.
- **topFontSize**: Font size for the top text. Default: `40px`.
- **bottomFontSize**: Font size for the bottom text. Default: `40px`.
- **topFontStyle**: Font style for the top text (e.g., `bold`, `italic`). Default: `bold`.
- **bottomFontStyle**: Font style for the bottom text (e.g., `italic`). Default: `italic`.
- **topFont**: Font family for the top text (e.g., `Arial`). Default: `Arial`.
- **bottomFont**: Font family for the bottom text. Default: `Arial`.
- **topPosition**: Vertical position of the top text in pixels. Default: `50`.
- **bottomPosition**: Vertical position of the bottom text in pixels. Default: `canvas.height - 150`.

### Full-Width Paragraph Parameters
- **text**: Full-width paragraph text to display over the image.
- **fontSize**: Font size for the full-width paragraph. Default: `40px`.
- **fontStyle**: Font style for the full-width paragraph. Default: `bold`.
- **fontFamily**: Font family for the full-width paragraph. Default: `Arial`.
- **textColor**: Color of the paragraph text. Default: `white`.
- **textAlign**: Horizontal alignment of the paragraph text. Default: `center`.

### Example URL:
```
https://korczis.github.io/bubbler/?top=Father+Says&bottom=Son+Replies&text=Listen+to+me!&fontSize=50&fontStyle=italic&textColor=red
```

## How to Use

1. **Clone the repository:**
   ```bash
   git clone https://github.com/korczis/bubbler.git
   cd bubbler
   ```

2. **Run locally:**
   Open the `index.html` file in a browser:
   ```bash
   open index.html
   ```

3. **Customize the URL:**
   Add your custom text and styles by changing the parameters in the URL. For example:
   ```
   file:///path-to-your-bubbler-directory/index.html?top=Hello&bottom=World&text=This+is+a+full+width+text
   ```

## Repository Structure

```
bubbler/
├── index.html      # Main HTML file
├── js/
│   └── script.js   # JavaScript for handling image and speech bubble generation
└── images/
    └── image.png   # The image of the boy
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
