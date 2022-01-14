import {makeAutoObservable} from "mobx";
import axios from "axios";
import { toast } from 'react-toastify';

const DEFAULT_PROMPT = 'Enter the confirmation code that we sent to your phone'

class AccountStore {
    user = null
    loading = false

    waitingConfirmationCode = false
    confirmationCodePrompt = DEFAULT_PROMPT
    confirmationCode = ''

    constructor() {
        makeAutoObservable(this)
    }

    async getUser(userId) {
        this.setLoading(true)
        try {
            const res = await axios.get(`/api/authentication/v1/users/${userId}`)
            this.setUser(res.data)
        } catch (e) {
            toast.error(`Login failed because ${e.response.data}`)
        } finally {
            this.setLoading(false)
        }
    }

    async saveUser() {
        this.setLoading(true)
        try {
            const userUpdates = {
                "name": this.user.name,
                "phoneNumber": this.user.phoneNumber
            }
            const res = await axios.patch(`/api/authentication/v1/users/${this.user.userId}`, userUpdates)
            this.setUser(res.data)
        } catch (e) {
            toast.error(`Failed to update user because ${e.response.data}`)
        } finally {
            this.setLoading(false)
        }
    }

    async sendPhoneConfirmCode() {
        try {
            this.setLoading(true)
            // Create the unconfirmed account
            const sendCodeResponse = await axios.post(`/api/authentication/v1/users/${this.user.userId}/sendCode?attribute=phone_number`)
            const deliveryDetails = sendCodeResponse.data
            this.setConfirmationCodePrompt(`We have sent a text with a confirmation code to ${deliveryDetails.CodeDeliveryDetails.Destination}. Enter that code to confirm your phone number`)
            this.setWaitingConfirmationCode(true)
        } catch (e) {
            const message = e.response && e.response.data ? e.response.data : e
            toast.error(`Send confirmation code failed because ${message}`)
        } finally {
            this.setLoading(false)
        }
    }

    async confirmPhone() {
        try {
            this.setLoading(true)
            await axios.post(`/api/authentication/v1/users/${this.user.userId}/confirmCode?attribute=phone_number&code=${this.confirmationCode}`)
            this.setConfirmationCodePrompt(DEFAULT_PROMPT)
            this.setWaitingConfirmationCode(false)
            this.updateUser("phoneNumberVerified", true)
        } catch (e) {
            const message = e.response && e.response.data ? e.response.data : e
            toast.error(`Confirmation code failed because ${message}`)
        } finally {
            this.setLoading(false)
        }
    }

    cancelConfirm() {
        this.setConfirmationCodePrompt(DEFAULT_PROMPT)
        this.setWaitingConfirmationCode(false)
    }

    updateUser(field, value) {
        this.user[field] = value
    }

    setUser(user) {
        this.user = user
    }

    setWaitingConfirmationCode(waitingConfirmationCode) {
        this.waitingConfirmationCode = waitingConfirmationCode
    }

    setConfirmationCodePrompt(confirmationCodePrompt) {
        this.confirmationCodePrompt = confirmationCodePrompt
    }

    setConfirmationCode(confirmationCode) {
        this.confirmationCode = confirmationCode
    }

    setLoading(loading) {
        this.loading = loading
    }
}

export default AccountStore;