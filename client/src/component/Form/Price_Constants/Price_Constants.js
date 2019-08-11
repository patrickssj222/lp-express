import React, { Component } from 'react'
import connect from "react-redux/es/connect/connect";
import * as actionTypes from '../../../store/action';
import { MDBDataTable } from "mdbreact";
import "../Form.css";
import "./Tab.css";
import DropDown from "../DropDown/DropDown";
import {Link, withRouter} from "react-router-dom";
import PriceInput from "./Price_Constants_Add";

class Price_Constants extends Component{
    constructor(props){
        super(props);
        this.state={
            add:false,
            tab: "签证申请"
        }
    }

    componentWillMount() {
        console.log("price constants");
        this.props.getPriceConstants();
    }

    handleDelete(id){
        this.props.deleteEntry(id);
    }

    handleAdd(){
        this.setState({
            add:true,
            new_service:{
                name:"",
                type:"",
                service_fee:"",
                government_fee:"",
                misc_fee:"",
                copywrite_percentage:""
            }
        })
    }

    changeTab = (e) =>{
        this.setState({
            tab: e.target.value
        })
    }

    handleChange = (index, e) => {
        console.log(e);
        console.log("index:",index);
        const { name, value } = e.target;
        const temp = this.props.constants.fee;
        temp[index][name] = value;
        this.props.updatePriceConstants(temp);
    }

    handleSubmit(){
        this.props.submitPriceConstants(this.props.constants.fee);
    }
    render(){
    
        const columns = [
            {
                label: '具体业务',
                field: 'name',
                sort: 'asc',

            },
            {
                label: '业务类别',
                field: 'type',
                sort: 'asc',

            },
            {
                label: '服务费用',
                field: 'service_fee',
                sort: 'asc',
            },
            {
                label: '政府费用',
                field: 'government_fee',
                sort: 'asc',
            },
            {
                label: '邮寄费用/指模费用',
                field: 'misc_fee',
                sort: 'asc',
            },
            {
                label: '文案比例',
                field: 'copywrite_percentage',
                sort: 'asc',
            },
            {
                label: '',
                field: 'delete_button',
                sort: 'asc',
            },
        ];
        let rows = null;
        if(this.props.constants.fee!=null){
            const fee = this.props.constants.fee;
            rows = Object.keys(fee).map((index)=>{       
                return({
                    name: fee[index].name,
                    type:fee[index].type,
                    service_fee: <input className={"mdb-editable"} type={"number"} step={".01"} name={"service_fee"} onChange={this.handleChange.bind(this,index)} value={fee[index].service_fee!=null?fee[index].service_fee:""}/>,
                    government_fee: <input className={"mdb-editable"} type={"number"} step={".01"} name={"government_fee"} onChange={this.handleChange.bind(this,index)} value={fee[index].government_fee!=null?fee[index].government_fee:""}/>,
                    misc_fee: <input className={"mdb-editable"} type={"number"} step={".01"} name={"misc_fee"} onChange={this.handleChange.bind(this,index)} value={fee[index].misc_fee!=null?fee[index].misc_fee:""}/>,
                    copywrite_percentage: 
                    <DropDown
                    options={["10%","20%","30%","40%"]}
                    name={"copywrite_percentage"}
                    value={fee[index].copywrite_percentage!=null?fee[index].copywrite_percentage:" "}
                    handleChange={this.handleChange.bind(this,index)}
                    />,
                    delete_button:<button className={"btn btn-danger"} onClick={this.handleDelete.bind(this, fee[index].id)}>删除</button>
                })
            });
            if(this.state.tabs!=""){
                rows = rows.filter(r => {return r.type===this.state.tab});
            }
        }
        const data = {
            columns:columns,
            rows:rows
        };
        return(
            <div className={"form-wrapper content-wrapper"}>
                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>基础价格常量</h3>
                        <ul class="nav nav-tabs mt-4">
                        <li class="nav-item">
                            <button style={{outline: "none"}} class="nav-link" onClick={this.changeTab} value="签证申请">签证申请</button>
                        </li>
                        <li class="nav-item">
                            <button style={{outline: "none"}} class="nav-link" onClick={this.changeTab} value="学校申请">学校申请</button>
                        </li>
                        <li class="nav-item">
                            <button style={{outline: "none"}} class="nav-link" onClick={this.changeTab} value="换发/公证">换发公证</button>
                        </li>
                        <li class="nav-item">
                            <button style={{outline: "none"}} class="nav-link" onClick={this.changeTab} value="移民申请">移民申请</button>
                        </li>
                        <li class="nav-item">
                            <button style={{outline: "none"}} class="nav-link" onClick={this.changeTab} value="交通告票">交通告票</button>
                        </li>
                        <li class="nav-item">
                            <button style={{outline: "none"}} class="nav-link" onClick={this.changeTab} value="其他">其他</button>
                        </li>
                        </ul>
                        {/* <button className={"nav-item"} >签证申请</button>
                        <button className={"btn btn-primary"} onClick={this.changeTab} value="学校申请">学校申请</button>
                        <button className={"btn btn-primary"} onClick={this.changeTab} value="换发/公证">换发公证</button>
                        <button className={"btn btn-primary"} onClick={this.changeTab} value="移民申请">移民申请</button>
                        <button className={"btn btn-primary"} onClick={this.changeTab} value="交通告票">交通告票</button>
                        <button className={"btn btn-primary"} onClick={this.changeTab} value="其他">其他</button> */}
                    </div>
                    <hr className={"style1"}/>
                    <div className={"section-body"}>
                        <MDBDataTable
                            striped
                            bordered
                            small
                            data={data}
                            entries={10}
                        />
                        <div className={"footer"}>
                            <div className={"form-confirmation button-group"}>
                            <Link to={"/constants/price/add"}>
                                <button className={"btn btn-primary"}>添加常量</button>
                            </Link>                            
                            <button className={"btn btn-primary"} onClick={this.handleSubmit.bind(this)}>确认</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return{
        user:state.user,
        constants: state.constants
    };
};

const mapDispatchToProps = dispatch =>{
    return{
        getPriceConstants: () => dispatch({type:actionTypes.SAGA_GET_PRICE_CONSTANTS}),
        //Delete 
        updatePriceConstants: (constants) => dispatch({type:actionTypes.UPDATE_PRICE_CONSTANTS, constants:constants}),
        submitPriceConstants: (constants) => dispatch({type:actionTypes.SAGA_UPDATE_PRICE_CONSTANTS, constants:constants}),
        popUp: (status, message, action) => dispatch({type:actionTypes.POP_UP, message:message, status:status, action:action}),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Price_Constants);