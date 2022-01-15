import {makeAutoObservable} from "mobx";
import axios from "axios";
import { toast } from 'react-toastify';

class AccountStore {
    user = null
    updatedUser = null
    loading = false

    constructor() {
        makeAutoObservable(this)
    }

    async getUser(userId) {
        this.setLoading(true)
        try {
            const res = await axios.get(`/api/authentication/v1/users/${userId}`)
            this.setUser(res.data)
            this.setUpdatedUser(JSON.parse(JSON.stringify(res.data)))
        } catch (e) {
            toast.error(`Login failed because ${e.response.data}`)
        } finally {
            this.setLoading(false)
        }
    }

    async saveUser() {
        this.setLoading(true)
        try {
            const userUpdates = {}
            Object.keys(this.updatedUser).filter(key => {
                return this.user[key] !== this.updatedUser[key];
            }).forEach(key => {
                userUpdates[key] = this.updatedUser[key];
            })
            const res = await axios.patch(`/api/authentication/v1/users/${this.user.userId}`, userUpdates)
            this.setUser(res.data)
        } catch (e) {
            toast.error(`Failed to update user because ${e.response.data}`)
        } finally {
            this.setLoading(false)
        }
    }

    get hasUserChanged() {
        return JSON.stringify(this.user) !== JSON.stringify(this.updatedUser)
    }

    updateUser(field, value) {
        if (value) {
            this.updatedUser[field] = value
        } else {
            delete this.updatedUser[field]
        }
    }

    setUser(user) {
        this.user = user
    }

    setUpdatedUser(updatedUser) {
        this.updatedUser = updatedUser
    }

    setLoading(loading) {
        this.loading = loading
    }
}

export default AccountStore;