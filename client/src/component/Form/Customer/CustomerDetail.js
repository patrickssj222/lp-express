import React, { Component } from 'react';
import DropDown from '../DropDown/DropDown';
import '../Form.css';
import './CustomerDetail.css';
import Input from "../Input/Input";
import connect from "react-redux/es/connect/connect";
import * as actionTypes from "../../../store/action";
import axios from "axios";
import {MDBDataTable} from "mdbreact";
import CustomFormatInput from "../Input/CustomFormatInput";
import PhoneInput from "../Input/PhoneInput";
import { Redirect } from "react-router-dom";


class CustomerDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:null,
            business:null,
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
        this.columns = [
            {
                label: '具体业务',
                field: 'service_name',
                sort: 'asc',

            },
            {
                label: '业务状态',
                field: 'progress',
                sort: 'asc',
            },
            {
                label: '负责文案',
                field: 'wenan',
                sort: 'asc',
            }
        ];
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.handleBirthCityChange = this.handleBirthCityChange.bind(this);
        this.handleContactChange = this.handleContactChange.bind(this);
        this.handleSpecialChange = this.handleSpecialChange.bind(this);
    }
    componentWillMount() {
        try{
            this.setState({
                detail:this.props.location.state?this.props.customer[this.props.location.state.index]:null,
            });
            axios({
                method: 'POST',
                url: '/api/customers/business',
                data:{
                    id:this.state.detail.id
                }
            }).then(response=>{
                if(response.data.status>=200 && response.data.status<300){
                    const result = response.data.response;
                    this.setState({
                        business:result
                    });
                }
                else{
                }
            });

        }
        catch(e){
        }
        if(this.props.china_geo==null){
            this.props.getChinaGeo();
        }

        if(this.props.customer){
            const city_info = this.findNested(this.props.china_geo,"id",this.props.customer[this.props.location.state.index].birth_city_id);
            this.setState({
                birth_geo:{
                    city:city_info.city,
                    province:city_info.province,
                    region:city_info.region
                }
            });
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
        console.log("name", name, "value", value);
        this.setState((prevState) => ({
            ...prevState,
            detail:{
                ...prevState.detail,
                [name]:value,
            }
        }));
    }
    handleSubmit(e){
        this.props.updateCustomer(this.state.detail);
    }
    handleNewBusiness(e){
        this.props.updateView("AddBusiness", {customer_id:this.state.detail.id, customer_name:this.state.detail.name, index:this.props.payload.index});
    }

    handleContactChange(e, index){
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

    initCity(){
        try{
            axios({
                method: 'POST',
                url: '/api/customers/city/china',
                data:{
                    id:this.state.detail.city_id
                }
            }).then(response=>{
                if(response.data.status>=200 && response.data.status<300){
                    const result = response.data.response;
                    this.setState((prevState) => ({
                        ...prevState,
                        china_geo:{
                            ...prevState.china_geo,
                            city:result[0].name
                        }
                    }));
                }
                else{
                }

            });

        }
        catch(e){
            console.log(e);
        }
    }
    handleCityChange(e){
        const { name, value } = e.target;
        const city_info = this.findNested(this.props.china_geo,"city",value);
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
        const city_info = this.findNested(this.props.china_geo,"city",value);
        console.log("birth city",city_info);
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
    findNested (obj, key, value){
        // Base case
        if (obj[key] === value) {
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
    render(){
        console.log("current state", this.state);
        let customer = null;
        let data = null;
        let region_value = "";
        let province_value = "";
        let birth_region_value = "";
        let birth_province_value = "";
        try{
            customer = this.props.customer[this.props.location.state.index];
            if(this.props.china_geo!=null && this.state.china_geo.city === ""){
                this.initCity();
            }
            if(this.props.china_geo!=null && this.state.china_geo.city!==""){
                const city_info = this.findNested(this.props.china_geo,"city",this.state.china_geo.city);
                if(city_info){
                    region_value=city_info.region;
                    province_value=city_info.province;
                }
            }
            if(this.props.china_geo!=null && this.state.birth_geo.city!==""){
                const birth_city_info = this.findNested(this.props.china_geo,"city",this.state.birth_geo.city);
                if(birth_city_info){
                    birth_region_value = birth_city_info.region;
                    birth_province_value = birth_city_info.province;
                }
            }


            let rows = [];
            if(this.state.business!=null){
                rows = this.state.business.map((item)=>{
                    return({
                        service_name:item.service_name,
                        progress:item.progress,
                        wenan:item.wenan,/*
                    amount:item.amount*/
                    })
                })
            }
            data = {
                columns:this.columns,
                rows:rows
            };
        }
        catch{
            return(<Redirect to='/customer'/>);
        }
        return(
            <div className={"form-wrapper content-wrapper customer-detail"}>
                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>基础信息</h3>
                        <button onClick={this.props.optionPopUp.bind(this, ["删除方式？"],[{name:"彻底删除",handler:this.props.forceDeleteCustomer.bind(this,customer)}])} className={"btn btn-danger"}>删除</button>
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
                                        className={"form-control"}
                                        label={"出生日期："}
                                        name={"dob"}
                                        value={this.state.detail.dob}
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
                        <h3>详细地址</h3>
                    </div>
                    <div className={"section-body"}>
                        <table className={"business-detail-table justify-auto"}>
                            <thead/>
                            <tbody>
                            <tr>
                                <td>
                                    <Input label={"中国现居地址："}
                                           name={"china_address"}
                                           value={this.state.detail.china_address}
                                           type={"text"}
                                           handleChange={this.handleChange}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Input label={"加拿大现居地址："}
                                           name={"canada_address"}
                                           value={this.state.detail.canada_address}
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
                                            { exactly: "-" },
                                            {char: /\d/, repeat:1},
                                        ]}
                                        placeholder={"XXX-XXX-XXXX-XXXX-XXXX-X"}
                                        handleChange={this.handleSpecialChange}
                                    />
                                </td>
                                <td>
                                    <DropDown label={"在加身份："}
                                              name={"visa_type"}
                                              value={this.state.detail.visa_type}
                                              handleChange={this.handleChange}
                                              options={["加拿大学签","加拿大旅游签","加拿大工签","加拿大移民","加拿大公民","加拿大难民","首次签证"]}
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
                                        value={this.state.detail.passport_due}
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
                                           disabled={this.state.detail.visa_type==="加拿大移民"||this.state.detail.visa_type==="加拿大公民"||this.state.detail.visa_type==="加拿大难民"||this.state.detail.visa_type==="首次签证"}
                                           handleChange={this.handleChange}
                                    />

                                </td>
                                <td>
                                    <CustomFormatInput
                                        label={"签证到期日："}
                                        name={"visa_due"}
                                        value={this.state.detail.visa_due}
                                        format={[
                                            {char: /\d/, repeat:4},
                                            { exactly: "-" },
                                            {char: /\d/, repeat:2},
                                            { exactly: "-" },
                                            {char: /\d/, repeat:2},
                                        ]}
                                        placeholder={"YYYY-MM-DD"}
                                        disabled={this.state.detail.visa_type==="加拿大移民"||this.state.detail.visa_type==="加拿大公民"||this.state.detail.visa_type==="加拿大难民"||this.state.detail.visa_type==="首次签证"}
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
                                        value={this.state.detail.first_landing_date}
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
                                this.state.detail.emergency_contact?this.state.detail.emergency_contact.map((contact, index)=>{
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
                                }):null
                            }
                            </tbody>
                        </table>
                    </div>
                </div>*/}
                <div className={"footer"}>
                    <div className={"form-confirmation button-group"}>
                        <small>完成值: {Math.round(this.state.total_completion/this.state.max_total*100)}%</small>
                        <button className={"btn btn-primary"} onClick={this.handleSubmit.bind(this)}>更新客户</button>
                    </div>
                </div>
                {
                    this.props.user.role==="管理员"?<div className={"section-wrapper"}>
                        <div className={"section-header"}>
                            <h3>对应业务</h3>
                        </div>
                        <div className={"footer"}>
                            <div className={"form-confirmation button-group"}>
                                <button className={"btn btn-primary"} onClick={this.handleNewBusiness.bind(this)}>添加业务</button>
                            </div>
                        </div>
                        <div className={"section-body"}>
                            <MDBDataTable
                                bordered
                                small
                                data={data}
                                entries={10}
                            />
                        </div>
                    </div>:null
                }

            </div>
        );
    }
}
const mapStateToProps = state => {
    return{
        user:state.user,
        customer:state.customer,
        china_geo:state.china_geo,
    };
};

const mapDispatchToProps = dispatch =>{
    return{
        updateCustomer:(customer)=>dispatch({type:actionTypes.SAGA_UPDATE_CUSTOMERS,customer: customer}),
        updateView:(component, payload)=>dispatch({type:actionTypes.SWITCH_VIEW, component:component, payload:payload}),
        getChinaGeo:()=>dispatch({type:actionTypes.SAGA_GET_CHINA_GEO}),
        optionPopUp:(message,option)=>dispatch({type:actionTypes.OPTION_POP_UP, message:message,option:option}),
        forceDeleteCustomer:(customer)=>dispatch({type:actionTypes.SAGA_FORCE_DELETE_CUSTOMER,customer:customer})
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetail);