import {makeAutoObservable} from "mobx";
import {toast} from "react-toastify";

const DEFAULT_PROMPT = 'Enter the confirmation code that we previously sent to your email'

class ConfirmAttributeStore {
    waitingConfirmationCode = false
    confirmationCodePrompt = DEFAULT_PROMPT
    confirmationCode = ''
    loading = false

    constructor(accountStore, apiClient) {
        makeAutoObservable(this)
        this.api = apiClient
        this.accountStore = accountStore
    }

    async sendEmailConfirmCode() {
        try {
            this.setLoading(true)
            // Create the unconfirmed account
            const sendCodeResponse = await this.api.post(`/api/authentication/v1/users/${this.accountStore.user.id}/sendCode?attribute=email`)
            const deliveryDetails = sendCodeResponse.data
            this.setConfirmationCodePrompt(`We have sent an email with a confirmation code to ${deliveryDetails.CodeDeliveryDetails.Destination}. Enter that code to confirm your email`)
            this.setWaitingConfirmationCode(true)
        } catch (e) {
            const message = e.response && e.response.data ? e.response.data : e
            toast.error(`Send confirmation code failed because ${message}`)
        } finally {
            this.setLoading(false)
        }
    }

    async confirmEmail() {
        try {
            this.setLoading(true)
            await this.api.post(`/api/authentication/v1/users/${this.accountStore.user.id}/confirmCode?attribute=email&code=${this.confirmationCode}`)
            this.setConfirmationCodePrompt(DEFAULT_PROMPT)
            this.setConfirmationCode("")

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