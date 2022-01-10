import {makeAutoObservable} from "mobx";
import axios from "axios";
import { toast } from 'react-toastify';


class AccountStore {
    user = null
    loading = false

    constructor() {
        makeAutoObservable(this)
    }

    async getUser(userId) {
        this.setLoading(true)
        try {
            const res = await axios.get(`/api/authentication/v1/users/${userId}`)
            res.data.emailVerified = res.data.emailVerified === 'true'
            res.data.phoneVerified = res.data.phoneVerified === 'true'
            this.setUser(res.data)
        } catch (e) {
            toast.error(`Login failed because ${e.response.data}`)
        } finally {
            this.setLoading(false)
        }
    }

    async saveUser() {
        this.setLoading(true)
        try {
            const userUpdates = JSON.parse(JSON.stringify(this.user))
            delete userUpdates["userId"]
            delete userUpdates["email"]
            delete userUpdates["emailVerified"]
            delete userUpdates["phone"]
            delete userUpdates["phoneVerified"]
            const res = await axios.patch(`/api/authentication/v1/users/${this.user.userId}`, userUpdates)
            this.setUser(res.data)
        } catch (e) {
            toast.error(`Failed to update user because ${e.response.data}`)
        } finally {
            this.setLoading(false)
        }
    }

    updateUser(field, value) {
        this.user[field] = value
    }

    setUser(user) {
        this.user = user
    }

    setLoading(loading) {
        this.loading = loading
    }
}

export default AccountStore;