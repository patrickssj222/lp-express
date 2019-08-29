import React, { Component } from 'react';
import DropDown from '../DropDown/DropDown';
import '../Form.css';
import './BusinessDetail.css';
import Input from "../Input/Input";
import connect from "react-redux/es/connect/connect";
import * as actionTypes from "../../../store/action";
import findObject from "../../../utility/findObject";
import { withRouter } from 'react-router-dom';
import FirstTimeStudentVisa from './FirstTimeStudentVisa';
import PassportRenewal from './PassportRenewal';
import TemporaryVisaRenewal from './TemporaryVisaRenewal';
import StudentVisaRenewal from './StudentVisaRenewal';
import StudentAndTemporaryVisa from './StudentAndTemporaryVisa';
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
            service_level:"",
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
        console.log("add business props", this.props);
        console.log("add business location", this.props.location.state);
        try{
            this.setState({
                detail:{
                    ...this.state.detail,
                    customer_id: this.props.location.state.customer_id,
                    customer_name:this.props.location.state.customer_name
                },
            })
        }
        catch{
            this.props.history.push("/customer");
        }
        if(!this.props.constants.fee){
            this.props.getPriceConstants();
        }
    }

    updateStateHandler = (detail) => {
        this.setState({
            detail: detail
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
        this.props.addNewBusiness(this.state.detail);
        this.props.history.push({
            pathname: "/customer/detail",
            state: { index: this.props.location.state.index}
        })
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
        var form = null;
            if(this.state.service_name ==="首次学签"){
                form = <FirstTimeStudentVisa parentState={this.state} service_level={this.state.detail.service_level || "普通"} location={this.props.location.state} updateState={this.updateStateHandler}></FirstTimeStudentVisa>
            }else if (this.state.service_name ==="小签续签"){
                form = <TemporaryVisaRenewal parentState={this.state} service_level={this.state.detail.service_level || "普通"} location={this.props.location.state} updateState={this.updateStateHandler}></TemporaryVisaRenewal>
            }else if (this.state.service_name ==="学签续签"){
                form = <StudentVisaRenewal parentState={this.state} service_level={this.state.detail.service_level || "普通"} location={this.props.location.state} updateState={this.updateStateHandler}></StudentVisaRenewal>
            }
            else if (this.state.service_name ==="学签和小签"){
                form = <StudentAndTemporaryVisa parentState={this.state} service_level={this.state.detail.service_level || "普通"} location={this.props.location.state} updateState={this.updateStateHandler}></StudentAndTemporaryVisa>
            }
            else if (this.state.service_name ==="护照换发"){
                form = <PassportRenewal parentState={this.state} service_level={this.state.detail.service_level || "普通"} location={this.props.location.state} updateState={this.updateStateHandler}></PassportRenewal>
            }
        return(
            <div className={"form-wrapper content-wrapper business-detail"}>
                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>业务信息</h3>
                        <small>客户姓名:{this.props.location.state.customer_name}</small>
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
                                        options={service_option}
                                        handleChange={this.handleServiceChange}
                                    />
                                </td>
                                <td>
                                    <DropDown
                                        label={"业务等级"}
                                        value={this.state.detail.service_level}
                                        name={"service_level"}
                                        options={["普通","特殊"]}
                                        handleChange={this.handleChange}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {form}</div>
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