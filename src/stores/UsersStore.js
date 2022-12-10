import {makeAutoObservable, reaction} from "mobx";
import axios from "axios";
import { toast } from 'react-toastify';
import {debounce} from "@mui/material";

class UsersStore {
    loading = false
    requesting = false
    users = []
    continuationKey = undefined

    nameFilter = ""

    constructor(authStore) {
        makeAutoObservable(this)
        this.authStore = authStore
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
            const users = res.data.users.filter((user) => user.id !== this.authStore.userId)
            this.setUsers(users)
        } catch(e) {
            toast.error(`Failed to load users due to ${e.message ? e.message.toLowerCase() : e.response.data.toLowerCase()}`)
        } finally {
            this.setLoading(false)
        }
    }

    async requestConnection(otherUserId) {
        try {
            this.setRequesting(true)
            let url = `/api/user/v1/users/${this.authStore.userId}/connections/requests`
            // TODO - dont hard code, if no permission groups prompt user to confirm ALL
            const res = await axios.post(url, {otherUserId: otherUserId, permissionGroupName: "ALL"})
            toast.success('Connection request submitted')
            return res.data
        } catch (e) {
            console.log(e)
            toast.error(`Connection request failed because ${e.response.data.toLowerCase()}`)
        } finally {
            this.setRequesting(false)
        }
    }

    setLoading(loading) {
        this.loading = loading
    }

    setRequesting(requesting) {
        this.requesting = requesting
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