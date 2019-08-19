import React, { Component } from 'react'
import connect from "react-redux/es/connect/connect";
import * as actionTypes from '../../../store/action';
import { MDBDataTable } from "mdbreact";
import "../Form.css";
import {Link, withRouter} from "react-router-dom";
class AdminCustomer extends Component{
    constructor(props){
        super(props);
    }

    componentWillMount() {
        console.log("admin will mount");
        this.props.getAdminDataset(this.props.history);
    }
    render(){
        return(
            <div className={"form-wrapper content-wrapper"}>
                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>客户列表</h3>
                    </div>
                    <hr className={"style1"}/>
                    <div className={"footer"}>
                    </div>
                    <div className={"section-body"}>
                        {
                            this.props.admin_dataset?<MDBDataTable
                                striped
                                bordered
                                small
                                hover
                                data={this.props.admin_dataset}
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
        customer: state.customer,
        users_list:state.users_list,
        china_geo:state.china_geo,
        admin_dataset:state.admin_dataset
    };
};

const mapDispatchToProps = dispatch =>{
    return{
        getCustomers: () => dispatch({type:actionTypes.SAGA_GET_CUSTOMERS}),
        switchView: (component, payload) => dispatch({type:actionTypes.SWITCH_VIEW, component:component, payload:payload}),
        getAllUsers: () => dispatch({type:actionTypes.SAGA_GET_ALL_USERS}),
        getChinaGeo:()=>dispatch({type:actionTypes.SAGA_GET_CHINA_GEO}),
        getAdminDataset:(history)=>dispatch({type:actionTypes.SAGA_ADMIN_DATASET, history:history}),
        popUp: (status, message, action) => dispatch({type:actionTypes.POP_UP, message:message, status:status, action:action}),
        removePopUp: ()=>dispatch({type:actionTypes.REMOVE_POP_UP})
    };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AdminCustomer));