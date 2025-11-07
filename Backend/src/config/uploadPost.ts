import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
        folder: "Post_Attachments",
        resource_type: "auto", 
        transformation: [
            { width: 1000, height: 1000, crop: "limit" }
        ]
    })
});

const uploadPost = multer({ storage });
export default uploadPost;