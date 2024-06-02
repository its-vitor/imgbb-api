import axios from "axios";
import exceptions from "./exceptions";

/**
 * The function `validateImage` checks if an image is valid by verifying its format, size, and source.
 * @param {string} image - The `image` parameter in the `validateImage` function is a string that
 * represents either a base64 encoded image or a URL pointing to an image file. The function validates
 * the image based on certain criteria such as checking if it is a valid base64 string or URL,
 * determining the image size,
 */
async function validateImage(image: string): Promise<string> {
    const isBase64 = image.startsWith('data:image/');
    const isUrl = image.startsWith('http') || image.startsWith('https');

    if (!isBase64 && !isUrl) {
        throw new exceptions.InvalidImage();
    }

    let imageSize: number;
    if (isBase64) {
        const base64Data = image.split(',')[1];
        const decodedImage = Buffer.from(base64Data, 'base64');
        imageSize = decodedImage.length;
    } else {
        const response = await axios.head(image);
        imageSize = Number(response.headers['content-length']);
    }

    if (imageSize > 32 * 1024 * 1024) {
        throw new exceptions.ImageSize();
    }

    const validExtensions = ['.jpeg', '.jpg', '.png', '.gif'];
    const extension = isBase64 ? '.base64' : new URL(image).pathname.toLowerCase();
    if (!validExtensions.includes(extension)) {
        throw new exceptions.InsupportedFormat();
    }

    return image;
}

export default validateImage;