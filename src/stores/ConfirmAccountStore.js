import {makeAutoObservable} from "mobx";
import {toast} from "react-toastify";
import axios from "axios";
import {router} from '../router'

const DEFAULT_PROMPT = 'Enter the confirmation code that we previously sent to your email'

class ConfirmAccountStore {
    email = ''
    confirmationCodePrompt = DEFAULT_PROMPT
    confirmationCode = ''
    callback = null
    loading = false

    constructor() {
        makeAutoObservable(this)
    }

    async confirmAccount() {
        try {
            this.setLoading(true)
            // Confirm the account using email as the username
            await axios.post(
                `/api/authentication/v1/confirm`,
                {username: this.email, confirmationCode: this.confirmationCode}
            )

            if (this.callback) {
                await this.callback()
                toast.success("Successfully verified account")
            } else {
                router.push('/login')
                toast.success("Successfully verified account. You can now use that email to log in.")
            }

            this.setEmail('')
            this.setConfirmationCodePrompt(DEFAULT_PROMPT)
            this.setLoading(false)
        } catch (e) {
            const message = e.response && e.response.data ? e.response.data : e
            toast.error(`Failed to confirm account because ${message}`)
        } finally {
            this.setConfirmationCode('')
        }
    }

    setEmail(email) {
        this.email = email
    }

    setConfirmationCodePrompt(confirmationCodePrompt) {
        this.confirmationCodePrompt = confirmationCodePrompt
    }

    setCallback(callback) {
        this.callback = callback
    }

    setConfirmationCode(confirmationCode) {
        this.confirmationCode = confirmationCode
    }

    setLoading(loading) {
        this.loading = loading
    }
}

export default ConfirmAccountStore;