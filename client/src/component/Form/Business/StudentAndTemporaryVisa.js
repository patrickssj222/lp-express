import React, { Component } from 'react';
import DropDown from '../DropDown/DropDown';
import '../Form.css';
import Input from "../Input/Input";
import findObject from "../../../utility/findObject";
import CustomFormatInput from "../Input/CustomFormatInput";
import connect from "react-redux/es/connect/connect";

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
                misc_fee_payment_method: this.props.parentState.detail.misc_fee_payment_method,
                government_fee_payment_method: this.props.parentState.detail.government_fee_payment_method,
                government_fee: this.props.parentState.detail.government_fee,
                service_fee:"",
                company_fee:"",
                misc_fee: this.props.parentState.detail.misc_fee,
                student_visa_progress:"收集材料",
                temporary_visa_progress:"收集材料",
                service_creation_date:"",
                student_visa_submit_date:"",
                temporary_visa_submit_date:"",
                student_visa_approved_date:"",
                temporary_visa_approved_date:"",
                visa_expire_date:"",
                service_level: "普通",
                wenan:"",
                guihuashi:"",
                shoukuan:"",
                payment_amount: 0,
                payment_method: "Cash",
                wenan_type:"",
                refundable_amount:"",
                total_payment: 0
            },
            service: this.props.parentState.service,
            service_type:"",
            service_name:"",
            test_role: "文案",
            payment_table: []
        }
    };
    handleServiceTypeChange = (e) =>{
        const { name, value } = e.target;
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

    handleSpecialChange = (name, value) => {
        this.setState((prevState) => ({
            ...prevState,
            detail:{
                ...prevState.detail,
                [name]:value,
            }
        }));
    }

    handleSubmit= (e) =>{
        console.log("Adding business: ", this.state.detail);
        this.props.addNewBusiness(this.state.detail);
        this.props.history.push({
            pathname: "/customer/detail",
            state: { index: this.props.location.state.index}
        })
    }

    paymentTable2React = (table) => {
        return table.map((t, index) => {
            return (
                <tr key={index}>
                    <th> {t.payment_amount} </th>
                    <th> {t.payment_method} </th> 
                    <th> {t.date} </th>
                    <th> {t.payment_people} </th>
                </tr>
            )
        })
    }

    handlePayment = () => {
        var date = new Date();
        var new_payment = {
            payment_amount: this.state.detail.payment_amount, 
            payment_method: this.state.detail.payment_method, 
            date: date.toString(),
            payment_people: this.props.user.name}
        this.setState((prevState) => {
            return {
                ...prevState,
                detail: {
                    ...prevState.detail,
                    total_payment: parseFloat(prevState.detail.total_payment) + parseFloat(this.state.detail.payment_amount)
                },
                payment_table: [
                    ...prevState.payment_table,
                    new_payment
                ]
            }
        })
    }

    render(){

        var service_level_input = 
        <Input
            label={"服务费"}
            value={"仅业务员可选"}
            type={"text"}
            handleChange={this.handleChange}
            disabled={true}
            />
        if (this.props.service_level==="普通"){
            service_level_input = 
            <Input
                label={"服务费"}
                value={this.state.service.service_fee}
                type={"number"}
                step={".01"}
                handleChange={this.handleChange}
                disabled={true}
                />
        } else if (this.props.service_level!=="普通" && this.state.test_role ==="业务员"){
            service_level_input =
            <Input
                label={"服务费"}
                value={this.state.service.service_fee}
                type={"number"}
                step={".01"}
                handleChange={this.handleChange}
            /> 
        }

        
        return(
        <div>
            <div className={"section-wrapper"}>
                <div className={"section-header"}>
                    <h3>规划师操作</h3>
                    <small>负责规划师:{this.state.detail.guihuashi}</small>
                </div>
                <div className={"section-body"}>
                    <table className={"business-detail-table"}>
                        <thead/>
                        <tbody>
                        <tr>
                        <td>
                            <Input
                            label={"政府费"}
                            name={"government_fee"}
                            value={this.state.detail.government_fee}
                            type={"number"}
                            step={".01"}
                            handleChange={this.handleChange}
                            disabled={true}
                        />
                        </td>
                            <td>
                            {this.state.test_role ==="规划师"||this.state.test_role === "收款员"?
                                (<DropDown
                                    label={"支付方式"}
                                    value={this.state.detail.government_fee_payment_method}
                                    name={"government_fee_payment_method"}
                                    options={
                                        this.state.detail.service_constants_id?["公司信用卡","客人信用卡"]:[""]
                                    }
                                    handleChange={this.handleGovernmentPaymentMethodChange}
                                />) :
                                (<DropDown
                                    label={"支付方式"}
                                    value={"仅规划师/收款员可选"}
                                    name={"government_fee_payment_method"}   
                                    options={
                                        ["仅规划师/收款员可选"]
                                    }
                                    handleChange={this.handleGovernmentPaymentMethodChange}                        
                                    disabled={true}
                                />)
                            }     
                            </td>
                            <td>
                                <Input
                                    label={"公司收费"}
                                    name={"company_fee"}
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
                                name={"misc_fee"}
                                value={this.state.detail.misc_fee}
                                type={"number"}
                                step={".01"}
                                handleChange={this.handleChange}
                                disabled={true}
                            />
                            </td>
                            <td>
                                {this.state.test_role  ==="规划师"||this.state.test_role  ==="收款员"?
                                (<DropDown
                                    label={"邮寄方式"}
                                    value={this.state.detail.mailing_method}
                                    name={"mailing_method"}
                                    options={
                                        this.state.detail.service_constants_id?["公司支付","客人支付"]:[""]
                                    }
                                    handleChange={this.handleChange}
                                />) :
                                (<DropDown
                                    label={"邮寄方式"}
                                    value={"仅规划师/收款员可选"}
                                    name={"mailing_method"}   
                                    options={
                                        ["仅规划师/收款员可选"]
                                    }
                                    handleChange={this.handleChange}                        
                                    disabled={true}
                                />)
                            }    
                            </td>
                            <td>
                                <Input
                                    label={"公司收费"}
                                    name={"misc_fee"}
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
                            {service_level_input}
                            </td>
                            <td>
                                <Input
                                    label={"其他"}
                                    value={this.state.service?this.state.detail.other_fee:""}
                                    type={"number"}
                                    step={".01"}
                                    handleChange={this.handleChange}
                                    disabled={true}
                                />
                            </td>
                            <td>
                                <Input
                                    label={"收费总计"}
                                    value={this.state.service? this.state.detail.total_fee: ""}
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
                                label={"负责规划师"}
                                name={"guihuashi"}
                                value={this.state.detail.guihuashi}
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
                            {this.state.test_role !== "业务员"?
                            (<Input
                                label={"可退款金额"}
                                value={"仅业务员可选"}
                                type={"text"}
                                step={".01"}
                                handleChange={this.handleChange}
                                disabled={true}
                            />):(
                                <Input
                                label={"可退款金额"}
                                value={this.refundable_amount}
                                type={"number"}
                                step={".01"}
                                handleChange={this.handleChange}
                            />
                            )}
                            </td>
                            </tr> 
                        }
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
                                    type={"text"}
                                    handleChange={this.handleChange}
                                />
                            </td>
                            <td>
                                <DropDown
                                    label={"缴费方式"}
                                    value={this.state.detail.payment_method}
                                    name={"payment_method"}
                                    options={this.state.detail.service_constants_id?["cash", "debit"]:[""]}
                                    handleChange={this.handleChange}
                                />
                            </td>
                        </tr>
                        <tr>
                        <td>
                        {this.state.test_role ==="收款员"?(
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
                            <tr>
                        <td>
                        {this.state.test_role ==="收款员"?(
                            <CustomFormatInput
                            label={"护照寄出时间"}
                            value={this.state.detail.passport_mailed_date}
                            name={"passport_mailed_date"}
                            format={[
                                {char: /\d/, repeat:4},
                                { exactly: "-" },
                                {char: /\d/, repeat:2},
                                { exactly: "-" },
                                {char: /\d/, repeat:2},
                            ]}
                            placeholder={"YYYY-MM-DD"}
                            handleChange={this.handleSpecialChange}
                        />):
                            (
                            <Input
                                label={"护照寄出时间"}
                                value={"仅收款员可选"}
                                name={"passport_mailed_date"}
                                type={"text"}
                                handleChange={this.handleChange}
                                disabled={true}
                            />)}
                        </td>
                        <td>
                        {this.state.test_role ==="收款员"?(
                            <CustomFormatInput
                            label={"护照收到时间"}
                            value={this.state.detail.passport_received_date}
                            name={"passport_received_date"}
                            format={[
                                {char: /\d/, repeat:4},
                                { exactly: "-" },
                                {char: /\d/, repeat:2},
                                { exactly: "-" },
                                {char: /\d/, repeat:2},
                            ]}
                            placeholder={"YYYY-MM-DD"}
                            handleChange={this.handleSpecialChange}
                        />):
                            (
                            <Input
                                label={"护照收到时间"}
                                value={"仅收款员可选"}
                                name={"passport_received_date"}
                                type={"text"}
                                handleChange={this.handleChange}
                                disabled={true}
                            />)}
                        </td>
                        <td>
                        {this.state.test_role ==="收款员"?(
                            <DropDown
                            label={"护照状态"}
                            value={this.state.detail.passport_status}
                            name={"passport_status"}
                            options={
                                ["收集材料","申请递交","护照获批","护照被拒"]
                            }
                            handleChange={this.handleChange}
                        />):
                            (
                            <DropDown
                                label={"护照状态"}
                                value={this.state.detail.passport_status}
                                name={"passport_status"}
                                options={
                                    ["仅收款员可选"]
                                }
                                handleChange={this.handleChange}
                                disabled={true}
                            />)}
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
                        <small>完成值: {Math.round(this.state.total_completion/this.state.max_total*100)}%</small>
                        <small>目前状态:{this.state.confirmed?"已认证":"未认证"}</small>
                        <button className={"btn btn-primary"} onClick={this.handleSubmit.bind(this)}>添加业务</button>
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
                            {this.state.test_role ==="文案"?(
                                <DropDown
                                    label={"学签/签证进度"}
                                    value={this.state.detail.student_visa_progress}
                                    name={"student_visa_progress"}
                                    options={
                                        ["收集材料","申请递交","签证获批","签证被拒"]
                                    }
                                    handleChange={this.handleChange}
                                />):(
                                    <DropDown
                                    label={"学签/签证进度"}
                                    value={this.state.detail.student_visa_progress}
                                    name={"student_visa_progress"}
                                    options={
                                        ["仅文案可选"]
                                    }
                                    handleChange={this.handleChange}
                                    disabled={true}
                                />)}
                            </td>
                            <td>
                            {this.state.test_role ==="文案"?(
                                <DropDown
                                    label={"小签/签证进度"}
                                    value={this.state.detail.temporary_visa_progress}
                                    name={"temporary_visa_progress"}
                                    options={
                                        ["收集材料","申请递交","签证获批","签证被拒"]
                                    }
                                    handleChange={this.handleChange}
                                />):(
                                    <DropDown
                                    label={"小签/签证进度"}
                                    value={this.state.detail.temporary_visa_progress}
                                    name={"temporary_visa_progress"}
                                    options={
                                        ["仅文案可选"]
                                    }
                                    handleChange={this.handleChange}
                                    disabled={true}
                                />)}
                            </td>
                            </tr><tr>
                            <td>
                            {this.state.test_role !=="文案"?(
                            <Input
                                label={"递交日期"}
                                name={"student_visa_submit_date"}
                                value={"仅文案可选"}
                                type={"text"}
                                handleChange={this.handleChange}
                                disabled={true} /> 
                                ) : (
                                <CustomFormatInput
                                label={"递交日期"}
                                name={"student_visa_submit_date"}
                                value={this.state.detail.student_visa_submit_date.replace(/\//g, '-')}
                                format={[
                                    {char: /\d/, repeat:4},
                                    { exactly: "-" },
                                    {char: /\d/, repeat:2},
                                    { exactly: "-" },
                                    {char: /\d/, repeat:2},
                                ]}
                                placeholder={"YYYY-MM-DD"}
                                handleChange={this.handleSpecialChange}
                                disabled={this.state.detail.student_visa_progress !== "申请递交" && this.state.detail.student_visa_progress !== "签证获批"}
                            />
                            )}
                            </td>
                            <td>
                            {this.state.test_role !=="文案"?(
                            <Input
                                label={"递交日期"}
                                name={"temporary_visa_submit_date"}
                                value={"仅文案可选"}
                                type={"text"}
                                handleChange={this.handleChange}
                                disabled={true}
                            />):(
                                <CustomFormatInput
                                label={"递交日期"}
                                name={"temporary_visa_submit_date"}
                                value={this.state.detail.temporary_visa_submit_date.replace(/\//g, '-')}
                                format={[
                                    {char: /\d/, repeat:4},
                                    { exactly: "-" },
                                    {char: /\d/, repeat:2},
                                    { exactly: "-" },
                                    {char: /\d/, repeat:2},
                                ]}
                                placeholder={"YYYY-MM-DD"}
                                handleChange={this.handleSpecialChange}
                                disabled={this.state.detail.temporary_visa_progress !== "申请递交" && this.state.detail.temporary_visa_progress !== "签证获批"}
                            />
                            )}
                            </td>
                        </tr>
                        <tr>
                            <td>
                            {this.state.test_role !=="文案"?(
                            <Input
                                label={"获批日期"}
                                name={"student_visa_approved_date"}
                                value={"仅文案可选"}
                                type={"text"}
                                handleChange={this.handleChange}
                                disabled={true}
                            />):(
                                <CustomFormatInput
                                label={"获批日期"}
                                name={"student_visa_approved_date"}
                                value={this.state.detail.student_visa_approved_date.replace(/\//g, '-')}
                                format={[
                                    {char: /\d/, repeat:4},
                                    { exactly: "-" },
                                    {char: /\d/, repeat:2},
                                    { exactly: "-" },
                                    {char: /\d/, repeat:2},
                                ]}
                                placeholder={"YYYY-MM-DD"}
                                handleChange={this.handleSpecialChange}
                                disabled={this.state.detail.student_visa_progress !== "签证获批"}
                            />
                            )}
                            </td>
                            <td>
                            {this.state.test_role !=="文案"?(
                            <Input
                                label={"获批日期"}
                                name={"temporary_visa_approved_date"}
                                value={"仅文案可选"}
                                type={"text"}
                                handleChange={this.handleChange}
                                disabled={true}
                            />):(
                                <CustomFormatInput
                                label={"获批日期"}
                                name={"temporary_visa_approved_date"}
                                value={this.state.detail.temporary_visa_approved_date.replace(/\//g, '-')}
                                format={[
                                    {char: /\d/, repeat:4},
                                    { exactly: "-" },
                                    {char: /\d/, repeat:2},
                                    { exactly: "-" },
                                    {char: /\d/, repeat:2},
                                ]}
                                placeholder={"YYYY-MM-DD"}
                                handleChange={this.handleSpecialChange}
                                disabled={this.state.detail.temporary_visa_progress !== "签证获批"}
                            />
                            )}
                            </td>
                        </tr>
                        <tr>
                        <td>
                        {this.state.test_role ==="文案"?(
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
                            />):
                            (<Input
                                label={"签证获批至"}
                                name={"visa_expire_date"}
                                value={"仅文案可选"}
                                type={"text"}
                                handleChange={this.handleChange}
                                disabled={true}
                            />)}
                        </td>
                        <td>
                            <Input
                                label={"负责文案"}
                                value={this.state.detail.wenan}
                                name={"wenan"}
                                type={"text"}
                                handleChange={this.handleChange}
                                disabled={true}
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
    )};
}

const mapStateToProps = state => {
    return{
        user: state.user,
    };
};
export default connect(mapStateToProps)(FirstTimeStudentVisa);