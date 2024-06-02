import { StatusCodes } from "http-status-codes";

class CustomException extends Error {
    public statusCode: string | number = 500;
    constructor(message: string, statusCode?: string | number) {
        super(message);
        this.statusCode = statusCode ? statusCode : 500;
    }
}

class InvalidImage extends CustomException {
    constructor() {
        super('Invalid image format. Please provide a valid base64 or image URL.', StatusCodes.BAD_REQUEST);
    }
}

class ImageSize extends CustomException {
    constructor() {
        super('Image size exceeds the maximum allowed (32 MB).', StatusCodes.BAD_GATEWAY);
    }
}

class InsupportedFormat extends CustomException {
    constructor() {
        super('Invalid image extension. Supported formats: jpeg, jpg, png, gif.', StatusCodes.BAD_GATEWAY);
    }
}

export default {
    InvalidImage, ImageSize, InsupportedFormat
}