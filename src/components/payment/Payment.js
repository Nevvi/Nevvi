import React, {Component} from 'react';
import {getPaymentToken, createTransaction} from '../../utils/ApiUtils'
import Loading from "../loading/Loading";
import {Button, Col, Form} from "react-bootstrap";

import DropIn from "braintree-web-drop-in-react";
import {inject, observer} from "mobx-react";

class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {loading: undefined, done: undefined, clientToken: null, instance: null, nonce: null, amount: ""}

        this.handleChange = this.handleChange.bind(this);
        this.setupPayment = this.setupPayment.bind(this);
        this.donate = this.donate.bind(this);
    }

    componentDidMount() {
        this.setState({loading: true})
        getPaymentToken()
            .then(res => {
                this.setState({clientToken: res.clientToken, loading: undefined, done: undefined})
            })
            .catch(err => {
                alert(err)
                this.setState({loading: undefined, done: undefined})
            })
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    async setupPayment() {
        const { nonce } = await this.state.instance.requestPaymentMethod();
        this.setState({nonce})
    }

    async donate() {
        const {routingStore} = this.props;
        this.setState({loading: true})
        const transactionResponse = await createTransaction(this.state.nonce, this.state.amount)
        if (transactionResponse.success) {
            alert("Thanks!")
        } else {
            console.log(transactionResponse)
            alert("Something bad happened..")
        }
        this.setState({loading: undefined, done: undefined, amount: "", nonce: undefined})
        routingStore.push("/account")
    }

    render() {
        // Initial page load
        if (!this.state.clientToken) {
            return <Loading
                component={<div/>}
                loading={this.state.loading}
                done={this.state.done}
            />
        }

        // Subsequent page load
        const isDisabled = !this.state.amount
        return (
            <Col md={{ span: 4 }}>
                <div>
                    <DropIn
                        options={{ authorization: this.state.clientToken }}
                        onInstance={(instance) => (this.setState({instance: instance}))}
                    />
                    <Button onClick={this.setupPayment}>Confirm</Button>
                </div>
                {this.state.nonce ? <div>
                    <br/>
                    <Form>
                        <Form.Group controlId="formBasicAmount">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control type="text" placeholder="Amount" name="amount" value={this.state.amount} onChange={this.handleChange}/>
                        </Form.Group>
                        <Loading
                            component={<Button variant="primary" type="submit" disabled={isDisabled} onClick={this.donate}>Donate</Button>}
                            loading={this.state.loading}
                            done={this.state.done}
                        />
                    </Form>
                </div> : <div/>}
            </Col>
        )
    }
}

export default inject('routingStore')(observer(Payment));