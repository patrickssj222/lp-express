import React, { Component } from 'react';
import NewWindow from 'react-new-window'
import CustomerDetail from './CustomerDetail';


class PrintResult extends Component {
    render () {
        return(
            <NewWindow>
                <p> this is the new pdf </p>
                <p> Name: {this.props.detail.name} </p>
                <p> Used Name: {this.props.detail.used_name} </p>
                <p> Gender: {this.props.detail.gender} </p>
            </NewWindow>
        )
    }
}

export default PrintResult;
