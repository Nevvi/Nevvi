import {Button, Col, Table} from "react-bootstrap";
import React, {Component} from 'react';
import {getContests} from "../../utils/ApiUtils";
import Loading from "../loading/Loading";
import history from '../../History';

class DailyFantasySports extends Component {
    constructor(props) {
        super(props);
        this.state = {contests: null, loading: undefined, done: undefined}
    }

    componentDidMount() {
        this.setState({loading: true})
        getContests()
            .then(res => {
                this.setState({contests: res, loading: undefined, done: undefined})
            })
            .catch(err => {
                alert(err)
                this.setState({loading: undefined, done: undefined})
            })
    }

    render() {
        // Initial page load
        if (!this.state.contests) {
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
                            <th>DraftKings Id</th>
                            <th>Title</th>
                            <th>Cost</th>
                            <th>Total Prizes</th>
                            <th>Max Lobby Size</th>
                            <th>Current Lobby Size</th>
                            <th>Start Time</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.contests.map(c => {
                            return <tr key={c.id}>
                                {/*<td><a href={"https://www.draftkings.com/draft/contest/" + c.id}>{c.id}</a></td>*/}
                                <td><Button onClick={() => {history.push("/dfs/" + c.id)}}>{c.id}</Button></td>
                                <td>{c.title}</td>
                                <td>${c.cost}</td>
                                <td>{c.prizes}</td>
                                <td>{c.maxLobbySize}</td>
                                <td>{c.lobbySize}</td>
                                <td>{c.startTime}</td>
                            </tr>
                        })
                    }
                    </tbody>
                </Table>
            </Col>
        )
    }
}

export default DailyFantasySports;