import {makeAutoObservable} from "mobx";
import axios from "axios";
import { toast } from 'react-toastify';
import {router} from "../router";


class PermissionGroupModalStore {
    user = null
    open = false
    loading = false
    submitting = false
    selectedGroup = "ALL"
    otherUserId = null

    constructor(authStore) {
        makeAutoObservable(this)
        this.authStore = authStore
    }

    async initialize(otherUserId) {
        this.setLoading(true)
        this.setUser(null)
        this.setOtherUserId(otherUserId)

        try {
            const res = await axios.get(`/api/user/v1/users/${this.authStore.userId}`)
            this.setUser(res.data)
            this.setOpen(true)
        } catch (e) {
            toast.error(`Failed to load user because ${e.response.data}`)
            router.push("/")
        } finally {
            this.setLoading(false)
        }
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

    setUser(user) {
        this.user = user
    }

    setLoading(loading) {
        this.loading = loading
    }

    setSubmitting(submitting) {
        this.submitting = submitting
    }

    setOpen(open) {
        this.open = open
    }

    setSelectedGroup(group) {
        this.selectedGroup = group
    }

    setOtherUserId(otherUserId) {
        this.otherUserId = otherUserId
    }

    reset() {
        this.user = null
        this.loading = false
        this.open = false
        this.submitting = null
        this.selectedGroup = "ALL"
        this.otherUserId = null
    }
}

export default PermissionGroupModalStore;