import React, { Component } from 'react';
import PrintResult from './PrintResult'
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
import { Redirect, withRouter } from "react-router-dom";
import { saveAs } from 'file-saver';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';

class CustomerDetail extends Component{

    headRows = [
        {id: "service_name", numeric: false, disablePadding: true, label: "具体业务"},
        {id: "progress", numeric: true, disablePadding: false, label: "业务状态"},
        {id: "wenan", numeric: true, disablePadding: false, label: "负责文案"},
    ];

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
            },
            pdfCreated: false,
            page: 0,
            rowsPerPage: 10,
            order: "asc",
            orderBy: "name",
            textValue: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.handleBirthCityChange = this.handleBirthCityChange.bind(this);
        this.handleSpecialChange = this.handleSpecialChange.bind(this);
    }

    handleChangePage = (event, newPage) => {
        this.setState({
            page: newPage,
        });
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({
            rowsPerPage: event.target.value,
            page: 0,
        });
    };

    handleChangeSearch = (event) => {
        this.setState({
            textValue: event.target.value,
        });
    };

    searchbyName(array, text) {
        var filteredrow = [];
        Object.keys(array).forEach((index)=>{
            if (array[index].service_name.includes(text) || array[index].progress.includes(text) || array[index].wenan.includes(text)){
                filteredrow.push(array[index])
            }
        })
        return filteredrow;
    }

    stableSort(array, order, orderBy){
        if (orderBy === 'service_name'){
            return order === 'asc' ? array.sort((x,y)=>x.service_name.localeCompare(y.service_name, 'zh-CN')) : array.sort((x,y)=>y.service_name.localeCompare(x.service_name, 'zh-CN'));
        } else if (orderBy === 'progress'){
            // need change
            return order === 'asc' ? array.sort((x,y)=>x.service_name.localeCompare(y.service_name, 'zh-CN')) : array.sort((x,y)=>y.service_name.localeCompare(x.service_name, 'zh-CN'));
        } else if (orderBy === 'wenan'){
            // need change
            return order === 'asc' ? array.sort((x,y)=>x.service_name.localeCompare(y.service_name, 'zh-CN')) : array.sort((x,y)=>y.service_name.localeCompare(x.service_name, 'zh-CN'));
        } else {
            return order === 'asc' ? array.sort((x,y)=>x.service_name.localeCompare(y.service_name, 'zh-CN')) : array.sort((x,y)=>y.service_name.localeCompare(x.service_name, 'zh-CN'));
        }
    }

    createSortHandler = property => event => {
        this.handleRequestSort(event, property);
    };

    handleRequestSort(event, property) {
        const isDesc = this.state.orderBy === property && this.state.order === 'desc';
        const order = isDesc ? 'asc' : 'desc';
        this.setState({
            order: order,
            orderBy: property,
        });
    }

    componentWillMount() {
        if(!this.props.china_geo){
            this.props.getChinaGeo();
        }
        try{
            this.props.getCustomerBusiness(this.props.customer[this.props.location.state.index].id);
            this.setState({
                detail:this.props.location.state?this.props.customer[this.props.location.state.index]:null,
            });
            if(this.props.china_geo!=null && this.state.china_geo.city === "" && this.props.location.state){
                this.initCity(this.props.customer[this.props.location.state.index].city_id, this.props.customer[this.props.location.state.index].birth_city_id);
            }
        }
        catch(e){
            this.props.history.push({
                pathname: '/customer'
            })
        }


        if(this.props.customer && this.props.china_geo){
            let city_info = this.findNested(this.props.china_geo,"id",this.props.customer[this.props.location.state.index].birth_city_id);
            if(city_info){
                this.setState({
                    birth_geo:{
                        city:city_info.city,
                        province:city_info.province,
                        region:city_info.region
                    }
                });
            }
            city_info = this.findNested(this.props.china_geo,"id",this.props.customer[this.props.location.state.index].city_id);
            if(city_info){
                this.setState({
                    china_geo:{
                        city:city_info.city,
                        province:city_info.province,
                        region:city_info.region
                    }
                });
            }
        }
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.customer_business){
            this.setState({
                business:nextProps.customer_business
            })

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
        this.props.history.push({
            pathname: "/business/add",
            state:{customer_id:this.state.detail.id, customer_name:this.state.detail.name, index:this.props.location.state.index}
        });
    }

    initCity(city_id, birth_city_id){
        const city = this.findNested(this.props.china_geo,"id",city_id);
        const birth_city = this.findNested(this.props.china_geo,"id",birth_city_id);

        this.setState((prevState) => ({
            ...prevState,
            china_geo:{
                ...prevState.china_geo,
                city:city?city.city:""
            },
            birth_geo:{
                ...prevState.birth_geo,
                city:birth_city?birth_city.city:""
            }
        }));
    }

    /*
    handleRedirect(path, id){
        this.props.history.push({
            pathname: path,
            state:{id:id}
        })
    }
    */

    handleClick(event, id){
        this.props.history.push({
            pathname: '/business/detail',
            state: { id:id }
        })
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

    handlePrintDetail(){
        console.log("print state", this.state);
        axios.post('/create-pdf',this.state)
            .then((res)=>{
                if(res.status === 200){
                    axios.get('/fetch-pdf', {responseType:'blob'}).then((res)=>{
                        const pdfBlob = new Blob([res.data],{type:'application/pdf'});
                        saveAs(pdfBlob, this.state.detail.name+'-客户档案.pdf');
                    })
                }
            })
    }

    handlePrintLayoutRedirect(){
        if (this.state.pdfCreated == true) {
            this.setState({
                pdfCreated:false
            })
            // work around to enable reprint
            setTimeout(() => {
                this.setState({
                    pdfCreated: true
                })
            }, 150);
        } else {
            this.setState({
                pdfCreated: true
            })
        }
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
        let newWindow = null;
        if (this.state.pdfCreated) {
            newWindow = <PrintResult 
            detail={this.state.detail}
            birth_geo={this.state.birth_geo}
            china_geo={this.state.china_geo}
            callback={this.printFinishCallback} // pass callback to child
            />
        }

        let customer = null;
        let data = null;
        let region_value = "";
        let province_value = "";
        let birth_region_value = "";
        let birth_province_value = "";
        let rows = [];
        try{
            customer = this.props.customer[this.props.location.state.index];

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

            if(this.state.business!=null){
                rows = this.state.business.map((item)=>{
                    return({
                        service_name:item.service_name,
                        progress:item.progress,
                        wenan:item.wenan,
                        index: item.id,
                    })
                })
            }
        }
        catch{
            return(<Redirect to='/customer'/>);
        }
        return(
            <div>
            {newWindow}
            <div className={"form-wrapper content-wrapper customer-detail"}>
                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>基础信息</h3>
                        <div className={"button-group"}>
                            <button className={"btn btn-primary"} onClick={this.handlePrintLayoutRedirect.bind(this)}>打印界面</button>
                            {
                                this.props.user.role==="管理员"?<button onClick={this.props.optionPopUp.bind(this, ["删除方式？"],[{name:"彻底删除",handler:this.props.forceDeleteCustomer.bind(this,this.props.customer[this.props.location.state.index])}])} className={"btn btn-danger"}>删除</button>:null
                            }
                        </div>
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
                                    <DropDown label={"国籍："}
                                              name={"citizenship"}
                                              value={this.state.detail.citizenship}
                                              options={["","中国","加拿大","越南","美国","印度","韩国","日本","柬埔寨"]}
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
                        <table className={"business-detail-table"}>
                            <thead/>
                            <tbody>
                            <tr>
                                <td>
                                    <Input label={"中国现居城市："}
                                           name={"city"}
                                           value={this.state.china_geo.city}
                                           type={"text"}
                                           handleChange={this.handleCityChange}
                                    />
                                </td>
                                <td>
                                    <Input label={"省份"}
                                           value={province_value}
                                           type={"text"}
                                           disabled={true}
                                           handleChange={this.handleCityChange}
                                    />
                                </td>

                                <td>
                                    <Input label={"区域"}
                                           value={region_value}
                                           type={"text"}
                                           disabled={true}
                                           handleChange={this.handleCityChange}
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
                                <td>
                                    <Input label={"加拿大邮编："}
                                           name={"postal_code"}
                                           value={this.state.detail.postal_code}
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
                                            {char: /\d/, repeat:3},
                                            {char: /\d|X/, repeat:1},
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
                                           disabled={this.state.detail.visa_type==="加拿大移民"||this.state.detail.visa_type==="加拿大公民"||this.state.detail.visa_type==="加拿大难民"||this.state.detail.visa_type==="首次签证"}
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
                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>家长信息</h3>
                    </div>
                    <div className={"section-body"}>
                    </div>
                </div>
                <div className={"footer"}>
                    <div className={"form-confirmation button-group"}>
                        <small>完成值: {Math.round(this.state.total_completion/this.state.max_total*100)}%</small>
                        <button className={"btn btn-primary"} onClick={this.handleSubmit.bind(this)}>更新客户</button>
                    </div>
                </div>
                {
                    this.props.user.role==="管理员"?<div className={"section-wrapper"}>
                        <div className={"section-header"}>
                            <h3>
                                对应业务
                                <input className='searchStyle'
                                placeholder="Search"
                                onChange={this.handleChangeSearch}
                                value={this.state.textValue}/>
                            </h3>
                        </div>
                        <div className={"footer"}>
                            <div className={"form-confirmation button-group"}>
                                <button className={"btn btn-primary"} onClick={this.handleNewBusiness.bind(this)}>添加业务</button>
                            </div>
                        </div>
                        <div className={"section-body"}>
                            { rows &&
                                <TablePagination
                                    rowsPerPageOptions={[10, 25, 50]}
                                    component="div"
                                    count={rows.length}
                                    rowsPerPage={this.state.rowsPerPage}
                                    page={this.state.page}
                                    backIconButtonProps={{
                                        'aria-label': 'previous page',
                                    }}
                                    nextIconButtonProps={{
                                        'aria-label': 'next page',
                                    }}
                                    onChangePage={this.handleChangePage}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                />
                            }
                            <Paper>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {this.headRows.map(row => (
                                                <TableCell className='fixedWidth'
                                                    key={row.id}
                                                    align={row.numeric ? "left" : "inherit"}
                                                    sortDirection={this.state.orderBy === row.id ? this.state.order : false}
                                                >
                                                { 
                                                    <TableSortLabel
                                                        active={this.state.orderBy === row.id}
                                                        direction={this.state.order}
                                                        onClick={this.createSortHandler(row.id)}
                                                        >
                                                        {row.label}
                                                    </TableSortLabel>
                                                }
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                <TableBody>
                                    {rows &&
                                    this.stableSort(rows, this.state.order, this.state.orderBy)
                                    .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                                    .map(row => (
                                        <TableRow hover onClick={event => this.handleClick(event, row.index)} className='ChangePointer' key={row.index}>
                                            <TableCell component="th" scope="row"> {row.service_name}</TableCell>
                                            <TableCell align="left">{row.progress}</TableCell>
                                            <TableCell align="left">{row.wenan}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            </Paper>
                        </div>
                    </div>:null
                }

            </div>

            </div>
        );
    }
}
const mapStateToProps = state => {
    return{
        user:state.user,
        customer:state.customer,
        china_geo:state.china_geo,
        customer_business:state.customer_business
    };
};

const mapDispatchToProps = dispatch =>{
    return{
        updateCustomer:(customer)=>dispatch({type:actionTypes.SAGA_UPDATE_CUSTOMERS,customer: customer}),
        updateView:(component, payload)=>dispatch({type:actionTypes.SWITCH_VIEW, component:component, payload:payload}),
        getCustomerBusiness:(id)=>dispatch({type:actionTypes.SAGA_GET_CUSTOMER_BUSINESS, id:id}),
        getChinaGeo:()=>dispatch({type:actionTypes.SAGA_GET_CHINA_GEO}),
        optionPopUp:(message,option)=>dispatch({type:actionTypes.OPTION_POP_UP, message:message,option:option}),
        forceDeleteCustomer:(customer)=>dispatch({type:actionTypes.SAGA_FORCE_DELETE_CUSTOMER,customer:customer})
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetail);