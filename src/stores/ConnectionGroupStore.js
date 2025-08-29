import {makeAutoObservable} from "mobx";
import {toast} from 'react-toastify';

class ConnectionGroupStore {
    group = null
    loading = false
    saving = false
    deleting = false
    exporting = false

    constructor(authStore, apiClient) {
        makeAutoObservable(this)
        this.api = apiClient
        this.authStore = authStore
    }

    async getGroup(groupId) {
        this.setLoading(true)
        this.setGroup(null)
        try {
            const allGroups = await this.api.get(`/api/user/v1/users/${this.authStore.userId}/connection-groups`)
            const groupMeta = allGroups.data.find(g => g.id === groupId)

            const groupConnections = await this.api.get(`/api/user/v1/users/${this.authStore.userId}/connection-groups/${groupId}/connections`)
            this.setGroup({
                id: groupId,
                name: groupMeta?.name,
                connections: groupConnections.data.users
            })
        } catch (e) {
            console.log(`Failed to load connection group ${e.response.data}`)
        } finally {
            this.setLoading(false)
        }
    }

    async addToGroup(connectionId) {
        this.setSaving(true)
        try {
            await this.api.post(
                `/api/user/v1/users/${this.authStore.userId}/connection-groups/${this.group.id}/connections`,
                {userId: connectionId}
            )
            await this.getGroup(this.group.id)
        } catch (e) {
            toast.error(`Failed to add connection to group ${e.response.data}`)
        } finally {
            this.setSaving(false)
        }
    }

    async addMultipleToGroup(connectionIds) {
        this.setSaving(true)
        try {
            // Add connections in parallel for better performance
            await Promise.all(
                connectionIds.map(connectionId => 
                    this.api.post(
                        `/api/user/v1/users/${this.authStore.userId}/connection-groups/${this.group.id}/connections`,
                        {userId: connectionId}
                    )
                )
            )
            await this.getGroup(this.group.id)
            toast.success(`Successfully added ${connectionIds.length} connection${connectionIds.length !== 1 ? 's' : ''} to group`)
        } catch (e) {
            toast.error(`Failed to add connections to group ${e.response.data}`)
        } finally {
            this.setSaving(false)
        }
    }

    async removeFromGroup(connectionId) {
        this.setSaving(true)
        try {
            await this.api.delete(
                `/api/user/v1/users/${this.authStore.userId}/connection-groups/${this.group.id}/connections`,
                {data: {userId: connectionId}}
            )
            await this.getGroup(this.group.id)
        } catch (e) {
            toast.error(`Failed to remove connection from group ${e.response.data}`)
        } finally {
            this.setSaving(false)
        }
    }

    async exportGroup() {
        this.setExporting(true)
        try {
            await this.api.post(`/api/user/v1/users/${this.authStore.userId}/connection-groups/${this.group.id}/export`)
            toast.success("Successfully exported group")
        } catch (e) {
            toast.error(`Failed to export group ${e.response.data}`)
        } finally {
            this.setExporting(false)
        }
    }

    setGroup(group) {
        this.group = group
    }

    setLoading(loading) {
        this.loading = loading
    }

    setSaving(saving) {
        this.saving = saving
    }

    setDeleting(deleting) {
        this.deleting = deleting
    }

    setExporting(exporting) {
        this.exporting = exporting
    }

    reset() {
        this.group = null
        this.loading = false
        this.saving = false
        this.deleting = false
        this.exporting = false
    }
}

export default ConnectionGroupStore;