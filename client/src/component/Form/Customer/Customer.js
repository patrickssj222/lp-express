import React, { Component } from 'react'
import connect from "react-redux/es/connect/connect";
import * as actionTypes from '../../../store/action';
import { MDBDataTable } from "mdbreact";
import "../Form.css";
class Customer extends Component{
    constructor(props){
        super(props);
    }

    componentWillMount() {
        this.props.getCustomers();
    }

    handleNewCustomer(e){
        this.props.switchView("AddCustomer");
    }
    render(){
        const columns = [
            {
                label: '姓名',
                field: 'name',
                sort: 'asc',

            },
            {
                label: '电话',
                field: 'phone',
                sort: 'asc',
            },
            {
                label: '护照到期日',
                field: 'passport_due',
                sort: 'asc',
            },
            {
                label: '签证到期日',
                field: 'visa_due',
                sort: 'asc',
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
                if(this.props.user.role==="管理员"){
                    console.log("SRKKKRR");
                    rows.push({
                            name:customer[index].name,
                            phone: customer[index].phone!=null?customer[index].phone:"",
                            passport_due: passport_due,
                            visa_due: visa_due,
                            clickEvent: this.props.switchView.bind(this,"CustomerDetail",{index:index})
                        }
                    )
                }
                else{
                    if(this.props.user.id === customer[index].created_by){
                        rows.push({
                            name:customer[index].name,
                            phone: customer[index].phone!=null?customer[index].phone:"",
                            passport_due: customer[index].passport_due!=null?customer[index].passport_due:"",
                            visa_due: customer[index].visa_due!=null?customer[index].visa_due:"",
                            clickEvent: this.props.switchView.bind(this,"CustomerDetail",{index:index})
                        })
                    }
                }

            });
        }
        const data = {
            columns:columns,
            rows:rows
        };

        console.log("DATA", data);
        return(
            <div className={"form-wrapper content-wrapper"}>
                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>客户列表</h3>
                    </div>
                    <hr className={"style1"}/>
                    <div className={"footer"}>
                        <div className={"form-confirmation button-group"}>
                            <button className={"btn btn-primary"} onClick={this.handleNewCustomer.bind(this)}>添加客户</button>
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
        customer: state.customer
    };
};

const mapDispatchToProps = dispatch =>{
    return{
        getCustomers: () => dispatch({type:actionTypes.SAGA_GET_CUSTOMERS}),
        switchView: (component, payload) => dispatch({type:actionTypes.SWITCH_VIEW, component:component, payload:payload}),
        popUp: (status, message, action) => dispatch({type:actionTypes.POP_UP, message:message, status:status, action:action}),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Customer);