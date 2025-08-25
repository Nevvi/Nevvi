import {makeAutoObservable} from "mobx";
import {toast} from 'react-toastify';
import {router} from "../router";

class ConnectionStore {
    connection = null
    loading = false
    saving = false
    deleting = false
    deletePromptOpen = false

    permissionGroup = null

    constructor(authStore, accountStore, apiClient) {
        makeAutoObservable(this)
        this.authStore = authStore
        this.accountStore = accountStore
        this.api = apiClient
    }

    async getConnection(connectionId) {
        this.setLoading(true)
        this.setConnection(null)
        try {
            const res = await this.api.get(`/api/user/v1/users/${this.authStore.userId}/connections/${connectionId}`)
            this.setConnection(res.data)
            this.setPermissionGroup(res.data.permissionGroup)
        } catch (e) {
            toast.error(`Failed to load connection because ${e.response.data}`)
            router.push("/")
        } finally {
            this.setLoading(false)
        }
    }

    async saveConnection() {
        this.setSaving(true)
        try {
            const updateRequest = {
                permissionGroupName: this.permissionGroup
            }
            const res = await this.api.patch(`/api/user/v1/users/${this.authStore.userId}/connections/${this.connection.id}`, updateRequest)
            this.setConnection(res.data)
            this.setPermissionGroup(res.data.permissionGroup)
        } catch (e) {
            toast.error(`Failed to update connection because ${e.response.data}`)
        } finally {
            this.setSaving(false)
        }
    }

    async deleteConnection() {
        this.setDeleting(true)
        try {
            await this.api.delete(`/api/user/v1/users/${this.authStore.userId}/connections/${this.connection.id}`)
            await this.accountStore.getRejectedUsers()
            toast.success("Successfully deleted connection")
            router.push("/")
        } catch (e) {
            toast.error(`Failed to update connection because ${e.response.data}`)
        } finally {
            this.setDeleting(false)
        }
    }

    setPermissionGroup(permissionGroup) {
        this.permissionGroup = permissionGroup
    }

    setConnection(connection) {
        this.connection = connection
    }

    setLoading(loading) {
        this.loading = loading
    }

    setSaving(saving) {
        this.saving = saving
    }

    setDeleting(deleting) {
        this.deleting = deleting;
    }

    setDeletePromptOpen(deletePromptOpen) {
        this.deletePromptOpen = deletePromptOpen;
    }

    reset() {
        this.connection = null
        this.loading = false
        this.saving = false
        this.deleting = false
        this.deletePromptOpen = false
    }
}

export default ConnectionStore;