export async function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.style.display = "none";
        img.crossOrigin = 'anonymous';  // Set CORS to 'anonymous'
        img.onload = () => resolve(img);  // Resolves the image element when it's loaded
        img.onerror = (err) => reject(err);  // Rejects if there's an error
        img.src = url;
    });
}

export function loadImageFromFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}

export function mapBrightnessToTile(tileBrightness, tileImages) {
    // Map each brightness level to best matching tile
    const brightImages = new Array(256);
    for (let i = 0; i < 256; i++) {
        let minDiff = 256;
        let bestMatch = 0;
        for (let j = 0; j < tileBrightness.length; j++) {
            const diff = Math.abs(i - tileBrightness[j]);
            if (diff < minDiff) {
                minDiff = diff;
                bestMatch = j;
            }
        }
        brightImages[i] = tileImages[bestMatch];
    }
    return brightImages;
}

export function averageBrightness(img, size) {
    var colorSum = 0;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const dataImage = ctx.getImageData(0, 0, size, size);
    const data = dataImage.data;
    var r, g, b, avg;

    //calculate brightness
    for (var x = 0; x < data.length; x += 4) {
        r = data[x];
        g = data[x + 1];
        b = data[x + 2];
        // Using the luminance formula to calculate brightness
        avg = Math.floor((r + g + b) / 3);
        colorSum += avg;
    }
    // Calculate average brightness
    const brightness = Math.floor(colorSum / (data.length / 4));
    return brightness;
}

export function averageBrightnessColor(color) {
    const [r, g, b] = colorCodeToRGB(color);
    const brightness = Math.floor((r + g + b) / 3);
    return brightness;
}

function colorCodeToRGB(hex) {
    // Remove hash if present
    hex = hex.replace(/^#/, '');

    // Parse shorthand hex (e.g., "#03F") to full form (e.g., "#0033FF")
    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return [r, g, b];
}