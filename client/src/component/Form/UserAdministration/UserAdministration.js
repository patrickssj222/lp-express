import React, { Component } from 'react'
import connect from "react-redux/es/connect/connect";
import * as actionTypes from '../../../store/action';
import { MDBDataTable } from "mdbreact";
import "../Form.css";
class Price_Constants extends Component{
    constructor(props){
        super(props);
    }

    componentWillMount() {
        this.props.getAllUsers();
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
        popUp: (status, message, action) => dispatch({type:actionTypes.POP_UP, message:message, status:status, action:action}),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Price_Constants);