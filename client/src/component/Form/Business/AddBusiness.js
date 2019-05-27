import React, { Component } from 'react';
import DropDown from '../DropDown/DropDown';
import '../Form.css';
import './BusinessDetail.css';
import Input from "../Input/Input";
import connect from "react-redux/es/connect/connect";
import * as actionTypes from "../../../store/action";
import findObject from "../../../utility/findObject";


class addBusiness extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:{
                customer_id: "",
                service_constants_id:null,
                other_fee: 0,
                total_fee: 0,
                misc_fee_payment_method: "",
                government_fee_payment_method: "",
                government_fee:"",
                misc_fee:"",
                progress:"收集材料",
                visa_submit_date:"",
                visa_expire_date:"",
                service_level: "普通",
            },
            service_type:"",
            service_name:"",
            service:null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleServiceTypeChange = this.handleServiceTypeChange.bind(this);
        this.handleServiceChange = this.handleServiceChange.bind(this);
        this.handleGovernmentPaymentMethodChange = this.handleGovernmentPaymentMethodChange.bind(this);
        this.handleMiscPaymentMethodChange = this.handleMiscPaymentMethodChange.bind(this);
        this.handleOtherFeeChange = this.handleOtherFeeChange.bind(this);
    }
    componentWillMount() {
        this.props.getPriceConstants();
    }
    componentWillReceiveProps(nextProps, nextContext) {
        console.log("Triggered", nextProps);
        const customer = findObject(this.props.customer,"id",nextProps.payload.customer_id)[0];
        console.log("found customer",customer);
        this.setState({
            detail:{
                ...this.state.detail,
                customer_id: nextProps.payload.customer_id
            },
            customer:customer
        })
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
                const parsedValue = parseFloat(prevState.detail.other_fee);
                return{
                    ...prevState,
                    detail:{
                        ...prevState.detail,
                        [name]:value,
                        total_fee:prevState.service.service_fee+prevState.service.government_fee+prevState.detail.misc_fee+parsedValue,
                        government_fee:prevState.service.government_fee,
                    },
                }
            });
        }
        else{
            this.setState((prevState) => {
                const parsedValue = parseFloat(prevState.detail.other_fee);
                return{
                    ...prevState,
                    detail:{
                        ...prevState.detail,
                        [name]:value,
                        total_fee:prevState.service.service_fee+prevState.detail.misc_fee+parsedValue,
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
                const parsedValue = parseFloat(prevState.detail.other_fee);
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
                const parsedValue = parseFloat(prevState.detail.other_fee);
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
        console.log("Adding business: ", this.state.detail);
        this.props.addNewBusiness(this.state.detail, this.props.payload.index);
    }
    render(){
        if(this.state.detail===null || this.props.constants.fee===null){
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
            console.log("found constants", findObject(this.props.constants.fee,"type",this.state.service_type));
            service_option = findObject(this.props.constants.fee,"type",this.state.service_type).map((f)=>{
                return f.name;
            });
            service_option.unshift("");
        }
        return(
            <div className={"form-wrapper content-wrapper business-detail"}>
                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>业务信息</h3>
                        <small>客户姓名:{this.state.customer?this.state.customer.name:"加载中..."}</small>
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
                                            ["收集材料","申请递交","签证获批","签证被拒"]
                                        }
                                        handleChange={this.handleChange}
                                    />
                                </td>
                                <td>
                                    <Input
                                        label={"递交日期"}
                                        value={this.state.detail.visa_submit_date}
                                        name={"visa_submit_date"}
                                        type={"date"}
                                        handleChange={this.handleChange}
                                    />
                                </td>
                                <td>
                                    <Input
                                        label={"签证获批至"}
                                        value={this.state.detail.visa_expire_date}
                                        name={"visa_expire_date"}
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
                        <button className={"btn btn-primary"} onClick={this.handleSubmit.bind(this)}>添加业务</button>
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
    };
};

const mapDispatchToProps = dispatch =>{
    return{
        getPriceConstants:()=>dispatch({type:actionTypes.SAGA_GET_PRICE_CONSTANTS}),
        addNewBusiness:(detail,customer_id)=>dispatch({type:actionTypes.SAGA_ADD_BUSINESS, detail:detail, customer_id:customer_id})
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(addBusiness);