import React, { Component } from 'react'
import "../Form.css";
import Input from "../Input/Input";
import CustomFormatInput from "../Input/CustomFormatInput";
import CurrencyInput from "../Input/CurrencyInput"
import DropDown from "../DropDown/DropDown";
import connect from "react-redux/es/connect/connect";
import * as actionTypes from '../../../store/action';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';


class UserDetail extends Component {

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
        };
        
        this.state = { 
            new_user:{
                name: "",
                gender: "",
                dob: "",
                visa_type: "",
                sin_number: "" ,
                entry_date: "",
                department: "",
                role: "",
                base_salary: "",
                position: "",
                username: "",
                password: "" ,
                IP:"",
                anticipated_IP:""
            }
        }
    }
    componentWillMount() {
        console.log(this.props);
        let user_info = this.props.history.location.user;
        Object.keys(user_info).forEach((key)=>{
            if(!user_info[key]){
                user_info[key] = "";
            }
        });
        this.setState({new_user:user_info});
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
    };

    handleSpecialChange = (name, value) => {
        this.setState((prevState) => ({
            ...prevState,
            new_user:{
                ...prevState.new_user,
                [name]: value,
            }
        }));
    };

    handleCurrencyChange = (event, maskedvalue, floatvalue) => {
        this.setState((prevState) => ({
            ...prevState,
            new_user: {
                ...prevState.new_user,
                base_salary: maskedvalue
            }
        }));
    };


    handleAddSubmit(){
        console.log("submit");
        this.props.User(this.state.new_user);
    }


    render() {
        return (
            <div className={"form-wrapper content-wrapper"}>
                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>用户信息</h3>
                    </div>
                    <hr className={"style1"}/>
                    <div className={"section-body"}>
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
                                            name={"sin_number"}
                                            value={this.state.new_user.sin_number}
                                            handleChange={this.handleChange.bind(this)}
                                        />
                                    </td>
                                    <td>
                                        <CustomFormatInput
                                            label={"入职时间"}
                                            name={"entry_date"}
                                            value={this.state.new_user.entry_date.replace(/\//g, '-')}
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
                                            name={"position"}
                                            value={this.state.new_user.position}
                                            handleChange={this.handleChange.bind(this)}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Input
                                            label={"IP 登录地址"}
                                            type={"text"}
                                            name={"IP"}
                                            value={this.state.new_user.IP}
                                            handleChange={this.handleChange.bind(this)}
                                        />
                                    </td>
                                    <td>
                                        <Input
                                            label={"预估地点"}
                                            type={"text"}
                                            name={"anticipated_IP"}
                                            value={this.state.new_user.anticipated_IP}
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
                                            <button className={"btn btn-danger"} onClick={this.handleDelete.bind(this, this.state.new_user.id)}>删除</button>
                                        </Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
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
        User: (user) => dispatch({type:actionTypes.SAGA_UPDATE_USER, user:user}),
        deleteUser: (id) => dispatch({type:actionTypes.SAGA_DELETE_USER, id:id}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserDetail);