import {makeAutoObservable} from "mobx";
import {toast} from 'react-toastify';
import {router} from "../router";


class PermissionGroupModalStore {
    user = null
    open = false
    loading = false
    submitting = false
    selectedGroup = "ALL"
    otherUserId = null

    constructor(authStore, apiClient) {
        makeAutoObservable(this)
        this.authStore = authStore
        this.api = apiClient
    }

    async submit(handler) {
        this.setSubmitting(true)
        try {
            await handler(this.otherUserId, this.selectedGroup)
            this.reset()
        } finally {
            this.setSubmitting(false)
        }
    }

    setSubmitting(submitting) {
        this.submitting = submitting
    }

    setSelectedGroup(group) {
        this.selectedGroup = group
    }

    reset() {
        this.user = null
        this.loading = false
        this.open = false
        this.submitting = null
        this.selectedGroup = "All Info"
        this.otherUserId = null
    }
}

export default PermissionGroupModalStore;