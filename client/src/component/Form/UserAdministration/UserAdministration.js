import React, { Component } from 'react'
import connect from "react-redux/es/connect/connect";
import * as actionTypes from '../../../store/action';
import { MDBDataTable } from "mdbreact";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import "../Form.css";

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
    
    handleDelete(id){
        this.props.deleteUser(id);
    }

    handleEdit = (id) => {
        
    }

    render(){
        const columns = [
            {
                label: '姓名',
                field: 'name',
                sort: 'asc',

            },
            {
                label: '性别',
                field: 'gender',
                sort: 'asc',

            },
            {
                label: '出生日期',
                field: 'birth_date',
                sort: 'asc',

            },
            {
                label: '在加身份',
                field: 'role',
                sort: 'asc',

            },
            {
                label: '权限',
                field: 'rights',
                sort: 'asc',
            },
            {
                label: '账号/手机号',
                field: 'user_name',
                sort: 'asc',
            },
            {
                label: '密码',
                field: 'pwd',
                sort: 'asc',
            },
            {
                label: '',
                field: 'adjust_button',
                sort: 'asc',
            },
        ];
        let rows = null;
        if(this.props.users_list!=null){
            const users_list = this.props.users_list;
            rows = Object.keys(users_list).map((index)=>{
                return({
                    name: users_list[index].name,
                    gender: users_list[index].gender,
                    birth_date: users_list[index].birth_date,
                    role: users_list[index].role,
                    rights: users_list[index].rights,
                    user_name: users_list[index].user_name,
                    pwd: users_list[index].pwd,
                    adjust_button: 
                    <Link to={{
                        pathname: "/user/edit/",
                        user: users_list[index]
                    }}> 
                        <button className={"btn btn-primary"}> 修改</button>
                    </Link>
                    // delete_button:<button className={"btn btn-danger"} onClick={this.handleDelete.bind(this, users_list[index].id)}>删除</button>
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
                    </div>
                    <Link to={"/user/new/"}> 
                        <button className={"btn btn-primary"}> 添加用户 </button>
                    </Link>
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