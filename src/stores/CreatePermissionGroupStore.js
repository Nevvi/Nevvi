import {makeAutoObservable} from "mobx";
import {toast} from 'react-toastify';

class PermissionGroupStore {
    groupName = ""
    errorText = ""
    fields = []
    permissionGroupPromptOpen = false
    loading = false
    editingGroup = null
    deleteConfirmOpen = false
    deletingGroup = null

    constructor(accountStore, apiClient) {
        makeAutoObservable(this)
        this.accountStore = accountStore
        this.api = apiClient
    }

    async saveGroup() {
        this.setLoading(true)
        try {
            if (!this.groupName) {
                this.errorText = "Group name is required"
                return
            }

            if (this.editingGroup) {
                this.accountStore.updatePermissionGroup(this.editingGroup.name, this.groupName, this.fields)
            } else {
                this.accountStore.addPermissionGroup(this.groupName, this.fields)
            }
            
            await this.accountStore.saveUser()
            this.closeModal()
        } catch (e) {
            toast.error(`Failed to save group because ${e.message ? e.message.toLowerCase() : e.response.data.toLowerCase()}`)
        } finally {
            this.setLoading(false)
        }
    }

    async deleteGroup() {
        if (!this.deletingGroup) return
        
        this.setLoading(true)
        try {
            this.accountStore.removePermissionGroup(this.deletingGroup.name)
            await this.accountStore.saveUser()
            this.closeDeleteConfirm()
            toast.success('Permission group deleted successfully')
        } catch (e) {
            toast.error(`Failed to delete group because ${e.message ? e.message.toLowerCase() : e.response.data.toLowerCase()}`)
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

    editGroup(group) {
        this.editingGroup = group
        this.groupName = group.name
        this.fields = [...group.fields.filter(f => !['First Name', 'Last Name', 'Profile Picture'].includes(f))]
        this.setPermissionGroupPromptOpen(true)
    }

    openDeleteConfirm(group) {
        this.deletingGroup = group
        this.deleteConfirmOpen = true
    }

    closeDeleteConfirm() {
        this.deletingGroup = null
        this.deleteConfirmOpen = false
    }

    closeModal() {
        this.setPermissionGroupPromptOpen(false)
        this.editingGroup = null
        this.groupName = ""
        this.fields = []
        this.errorText = ""
    }

    get isEditing() {
        return this.editingGroup !== null
    }

    get modalTitle() {
        return this.isEditing ? 'Edit Permission Group' : 'Create New Permission Group'
    }

    get saveButtonText() {
        return this.isEditing ? 'Update Group' : 'Create Group'
    }

}

export default PermissionGroupStore;