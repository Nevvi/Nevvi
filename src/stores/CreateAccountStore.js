import {makeAutoObservable} from "mobx";
import {toast} from "react-toastify";
import axios from "axios";

class LoginStore {
    email = ''
    password = ''

    waitingConfirmationCode = false
    confirmationCodeDestination = ''
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

            this.setConfirmationCodeDestination(registerResponse.data.codeDeliveryDestination)
            this.setWaitingConfirmationCode(true)
        } catch (e) {
            const message = e.response && e.response.data ? e.response.data : e
            toast.error(`Create account failed because ${message}`)
        } finally {
            this.setLoading(false)
        }
    }

    async confirmAccount() {
        try {
            this.setLoading(true)
            // Confirm the account using email as the username
            await axios.post(
                `/api/authentication/v1/confirm`,
                {username: this.email, confirmationCode: this.confirmationCode}
            )

            // Log in to the account
            await this.authStore.login(this.email, this.password)

            this.setEmail('')
            this.setPassword('')
            this.setConfirmationCodeDestination('')
            this.setWaitingConfirmationCode(false)
            this.setLoading(false)

            // Default go back to the home page
            this.routingStore.push('/')
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

    setConfirmationCodeDestination(confirmationCodeDestination) {
        this.confirmationCodeDestination = confirmationCodeDestination
    }

    setConfirmationCode(confirmationCode) {
        this.confirmationCode = confirmationCode
    }

    setLoading(loading) {
        this.loading = loading
    }
}

export default LoginStore;