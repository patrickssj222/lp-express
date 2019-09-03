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
                government_fee_payment_method: this.props.parentState.detail.government_fee_payment_method,
                government_fee: this.props.parentState.detail.government_fee,
                service_fee:"",
                company_fee:"",
                misc_fee: this.props.parentState.detail.misc_fee,
                progress:"收集材料",
                service_creation_date:moment().format('YYYY-MM-DD'),
                visa_submit_date:"",
                visa_expire_date:"",
                service_level: "普通",
            },
            service: this.props.parentState.service,
            service_type:"",
            service_name:"",
            test_role: "收款员",
            payment_table: [],
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
            })

            this.setState({
                clicked: newClicked
            })

            if (this.ghstable.includes(name)) {
                this.setState({
                    ghslevel: this.state.ghslevel + (1.0 / this.ghstable.length * 100.0)
                })
            } else if (this.skytable.includes(name)) {
                this.setState({
                    skylevel: this.state.skylevel + (1.0 / this.skytable.length * 100.0)
                })
            } else if (this.watable.includes(name)) {
                this.setState({
                    walevel: this.state.walevel + (1.0 / this.watable.length * 100.0)
                })
            }
        }
    }
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
    }
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

    handleSubmit = (e) =>{
        if(this.props.add){
            console.log("Adding business: ", this.state.detail);
            this.props.addNewBusiness(this.state.detail);
        }
    };
    render(){
        return(
            <div>
                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>收款员操作</h3>
                        <small>负责收款:{this.state.detail.shoukuan}</small>
                        <button className={"btn btn-primary float-right"} onClick={this.handlePayment.bind(this)}>添加缴费按键</button>
                    </div>
                    <div className={"section-body"}>
                        <table className={"business-detail-table"}>
                            <thead/>
                            <tbody>
                            <tr>
                                <td>
                                    <Input
                                        label={"缴费金额"}
                                        value={this.state.detail.payment_amount}
                                        name={"payment_amount"}
                                        type={"number"}
                                        handleChange={this.handleChange}
                                    />
                                </td>
                                <td>
                                    <DropDown
                                        label={"缴费方式"}
                                        value={this.state.detail.payment_method}
                                        name={"payment_method"}
                                        options={this.state.detail.service_constants_id?["Cash","Debit"]:[""]}
                                        handleChange={this.handleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {this.state.test_role==="收款员"?(
                                            <Input
                                                label={"选择文案"}
                                                value={this.state.detail.wenan_type}
                                                name={"wenan_type"}
                                                type={"text"}
                                                handleChange={this.handleChange}
                                            />):
                                        (
                                            <Input
                                                label={"选择文案"}
                                                value={"仅收款员可选"}
                                                name={"wenan_type"}
                                                type={"text"}
                                                handleChange={this.handleChange}
                                                disabled={true}
                                            />)}
                                </td>
                                <td>
                                    <Input
                                        label={"收款员"}
                                        value={this.state.detail.shoukuan}
                                        name={"shoukuan"}
                                        type={"text"}
                                        handleChange={this.handleChange}
                                        disabled={true}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table className="table">
                            <tbody>
                            <tr>
                                <th scope="col">缴费金额</th>
                                <th scope="col">缴费方式</th>
                                <th scope="col">缴费日期</th>
                                <th scope="col">收款员</th>
                            </tr>
                            {this.paymentTable2React(this.state.payment_table)}
                            </tbody>
                        </table>
                        <p> 当前业务余额: {this.state.detail.total_payment - this.state.detail.total_fee} </p>
                    </div>
                </div>
                <div className={"footer"}>
                    <div className={"form-confirmation button-group"}>
                        <small>完成值: {this.state.skylevel}%</small>
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