import axios from "axios";

export async function getUser(userId) {
    const res = await axios.get(`/api/user/v1/users/${userId}`)
    return res.data
}

export async function updateUser(userId, updates) {
    const res = await axios.patch(`/api/user/v1/users/${userId}`, updates)
    return res.data
}

export async function getPaymentToken() {
    const res = await axios.post(`/api/payment/v1/token`, {})
    return res.data
}

export async function createTransaction(sessionId, amount) {
    const res = await axios.post(`/api/payment/v1/transaction`, {sessionId, amount})
    return res.data
}