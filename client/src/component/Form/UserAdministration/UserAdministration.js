import React, { Component } from 'react'
import connect from "react-redux/es/connect/connect";
import * as actionTypes from '../../../store/action';
import { MDBDataTable } from "mdbreact";
import "../Form.css";
import Input from "../Input/Input";
import DropDown from "../DropDown/DropDown";
class UserAdministration extends Component{
    constructor(props){
        super(props);
        this.state={
            add:false
        }
    }

    componentWillMount() {
        this.props.getAllUsers();
    }
    handleChange(e){
        const { name, value } = e.target;
        this.setState((prevState) => ({
            ...prevState,
            new_user:{
                ...prevState.new_user,
                [name]:value,
            }
        }));
    }
    handleAdd(){
        this.setState({
            add:true,
            new_user:{
                username:"",
                password:"",
                role:"普通文案",
                name:"",
            }
        })
    }
    handleAddSubmit(){
        this.props.addUser(this.state.new_user);
        this.setState({
            add:false,
            new_user:null
        })
    }
    handleDelete(id){
        this.props.deleteUser(id);
    }

    render(){
        const columns = [
            {
                label: '姓名',
                field: 'name',
                sort: 'asc',

            },
            {
                label: '职务',
                field: 'role',
                sort: 'asc',

            },
            {
                label: '',
                field: 'delete_button',
                sort: 'asc',
            },
        ];
        let rows = null;
        if(this.props.users_list!=null){
            const users_list = this.props.users_list;
            rows = Object.keys(users_list).map((index)=>{
                return({
                    name: users_list[index].name,
                    role:users_list[index].role,
                    delete_button:<button className={"btn btn-danger"} onClick={this.handleDelete.bind(this, users_list[index].id)}>删除</button>
                })
            });
        }
        const data = {
            columns:columns,
            rows:rows
        };
        return(
            <div className={"form-wrapper content-wrapper"}>
                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>用户管理</h3>
                    </div>
                    <hr className={"style1"}/>
                    <div className={"section-body"}>
                        <MDBDataTable
                            striped
                            bordered
                            small
                            data={data}
                            entries={10}
                        />
                        {
                            this.state.add?<table className={"business-detail-table"}>
                                <thead/>
                                <tbody>
                                <tr>
                                    <td>
                                        <Input
                                            label={"用户名"}
                                            type={"text"}
                                            name={"username"}
                                            value={this.state.new_user.username}
                                            handleChange={this.handleChange.bind(this)}
                                        />
                                    </td>
                                    <td>
                                        <Input
                                            label={"密码"}
                                            type={"password"}
                                            name={"password"}
                                            value={this.state.new_user.password}
                                            handleChange={this.handleChange.bind(this)}
                                        />
                                    </td>

                                </tr>
                                <tr>
                                    <td>
                                        <Input
                                            label={"用户姓名"}
                                            type={"text"}
                                            name={"name"}
                                            value={this.state.new_user.name}
                                            handleChange={this.handleChange.bind(this)}
                                        />
                                    </td>
                                    <td>
                                        <DropDown
                                            label={"用户权限"}
                                            options={["管理员","文案员"]}
                                            name={"role"}
                                            value={this.state.new_user.role}
                                            handleChange={this.handleChange.bind(this)}
                                        />
                                    </td>
                                    <td>
                                        <button className={"btn btn-primary"} onClick={this.handleAddSubmit.bind(this)}>确认添加</button>
                                    </td>
                                </tr>
                                </tbody>
                            </table>:<button className={"btn btn-primary"} onClick={this.handleAdd.bind(this)}>添加用户</button>
                        }
                    </div>
                </div>
            </div>
        );
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
        getAllUsers: () => dispatch({type:actionTypes.SAGA_GET_ALL_USERS}),
        deleteUser: (id) => dispatch({type:actionTypes.SAGA_DELETE_USER, id:id}),
        addUser: (user) => dispatch({type:actionTypes.SAGA_ADD_USER, user:user}),
        popUp: (status, message, action) => dispatch({type:actionTypes.POP_UP, message:message, status:status, action:action}),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(UserAdministration);