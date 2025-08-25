import {makeAutoObservable, reaction} from "mobx";
import {toast} from 'react-toastify';
import {debounce} from "@mui/material";

class ConnectionsStore {
    connectionsLoading = false
    requestsLoading = false
    confirmationLoading = false

    connections = []
    totalConnections = 0
    connectionsPerPage = 8
    page = 1

    requests = []
    nameFilter = ""

    constructor(authStore, accountStore, apiClient) {
        makeAutoObservable(this)
        this.authStore = authStore
        this.accountStore = accountStore
        this.api = apiClient

        reaction(() => this.authStore.userId, (userId) => {
            if (userId) {
                this.loadRequests()
                this.loadConnections()
            }
        })

        reaction(() => this.nameFilter, debounce((name) => this.loadConnections(), 500))

        reaction(() => this.page, (page) => {
            if (this.authStore.userId) {
                this.loadConnections()
            }
        })
    }

    async loadConnections() {
        this.setConnectionsLoading(true)
        try {
            const skip = (this.page - 1) * this.connectionsPerPage
            const limit = this.connectionsPerPage
            let url = `/api/user/v1/users/${this.authStore.userId}/connections?limit=${limit}&skip=${skip}`
            if (this.nameFilter && this.nameFilter !== "" && this.nameFilter.length >= 3) {
                url = `${url}&name=${this.nameFilter}`
            }

            const res = await this.api.get(url)
            this.setConnections(res.data.users)
            this.setTotalConnections(res.data.count)
        } catch (e) {
            toast.error(`Failed to load connections due to ${e.message ? e.message.toLowerCase() : e.response.data.toLowerCase()}`)
        } finally {
            this.setConnectionsLoading(false)
        }
    }

    async loadRequests() {
        this.setRequestsLoading(true)
        try {
            let url = `/api/user/v1/users/${this.authStore.userId}/connections/requests/pending`
            const res = await this.api.get(url)
            this.setRequests(res.data)
        } catch (e) {
            toast.error(`Failed to load connections due to ${e.message ? e.message.toLowerCase() : e.response.data.toLowerCase()}`)
        } finally {
            this.setRequestsLoading(false)
        }
    }

    async confirmRequest(userId, permissionGroup) {
        this.setConfirmationLoading(true)
        try {
            let url = `/api/user/v1/users/${this.authStore.userId}/connections/requests/confirm`
            await this.api.post(url, {otherUserId: userId, permissionGroupName: permissionGroup})
            await Promise.all([this.loadConnections(), this.loadRequests()])
            toast.success('Connection confirmed')
        } catch (e) {
            toast.error(`Failed to confirm request due to ${e.message ? e.message.toLowerCase() : e.response.data.toLowerCase()}`)
        } finally {
            this.setConfirmationLoading(false)
        }
    }

    async denyRequest(userId) {
        this.setConfirmationLoading(true)
        try {
            let url = `/api/user/v1/users/${this.authStore.userId}/connections/requests/deny`
            await this.api.post(url, {otherUserId: userId})

            // load the latest data
            await Promise.all([
                this.loadRequests(),
                this.accountStore.getRejectedUsers()
            ])
            toast.success('Connection denied')
        } catch (e) {
            toast.error(`Failed to confirm request due to ${e.message ? e.message.toLowerCase() : e.response.data.toLowerCase()}`)
        } finally {
            this.setConfirmationLoading(false)
        }
    }

    setConnectionsLoading(loading) {
        this.connectionsLoading = loading
    }

    setConnections(connections) {
        this.connections = connections
    }

    setTotalConnections(totalConnections) {
        this.totalConnections = totalConnections
    }

    setPage(page) {
        this.page = page
    }

    setRequestsLoading(loading) {
        this.requestsLoading = loading
    }

    setRequests(requests) {
        this.requests = requests
    }

    setConfirmationLoading(loading) {
        this.confirmationLoading = loading
    }

    setNameFilter(nameFilter) {
        if (this.nameFilter !== nameFilter) {
            this.nameFilter = nameFilter
            this.setPage(1)
        }
    }

    get pageCount() {
        return Math.ceil(this.totalConnections / this.connectionsPerPage)
    }
}

export default ConnectionsStore;