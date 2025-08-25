import {makeAutoObservable} from "mobx";
import {toast} from "react-toastify";
import {router} from '../router'

const DEFAULT_PROMPT = 'Enter the new password and confirmation code that we sent to your phone number'

class ForgotPasswordStore {
    username = ''
    confirmationCodePrompt = DEFAULT_PROMPT
    confirmationCode = ''
    newPassword = ''
    errors = {}
    loading = false

    constructor(apiClient) {
        makeAutoObservable(this)
        this.api = apiClient
    }

    async sendForgotPasswordCode() {
        try {
            this.setLoading(true)
            await this.api.post(
                `/api/authentication/v1/forgotPassword`,
                {username: this.username}
            )
            this.setConfirmationCodePrompt(DEFAULT_PROMPT)
        } catch (e) {
            const message = e.response && e.response.data ? e.response.data : e
            toast.error(`Failed to send forgot password because ${message}`)
        } finally {
            this.setConfirmationCode('')
            this.setPassword('')
            this.setLoading(false)
        }
    }

    async confirmForgotPasswordCode() {
        try {
            this.setLoading(true)
            await this.api.post(
                `/api/authentication/v1/confirmForgotPassword`,
                {username: this.username, code: this.confirmationCode, password: this.newPassword}
            )

            router.push('/login')
            toast.success("Successfully changed password.")
        } catch (e) {
            const message = e.response && e.response.data ? e.response.data : e
            toast.error(`Failed to send forgot password because ${message}`)
        } finally {
            this.setConfirmationCode('')
            this.setLoading(false)
        }
    }

    setUsername(username) {
        this.username = username
    }

    setPassword(newPassword) {
        this.newPassword = newPassword
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

export default ForgotPasswordStore;