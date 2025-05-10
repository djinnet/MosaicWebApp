import { loadImage, loadImageFromFile, averageBrightness, averageBrightnessColor, mapBrightnessToTile } from './mosaicHelpers.js';

// Directly export functions
export async function generateMosaicFromPresetColor(sourceImageUrl, colors, canvasId, scl = 16, shapes = 0) {

    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    try {
        // Load source image
        const sourceImage = await loadImage(sourceImageUrl);

        // Resize source image to lower resolution
        const w = Math.floor(sourceImage.width / scl);
        const h = Math.floor(sourceImage.height / scl);

        canvas.width = w * scl;
        canvas.height = h * scl;

        // Create a smaller canvas to draw the resized image
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = sourceImage.width;
        tempCanvas.height = sourceImage.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(sourceImage, 0, 0);
        const imageData = tempCtx.getImageData(0, 0, sourceImage.width, sourceImage.height).data;

        // Resize tile images and calculate brightness
        const tileBrightness = colors.map(c => averageBrightnessColor(c));

        // Map each brightness level to best matching tile
        const brightImages = mapBrightnessToTile(tileBrightness, colors);

        // Loop through each pixel in the smaller image
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                // Calculate the index for the pixel data
                const px = x * scl;
                const py = y * scl;
                const idx = (py * sourceImage.width + px) * 4;

                // Get the RGB values for the pixel
                const r = imageData[idx];
                const g = imageData[idx + 1];
                const b = imageData[idx + 2];

                // Calculate the brightness value
                const brightness = Math.floor((r + g + b) / 3);

                if (isNaN(brightness) || !brightImages[brightness]) continue;

                DrawResult(shapes, ctx, brightImages[brightness], x, y, scl);  // Draw a square
            }
        }
    } catch (error) {
        console.error("Error generating mosaic:", error);  // Debug log
    }
}



export async function generateMosaicFromUrls(sourceImageUrl, tileImageUrls, canvasId, scl = 16, shapes = 0) {

    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    try {
        // Load source image
        const sourceImage = await loadImage(sourceImageUrl);

        // Resize source image to lower resolution
        const w = Math.floor(sourceImage.width / scl);
        const h = Math.floor(sourceImage.height / scl);

        canvas.width = w * scl;
        canvas.height = h * scl;

        // Create a smaller canvas to draw the resized image
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = sourceImage.width;
        tempCanvas.height = sourceImage.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(sourceImage, 0, 0);
        const imageData = tempCtx.getImageData(0, 0, sourceImage.width, sourceImage.height).data;

        // Load tile images
        const tileImages = await Promise.all(tileImageUrls.map(loadImage));

        // Resize tile images and calculate brightness
        const tileBrightness = tileImages.map(img => averageBrightness(img, scl));

        // Map each brightness level to best matching tile
        const brightImages = mapBrightnessToTile(tileBrightness, tileImages);

        // Loop through each pixel in the smaller image
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                // Calculate the index for the pixel data
                const px = x * scl;
                const py = y * scl;
                const idx = (py * sourceImage.width + px) * 4;

                // Get the RGB values for the pixel
                const r = imageData[idx];
                const g = imageData[idx + 1];
                const b = imageData[idx + 2];

                // Calculate the brightness value
                const brightness = Math.floor((r + g + b) / 3);
                //console.log("Brightness value:", brightness);  // Debug log

                if (isNaN(brightness) || !brightImages[brightness]) continue;

                ctx.drawImage(brightImages[brightness], x * scl, y * scl, scl, scl);
            }
        }
    } catch (error) {
        console.error("Error generating mosaic:", error);  // Debug log
    }
}

export async function generateMosaicFromFiles(sourceImageFile, tileImageFiles, canvasId, scl = 16) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    try {
        // Load source image from file
        const sourceImage = await loadImageFromFile(sourceImageFile);

        // Resize source image to lower resolution
        const w = Math.floor(sourceImage.width / scl);
        const h = Math.floor(sourceImage.height / scl);

        canvas.width = w * scl;
        canvas.height = h * scl;

        // Create a smaller canvas to draw the resized image
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = sourceImage.width;
        tempCanvas.height = sourceImage.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(sourceImage, 0, 0);
        const imageData = tempCtx.getImageData(0, 0, sourceImage.width, sourceImage.height).data;

        // Load tile images from files
        const tileImages = await Promise.all([...tileImageFiles].map(loadImageFromFile));

        // Resize and calculate brightness
        const tileBrightness = tileImages.map(img => averageBrightness(img, scl));

        // Map each brightness level to best matching tile
        const brightImages = mapBrightnessToTile(tileBrightness, tileImages);

        // Loop through each pixel in the smaller image
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                // Calculate the index for the pixel data
                const px = x * scl;
                const py = y * scl;
                const idx = (py * sourceImage.width + px) * 4;

                // Get the RGB values for the pixel
                const r = imageData[idx];
                const g = imageData[idx + 1];
                const b = imageData[idx + 2];

                // Calculate the brightness value
                const brightness = Math.floor((r + g + b) / 3);
                //console.log("Brightness value:", brightness);  // Debug log

                if (isNaN(brightness) || !brightImages[brightness]) continue;

                ctx.drawImage(brightImages[brightness], x * scl, y * scl, scl, scl);
            }
        }
    } catch (error) {
        console.error("Error generating mosaic from files:", error);  // Debug log
    }
}





function DrawResult(shapeType, ctx, image, x, y, scl) {
    if (typeof shapeType !== 'number') {
        throw new Error('You must pass a number to DrawResult!');
    }
    switch (shapeType) {
        // DrawResult(0) - Draw a square
        case 0:
            ctx.fillStyle = image;
            ctx.fillRect(x * scl, y * scl, scl, scl);
            break;
        // DrawResult(1) - Draw a circle
        case 1:
            ctx.beginPath();
            ctx.arc(x * scl + scl / 2, y * scl + scl / 2, scl / 2, 0, Math.PI * 2);
            ctx.fillStyle = image;
            ctx.fill();
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.closePath();
            break;
        // DrawResult(2) - Draw a triangle
        case 2:
            ctx.beginPath();
            ctx.moveTo(x * scl + scl / 2, y * scl);
            ctx.lineTo(x * scl, y * scl + scl);
            ctx.lineTo(x * scl + scl, y * scl + scl);
            ctx.fillStyle = image;
            ctx.fill();
            ctx.closePath();
            break;
        // DrawResult(3) - Draw a image
        case 3:
            ctx.drawImage(image, x * scl, y * scl, scl, scl);
            break;
        default:
            console.error('Invalid shape type passed to DrawResult!');
            break;
    }
}