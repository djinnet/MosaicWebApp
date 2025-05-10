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
        // DrawResult(0) - Draw a image
        case 0:
            
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
        // DrawResult(2) - Draw a square
        case 2:
            ctx.fillStyle = image;
            ctx.fillRect(x * scl, y * scl, scl, scl);
            break;
        // DrawResult(3) - Draw a triangle
        case 3:
            ctx.beginPath();
            ctx.moveTo(x * scl + scl / 2, y * scl);
            ctx.lineTo(x * scl, y * scl + scl);
            ctx.lineTo(x * scl + scl, y * scl + scl);
            ctx.fillStyle = image;
            ctx.fill();
            ctx.closePath();
            break;
        // DrawResult(4) - Draw a hexagon
        case 4:
            ctx.beginPath();
            ctx.moveTo(x * scl + scl / 2, y * scl);
            ctx.lineTo(x * scl + scl, y * scl + scl / 4);
            ctx.lineTo(x * scl + scl, y * scl + (scl * 3) / 4);
            ctx.lineTo(x * scl + scl / 2, y * scl + scl);
            ctx.lineTo(x * scl, y * scl + (scl * 3) / 4);
            ctx.lineTo(x * scl, y * scl + scl / 4);
            ctx.fillStyle = image;
            ctx.fill();
            ctx.closePath();
            break;
        // DrawResult(5) - Draw a pentagon
        case 5:
            ctx.beginPath();
            ctx.moveTo(x * scl + scl / 2, y * scl);
            ctx.lineTo(x * scl + (scl * 3) / 4, y * scl + (scl * 3) / 4);
            ctx.lineTo(x * scl + (scl / 2), y * scl + scl);
            ctx.lineTo(x * scl + (scl / 4), y * scl + (scl * 3) / 4);
            ctx.lineTo(x * scl, y * scl);
            ctx.fillStyle = image;
            ctx.fill();
            ctx.closePath();
            break;
        // DrawResult(6) - Draw a octagon
        case 6:
            ctx.beginPath();
            ctx.moveTo(x * scl + scl / 2, y * scl);
            ctx.lineTo(x * scl + (scl * 3) / 4, y * scl);
            ctx.lineTo(x * scl + scl, y * scl + scl / 4);
            ctx.lineTo(x * scl + scl, y * scl + (scl * 3) / 4);
            ctx.lineTo(x * scl + (scl * 3) / 4, y * scl + scl);
            ctx.lineTo(x * scl + (scl / 4), y * scl + scl);
            ctx.lineTo(x * scl, y * scl + (scl * 3) / 4);
            ctx.lineTo(x * scl, y * scl + (scl / 4));
            ctx.fillStyle = image;
            ctx.fill();
            ctx.closePath();
            break;
        // DrawResult(7) - Draw a star
        case 7:
            const cx = x * scl + scl / 2;
            const cy = y * scl + scl / 2;
            const outerRadius = scl / 2;
            const innerRadius = scl / 4;

            drawStar(ctx, cx, cy, 5, outerRadius, innerRadius, image);
            break;
        // DrawResult(8) - Draw a diamond
        case 8:
            ctx.beginPath();
            ctx.moveTo(x * scl + scl / 2, y * scl);
            ctx.lineTo(x * scl, y * scl + scl / 2);
            ctx.lineTo(x * scl + scl / 2, y * scl + scl);
            ctx.lineTo(x * scl + scl, y * scl + scl / 2);
            ctx.fillStyle = image;
            ctx.fill();
            ctx.closePath();
            break;
        // DrawResult(9) - Draw a heart
        case 9:
            drawHeart(ctx, x * scl + scl / 2, y * scl + scl / 2, scl, scl, image);
            break;
        
        default:
            console.error('Invalid shape type passed to DrawResult! Changing to imagedraw!');
            ctx.drawImage(image, x * scl, y * scl, scl, scl);
            break;
    }

    function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, fillStyle) {
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / spikes;
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);

        for (let i = 0; i < spikes; i++) {
            let x = cx + Math.cos(rot) * outerRadius;
            let y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }

        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fillStyle = fillStyle;
        ctx.fill();
    }

    function drawHeart(context, x, y, width, height, image) {
        context.beginPath();
        var topCurveHeight = height * 0.3;
        context.moveTo(x, y + topCurveHeight);
        // top left curve
        context.bezierCurveTo(
            x, y,
            x - width / 2, y,
            x - width / 2, y + topCurveHeight
        );

        // bottom left curve
        context.bezierCurveTo(
            x - width / 2, y + (height + topCurveHeight) / 2,
            x, y + (height + topCurveHeight) / 2,
            x, y + height
        );

        // bottom right curve
        context.bezierCurveTo(
            x, y + (height + topCurveHeight) / 2,
            x + width / 2, y + (height + topCurveHeight) / 2,
            x + width / 2, y + topCurveHeight
        );

        // top right curve
        context.bezierCurveTo(
            x + width / 2, y,
            x, y,
            x, y + topCurveHeight
        );

        context.closePath();
        context.fillStyle = image;
        context.fill();
    }

}