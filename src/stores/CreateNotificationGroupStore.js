import {makeAutoObservable} from "mobx";
import axios from "axios";
import { toast } from 'react-toastify';
import dayjs from "dayjs";

class CreateNotificationGroupStore {
    groupName = ""
    expirationDate = dayjs().add(1, "year").format("YYYY-MM-DD")
    loading = false
    authStore = null
    routingStore = null

    constructor(authStore, routingStore) {
        makeAutoObservable(this)
        this.authStore = authStore
        this.routingStore = routingStore
    }

    async createGroup() {
        this.setLoading(true)
        try {
            const body = {name: this.groupName, expirationDate: this.expirationDate}
            await axios.post(`/api/notification/v1/users/${this.authStore.userId}/groups`, body)
            this.routingStore.push("/groups")
            toast.success(`Successfully created ${this.groupName}`)
            this.groupName = ""
            this.expirationDate = dayjs().add(1, "year").format("YYYY-MM-DD")
        } catch (e) {
            toast.error(`Failed to create group because ${e.response.data}`)
        } finally {
            this.setLoading(false)
        }
    }

    setGroupName(groupName) {
        this.groupName = groupName
    }

    setExpirationDate(expirationDate) {
        this.expirationDate = expirationDate
    }

    setLoading(loading) {
        this.loading = loading
    }
}

export default CreateNotificationGroupStore;