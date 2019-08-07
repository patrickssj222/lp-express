import React, { Component } from 'react'
import "../Form.css";
import Input from "../Input/Input";
import CustomFormatInput from "../Input/CustomFormatInput";
import CurrencyInput from "../Input/CurrencyInput"
import DropDown from "../DropDown/DropDown";
import connect from "react-redux/es/connect/connect";
import * as actionTypes from '../../../store/action';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';


class EditUser extends Component {

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
                name: "",
                gender: "",
                birth_date: "",
                visa_type: "",
                sin_num: "" ,
                enter_date: "",
                department: "",
                role: "",
                base_salary: "",
                rights: "",
                user_name: "",
                pwd: "" ,
                // name: this.props.location.user.name,
                // gender: this.props.location.user.gender,
                // birth_date: this.props.location.user.birth_date,
                // visa_type: this.props.location.user.visa_type,
                // sin_num: this.props.location.user.sin_num,
                // enter_date: this.props.location.user.enter_date,
                // department: this.props.location.user.department,
                // role: this.props.location.user.role,
                // base_salary: this.props.location.user.base_salary,
                // rights: this.props.location.user.rights,
                // user_name: this.props.location.user.user_name,
                // pwd: this.props.location.user.pwd,
            }
        }
    }

    handleDelete(id){
        this.props.deleteUser(id);
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
        this.props.editUser(this.state.new_user);
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
            </tr>
            <tr>
                <td>
                    <Input
                        label={"IP 登录地址"}
                        type={"text"}
                        name={"ip"}
                        value={this.state.new_user.ip}
                        handleChange={this.handleChange.bind(this)}
                    />
                </td>
                <td>
                    <Input
                        label={"预估地点"}
                        type={"text"}
                        name={"anticipatedIP"}
                        value={this.state.new_user.anticipatedIP}
                        handleChange={this.handleChange.bind(this)}
                    />
                </td>
            </tr>
            <tr> 
                <td>
                    <Link to={"/user"}> 
                    <button className={"btn btn-primary"} onClick={this.handleAddSubmit.bind(this)}>确认修改</button>
                    </Link>
                </td>
                <td>
                    <Link to={"/user"}> 
                    <button className={"btn btn-danger"}>删除</button> 
                    {/* onClick={this.handleDelete.bind(this, users_list[index].id)} */}
                    </Link>   
                </td>
            </tr>

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
        editUser: (user) => dispatch({type:actionTypes.SAGA_EDIT_USER, user:user}),
        deleteUser: (id) => dispatch({type:actionTypes.SAGA_DELETE_USER, id:id}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditUser);