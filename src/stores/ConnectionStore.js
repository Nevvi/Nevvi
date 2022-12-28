import {makeAutoObservable} from "mobx";
import axios from "axios";
import { toast } from 'react-toastify';
import {router} from "../router";

class ConnectionStore {
    user = null
    loading = false

    constructor(authStore) {
        makeAutoObservable(this)
        this.authStore = authStore
    }

    async getUser(userId) {
        this.setLoading(true)
        this.setUser(null)
        try {
            const res = await axios.get(`/api/user/v1/users/${this.authStore.userId}/connections/${userId}`)
            this.setUser(res.data)
        } catch (e) {
            toast.error(`Failed to load connection because ${e.response.data}`)
            router.push("/")
        } finally {
            this.setLoading(false)
        }
    }

    setUser(user) {
        this.user = user
    }

    setLoading(loading) {
        this.loading = loading
    }

    reset() {
        this.user = null
        this.loading = false
    }
}

export default ConnectionStore;