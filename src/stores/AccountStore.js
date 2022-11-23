import {makeAutoObservable} from "mobx";
import axios from "axios";
import { toast } from 'react-toastify';
import {router} from "../router";

import {PhoneNumberFormat, PhoneNumberUtil} from 'google-libphonenumber'
const PNU = PhoneNumberUtil.getInstance();

class AccountStore {
    user = null
    updatedUser = null
    loading = false
    imageLoading = false
    newImage = null

    constructor(authStore) {
        makeAutoObservable(this)
        this.authStore = authStore
    }

    async getUser(userId) {
        this.setLoading(true)
        try {
            // If we are requesting ourselves then call the profile endpoint
            // If we are loading someone else call the connections endpoint to restrict who can view data
            const res = userId === this.authStore.userId ?
                await axios.get(`/api/user/v1/users/${userId}`) :
                await axios.get(`/api/user/v1/users/${this.authStore.userId}/connections/${userId}`)

            this.setUser(res.data)
            this.setUpdatedUser(JSON.parse(JSON.stringify(res.data)))
        } catch (e) {
            toast.error(`Failed to load user because ${e.response.data}`)
            router.push("/")
        } finally {
            this.setLoading(false)
        }
    }

    async saveUserImage(image) {
        this.setImageLoading(true)
        try {
            const url = `/api/user/v1/users/${this.user.id}/image`;
            const formData = new FormData();
            formData.append('file', image)
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            await axios.post(url, formData, config)
            await this.getUser(this.user.id)
        } catch (e) {
            toast.error(`Failed to save image because ${e.response.data}`)
        } finally {
            this.setImageLoading(false)
        }
    }

    async saveUser() {
        this.setLoading(true)
        try {
            const userUpdates = {}
            Object.keys(this.updatedUser).filter(key => {
                return this.user[key] !== this.updatedUser[key];
            }).forEach(key => {
                if (key === "phoneNumber") {
                    // Format the phone number the way the backend is expecting it
                    const number = PNU.parseAndKeepRawInput(this.updatedUser[key], 'US');
                    // Ideally we do this before submit
                    if (!PNU.isValidNumberForRegion(number, 'US')) {
                        throw new SyntaxError('Invalid phone number format')
                    }
                    userUpdates[key] = PNU.format(number, PhoneNumberFormat.E164);
                } else if (key === "address") {
                    // If updating address make sure we aren't sending over a partial one
                    Object.keys(this.updatedUser[key]).forEach(addressKey => {
                        if (!this.updatedUser[key][addressKey]) {
                            throw new SyntaxError(`All address fields are required for updating`)
                        }
                    })
                    userUpdates[key] = this.updatedUser[key];
                } else {
                    userUpdates[key] = this.updatedUser[key];
                }
            })

            const res = await axios.patch(`/api/user/v1/users/${this.user.id}`, userUpdates)
            this.setUser(res.data)
            this.setUpdatedUser(res.data)
        } catch (e) {
            toast.error(`Failed to update user because ${e.message ? e.message.toLowerCase() : e.response.data.toLowerCase()}`)
        } finally {
            this.setLoading(false)
        }
    }

    get hasUserChanged() {
        return JSON.stringify(this.user) !== JSON.stringify(this.updatedUser)
    }

    updateUser(field, value) {
        if (value) {
            this.updatedUser[field] = value
        } else {
            delete this.updatedUser[field]
        }
    }

    updateAddress(field, value) {
        if(field === "zipCode") {
            if (isNaN(value)) return
            value = parseInt(value)
        }

        if (value) {
            this.updatedUser.address[field] = value
        } else {
            this.updatedUser.address[field] = null
        }
    }

    setUser(user) {
        this.user = user
    }

    setUpdatedUser(updatedUser) {
        this.updatedUser = updatedUser
    }

    setLoading(loading) {
        this.loading = loading
    }

    setImageLoading(imageLoading) {
        this.imageLoading = imageLoading
    }

    get isMe() {
        return this.user && this.user.id === this.authStore.userId
    }

    reset() {
        this.user = null
        this.updatedUser = null
        this.loading = false
        this.imageLoading = false
        this.newImage = null
    }
}

export default AccountStore;