import {makeAutoObservable} from "mobx";
import {toast} from "react-toastify";
import {router} from '../router'
import {getUser} from "../components/utils/httpUtils";

class LoginStore {
    username = ''
    password = ''
    showPassword = false
    errors = {}
    loading = false

    constructor(authStore) {
        makeAutoObservable(this)
        this.authStore = authStore
    }

    async login() {
        try {
            this.setLoading(true)
            await this.authStore.login(this.username, this.password)

            const user = await getUser(this.authStore.userId)

            router.push(user.onboardingCompleted ? '/' : '/onboarding')
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