import React, { Component } from 'react';
import DropDown from '../DropDown/DropDown';
import '../Form.css';
import './PriceConstants.css';
import Input from "../Input/Input";
import connect from "react-redux/es/connect/connect";
import * as actionTypes from "../../../store/action";
import PhoneInput from "../Input/PhoneInput";
import CustomFormatInput from "../Input/CustomFormatInput";
class Price_Constants_Add extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:{
                type:"签证申请",
                name:"",
                service_fee:"",
                government_fee:"",
                misc_fee:"",
                copywrite_percentage:"",
            },
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    handleChange(e){
        const { name, value } = e.target;
        this.setState((prevState) => ({
            ...prevState,
            detail:{
                ...prevState.detail,
                [name]:value,
            }
        }));
    }

    handleSpecialChange(name,value){
        this.setState((prevState) => ({
            ...prevState,
            detail:{
                ...prevState.detail,
                [name]:value,
            }
        }));
    }

    handleSubmit(e){
        this.props.addPriceConstant(this.state.detail);
    }

    render(){

        return(
            <div className={"form-wrapper content-wrapper customer-detail"}>
                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>基础信息</h3>
                    </div>
                    <div className={"section-body"}>
                        <table className={"business-detail-table"}>
                            <thead/>
                            <tbody>
                                <tr>
                            <td>
                                <DropDown label={"服务内容"}
                                    name={"type"}
                                    value={this.state.detail.type}
                                    handleChange={this.handleChange}
                                    options={["签证申请","换发公正","学校申请","移民申请","交通告票"]}
                                    />
                            </td>
                            <td>
                                <Input label={"具体业务"}
                                    name={"name"}
                                    value={this.state.detail.name}
                                    type={"text"}
                                    handleChange={this.handleChange}
                                    />
                            </td>
                            <td>
                                <DropDown label={"文案比例"}
                                    name={"copywrite_percentage"}
                                    value={this.state.detail.copywrite_percentage}
                                    options={["10%","20%","30%","40%"]}
                                    handleChange={this.handleChange}
                                />
                            </td>
                            </tr>
                            <tr>
                            <td>
                                <Input label={"服务费用"}
                                    name={"service_fee"}
                                    value={this.state.detail.service_fee}
                                    type={"text"}
                                    handleChange={this.handleChange}
                                    />
                            </td>
                            <td>
                                <Input label={"政府费用"}
                                    name={"government_fee"}
                                    value={this.state.detail.government_fee}
                                    type={"text"}
                                    handleChange={this.handleChange}
                                    />
                            </td>
                            <td>
                                <Input label={"邮寄费用"}
                                    name={"misc_fee"}
                                    value={this.state.detail.misc_fee}
                                    type={"text"}
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
                        <button className={"btn btn-primary"} onClick={this.handleSubmit.bind(this)}>添加常量</button>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return{
        user:state.user,
        china_geo:state.china_geo,
    };
};

const mapDispatchToProps = dispatch =>{
    return {
        addPriceConstant: (constants)=>dispatch({type:actionTypes.SAGA_ADD_PRICE_CONSTANTS, constants:constants})
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Price_Constants_Add);