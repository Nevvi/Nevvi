import React, {Component} from 'react';
import Loading from "../loading/Loading";
import {Col, Form} from "react-bootstrap";
import {Button} from "@mui/material";

import DropIn from "braintree-web-drop-in-react";
import {inject, observer} from "mobx-react";

class Payment extends Component {
    constructor(props) {
        super(props);
        this.donate = this.donate.bind(this);
    }

    componentDidMount() {
        const {paymentStore} = this.props
        paymentStore.getPaymentToken()
    }

    async donate() {
        const {routingStore, paymentStore} = this.props;
        await paymentStore.makePayment()
        routingStore.push("/account")
    }

    render() {
        const {paymentStore} = this.props
        // Initial page load
        if (!paymentStore.clientIdToken) {
            return <Loading component={<div/>} loading={paymentStore.loading}/>
        }

        // Subsequent page load
        const isDisabled = !paymentStore.amount
        return (
            <Col md={{ span: 4 }}>
                <div>
                    <DropIn
                        options={{ authorization: paymentStore.clientIdToken }}
                        onInstance={(instance) => (paymentStore.setInstance(instance))}
                    />
                    <Button onClick={async () => await paymentStore.initializePayment()}>Confirm</Button>
                </div>
                {paymentStore.nonce ? <div>
                    <br/>
                    <Form>
                        <Form.Group controlId="formBasicAmount">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control type="text"
                                          placeholder="Amount"
                                          value={paymentStore.amount}
                                          onChange={(e) => paymentStore.setAmount(e.target.value)}/>
                        </Form.Group>
                        <Loading
                            component={<Button variant="primary" type="submit" disabled={isDisabled} onClick={this.donate}>Donate</Button>}
                            loading={paymentStore.loading}
                        />
                    </Form>
                </div> : <div/>}
            </Col>
        )
    }
}

export default inject('routingStore', 'paymentStore')(observer(Payment));