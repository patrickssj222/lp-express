import React, { Component } from 'react';
import DropDown from '../DropDown/DropDown';
import '../Form.css';
import './BusinessDetail.css';
import Input from "../Input/Input";
import connect from "react-redux/es/connect/connect";
import * as actionTypes from "../../../store/action";
import axios from "axios";
import {MDBDataTable} from "mdbreact";


class addBusiness extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:{
                business_type:"",

            },
            payment:null,
            constants:null,
            new_payment:null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNewPaymentInfoChange = this.handleNewPaymentInfoChange.bind(this);
        this.handleNewPaymentButton = this.handleNewPaymentButton.bind(this);
        this.handleAddPayment = this.handleAddPayment.bind(this);
    }
    componentWillMount() {
        this.props.getPriceConstants();
    }
    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            constants:nextProps.constants,
        })
    }

    handleChange(e){
        const { name, value } = e.target;
        let toChange = null;
        switch(name){
            case "government_fee_payment_method":
                if(value==="公司信用卡"){
                    toChange = {
                        government_fee: this.state.constants.fee[0].government_fee
                    };
                }
                else if(value==="客人信用卡"){
                    toChange = {
                        government_fee: 0
                    };
                }
                else{
                    toChange = {
                        government_fee: ""
                    };
                }
                break;
            case "post_fee_payment_method":
                if(value==="公司邮寄"){
                    toChange = {
                        post_fee: this.state.constants.fee[0].misc_fee
                    };
                }
                else if(value==="客人邮寄"){
                    toChange = {
                        post_fee: 0
                    };
                }
                else{
                    toChange = {
                        post_fee: ""
                    };
                }
                break;
        }

        this.setState((prevState) => {
            let total_value_change = 0;
            if (toChange!=null){
                const toChangeKey = Object.keys(toChange);
                const toChangeValue = Object.values(toChange);
                console.log(toChangeKey, toChangeValue, prevState);
                if(toChangeValue[0]!=="" && prevState.detail[toChangeKey[0]]!==""){
                    total_value_change = prevState.detail[toChangeKey[0]]-toChangeValue[0];
                    console.log(total_value_change);
                }
                else if(toChangeValue[0]!==""){
                    total_value_change = 0 - toChangeValue[0];
                }
                else if(prevState.detail[toChangeKey[0]]!==""){
                    total_value_change = prevState.detail[toChangeKey[0]] - 0;
                }
                else{
                    total_value_change = 0;
                }
            }

            const total_fee = (this.state.detail.government_fee===""?0:this.state.detail.government_fee) +
                (this.state.detail.post_fee===""?0:this.state.detail.post_fee) +
                (this.state.detail.service_fee===""?0:this.state.detail.service_fee) +
                (this.state.detail.misc_fee===""?0:this.state.detail.misc_fee) - total_value_change;
            return (
                {
                    ...prevState,
                    detail:{
                        ...prevState.detail,
                        ...toChange,
                        [name]:value,
                        total_fee: total_fee
                    }
                }
            )
        });
    }
    handleSubmit(e){
        this.props.updateBusiness(this.state.detail);
    }
    handleNewPaymentButton(e){
        this.setState({new_payment:{amount:"", payment_method: "", comment:""}})
    }
    handleNewPaymentInfoChange(e){
        const { name, value } = e.target;
        this.setState({new_payment:{[name]:value}});
    }
    handleAddPayment(e){
        this.props.addPayment(this.state.detail.id, this.state.new_payment);
    }
    render(){
        if(this.state.detail===null || this.state.constants.fee===null){
            return(<div/>);
        }
        let subservice_option = this.state.constants.fee.map((f)=>{
            return f.name;
        });
        subservice_option.unshift("");
        let remaining_payment = this.state.detail.total_fee;
        let payment_section = null;

        const payment_columns = [
            {
                label: '缴费',
                field: 'amount',
                sort: 'asc',

            },
            {
                label: '缴费方式',
                field: 'payment_method',
                sort: 'asc',
            },
            {
                label: '缴费时间',
                field: 'payment_date',
                sort: 'asc',
            },
            {
                label: '备注',
                field: 'comment',
                sort: 'asc',
            },
            {
                label: '',
                field: 'delete',
            }
        ];
        let payment_rows = null;
        if(this.state.payment!=null){
            this.state.payment.forEach((payment)=>{
                remaining_payment = remaining_payment - payment.amount;
            });
            payment_rows = this.state.payment.map((payment, index)=>{
                return({
                    amount: payment.amount,
                    payment_method: payment.payment_method,
                    payment_date: payment.payment_date,
                    comment: payment.comment,
                    delete: <button className={"btn btn-danger"} onClick={this.props.deletePayment.bind(this, payment.id, this.state.detail.id)}>删除</button>
                });
            })
        }
        const new_payment_button = this.state.new_payment==null?<button className={"btn btn-primary"} onClick={this.handleNewPaymentButton.bind(this)}>添加缴款</button>:null;
        let new_payment_section = null;
        if(this.state.new_payment!=null){
            new_payment_section = <table className={"business-detail-table"} >
                <tbody>
                <tr>
                    <td>
                        <Input
                            label={"缴费"}
                            name={"amount"}
                            value={this.state.new_payment.amount}
                            step={".01"}
                            type={"number"}
                            handleChange={this.handleNewPaymentInfoChange}
                        />
                    </td>
                    <td>
                        <Input
                            label={"缴费方式"}
                            name={"payment_method"}
                            value={this.state.new_payment.payment_method}
                            type={"text"}
                            handleChange={this.handleNewPaymentInfoChange}
                        />
                    </td>
                    <td>
                        <Input
                            label={"备注"}
                            name={"comment"}
                            value={this.state.new_payment.comment}
                            type={"text"}
                            handleChange={this.handleNewPaymentInfoChange}
                        />
                    </td>
                    <td>
                        <button className={"btn btn-primary"} onClick={this.handleAddPayment.bind(this)}>确认添加</button>
                    </td>
                </tr>
                </tbody>
            </table>
        }
        return(
            <div className={"form-wrapper content-wrapper business-detail"}>
                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>业务信息</h3>
                        <small>客户姓名:{this.state.detail.customer_name}</small>
                    </div>
                    <div className={"section-body"}>
                        <table className={"business-detail-table"}>
                            <thead/>
                            <tbody>
                            <tr>
                                <td>
                                    <DropDown
                                        label={"签证类别"}
                                        value={this.state.detail.business_type}
                                        name={"business_type"}
                                        options={
                                            ["","签证相关","学校申请","中国文件相关"]
                                        }
                                        handleChange={this.handleChange}
                                    />
                                </td>
                                <td>
                                    <DropDown
                                        label={"具体业务"}
                                        value={this.state.detail.subservice_name}
                                        name={"subservice_name"}
                                        options={
                                            subservice_option
                                        }
                                        handleChange={this.handleChange}
                                    />
                                </td>
                                <td>
                                    <DropDown
                                        label={"业务等级"}
                                        value={this.state.detail.service_level}
                                        name={"service_level"}
                                        options={
                                            ["","普通","特殊"]
                                        }
                                        handleChange={this.handleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Input
                                        label={"签证政府费"}
                                        value={this.state.constants.fee[0].government_fee}
                                        type={"number"}
                                        step={".01"}
                                        handleChange={this.handleChange}
                                        disabled={true}
                                    />
                                </td>
                                <td>
                                    <DropDown
                                        label={"支付方式"}
                                        value={this.state.detail.government_fee_payment_method}
                                        name={"government_fee_payment_method"}
                                        options={
                                            ["","公司信用卡","客人信用卡"]
                                        }
                                        handleChange={this.handleChange}
                                    />
                                </td>
                                <td>
                                    <Input
                                        label={"公司收费"}
                                        name={"government_fee"}
                                        value={this.state.detail.government_fee}
                                        type={"number"}
                                        step={".01"}
                                        handleChange={this.handleChange}
                                        disabled={true}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Input
                                        label={"邮寄费"}
                                        value={this.state.constants.fee[0].misc_fee}
                                        type={"number"}
                                        step={".01"}
                                        handleChange={this.handleChange}
                                        disabled={true}
                                    />
                                </td>
                                <td>
                                    <DropDown
                                        label={"邮寄方式"}
                                        value={this.state.detail.post_fee_payment_method}
                                        name={"post_fee_payment_method"}
                                        options={
                                            ["", "公司邮寄", "客人邮寄"]
                                        }
                                        handleChange={this.handleChange}
                                    />
                                </td>
                                <td>
                                    <Input
                                        label={"公司收费"}
                                        name={"mailing_company_fee"}
                                        value={this.state.detail.post_fee}
                                        type={"number"}
                                        step={".01"}
                                        handleChange={this.handleChange}
                                        disabled={true}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Input
                                        label={"服务费"}
                                        name={"service_fee"}
                                        value={this.state.detail.service_fee}
                                        type={"number"}
                                        step={".01"}
                                        handleChange={this.handleChange}
                                        disabled={true}
                                    />
                                </td>
                                <td>
                                    <Input
                                        label={"其他"}
                                        name={"misc_fee"}
                                        value={this.state.detail.misc_fee}
                                        type={"number"}
                                        step={".01"}
                                        handleChange={this.handleChange}
                                        disabled={true}
                                    />
                                </td>
                                <td>
                                    <Input
                                        label={"收费总计"}
                                        name={"total_fee"}
                                        value={this.state.detail.total_fee}
                                        type={"number"}
                                        step={".01"}
                                        handleChange={this.handleChange}
                                        disabled={true}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>收款操作</h3>
                    </div>
                    <div className={"section-body"}>
                        <MDBDataTable
                            striped
                            bordered
                            small
                            data={{columns: payment_columns, rows: payment_rows}}
                            entries={10}
                            paging={false}
                            responsive={true}
                            searching={false}
                        />
                        {new_payment_section}
                        <div className={"payment-footer"}>
                            <Input
                                label={"余款"}
                                value={remaining_payment}
                                name={"remaining_payment"}
                                type={"number"}
                                step={".01"}
                                handleChange={this.handleChange}
                                disabled={true}
                            />
                            {new_payment_button}
                        </div>
                    </div>
                </div>

                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>文案操作</h3>
                        <small>负责文案:{this.state.detail.wenan}</small>
                    </div>
                    <div className={"section-body"}>
                        <table className={"business-detail-table"}>
                            <thead/>
                            <tbody>
                            <tr>
                                <td>
                                    <DropDown
                                        label={"当前进度"}
                                        value={this.state.detail.progress}
                                        name={"progress"}
                                        options={
                                            ["","收集材料","申请递交","签证获批","签证被拒"]
                                        }
                                        handleChange={this.handleChange}
                                    />
                                </td>
                                <td>
                                    <Input
                                        label={"递交日期"}
                                        value={this.state.detail.submit_time_visa}
                                        name={"submit_time_visa"}
                                        type={"date"}
                                        handleChange={this.handleChange}
                                    />
                                </td>
                                <td>
                                    <Input
                                        label={"签证获批至"}
                                        value={this.state.detail.expire_time_visa}
                                        name={"expire_time_visa"}
                                        type={"date"}
                                        handleChange={this.handleChange}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={"footer"}>
                    <div className={"form-confirmation button-group"}>
                        <small>完成值: {Math.round(this.state.total_completion/this.state.max_total*100)}%</small>
                        <small>目前状态:{this.state.confirmed?"已认证":"未认证"}</small>
                        <button className={"btn btn-primary"} onClick={this.handleSubmit.bind(this)}>业务员认证</button>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return{
        user:state.user,
        customer:state.customer,
        constants:state.constants,
        business_detail:state.business_detail,
        business_payment:state.business_payment,
    };
};

const mapDispatchToProps = dispatch =>{
    return{
        getPriceConstants:()=>dispatch({type:actionTypes.SAGA_GET_PRICE_CONSTANTS}),
        deletePayment:(id, business_id)=>dispatch({type:actionTypes.SAGA_DELETE_PAYMENT_TRANSACTION,id:id, business_id:business_id}),
        addPayment:(id, payment_info)=>dispatch({type:actionTypes.SAGA_ADD_PAYMENT_TRANSACTION,id:id, payment_info:payment_info}),
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(addBusiness);