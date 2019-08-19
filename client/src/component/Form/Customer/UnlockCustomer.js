import React, { Component } from 'react';
import DropDown from '../DropDown/DropDown';
import '../Form.css';
import './CustomerDetail.css';
import Input from "../Input/Input";
import connect from "react-redux/es/connect/connect";
import * as actionTypes from "../../../store/action";
import PhoneInput from "../Input/PhoneInput";
import CustomFormatInput from "../Input/CustomFormatInput";
class AddCustomer extends Component{
    constructor(props){
        super(props);
        this.state={
            name:"",
            gender:"",
            dob:"",
            passport_number:"",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSpecialChange = this.handleSpecialChange.bind(this);
    }
    handleChange(e){
        const { name, value } = e.target;
        this.setState((prevState) => ({
            ...prevState,
            [name]:value,
        }));
    }
    handleSpecialChange(name,value){
        this.setState((prevState) => ({
            ...prevState,
            [name]:value,
        }));
    }
    handleSubmit(e){
        this.props.unlockCustomer(this.state, this.props.user);
    }

    render(){
        return(
            <div className={"form-wrapper content-wrapper customer-detail"}>
                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>解锁验证</h3>
                    </div>
                    <div className={"section-body"}>
                        <table className={"business-detail-table"}>
                            <thead/>
                            <tbody>
                            <tr>
                                <td>
                                    <Input label={"姓名："}
                                           name={"name"}
                                           value={this.state.name}
                                           type={"text"}
                                           handleChange={this.handleChange}
                                    />
                                </td>
                                <td>
                                    <DropDown label={"性别："}
                                              name={"gender"}
                                              value={this.state.gender}
                                              options={["","男","女"]}
                                              handleChange={this.handleChange}
                                    />
                                </td>
                                <td>
                                    <CustomFormatInput
                                        label={"出生日期："}
                                        name={"dob"}
                                        value={this.state.dob.replace(/\//g, '-')}
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
                                    <Input label={"护照号码："}
                                           name={"passport_number"}
                                           value={this.state.passport_number}
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
                    <small>以上信息必须和当前数据库内信息完全相同才可解锁对应客户</small>
                </div>
                <div className={"footer"}>
                    <div className={"form-confirmation button-group"}>
                        <button className={"btn btn-primary"} onClick={this.handleSubmit.bind(this)}>解锁客户</button>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return{
        user:state.user,
    };
};

const mapDispatchToProps = dispatch =>{
    return{
        unlockCustomer:(customer, user)=>dispatch({type:actionTypes.SAGA_UNLOCK_CUSTOMERS,customer: customer, user:user}),
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(AddCustomer);