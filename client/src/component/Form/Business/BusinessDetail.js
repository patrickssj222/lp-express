import React, { Component } from 'react';
import DropDown from '../DropDown/DropDown';
import '../Form.css';
import './BusinessDetail.css';
import Input from "../Input/Input";
import connect from "react-redux/es/connect/connect";
import * as actionTypes from "../../../store/action";
import axios from "axios";
import {MDBDataTable} from "mdbreact";
import findObject from "../../../utility/findObject";


class BusinessDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:null,
            payment:null,
            constants:null,
            new_payment:null,
            service_type:"",
            service_name:"",
            service:null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleServiceTypeChange = this.handleServiceTypeChange.bind(this);
        this.handleServiceChange = this.handleServiceChange.bind(this);
        this.handleGovernmentPaymentMethodChange = this.handleGovernmentPaymentMethodChange.bind(this);
        this.handleMiscPaymentMethodChange = this.handleMiscPaymentMethodChange.bind(this);
        this.handleOtherFeeChange = this.handleOtherFeeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNewPaymentInfoChange = this.handleNewPaymentInfoChange.bind(this);
        this.handleNewPaymentButton = this.handleNewPaymentButton.bind(this);
        this.handleAddPayment = this.handleAddPayment.bind(this);
    }
    componentWillMount() {
        this.props.getBusinessDetail(this.props.payload.id);
    }
    componentWillReceiveProps(nextProps, nextContext) {
        const detail = JSON.parse(JSON.stringify(nextProps.business_detail));
        if(detail){
            const service = findObject(this.props.constants.fee,"name",nextProps.business_detail.service_name)[0];
            delete detail.service_name;
            delete detail.service_type;
            this.setState({
                detail:detail,
                payment:nextProps.business_payment,
                constants:nextProps.constants,
                new_payment:null,
                service_type: nextProps.business_detail.service_type,
                service_name: nextProps.business_detail.service_name,
                service:service
            })
        }
        else{
            this.setState({
                detail:detail,
                payment:nextProps.business_payment,
                constants:nextProps.constants,
                new_payment:null,
            })
        }

    }

    handleServiceTypeChange(e){
        const { name, value } = e.target;
        this.setState((prevState) => {
            return{
                ...prevState,
                [name]:value,
                service_name:""
            }
        });
    }
    handleServiceChange(e){
        const { name, value } = e.target;
        const service = findObject(this.props.constants.fee,"name",value)[0];
        this.setState((prevState) => {
            return{
                ...prevState,
                [name]:value,
                detail:{
                    ...prevState.detail,
                    service_constants_id: service.id,
                    misc_fee_payment_method: "公司邮寄",
                    government_fee_payment_method: "公司信用卡",
                    other_fee:0,
                    service_level:"普通",
                    total_fee:service.service_fee+service.government_fee+service.misc_fee,
                    government_fee:service.government_fee,
                    misc_fee:service.misc_fee,
                },
                service:service,
            }
        });
    }
    handleGovernmentPaymentMethodChange(e){
        const { name, value } = e.target;
        if(value === "公司信用卡"){
            this.setState((prevState) => {
                const parsedValue = prevState.detail.other_fee&&prevState.detail.other_fee!==""?parseFloat(prevState.detail.other_fee):0;
                const total_fee = prevState.service.service_fee+prevState.service.government_fee+prevState.detail.misc_fee+parsedValue;
                return{
                    ...prevState,
                    detail:{
                        ...prevState.detail,
                        [name]:value,
                        total_fee:total_fee,
                        government_fee:prevState.service.government_fee,
                    },
                }
            });
        }
        else{
            this.setState((prevState) => {
                const parsedValue = prevState.detail.other_fee&&prevState.detail.other_fee!==""?parseFloat(prevState.detail.other_fee):0;
                const total_fee = prevState.service.service_fee+prevState.detail.misc_fee+parsedValue;
                return{
                    ...prevState,
                    detail:{
                        ...prevState.detail,
                        [name]:value,
                        total_fee:total_fee,
                        government_fee:0,
                    },
                }
            });
        }
    }
    handleMiscPaymentMethodChange(e){
        const { name, value } = e.target;
        if(value === "公司邮寄"){
            this.setState((prevState) => {
                const parsedValue = prevState.detail.other_fee&&prevState.detail.other_fee!==""?parseFloat(prevState.detail.other_fee):0;
                return{
                    ...prevState,
                    detail:{
                        ...prevState.detail,
                        [name]:value,
                        total_fee:prevState.service.service_fee+prevState.detail.government_fee+prevState.service.misc_fee+parsedValue,
                        misc_fee:prevState.service.misc_fee,
                    },
                }
            });
        }
        else{
            this.setState((prevState) => {
                const parsedValue = prevState.detail.other_fee&&prevState.detail.other_fee!==""?parseFloat(prevState.detail.other_fee):0;
                return{
                    ...prevState,
                    detail:{
                        ...prevState.detail,
                        [name]:value,
                        total_fee:prevState.service.service_fee+prevState.detail.government_fee+parsedValue,
                        misc_fee:0,
                    },
                }
            });
        }
    }
    handleOtherFeeChange(e){
        const { name, value } = e.target;
        const parsedValue = parseFloat(value);
        this.setState((prevState) => {
            return{
                ...prevState,
                detail:{
                    ...prevState.detail,
                    [name]:value,
                    total_fee:prevState.service.service_fee+prevState.detail.government_fee+prevState.detail.misc_fee+(parsedValue?parsedValue:0),
                }
            }
        });
    }
    handleChange(e){
        const { name, value } = e.target;
        this.setState((prevState) => {
            return{
                ...prevState,
                detail:{
                    ...prevState.detail,
                    [name]:value,
                }
            }
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
        console.log("state",this.state);
        if(this.state.detail===null || this.state.constants.fee===null){
            return(<div/>);
        }
        //业务类别
        let service_type_option = [""];
        this.props.constants.fee.forEach((element)=>{
            if(!(service_type_option.includes(element.type))){
                service_type_option.push(element.type);
            }
        });
        //具体业务
        let service_option = [""];
        if(this.state.service_type && this.state.service_type!==""){
            service_option = findObject(this.props.constants.fee,"type",this.state.service_type).map((f)=>{
                return f.name;
            });
            service_option.unshift("");
        }
        let remaining_payment = this.state.detail.total_fee;
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
                                        value={this.state.service_type}
                                        name={"service_type"}
                                        options={service_type_option}
                                        handleChange={this.handleServiceTypeChange}
                                    />
                                </td>
                                <td>
                                    <DropDown
                                        label={"具体业务"}
                                        value={this.state.service_name}
                                        name={"service_name"}
                                        options={
                                            service_option
                                        }
                                        handleChange={this.handleServiceChange}
                                    />
                                </td>
                                <td>
                                    <DropDown
                                        label={"业务等级"}
                                        value={this.state.detail.service_level}
                                        name={"service_level"}
                                        options={
                                            ["普通","特殊"]
                                        }
                                        handleChange={this.handleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Input
                                        label={"签证政府费"}
                                        value={this.state.service?this.state.service.government_fee:""}
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
                                            this.state.detail.service_constants_id?["公司信用卡","客人信用卡"]:[""]
                                        }
                                        handleChange={this.handleGovernmentPaymentMethodChange}
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
                                        label={"邮寄/指模费"}
                                        value={this.state.service?this.state.service.misc_fee:""}
                                        type={"number"}
                                        step={".01"}
                                        handleChange={this.handleChange}
                                        disabled={true}
                                    />
                                </td>
                                <td>
                                    <DropDown
                                        label={"邮寄方式"}
                                        value={this.state.detail.misc_fee_payment_method}
                                        name={"misc_fee_payment_method"}
                                        options={
                                            this.state.detail.service_constants_id?["公司邮寄","客人邮寄"]:[""]
                                        }
                                        handleChange={this.handleMiscPaymentMethodChange}
                                    />
                                </td>
                                <td>
                                    <Input
                                        label={"公司收费"}
                                        value={this.state.detail.misc_fee}
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
                                        value={this.state.service?this.state.service.service_fee:""}
                                        type={"number"}
                                        step={".01"}
                                        handleChange={this.handleChange}
                                        disabled={true}
                                    />
                                </td>
                                <td>
                                    <Input
                                        label={"其他"}
                                        name={"other_fee"}
                                        value={this.state.detail.other_fee}
                                        type={"number"}
                                        step={".01"}
                                        handleChange={this.handleOtherFeeChange}
                                        disabled={this.state.detail.service_level==="普通"}
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
        updateBusiness:(business)=>dispatch({type:actionTypes.SAGA_UPDATE_BUSINESS,business: business}),
        getBusinessDetail:(id)=>dispatch({type:actionTypes.SAGA_GET_BUSINESS_DETAIL,id:id}),
        deletePayment:(id, business_id)=>dispatch({type:actionTypes.SAGA_DELETE_PAYMENT_TRANSACTION,id:id, business_id:business_id}),
        addPayment:(id, payment_info)=>dispatch({type:actionTypes.SAGA_ADD_PAYMENT_TRANSACTION,id:id, payment_info:payment_info}),
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(BusinessDetail);