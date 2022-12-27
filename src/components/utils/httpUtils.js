import axios from "axios";

export async function getUser(userId) {
    const response = await axios.get(`/api/user/v1/users/${userId}`)
    return response.data
}