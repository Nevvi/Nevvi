import {makeAutoObservable} from "mobx";
import {toast} from "react-toastify";
import axios from "axios";

const DEFAULT_PROMPT = 'Enter the confirmation code that we previously sent to your email'

class ConfirmAttributeStore {
    waitingConfirmationCode = false
    confirmationCodePrompt = DEFAULT_PROMPT
    confirmationCode = ''
    loading = false

    constructor(accountStore) {
        makeAutoObservable(this)
        this.accountStore = accountStore
    }

    async sendPhoneConfirmCode() {
        try {
            this.setLoading(true)
            // Create the unconfirmed account
            const sendCodeResponse = await axios.post(`/api/authentication/v1/users/${this.accountStore.user.id}/sendCode?attribute=phone_number`)
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
            await axios.post(`/api/authentication/v1/users/${this.accountStore.user.id}/confirmCode?attribute=phone_number&code=${this.confirmationCode}`)
            this.setConfirmationCodePrompt(DEFAULT_PROMPT)

            // Reload the latest user data
            await this.accountStore.getUser(this.accountStore.user.id)
            this.setWaitingConfirmationCode(false)
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

export default ConfirmAttributeStore;