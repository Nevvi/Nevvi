import {makeAutoObservable} from "mobx";
import {toast} from "react-toastify";
import {router} from '../router'

class LoginStore {
    username = ''
    password = ''
    showPassword = false
    errors = {}
    loading = false

    constructor(authStore, apiClient) {
        makeAutoObservable(this)
        this.authStore = authStore
        this.api = apiClient
    }

    async login() {
        try {
            this.setLoading(true)
            await this.authStore.login(this.username, this.password)

            const user = await this.api.get(`/api/user/v1/users/${this.authStore.userId}`)

            router.push(user.data.onboardingCompleted ? '/' : '/onboarding')
        } catch (e) {
            toast.error(`Login failed because ${e.message}`)
        } finally {
            this.setUsername('')
            this.setPassword('')
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

export default LoginStore;