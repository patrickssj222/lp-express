import React, { Component } from 'react';
import ReactToPrint from 'react-to-print';
import * as actionTypes from "../../../store/action";
import connect from "react-redux/es/connect/connect";
import { withRouter } from 'react-router-dom';
import "./PrintCustomerDetail.css";

class PrintCustomerDetail extends Component{
    constructor(props){
        super(props);
        this.state={
        }
    }
    componentWillMount() {
        try{
            this.setState(this.props.location.state);
        }
        catch{
            this.props.history.push("/customer");
        }
    }
    render() {
        const info = this.state.detail;
        console.log("PRINT PROP",info);
        return(
            <div className={"preview"}>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return{
    };
};

const mapDispatchToProps = dispatch =>{
    return{
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(PrintCustomerDetail);
