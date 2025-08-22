import {makeAutoObservable, reaction} from "mobx";
import axios from "axios";
import {toast} from 'react-toastify';

class ConnectionGroupsStore {
    connectionGroupsLoading = false
    connectionGroups = []

    constructor(authStore) {
        makeAutoObservable(this)
        this.authStore = authStore

        reaction(() => authStore.userId, (userId) => {
            if (userId) {
                this.loadGroups()
            }
        })
    }

    async loadGroups() {
        this.setConnectionGroupsLoading(true)
        try {
            let url = `/api/user/v1/users/${this.authStore.userId}/connection-groups`
            const res = await axios.get(url)
            this.setConnectionGroups(res.data)
        } catch (e) {
            toast.error(`Failed to load connection groups due to ${e.message ? e.message.toLowerCase() : e.response.data.toLowerCase()}`)
        } finally {
            this.setConnectionGroupsLoading(false)
        }
    }

    async createGroup(name) {
        this.setConnectionGroupsLoading(true)
        try {
            let url = `/api/user/v1/users/${this.authStore.userId}/connection-groups`
            await axios.post(url, {name: name})
            await this.loadGroups()
            toast.success('Connection group created')
        } catch (e) {
            toast.error(`Failed to create connection group due to ${e.message ? e.message.toLowerCase() : e.response.data.toLowerCase()}`)
        }
    }

    async deleteGroup(groupId) {
        this.setConnectionGroupsLoading(true)
        try {
            let url = `/api/user/v1/users/${this.authStore.userId}/connection-groups/${groupId}`
            await axios.delete(url)
            await this.loadGroups()
            toast.success('Connection group deleted')
        } catch (e) {
            toast.error(`Failed to delete connection group due to ${e.message ? e.message.toLowerCase() : e.response.data.toLowerCase()}`)
        }
    }

    setConnectionGroupsLoading(loading) {
        this.connectionGroupsLoading = loading
    }

    setConnectionGroups(connectionGroups) {
        this.connectionGroups = connectionGroups
    }
}

export default ConnectionGroupsStore;