import React, { Component } from 'react'
import connect from "react-redux/es/connect/connect";
import * as actionTypes from '../../../store/action';
import { MDBDataTable } from "mdbreact";
import "../Form.css";
import {Link, withRouter} from "react-router-dom";
import CustomFormatInput from "./AddCustomer";
class Customer extends Component{
    constructor(props){
        super(props);
    }

    componentWillMount() {
        this.props.getCustomers();
        this.props.getAllUsers();
        if(this.props.china_geo==null){
            this.props.getChinaGeo();
        }
    }

    handleRedirect(path, index){
        this.props.history.push({
            pathname: path,
            state: { index:index }
        })
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
        const columns = [
            {
                label: '姓名',
                field: 'name',
            },
            {
                label: '电话',
                field: 'phone',
            },
            {
                label: '护照到期日',
                field: 'passport_due',
            },
            {
                label: '签证到期日',
                field: 'visa_due',
            },
            {
                label: '上次更新时间',
                field: 'update_time',
            },
        ];
        let rows = null;
        if(this.props.customer!=null){
            rows = [];
            const customer = this.props.customer;
            Object.keys(customer).forEach((index)=>{
                let visa_due = "";
                if(customer[index].visa_due){
                    const today = new Date();
                    const visa_time = new Date(customer[index].visa_due);
                    const diffTime = visa_time.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if(diffDays<=90&&diffDays>=0){
                        visa_due=<div className={"blue-text"}>{customer[index].visa_due} 剩余时间:{diffDays}天</div>
                    }
                    else if(diffDays<0&&diffDays>=-90){
                        visa_due=<div className={"orange-text"}>{customer[index].visa_due}  过期时间:{Math.abs(diffDays)}天</div>
                    }
                    else if(diffDays<-90){
                        visa_due=<div className={"red-text"}>{customer[index].visa_due}</div>
                    }
                    else{
                        visa_due=customer[index].visa_due;
                    }
                }
                let passport_due = "";
                if(customer[index].passport_due){
                    const today = new Date();
                    const passport_time = new Date(customer[index].passport_due);
                    const diffTime = passport_time.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if(diffDays<=180&&diffDays>=0){
                        passport_due=<div className={"blue-text"}>{customer[index].passport_due} 剩余时间:{diffDays}天</div>
                    }
                    else if(diffDays<0){
                        passport_due=<div className={"orange-text"}>{customer[index].passport_due}  过期时间:{Math.abs(diffDays)}天</div>
                    }
                    else{
                        passport_due=customer[index].passport_due;
                    }
                }
                if(this.props.user.id === customer[index].created_by){
                    rows.push({
                        name:customer[index].name,
                        phone: customer[index].phone!=null?customer[index].phone:"",
                        passport_due: passport_due,
                        visa_due: visa_due,
                        update_time:customer[index].update_time,
                        clickEvent: this.handleRedirect.bind(this,"/customer/detail",index)
                    })
                }
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
                        <h3>客户列表</h3>
                    </div>
                    <hr className={"style1"}/>
                    <div className={"footer"}>
                        <div className={"form-confirmation button-group"}>
                            <Link to={"/customer/add"}>
                                <button className={"btn btn-primary"}>添加客户</button>
                            </Link>
                        </div>
                    </div>
                    <div className={"section-body"}>
                        {
                            data.rows?<MDBDataTable
                                striped
                                bordered
                                small
                                hover
                                data={data}
                                entries={10}
                                order={['update_time','desc']}
                            />:null
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
        customer: state.customer,
        users_list:state.users_list,
        china_geo:state.china_geo,
    };
};

const mapDispatchToProps = dispatch =>{
    return{
        getCustomers: () => dispatch({type:actionTypes.SAGA_GET_CUSTOMERS}),
        switchView: (component, payload) => dispatch({type:actionTypes.SWITCH_VIEW, component:component, payload:payload}),
        getChinaGeo:()=>dispatch({type:actionTypes.SAGA_GET_CHINA_GEO}),
        getAllUsers: () => dispatch({type:actionTypes.SAGA_GET_ALL_USERS}),
        popUp: (status, message, action) => dispatch({type:actionTypes.POP_UP, message:message, status:status, action:action}),
    };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Customer));