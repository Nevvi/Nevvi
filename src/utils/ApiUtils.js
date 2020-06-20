import axios from "axios";

export async function getUser(userId) {
    const res = await axios.get(`/api/user/v1/users/${userId}`)
    return res.data
}