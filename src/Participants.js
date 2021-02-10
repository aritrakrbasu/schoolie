import React, { Component } from 'react'

export default class Participants extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        console.log(this.props.data);
    }
    render() {
        return (
                <div className="container-fluid py-4" id="lessons">
								<h1 className="big-header d-block">Participants</h1>
                                <table class="table participant-list">
                                {
                                this.props.data && Object.values(this.props.data).map(user=>{
                                    return(
                                        <tr>
                                            <td>
                                                <div>{user.name}</div> 
                                                <div class="participants-tag">{user.role}</div>
                                            </td>
                                        </tr>
                                    )
                                })
                                }
                                </table>
				</div>
        )
    }
}
