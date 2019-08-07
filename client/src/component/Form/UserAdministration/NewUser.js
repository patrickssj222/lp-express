import React, { Component } from 'react'
import "../Form.css";
import Input from "../Input/Input";
import CustomFormatInput from "../Input/CustomFormatInput";
import CurrencyInput from "../Input/CurrencyInput"
import DropDown from "../DropDown/DropDown";
import connect from "react-redux/es/connect/connect";
import * as actionTypes from '../../../store/action';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';


class NewUser extends Component {

    constructor(props) {
        super(props);
        this.role_options = {
            "行政部（一级）": ["部长"],
            "外联部（二级）":["外联/主任", "外联/主管", "前台"],
            "人力资源部（二级）":["人力资源/主任", "培训讲师/主管", "移民/讲师", "留学/讲师", "招聘/主管", "见习规划师"],
            "文案部（一级）":["部长"],
            "签证部（二级）":["主任", "文案助理"],
            "申请部（二级）":["主任", "文案助理", "申请助理"],
            "市场部（一级）":["部长"],
            "传媒部（二级）":["主任", "设计/主管", "设计师", "IT/主管", "网络工程师", "新媒体/主管", "文字编辑"],
            "业务部（二级）":[null]
        }
        
        this.state = {
            new_user:{
                name: " ",
                gender: " ",
                birth_date: " ",
                visa_type: " ",
                sin_num: 0,
                enter_date: " ",
                department: " ",
                role: " ",
                base_salary: " ",
                rights: " ",
                user_name: " ",
                pwd: " ",
            }
        }
    }


    handleChange = e => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            ...prevState,
            new_user:{
                ...prevState.new_user,
                [name]: value,
            }
        }));
    }

    handleSpecialChange = (name, value) => {
        this.setState((prevState) => ({
            ...prevState,
            new_user:{
                ...prevState.new_user,
                [name]: value,
            }
        }));
    }

    handleCurrencyChange = (event, maskedvalue, floatvalue) => {
        this.setState((prevState) => ({
            ...prevState,
            new_user: {
                ...prevState.new_user,
                base_salary: maskedvalue
            }
        }));
    }


    handleAddSubmit(){
        console.log("submit");
        this.props.addUser(this.state.new_user);
    }


    render() {
        return (
            <div className={"form-wrapper content-wrapper"}>
           <table className={"business-detail-table"}>
            <tbody>
            <tr>
                <td>
                    <Input
                        label={"姓名"}
                        type={"text"}
                        name={"name"}
                        value={this.state.new_user.name}
                        handleChange={this.handleChange.bind(this)}
                    />
                </td>
                <td>
                    <DropDown
                        label={"性别"}
                        options={["男","女"]}
                        name={"gender"}
                        value={this.state.new_user.gender}
                        handleChange={this.handleChange.bind(this)}
                    />
                </td>
                <td>
                    <CustomFormatInput
                        label={"出生日期"}
                        name={"birth_date"}
                        value={this.state.new_user.birth_date.replace(/\//g, '-')}
                        format={[
                            {char: /\d/, repeat:4},
                            { exactly: "-" },
                            {char: /\d/, repeat:2},
                            { exactly: "-" },
                            {char: /\d/, repeat:2},
                        ]}
                        placeholder={"YYYY-MM-DD"}
                        // handleChange={this.handleChange.bind(this)}
                        handleChange={this.handleSpecialChange}
                    />
                </td>
    
            </tr>
            <tr>
                <td>
                    <DropDown
                        label={"在加身份"}
                        options={["加拿大学签","加拿大工签", "加拿大旅游签", "加拿大移民", "加拿大公民", "加拿大难民"]}
                        name={"visa_type"}
                        value={this.state.new_user.visa_type}
                        handleChange={this.handleChange.bind(this)}
                    />
                </td>
                <td>
                    <Input
                        label={"Sin Number"}
                        type={"text"}
                        name={"sin_num"}
                        value={this.state.new_user.sin_num}
                        handleChange={this.handleChange.bind(this)}
                    />
                </td>
                <td>
                    <CustomFormatInput
                        label={"入职时间"}
                        name={"enter_date"}
                        value={this.state.new_user.enter_date.replace(/\//g, '-')}
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
                    <DropDown
                        label={"入职部门"}
                        options={["行政部（一级）","外联部（二级）", "人力资源部（二级）", "文案部（一级）", "签证部（二级）", "申请部（二级）", "市场部（一级）", "传媒部（二级）", "业务部（二级）"]}
                        name={"department"}
                        value={this.state.new_user.department}
                        handleChange={this.handleChange.bind(this)}
                    />
                </td>
                <td>
                    <DropDown
                        label={"工作职位"}
                        options={this.role_options[this.state.new_user.department] || ["部长"]}
                        name={"role"}
                        value={this.state.new_user.role}
                        handleChange={this.handleChange.bind(this)}
                    />
                </td>
                <td>
                    <CurrencyInput
                        label={"固定底薪"}
                        suffix="$"
                        precision="2"
                        type={"text"}
                        name={"base_salary"}
                        value={this.state.new_user.base_salary}
                        // handleChange={this.handleChange.bind(this)}
                        onChangeEvent={this.handleCurrencyChange}
                    />
                </td>
            </tr>
            <tr>
                <td>
                    <DropDown
                        label={"权限"}
                        options={[ "管理员（高级）", "管理员", "规划师", "文案师", "收款员"]}
                        name={"rights"}
                        value={this.state.new_user.rights}
                        handleChange={this.handleChange.bind(this)}
                    />
                </td>
                <td>
                    <Input
                        label={"账号"}
                        type={"text"}
                        name={"user_name"}
                        value={this.state.new_user.user_name}
                        handleChange={this.handleChange.bind(this)}
                    />
                </td>
                <td>
                    <Input
                        label={"密码"}
                        type={"password"}
                        name={"pwd"}
                        value={this.state.new_user.pwd}
                        handleChange={this.handleChange.bind(this)}
                    />
                </td>
            </tr>
            <Link to={"/user"}> 
                <button className={"btn btn-primary"} onClick={this.handleAddSubmit.bind(this)}>确认添加</button>
            </Link>
            </tbody>
            </table>

            </div>
         )
    }
}


const mapStateToProps = state => {
    return{
        user:state.user,
        users_list:state.users_list
    };
};


const mapDispatchToProps = dispatch =>{
    return{
        addUser: (user) => dispatch({type:actionTypes.SAGA_ADD_USER, user:user})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewUser);