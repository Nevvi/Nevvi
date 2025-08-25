import {makeAutoObservable, reaction} from "mobx";
import {toast} from 'react-toastify';

class ConnectionGroupsStore {
    connectionGroupsLoading = false
    connectionGroups = []

    constructor(authStore, apiClient) {
        makeAutoObservable(this)
        this.authStore = authStore
        this.api = apiClient

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
            const res = await this.api.get(url)
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
            await this.api.post(url, {name: name})
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
            await this.api.delete(url)
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