import axios from "axios"

const instance = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 10000,
    withCredentials: false,
    headers: {
        // 'Content-Type': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
    },
});

instance.interceptors.request.use(
    (config) => {
        // Xử lý trước khi gửi yêu cầu
        return config;
    },
    (error) => {
        // Xử lý lỗi khi gửi yêu cầu
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        // Xử lý sau khi nhận phản hồi
        return response;
    },
    (error) => {
        // Xử lý lỗi sau khi nhận phản hồi
        return Promise.reject(error);
    }
);

export default instance;