import {makeAutoObservable} from "mobx";
import {toast} from "react-toastify";
import {router} from '../router'

class CreateAccountStore {
    firstName = ''
    lastName = ''
    phoneNumber = ''
    email = ''
    address = ''
    birthday = ''
    loading = false
    submitted = false
    errors = {}

    constructor(loginStore) {
        makeAutoObservable(this)
        this.loginStore = loginStore
    }

    async getInvite(inviteId) {
        this.setLoading(true)
        try {
            // const res = await axios.get(`/api/user/v1/invites/${inviteId}`)
            // const phoneNumber = res.data.phoneNumber
            this.setPhoneNumber("+16129631237")
        } catch (e) {
            toast.error(`Failed to load invite`)
            router.push("/")
        } finally {
            this.setLoading(false)
        }
    }

    validate() {
        const newErrors = {};

        // Required field validation
        if (!this.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!this.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!this.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        }

        // Optional field validation (only if filled)
        if (this.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        return newErrors;
    }

    async submitForm() {
        try {
            this.setLoading(true)
            const validationErrors = this.validate();

            if (Object.keys(validationErrors).length > 0) {
                this.setErrors(validationErrors);
                return;
            }

            this.setSubmitted(true)
            this.loginStore.setUsername(this.phoneNumber)

            toast.success("Success! We've texted you a temporary password to login.", {
                autoClose: 10000,
                hideProgressBar: true,
                pauseOnHover: false
            })

            toast.info("Re-routing to login...", {
                autoClose: 5000,
                pauseOnHover: false,
                onClose: props => {
                    router.push("/login")
                }
            })
        } catch (e) {
            const message = e.response && e.response.data ? e.response.data : e
            toast.error(`Form submit failed because ${message}`)
        } finally {
            this.setLoading(false)
        }
    }

    setFirstName(firstName) {
        this.firstName = firstName
    }

    setLastName(lastName) {
        this.lastName = lastName
    }

    setEmail(email) {
        this.email = email
    }

    setPhoneNumber(phoneNumber) {
        this.phoneNumber = phoneNumber
    }

    setAddress(address) {
        this.address = address
    }

    setBirthday(birthday) {
        this.birthday = birthday
    }

    setLoading(loading) {
        this.loading = loading
    }

    setSubmitted(submitted) {
        this.submitted = submitted
    }

    setErrors(errors) {
        this.errors = errors
    }
}

export default CreateAccountStore;