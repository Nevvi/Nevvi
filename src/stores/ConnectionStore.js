import {makeAutoObservable} from "mobx";
import axios from "axios";
import { toast } from 'react-toastify';
import {router} from "../router";

class ConnectionStore {
    connection = null
    loading = false
    saving = false

    permissionGroup = null

    constructor(authStore) {
        makeAutoObservable(this)
        this.authStore = authStore
    }

    async getConnection(connectionId) {
        this.setLoading(true)
        this.setConnection(null)
        try {
            const res = await axios.get(`/api/user/v1/users/${this.authStore.userId}/connections/${connectionId}`)
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
            const res = await axios.patch(`/api/user/v1/users/${this.authStore.userId}/connections/${this.connection.id}`, updateRequest)
            this.setConnection(res.data)
            this.setPermissionGroup(res.data.permissionGroup)
        } catch (e) {
            toast.error(`Failed to update connection because ${e.response.data}`)
        } finally {
            this.setSaving(false)
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

    reset() {
        this.connection = null
        this.loading = false
    }
}

export default ConnectionStore;