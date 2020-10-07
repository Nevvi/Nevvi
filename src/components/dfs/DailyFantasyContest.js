import {Button, Col, Row, Table} from "react-bootstrap";
import React, {Component} from 'react';
import { useParams } from 'react-router';
import Loading from "../loading/Loading";
import history from '../../History';
import {optimizeLineup} from "../../utils/ApiUtils";

class DailyFantasyContest extends Component {
    constructor(props) {
        super(props);
        this.state = {contestId: props.computedMatch.params.contestId, lineup: null, loading: undefined, done: undefined}
    }

    componentDidMount() {
        this.setState({loading: true})
        optimizeLineup(this.state.contestId)
            .then(res => {
                console.log(res)
                this.setState({lineup: res, loading: undefined, done: undefined})
            })
            .catch(err => {
                alert(err)
                this.setState({loading: undefined, done: undefined})
            })
    }

    render() {
        // Initial page load
        if (!this.state.lineup) {
            return <Loading
                component={<div/>}
                loading={this.state.loading}
                done={this.state.done}
            />
        }

        return (
            <Col md={{ span: 8 }}>
                <Table striped bordered hover responsive>
                    <thead>
                    <tr>
                        <th>Position</th>
                        <th>Cost</th>
                        <th>Name</th>
                        <th>Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        Object.entries(this.state.lineup).map(([pos, details]) => {
                            return <tr key={details.id}>
                                <td>{pos.toUpperCase()}</td>
                                <td>${details.cost}</td>
                                <td>{details.firstName} {details.lastName}</td>
                                <td>{details.value}</td>
                            </tr>
                        })
                    }
                    </tbody>
                </Table>
            </Col>
        )
    }
}

export default DailyFantasyContest;