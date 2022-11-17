import {makeAutoObservable} from "mobx";
import axios from "axios";
import { toast } from 'react-toastify';

import {PhoneNumberFormat, PhoneNumberUtil} from 'google-libphonenumber'
const PNU = PhoneNumberUtil.getInstance();

class AccountStore {
    user = null
    updatedUser = null
    loading = false

    constructor() {
        makeAutoObservable(this)
    }

    async getUser(userId) {
        this.setLoading(true)
        try {
            const res = await axios.get(`/api/user/v1/users/${userId}`)
            this.setUser(res.data)
            this.setUpdatedUser(JSON.parse(JSON.stringify(res.data)))
        } catch (e) {
            toast.error(`Login failed because ${e.response.data}`)
        } finally {
            this.setLoading(false)
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
}

export default AccountStore;