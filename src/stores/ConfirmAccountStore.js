import {makeAutoObservable} from "mobx";
import {toast} from "react-toastify";
import {router} from '../router'

const DEFAULT_PROMPT = 'Enter the confirmation code that we previously sent to your phone number'

class ConfirmAccountStore {
    username = ''
    confirmationCodePrompt = DEFAULT_PROMPT
    confirmationCode = ''
    errors = {}
    callback = null
    loading = false

    constructor(apiClient) {
        makeAutoObservable(this)
        this.api = apiClient
    }

    async confirmAccount() {
        try {
            this.setLoading(true)
            // Confirm the account using username as the username
            await this.api.post(
                `/api/authentication/v1/confirm`,
                {username: this.username, confirmationCode: this.confirmationCode}
            )

            if (this.callback) {
                await this.callback()
                toast.success("Successfully verified account")
            } else {
                router.push('/login')
                toast.success("Successfully verified account. You can now use that username to log in.")
            }

            this.setUsername('')
            this.setConfirmationCodePrompt(DEFAULT_PROMPT)
        } catch (e) {
            const message = e.response && e.response.data ? e.response.data : e
            toast.error(`Failed to confirm account because ${message}`)
        } finally {
            this.setConfirmationCode('')
            this.setLoading(false)
        }
    }

    setUsername(username) {
        this.username = username
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