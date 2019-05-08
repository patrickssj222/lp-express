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
        console.log(this.props.customer);
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
            }
        ];
        let rows = null;
        if(this.props.customer!=null){
            const customer = this.props.customer;
            rows = Object.keys(customer).map((index)=>{
                return({
                    name:customer[index].name,
                    phone: customer[index].phone!=null?customer[index].phone:"",
                    passport_due: customer[index].passport_due!=null?customer[index].passport_due:"",
                    visa_due: customer[index].visa_due!=null?customer[index].visa_due:"",
                    clickEvent: this.props.switchView.bind(this,"CustomerDetail",{index:index})
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
                        <h3>客户列表</h3>
                    </div>
                    <hr className={"style1"}/>
                    <div className={"footer"}>
                        <div className={"form-confirmation button-group"}>
                            <button className={"btn btn-primary"} onClick={this.handleNewCustomer.bind(this)}>添加客户</button>
                        </div>
                    </div>
                    <div className={"section-body"}>
                        <MDBDataTable
                            striped
                            bordered
                            small
                            hover
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