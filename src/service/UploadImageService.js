// src/services/imageUploadService.js
import axios from "axios";

const API_URL = "https://api.imgbb.com/1/upload";
const API_KEY = "db3e6e11d31b50e5f32a03814f90fd42";

const uploadImage = async (imageFile, imageName = "") => {
    try {
        // Đọc dữ liệu ảnh
        const formData = new FormData();
        formData.append("key", API_KEY);
        formData.append("image", imageFile);
        if (imageName) formData.append("name", imageName);

        // Gửi request POST
        const response = await axios.post(API_URL, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data; // Trả về dữ liệu nếu upload thành công
    } catch (error) {
        console.error("Upload failed:", error);
        throw error; // Ném lỗi để xử lý trong component Vue
    }
};

export default {
    uploadImage,
};
