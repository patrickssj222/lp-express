import React, { Component } from 'react';
import DropDown from '../DropDown/DropDown';
import '../Form.css';
import './CustomerDetail.css';
import Input from "../Input/Input";
import connect from "react-redux/es/connect/connect";
import * as actionTypes from "../../../store/action";
import axios from "axios";
import {MDBDataTable} from "mdbreact";


class AddCustomer extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:{
                name:"",
                phone:"",
                dob:"",
                gender:"",
                email:"",
                citizenship:"",
                identification_number:"",
                uci_number:"",
                passport_due:"",
                passport_number:"",
                visa_due:"",
                visa_type:"",
                first_landing_date:"",
                first_landing_location:"",
                used_name:"",
                emergency_contact:[],
            },
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleContactChange = this.handleContactChange.bind(this);
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
    handleSubmit(e){
        this.props.addCustomer(this.state.detail);
    }
    handleContactChange(e, index){
        const { name, value } = e.target;
        console.log(name, index);
        this.setState((prevState) => {
            let new_contacts = prevState.detail.emergency_contact;
            new_contacts[index][name] = value;
            return ({
                ...prevState,
                detail:{
                    ...prevState.detail,
                    emergency_contact:new_contacts
                }
            })
        });
    }
    handleNewContact(e){
        this.setState((prevState) => ({
            ...prevState,
            detail:{
                ...prevState.detail,
                emergency_contact:[
                    ...prevState.detail.emergency_contact,
                    {
                        name:"",
                        relationship:"",
                        phone:""
                    }
                ]
            }
        }));
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
                                        <Input label={"姓名："}
                                               name={"name"}
                                               value={this.state.detail.name}
                                               type={"text"}
                                               handleChange={this.handleChange}
                                        />
                                    </td>
                                    <td>
                                        <DropDown label={"性别："}
                                               name={"gender"}
                                               value={this.state.detail.gender}
                                               options={["","男","女"]}
                                               handleChange={this.handleChange}
                                        />
                                    </td>
                                    <td>
                                        <Input label={"出生日期："}
                                               name={"dob"}
                                               value={this.state.detail.dob.replace(/\//g, '-')}
                                               type={"date"}
                                               handleChange={this.handleChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Input label={"曾用命："}
                                               name={"used_name"}
                                               value={this.state.detail.used_name}
                                               type={"text"}
                                               handleChange={this.handleChange}
                                        />
                                    </td>
                                    <td>
                                        <Input label={"邮箱："}
                                               name={"email"}
                                               value={this.state.detail.email}
                                               type={"email"}
                                               handleChange={this.handleChange}
                                        />
                                    </td>
                                    <td>
                                        <Input label={"电话："}
                                               name={"phone"}
                                               value={this.state.detail.phone}
                                               type={"tel"}
                                               handleChange={this.handleChange}
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>中国地址</h3>
                    </div>
                    <div className={"section-body"}>
                        <table className={"business-detail-table"}>
                            <thead/>
                            <tbody>
                            <tr>
                                <td>
                                    城市
                                </td>
                                <td>
                                    区域
                                </td>
                                <td>
                                    省份
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>身份与证件</h3>
                    </div>
                    <div className={"section-body"}>
                        <table className={"business-detail-table"}>
                            <thead/>
                            <tbody>
                            <tr>
                                <td>
                                    <Input label={"国籍："}
                                           name={"citizenship"}
                                           value={this.state.detail.citizenship}
                                           type={"text"}
                                           handleChange={this.handleChange}
                                    />
                                </td>
                                <td>
                                    <Input label={"身份证号码："}
                                           name={"identification_number"}
                                           value={this.state.detail.identification_number}
                                           type={"text"}
                                           handleChange={this.handleChange}
                                    />
                                </td>
                                <td>
                                    <Input label={"UCI 号码："}
                                           name={"uci_number"}
                                           value={this.state.detail.uci_number}
                                           type={"text"}
                                           handleChange={this.handleChange}
                                    />
                                </td>
                            </tr>
                            <tr>

                                <td>
                                    <Input label={"护照号码："}
                                           name={"passport_number"}
                                           value={this.state.detail.passport_number}
                                           type={"text"}
                                           handleChange={this.handleChange}
                                    />
                                </td>
                                <td>
                                    <Input label={"护照到期日："}
                                           name={"passport_due"}
                                           value={this.state.detail.passport_due.replace(/\//g, '-')}
                                           type={"date"}
                                           handleChange={this.handleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Input label={"签证类型："}
                                           name={"visa_type"}
                                           value={this.state.detail.visa_type}
                                           type={"text"}
                                           handleChange={this.handleChange}
                                    />
                                </td>
                                <td>
                                    <Input label={"签证到期日："}
                                           name={"visa_due"}
                                           value={this.state.detail.visa_due.replace(/\//g, '-')}
                                           type={"date"}
                                           handleChange={this.handleChange}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>其他信息</h3>
                    </div>
                    <div className={"section-body"}>
                        <table className={"business-detail-table"}>
                            <thead/>
                            <tbody>
                            <tr>
                                <td>
                                    <Input label={"第一次登录时间："}
                                           name={"first_landing_date"}
                                           value={this.state.detail.first_landing_date.replace(/\//g, '-')}
                                           type={"date"}
                                           handleChange={this.handleChange}
                                    />
                                </td>
                                <td>
                                    <Input label={"第一次登陆地点："}
                                           name={"first_landing_location"}
                                           value={this.state.detail.first_landing_location}
                                           type={"text"}
                                           handleChange={this.handleChange}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>紧急联系人信息</h3>
                        <button className={"btn btn-primary"} onClick={this.handleNewContact.bind(this)}>添加联系人</button>
                    </div>
                    <div className={"section-body"}>
                        <table className={"business-detail-table"}>
                            <thead/>
                            <tbody>
                            {
                                this.state.detail.emergency_contact.map((contact, index)=>{
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <Input
                                                    label={"姓名"}
                                                    name={"name"}
                                                    value={this.state.detail.emergency_contact[index].name}
                                                    type={"text"}
                                                    handleChange={(event)=>this.handleContactChange(event,index)}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    label={"关系"}
                                                    name={"relationship"}
                                                    value={this.state.detail.emergency_contact[index].relationship}
                                                    type={"text"}
                                                    handleChange={(event)=>this.handleContactChange(event,index)}
                                                />
                                            </td>
                                            <td>
                                                <Input
                                                    label={"电话"}
                                                    name={"phone"}
                                                    value={this.state.detail.emergency_contact[index].phone}
                                                    type={"tel"}
                                                    handleChange={(event)=>this.handleContactChange(event,index)}
                                                />
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={"footer"}>
                    <div className={"form-confirmation button-group"}>
                        <small>完成值: {Math.round(this.state.total_completion/this.state.max_total*100)}%</small>
                        <button className={"btn btn-primary"} onClick={this.handleSubmit.bind(this)}>添加客户</button>
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
        addCustomer:(customer)=>dispatch({type:actionTypes.SAGA_ADD_CUSTOMERS,customer: customer}),
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(AddCustomer);