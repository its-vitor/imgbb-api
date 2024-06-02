import {
    ImgbbResponse,
    UploadCallback
} from "./utils/types";
import axios from "axios";
import validateImage from "./utils/validator";

export class ImgBB {

    private apiKey: string;
    private apiUrl: string = "https://api.imgbb.com/1/";
    
    /**
     * The constructor function initializes an object with an API key in TypeScript.
     * @param {string} apiKey - The `apiKey` parameter is a string that represents an API key used for
     * authentication and authorization when making requests to an API.
     */
    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    /**
     * The function `upload` asynchronously uploads an image with optional parameters and returns a
     * promise of ImgbbResponse.
     * @param options - The `upload` function takes in an `options` object with the following
     * properties:
     * @param {UploadCallback} [callback] - The `callback` parameter in the `upload` function is a
     * function that can be optionally provided by the caller. If a `callback` function is provided, it
     * will be called with the `ImgbbResponse` object as an argument after the upload operation is
     * completed. This allows the caller to perform
     * @returns The `upload` function is returning a Promise that resolves to an `ImgbbResponse`
     * object.
     */
    public async upload(options: {
        image: Buffer | string | Blob,
        filename?: string,
        expiration?: number,
    }, callback?: UploadCallback): Promise<ImgbbResponse> {
        const { image, filename, expiration } = options;

        const body = new FormData();
        body.set('key', this.apiKey);

        if (typeof image === 'string') {
            body.append('image', await validateImage(image));
        } else if (image instanceof Buffer) {
            body.append('image', await validateImage(Buffer.from(image).toString('base64')));
        } else if (image instanceof Blob && filename) {
            body.append('image', image, filename);
        }

        if (expiration) {
            body.append('expiration', expiration.toString());
        }

        const response = await axios.post(
            this.apiUrl + "/upload", body
        ) as ImgbbResponse;

        if (callback) {
            callback(response);
        }
        
        return response;
    }
}