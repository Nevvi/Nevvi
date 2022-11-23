import {makeAutoObservable} from "mobx";
import axios from "axios";
import { toast } from 'react-toastify';

class UsersStore {
    connectionsLoading = false
    requestsLoading = false
    confirmationLoading = false

    connections = []
    requests = []
    nameFilter = ""

    constructor(authStore) {
        makeAutoObservable(this)
        this.authStore = authStore

        this.loadConnections()
        this.loadRequests()
    }

    async loadConnections() {
        this.setConnectionsLoading(true)
        try {
            let url = `/api/user/v1/users/${this.authStore.userId}/connections`
            const res = await axios.get(url)
            this.setConnections(res.data)
        } catch(e) {
            toast.error(`Failed to load connections due to ${e.message ? e.message.toLowerCase() : e.response.data.toLowerCase()}`)
        } finally {
            this.setConnectionsLoading(false)
        }
    }

    async loadRequests() {
        this.setRequestsLoading(true)
        try {
            let url = `/api/user/v1/users/${this.authStore.userId}/connections/requests/pending`
            const res = await axios.get(url)
            this.setRequests(res.data)
        } catch(e) {
            toast.error(`Failed to load connections due to ${e.message ? e.message.toLowerCase() : e.response.data.toLowerCase()}`)
        } finally {
            this.setRequestsLoading(false)
        }
    }

    async confirmRequest(userId) {
        this.setConfirmationLoading(true)
        try {
            let url = `/api/user/v1/users/${this.authStore.userId}/connections/requests/confirm`
            await axios.post(url, {otherUserId: userId})
            await Promise.all([this.loadConnections(), this.loadRequests()])
            toast.success('Connection confirmed')
        } catch(e) {
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
        this.nameFilter = nameFilter
    }
}

export default UsersStore;