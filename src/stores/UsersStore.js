import {makeAutoObservable, reaction} from "mobx";
import axios from "axios";
import { toast } from 'react-toastify';
import {debounce} from "@mui/material";

class UsersStore {
    loading = false
    users = []
    continuationKey = undefined

    nameFilter = ""

    constructor() {
        makeAutoObservable(this)

        reaction(() => this.nameFilter, debounce((name) => this.loadUsers(), 500))
    }

    async loadUsers(continuationKey = undefined) {
        if (!this.nameFilter || this.nameFilter.length < 3) {
            this.setUsers([])
            this.setContinuationKey(undefined)
            return
        }

        this.setLoading(true)
        try {
            let url = `/api/user/v1/users/search?name=${this.nameFilter}`
            if (continuationKey) {
                url = `${url}&continuationKey=${continuationKey}`
            }
            const res = await axios.get(url)
            this.setContinuationKey(res.data.continuationKey)
            this.setUsers(res.data.users)
        } catch(e) {
            toast.error(`Failed to load users due to ${e.message ? e.message.toLowerCase() : e.response.data.toLowerCase()}`)
        } finally {
            this.setLoading(false)
        }
    }

    setLoading(loading) {
        this.loading = loading
    }

    setUsers(users) {
        this.users = users
    }

    setContinuationKey(continuationKey) {
        this.continuationKey = continuationKey
    }

    setNameFilter(nameFilter) {
        this.nameFilter = nameFilter
    }

    async nextPage() {
        await this.loadUsers(this.continuationKey)
    }
}

export default UsersStore;