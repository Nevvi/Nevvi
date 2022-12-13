import {makeAutoObservable} from "mobx";
import { toast } from 'react-toastify';

class CreatePermissionGroupStore {
    groupName = ""
    errorText = ""
    fields = []
    permissionGroupPromptOpen = false
    loading = false

    constructor(authStore, accountStore) {
        makeAutoObservable(this)
        this.authStore = authStore
        this.accountStore = accountStore
    }

    async saveGroup() {
        this.setLoading(true)
        try {
            if (!this.groupName) {
                this.errorText = "Group name is required"
                return
            }

            this.accountStore.addPermissionGroup(this.groupName, this.fields)
            await this.accountStore.saveUser()
            this.setPermissionGroupPromptOpen(false)
        } catch (e) {
            toast.error(`Failed to add group because ${e.message ? e.message.toLowerCase() : e.response.data.toLowerCase()}`)
        } finally {
            this.setLoading(false)
        }
    }

    addField(field) {
        if (!this.fields.includes(field)) {
            this.fields.push(field)
        }
    }

    removeField(field) {
        this.fields = this.fields.filter(f => f !== field)
    }

    setLoading(loading) {
        this.loading = loading
    }

    setGroupName(groupName) {
        this.groupName = groupName
        this.errorText = ""
    }

    setPermissionGroupPromptOpen(value) {
        this.permissionGroupPromptOpen = value;
    }

}

export default CreatePermissionGroupStore;