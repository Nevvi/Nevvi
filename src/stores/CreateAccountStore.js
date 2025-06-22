import {makeAutoObservable} from "mobx";
import {toast} from "react-toastify";
import axios from "axios";
import {router} from '../router'

class CreateAccountStore {
    username = ''
    password = ''
    showPassword = false
    errors = {}
    loading = false

    constructor(authStore, confirmAccountStore) {
        makeAutoObservable(this)
        this.authStore = authStore
        this.confirmAccountStore = confirmAccountStore
    }

    async createAccount() {
        try {
            this.setLoading(true)
            // Create the unconfirmed account
            const registerResponse = await axios.post(
                `/api/authentication/v1/register`,
                {username: this.username, password: this.password}
            )

            const {username, password} = this
            this.confirmAccountStore.setUsername(username)
            this.confirmAccountStore.setCallback(async () => {
                await this.authStore.login(username, password)
                router.push('/')
            })
            this.confirmAccountStore.setConfirmationCodePrompt(`You're account has been created! We have sent a 
                confirmation code to ${registerResponse.data.codeDeliveryDestination} which you can use to finish 
                setting up your account.`)
            router.push('/confirmAccount')

            this.setUsername('')
            this.setPassword('')
        } catch (e) {
            const message = e.response && e.response.data ? e.response.data : e
            toast.error(`Create account failed because ${message}`)
        } finally {
            this.setLoading(false)
        }
    }

    setUsername(username) {
        this.username = username
    }

    setPassword(password) {
        this.password = password
    }

    toggleShowPassword() {
        this.showPassword = !this.showPassword
    }

    setLoading(loading) {
        this.loading = loading
    }
}

export default CreateAccountStore;