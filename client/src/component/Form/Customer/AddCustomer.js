import React, { Component } from 'react';
import DropDown from '../DropDown/DropDown';
import '../Form.css';
import './CustomerDetail.css';
import Input from "../Input/Input";
import connect from "react-redux/es/connect/connect";
import * as actionTypes from "../../../store/action";
import axios from "axios";
import {MDBDataTable} from "mdbreact";
import PhoneInput from "../Input/PhoneInput";
import CustomFormatInput from "../Input/CustomFormatInput";
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
                visa_type:"无身份信息",
                first_landing_date:"",
                first_landing_location:"",
                used_name:"无",
                emergency_contact:[],
                city_id:"",
            },
            china_geo:{
                city:"",
                province:"",
                region:""
            },
            birth_geo:{
                city:"",
                province:"",
                region:""
            }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.handleBirthCityChange = this.handleBirthCityChange.bind(this);
        this.handleContactChange = this.handleContactChange.bind(this);
        this.handleSpecialChange = this.handleSpecialChange.bind(this);
    }
    componentWillMount() {
        if(this.props.china_geo==null){
            this.props.getChinaGeo();
        }
        if(this.props.user){
            this.setState((prevState) => ({
                ...prevState,
                detail:{
                    ...prevState.detail,
                    created_by:this.props.user.id
                }
            }));
        }
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
    findNested (obj, key, value){
        // Base case
        if (obj[key] === value) {
            console.log("FOUND VALUE", value);
            return obj;
        } else {
            for (let i = 0, len = Object.keys(obj).length; i < len; i++) {
                const next_obj = obj[Object.keys(obj)[i]];
                if (typeof next_obj == 'object') {
                    let found = this.findNested(next_obj, key, value);
                    if (found) {
                        // If the object was found in the recursive call, bubble it up.
                        return found;
                    }
                }
            }
        }
    };

    handleCityChange(e){
        const { name, value } = e.target;
        const city_info = this.findNested(this.props.china_geo,"name",value);
        this.setState((prevState) => ({
            ...prevState,
            detail:{
                ...prevState.detail,
                city_id: city_info?city_info.id:""
            },
            china_geo:{
                ...prevState.china_geo,
                [name]:value,
            }
        }));
    }
    handleBirthCityChange(e){
        const { name, value } = e.target;
        const city_info = this.findNested(this.props.china_geo,"name",value);
        this.setState((prevState) => ({
            ...prevState,
            detail:{
                ...prevState.detail,
                birth_city_id: city_info?city_info.id:""
            },
            birth_geo:{
                ...prevState.birth_geo,
                [name]:value,
            }
        }));
    }
    handleSubmit(e){
        this.props.addCustomer(this.state.detail);
    }
    handleContactChange(index, e){
        const { name, value } = e.target;
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
        let region_value = "";
        let province_value = "";
        let birth_region_value = "";
        let birth_province_value = "";
        if(this.props.china_geo!=null && this.state.china_geo.city!==""){
            const city_info = this.findNested(this.props.china_geo,"name",this.state.china_geo.city);
            if(city_info){
                const region_info = this.props.china_geo[city_info.region_id];
                region_value = region_info?region_info.name:"";
                if(region_info){
                    const province_info = region_info.province[city_info.province_id];
                    province_value = province_info?province_info.name:"";
                }
            }
        }
        else if(this.props.china_geo!=null && this.state.birth_geo.city!==""){
            const birth_city_info = this.findNested(this.props.china_geo,"name",this.state.birth_geo.city);
            if(birth_city_info){
                const birth_region_info = this.props.china_geo[birth_city_info.region_id];
                birth_region_value = birth_region_info?birth_region_info.name:"";
                if(birth_region_info){
                    const birth_province_info = birth_region_info.province[birth_city_info.province_id];
                    birth_province_value = birth_province_info?birth_province_info.name:"";
                }
            }
        }
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
                                        <CustomFormatInput
                                            label={"出生日期："}
                                            name={"dob"}
                                            value={this.state.detail.dob.replace(/\//g, '-')}
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
                                </tr>
                                <tr>
                                    <td>
                                        <Input label={"曾用名："}
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
                                        <PhoneInput label={"电话："}
                                               name={"phone"}
                                               value={this.state.detail.phone}
                                               handleChange={this.handleChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Input label={"国籍："}
                                               name={"citizenship"}
                                               value={this.state.detail.citizenship}
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
                        <h3>详细地址</h3>
                    </div>
                    <div className={"section-body"}>
                        <table className={"business-detail-table"}>
                            <thead/>
                            <tbody>
                            <tr>
                                <td>
                                    <Input label={"中国城市："}
                                           name={"city"}
                                           value={this.state.china_geo.city}
                                           type={"text"}
                                           handleChange={this.handleCityChange}
                                    />
                                </td>
                                <td>
                                    <Input label={"中国省份："}
                                           value={province_value}
                                           type={"text"}
                                           disabled={true}
                                           handleChange={this.handleCityChange}
                                    />
                                </td>

                                <td>
                                    <Input label={"中国区域："}
                                           value={region_value}
                                           type={"text"}
                                           disabled={true}
                                           handleChange={this.handleCityChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Input label={"出生城市："}
                                           name={"city"}
                                           value={this.state.birth_geo.city}
                                           type={"text"}
                                           handleChange={this.handleBirthCityChange}
                                    />
                                </td>
                                <td>
                                    <Input label={"出生省份："}
                                           value={birth_province_value}
                                           type={"text"}
                                           disabled={true}
                                           handleChange={this.handleBirthCityChange}
                                    />
                                </td>

                                <td>
                                    <Input label={"出生区域："}
                                           value={birth_region_value}
                                           type={"text"}
                                           disabled={true}
                                           handleChange={this.handleBirthCityChange}
                                    />
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
                                    <CustomFormatInput
                                        label={"身份证号码："}
                                        name={"identification_number"}
                                        value={this.state.detail.identification_number}
                                        format={[
                                            {char: /\d/, repeat:3},
                                            { exactly: "-" },
                                            {char: /\d/, repeat:3},
                                            { exactly: "-" },
                                            {char: /\d/, repeat:4},
                                            { exactly: "-" },
                                            {char: /\d/, repeat:4},
                                            { exactly: "-" },
                                            {char: /\d/, repeat:4},
                                        ]}
                                        placeholder={"XXX-XXX-XXXX-XXXX-XXXX"}
                                        handleChange={this.handleSpecialChange}
                                    />
                                </td>
                                <td>
                                    <DropDown label={"在加身份："}
                                              name={"visa_type"}
                                              value={this.state.detail.visa_type}
                                              handleChange={this.handleChange}
                                              options={["加拿大学签","加拿大旅游签","加拿大工签","加拿大移民","加拿大公民","加拿大难民","无身份信息"]}
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
                                    <CustomFormatInput
                                        label={"护照到期日："}
                                        name={"passport_due"}
                                        value={this.state.detail.passport_due.replace(/\//g, '-')}
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
                            </tr>
                            <tr>
                                <td>
                                    <Input label={"UCI 号码："}
                                           name={"uci_number"}
                                           value={this.state.detail.uci_number}
                                           type={"text"}
                                           handleChange={this.handleChange}
                                    />
                                </td>
                                <td>
                                    <CustomFormatInput
                                        label={"签证到期日："}
                                        name={"visa_due"}
                                        value={this.state.detail.visa_due.replace(/\//g, '-')}
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
                                    <CustomFormatInput
                                        label={"第一次登录时间："}
                                        name={"first_landing_date"}
                                        value={this.state.detail.first_landing_date.replace(/\//g, '-')}
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
                {/*<div className={"section-wrapper"}>
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
                </div>*/}
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
        china_geo:state.china_geo,
    };
};

const mapDispatchToProps = dispatch =>{
    return{
        addCustomer:(customer)=>dispatch({type:actionTypes.SAGA_ADD_CUSTOMERS,customer: customer}),
        getChinaGeo:()=>dispatch({type:actionTypes.SAGA_GET_CHINA_GEO})
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(AddCustomer);