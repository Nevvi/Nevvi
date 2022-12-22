import {makeAutoObservable, reaction} from "mobx";
import axios from "axios";
import { toast } from 'react-toastify';
import {debounce} from "@mui/material";

class UsersStore {
    loading = false
    requesting = false
    users = []
    totalUsers = 0
    usersPerPage = 1
    page = 1
    nameFilter = ""

    constructor(authStore) {
        makeAutoObservable(this)
        this.authStore = authStore
        reaction(() => this.nameFilter, debounce((name) => this.loadUsers(), 500))
        reaction(() => this.page,(page) => this.loadUsers())
    }

    async loadUsers() {
        if (!this.nameFilter || this.nameFilter.length < 3) {
            this.setUsers([])
            return
        }

        this.setLoading(true)
        try {
            const skip = (this.page - 1) * this.usersPerPage
            const limit = this.usersPerPage
            const url = `/api/user/v1/users/search?name=${this.nameFilter}&skip=${skip}&limit=${limit}`
            const res = await axios.get(url)
            const users = res.data.users.filter((user) => user.id !== this.authStore.userId)
            this.setUsers(users)
            this.setTotalUsers(res.data.count)
        } catch(e) {
            toast.error(`Failed to load users due to ${e.message ? e.message.toLowerCase() : e.response.data.toLowerCase()}`)
        } finally {
            this.setLoading(false)
        }
    }

    async requestConnection(otherUserId, group) {
        try {
            this.setRequesting(true)
            let url = `/api/user/v1/users/${this.authStore.userId}/connections/requests`
            const res = await axios.post(url, {otherUserId: otherUserId, permissionGroupName: group})
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

    setUsersPerPage(usersPerPage) {
        this.usersPerPage = usersPerPage
    }

    setPage(page) {
        this.page = page
    }

    setTotalUsers(totalUsers) {
        this.totalUsers = totalUsers
    }

    setNameFilter(nameFilter) {
        if (this.nameFilter !== nameFilter) {
            this.nameFilter = nameFilter

            if (this.page !== 1) {
                this.setPage(1)
            }
        }
    }

    get pageCount() {
        return Math.ceil(this.totalUsers / this.usersPerPage)
    }
}

export default UsersStore;