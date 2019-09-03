import React, { Component } from 'react';
import DropDown from '../DropDown/DropDown';
import '../Form.css';
import Input from "../Input/Input";
import findObject from "../../../utility/findObject";
import CustomFormatInput from "../Input/CustomFormatInput";
import connect from "react-redux/es/connect/connect";
import update from 'immutability-helper';
import * as actionTypes from "../../../store/action";
import moment from "moment";

class FirstTimeStudentVisa extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:{
                customer_id: this.props.location.customer_id,
                customer_name: this.props.location.customer_name,
                service_constants_id: this.props.parentState.detail.service_constants_id,
                other_fee: this.props.parentState.detail.other_fee,
                total_fee: this.props.parentState.detail.total_fee,
                government_fee_payment_method: "公司信用卡",
                government_fee_total: this.props.parentState.service.government_fee,
                service_fee:this.props.parentState.service.service_fee,
                progress:"收集材料",
                service_creation_date:moment().format('YYYY-MM-DD'),
                visa_submit_date:"",
                visa_expire_date:"",
                service_level: "普通",
                refundable_amount:0,
            },
            service: this.props.parentState.service,
            clicked: {
                service_type: false,
                service_name: false,
                service_level: false,
                wenan_type: false,
                progress:false,
            },
            ghslevel: 75,
        };
        this.ghstable = ["service_type", "service_name", "service_level", "government_fee_payment_method"];
    };

    addC = (name) => {
        if (!this.state.clicked[name]) {
            const newClicked = update(this.state.clicked, {
                [name]: {$set: true}
            });
            this.setState({
                clicked: newClicked
            });
            if (this.ghstable.includes(name)) {
                this.setState({
                    ghslevel: this.state.ghslevel + (1.0 / this.ghstable.length * 100.0)
                })
            }
        }
    };
    handleServiceTypeChange = (e) =>{
        const { name, value } = e.target;
        this.addC(name);
        this.setState((prevState) => {
            return{
                ...prevState,
                [name]:value,
                service_name:""
            }
        });
    }
    handleServiceChange= (e) =>{
        const { name, value } = e.target;
        this.addC(name);
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
                    total_fee:service.service_fee+service.government_fee+service.misc_fee+service.company_fee,
                    government_fee:service.government_fee,
                    misc_fee:service.misc_fee,
                    service_fee:service.service_fee
                },
                service:service,
            }
        });
    }
    handleGovernmentPaymentMethodChange= (e) =>{
        const { name, value } = e.target;
        this.addC(name);
        if(value === "公司信用卡"){
            this.setState((prevState) => {
                return{
                    ...prevState,
                    detail:{
                        ...prevState.detail,
                        [name]:value,
                        government_fee_total:prevState.service.government_fee,
                    },
                }
            });
        }
        else{
            this.setState((prevState) => {
                return{
                    ...prevState,
                    detail:{
                        ...prevState.detail,
                        [name]:value,
                        government_fee_total:0,
                    },
                }
            });
        }
    }
    handleMiscPaymentMethodChange= (e) =>{
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
    handleOtherFeeChange= (e) =>{
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
    handleChange= (e) =>{
        const { name, value } = e.target;
        this.addC(name);
        this.setState((prevState) => {
            return {
                ...prevState,
                detail:{
                    ...prevState.detail,
                    [name]:value,
                }
            }
        });
    };
    handleSpecialChange = (name, value) => {
        this.addC(name);
        this.setState((prevState) => ({
            ...prevState,
            detail:{
                ...prevState.detail,
                [name]: value,
            }
        }));
    }

    handleSubmit = (total_fee) =>{
        if(this.props.add){
            let detail = {
                ...this.state.detail,
                total_fee:total_fee,
                guihuashi:this.props.user.id
            };
            console.log("Adding business: ", detail);
            this.props.addNewBusiness(detail);
        }
    };
    render(){
        let total_fee = (parseFloat(this.state.detail.service_fee)+parseFloat(this.state.detail.other_fee)+parseFloat(this.state.detail.government_fee_total));
        return(
            <div>
                <div className={"section-wrapper"}>
                    <div className={"section-body"}>
                        <table className={"business-detail-table"}>
                            <thead/>
                            <tbody>
                            <tr>
                                <td>
                                    <Input
                                        label={"政府费"}
                                        name={"government_fee"}
                                        value={this.state.service.government_fee}
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
                                        value={this.state.detail.government_fee_total}
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
                                        value={this.state.detail.service_fee}
                                        name={"service_fee"}
                                        type={"number"}
                                        step={".01"}
                                        handleChange={this.handleChange}
                                        disabled={this.props.service_level==="普通"}
                                    />
                                </td>
                                <td>
                                    <Input
                                        label={"其他"}
                                        value={this.state.service?this.state.detail.other_fee:""}
                                        name={"other_fee"}
                                        type={"number"}
                                        step={".01"}
                                        handleChange={this.handleChange}
                                        disabled={true}
                                    />
                                </td>
                                <td>
                                    <Input
                                        label={"收费总计"}
                                        value={total_fee}
                                        name={"total_fee"}
                                        type={"number"}
                                        step={".01"}
                                        handleChange={this.handleChange}
                                        disabled={true}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <CustomFormatInput
                                        label={"签证获批至"}
                                        name={"visa_expire_date"}
                                        value={this.state.detail.visa_expire_date.replace(/\//g, '-')}
                                        format={[
                                            {char: /\d/, repeat:4},
                                            { exactly: "-" },
                                            {char: /\d/, repeat:2},
                                            { exactly: "-" },
                                            {char: /\d/, repeat:2},
                                        ]}
                                        placeholder={"YYYY-MM-DD"}
                                        handleChange={this.handleSpecialChange}
                                    />
                                </td>
                                <td>
                                    <Input
                                        label={"负责规划师"}
                                        name={"guihuashi"}
                                        value={this.props.user.name}
                                        type={"text"}
                                        handleChange={this.handleChange}
                                        disabled={true}
                                    />
                                </td>
                                <td>
                                    <CustomFormatInput
                                        label={"业务建档时间"}
                                        name={"service_creation_date"}
                                        value={this.state.detail.service_creation_date.replace(/\//g, '-')}
                                        format={[
                                            {char: /\d/, repeat:4},
                                            { exactly: "-" },
                                            {char: /\d/, repeat:2},
                                            { exactly: "-" },
                                            {char: /\d/, repeat:2},
                                        ]}
                                        placeholder={"YYYY-MM-DD"}
                                        handleChange={this.handleSpecialChange}
                                        disabled={true}
                                    />
                                </td>
                            </tr>
                            {this.props.service_level==="特殊" &&
                                <tr>
                                    <td>
                                        <Input
                                            label={"可退款金额"}
                                            value={this.refundable_amount}
                                            type={"number"}
                                            step={".01"}
                                            handleChange={this.handleChange}
                                        />
                                    </td>
                                </tr>
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={"footer"}>
                    <div className={"form-confirmation button-group"}>
                        <small>完成值: {this.state.ghslevel}%</small>
                        <button className={"btn btn-primary"} onClick={this.handleSubmit.bind(this,total_fee)}>添加业务</button>
                    </div>
                </div>
            </div>
        )};
}

const mapStateToProps = state => {
    return{
        user: state.user,
    };
};

const mapDispatchToProps = dispatch => {
    return{
        addNewBusiness:(detail,customer_id)=>dispatch({type:actionTypes.SAGA_ADD_BUSINESS, detail:detail, customer_id:customer_id})
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(FirstTimeStudentVisa);