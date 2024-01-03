import axios from "./axiosInstance"

export const getAllBill = async () => {
    return await axios.get('/server/getitem.php')
}

export const getDetailBill = async (madonhang) => {
    return await axios.post('/server/getchitietdonhang.php', { madonhang })
}

export const updateBill = async (data) => {
    return await axios.post('/server/updatedonhang.php', data)
}