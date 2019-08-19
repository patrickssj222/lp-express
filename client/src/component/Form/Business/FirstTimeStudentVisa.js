import React, { Component } from 'react';
import DropDown from '../DropDown/DropDown';
import '../Form.css';
import Input from "../Input/Input";
class FirstTimeStudentVisa extends Component{
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
        }
    };
    render(){
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
                    <button className={"btn btn-primary"} onClick={() => this.props.updateState(this.state.detail)}>添加业务</button>
                </div>
            </div>
        </div>
    )};
}
export default FirstTimeStudentVisa;