import {makeAutoObservable} from "mobx";
import axios from "axios";
import { toast } from 'react-toastify';

class UsersStore {
    loading = false
    connections = []
    requests = []
    nameFilter = ""

    constructor(authStore) {
        makeAutoObservable(this)
        this.authStore = authStore

        // this.loadConnections()
        this.loadRequests()
    }

    async loadConnections() {
        this.setLoading(true)
        try {
            let url = `/api/user/v1/users/${this.authStore.userId}/connections`
            const res = await axios.get(url)
            this.setConnections(res.data)
        } catch(e) {
            toast.error(`Failed to load connections due to ${e.message ? e.message.toLowerCase() : e.response.data.toLowerCase()}`)
        } finally {
            this.setLoading(false)
        }
    }

    async loadRequests() {
        this.setLoading(true)
        try {
            let url = `/api/user/v1/users/${this.authStore.userId}/connections/requests/pending`
            const res = await axios.get(url)
            this.setRequests(res.data)
        } catch(e) {
            toast.error(`Failed to load connections due to ${e.message ? e.message.toLowerCase() : e.response.data.toLowerCase()}`)
        } finally {
            this.setLoading(false)
        }
    }

    setLoading(loading) {
        this.loading = loading
    }

    setConnections(connections) {
        this.connections = connections
    }

    setRequests(requests) {
        this.requests = requests
    }

    setNameFilter(nameFilter) {
        this.nameFilter = nameFilter
    }
}

export default UsersStore;