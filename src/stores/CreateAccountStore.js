import {makeAutoObservable} from "mobx";
import {toast} from "react-toastify";
import axios from "axios";

class CreateAccountStore {
    email = ''
    password = ''
    loading = false

    constructor(routingStore, authStore, confirmAccountStore) {
        makeAutoObservable(this)
        this.routingStore = routingStore
        this.authStore = authStore
        this.confirmAccountStore = confirmAccountStore
    }

    async createAccount() {
        try {
            this.setLoading(true)
            // Create the unconfirmed account
            const registerResponse = await axios.post(
                `/api/authentication/v1/register`,
                {email: this.email, password: this.password}
            )

            const {email, password} = this
            this.confirmAccountStore.setEmail(email)
            this.confirmAccountStore.setCallback(async () => {
                await this.authStore.login(email, password)
                this.routingStore.push('/')
            })
            this.confirmAccountStore.setConfirmationCodePrompt(`You're account has been created! We have sent a 
                confirmation code to ${registerResponse.data.codeDeliveryDestination} which you can use to finish 
                setting up your account.`)
            this.routingStore.push('/confirmAccount')

            this.setEmail('')
            this.setPassword('')
        } catch (e) {
            const message = e.response && e.response.data ? e.response.data : e
            toast.error(`Create account failed because ${message}`)
        } finally {
            this.setLoading(false)
        }
    }

    setEmail(email) {
        this.email = email
    }

    setPassword(password) {
        this.password = password
    }

    setLoading(loading) {
        this.loading = loading
    }
}

export default CreateAccountStore;