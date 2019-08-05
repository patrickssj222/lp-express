import React, { Component } from 'react';
import DropDown from '../DropDown/DropDown';
import '../Form.css';
import Input from "../Input/Input";
import connect from "react-redux/es/connect/connect";
import Sales from "./Section/Sales";
import Reception from "./Section/Reception";
import Cleric from "./Section/Cleric";

class VisaApplication_2 extends Component{
    constructor(props){
        super(props);
        this.state={
            total_fee:0,
        };
        this.updateOverallState.bind(this);
    }

    updateOverallState(name,value){
        this.setState({[name]: value});
    }

    render(){
        return(
            <div className={"form-wrapper content-wrapper"}>
                <Sales updateOverallState={this.updateOverallState}/>
                <Reception total_fee={this.state.total_fee}/>
                <Cleric/>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return{
        user:state.user,
    };
};
export default connect(mapStateToProps, null)(VisaApplication_2);