import axios from "./axiosInstance"

export const getAllProduct = async () => {
    return await axios.get('/server/getallsanpham.php')
}

export const createProduct = async (data) => {
    return await axios.post('/server/themsanpham.php', data)
}

export const deleteProduct = async (Id) => {
    return axios.post('/server/xoasanpham.php', { Id })
}

export const updateProduct = async (data) => {
    return axios.post('/server/suasanpham.php', data)
}