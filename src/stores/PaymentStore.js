import {makeAutoObservable} from "mobx";
import axios from "axios";
import {toast} from "react-toastify";

class PaymentStore {
    loading = false
    clientIdToken = null
    amount = ''
    nonce = null
    instance = null

    constructor() {
        makeAutoObservable(this)
    }

    async initializePayment() {
        const { nonce } = await this.instance.requestPaymentMethod();
        this.setNonce(nonce)
    }

    async getPaymentToken() {
        try {
            this.setLoading(true)
            const res = await axios.post(`/api/payment/v1/token`, {})
            this.setClientIdToken(res.data.clientToken)
        } catch (e) {
            toast.error(`Failed to initialize payment because ${e.response.data}`)
        } finally {
           this.setLoading(false)
        }
    }

    async makePayment() {
        try {
            this.setLoading(true)
            await axios.post(`/api/payment/v1/transaction`, {sessionId: this.nonce, amount: this.amount})
            toast.success("Payment successful")
        } catch (e) {
            toast.error(`Failed to make payment because ${e.response.data}`)
        } finally {
            this.setAmount('')
            this.setNonce(null)
            this.setLoading(false)
        }
    }

    setLoading(loading) {
        this.loading = loading
    }

    setClientIdToken(clientIdToken) {
        this.clientIdToken = clientIdToken
    }

    setAmount(amount) {
        this.amount = amount
    }

    setNonce(nonce) {
        this.nonce = nonce
    }

    setInstance(instance) {
        this.instance = instance
    }

}

export default PaymentStore