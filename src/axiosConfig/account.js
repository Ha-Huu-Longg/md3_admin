import axios from "./axiosInstance"

export const getAllAccount = async () => {
    return await axios.get('/server/getadmin.php')
}

export const createAccount = async (data) => {
    return await axios.post('/server/register_account_manager.php', data)
}