import {makeAutoObservable} from "mobx";
import axios from "axios";
import { toast } from 'react-toastify';

class AccountStore {
    groups = []
    loading = false

    constructor() {
        makeAutoObservable(this)
    }

    async getGroups(userId) {
        this.setLoading(true)
        try {
            const res = await axios.get(`/api/notification/v1/users/${userId}/groups`)
            this.setGroups(res.data)
        } catch (e) {
            toast.error(`Failed to get groups because ${e.response.data}`)
        } finally {
            this.setLoading(false)
        }
    }

    setGroups(groups) {
        this.groups = groups
    }

    setLoading(loading) {
        this.loading = loading
    }
}

export default AccountStore;