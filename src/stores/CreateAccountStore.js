import {makeAutoObservable} from "mobx";
import {toast} from "react-toastify";
import axios from "axios";

const DEFAULT_PROMPT = 'Enter the confirmation code that we previously sent to your email'

class LoginStore {
    email = ''
    password = ''

    waitingConfirmationCode = false
    confirmationCodePrompt = DEFAULT_PROMPT
    confirmationCode = ''

    loading = false

    constructor(routingStore, authStore) {
        makeAutoObservable(this)
        this.routingStore = routingStore
        this.authStore = authStore
    }

    async createAccount() {
        try {
            this.setLoading(true)
            // Create the unconfirmed account
            const registerResponse = await axios.post(
                `/api/authentication/v1/register`,
                {email: this.email, password: this.password}
            )

            this.setConfirmationCodePrompt(`You're account has been created! We have sent a confirmation code to 
                            ${registerResponse.data.codeDeliveryDestination} which you can use to finish setting up 
                            your account.`)
            this.setWaitingConfirmationCode(true)
        } catch (e) {
            const message = e.response && e.response.data ? e.response.data : e
            toast.error(`Create account failed because ${message}`)
        } finally {
            this.setLoading(false)
        }
    }

    cancelConfirm() {
        this.setConfirmationCodePrompt(DEFAULT_PROMPT)
        this.setWaitingConfirmationCode(false)
    }

    async confirmAccount() {
        try {
            this.setLoading(true)
            // Confirm the account using email as the username
            await axios.post(
                `/api/authentication/v1/confirm`,
                {username: this.email, confirmationCode: this.confirmationCode}
            )

            if (this.password) {
                // If user created an account in this same session auto log them in
                await this.authStore.login(this.email, this.password)
                this.routingStore.push('/')
                toast.success("Successfully verified account")
            } else {
                // If the user is confirming there account separately go to login page
                this.routingStore.push('/login')
                toast.success("Successfully verified account. You can now use that email to log in.")
            }

            this.setEmail('')
            this.setPassword('')
            this.setConfirmationCodePrompt(DEFAULT_PROMPT)
            this.setWaitingConfirmationCode(false)
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

    setPassword(password) {
        this.password = password
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

export default LoginStore;