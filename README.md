# Bubbler - Speech Bubble Generator

Bubbler is a simple JavaScript application that generates a speech bubble with dynamic text over an image of a boy. The text is passed through a URL query parameter, allowing for easy customization of the speech content.

## Demo

You can test the application live via **GitHub Pages**. To generate a speech bubble with custom text, simply use the following URL format:

```
https://korczis.github.io/bubbler/?says=Your+Text+Here
```

For example:

```
https://korczis.github.io/bubbler/?says=Hello+World
```

## How It Works

The application uses an HTML5 `<canvas>` element to draw an image and overlay a customizable speech bubble. The text in the speech bubble is taken from the `says` query parameter in the URL.

### Example

![Bubbler Example](https://your-image-link-here)

## How to Use

1. **Clone the repository:**
   ```bash
   git clone https://github.com/korczis/bubbler.git
   cd bubbler
   ```

2. **Run locally:**
   Simply open the `index.html` file in a browser:
   ```bash
   open index.html
   ```

3. **Customize the URL:**
   Add your own text by changing the `says` query parameter in the URL. For example:
   ```
   file:///path-to-your-bubbler-directory/index.html?says=Custom+Message
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
