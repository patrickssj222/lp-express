import React, { Component } from 'react'
import connect from "react-redux/es/connect/connect";
import * as actionTypes from '../../../store/action';
import { MDBDataTable } from "mdbreact";
import "../Form.css";
class Business extends Component{
    constructor(props){
        super(props);
    }

    componentWillMount() {
        this.props.getBusiness();
    }

    render(){
        const columns = [
            {
                label: '客户姓名',
                field: 'customer_name',
                sort: 'asc',

            },
            {
                label: '业务类别',
                field: 'business_type',
                sort: 'asc',
            },
            {
                label: '具体业务',
                field: 'subservice_name',
                sort: 'asc',
            },
            {
                label: '服务费用',
                field: 'service_fee',
                sort: 'asc',
            },
            {
                label: '业务状态',
                field: 'progress',
                sort: 'asc',
            },
            {
                label: '负责文案',
                field: 'wenan',
                sort: 'asc',
            }
        ];
        let rows = null;
        if(this.props.business!=null){
            const business = this.props.business;
            rows = Object.keys(business).map((index)=>{
                return({
                    customer_name: business[index].customer_name,
                    business_type: business[index].business_type!=null?business[index].business_type:"",
                    subservice_name: business[index].subservice_name!=null?business[index].subservice_name:"",
                    service_fee: business[index].service_fee!=null?business[index].service_fee:"",
                    progress: business[index].progress!=null?business[index].progress:"",
                    wenan: business[index].wenan!=null?business[index].wenan:"",
                    clickEvent: this.props.switchView.bind(this,"BusinessDetail",{id: business[index].id})
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
                        <h3>业务列表</h3>
                    </div>
                    <hr className={"style1"}/>
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
        business: state.business
    };
};

const mapDispatchToProps = dispatch =>{
    return{
        getBusiness: () => dispatch({type:actionTypes.SAGA_GET_BUSINESS}),
        switchView: (component, payload) => dispatch({type:actionTypes.SWITCH_VIEW, component:component, payload:payload}),
        popUp: (status, message, action) => dispatch({type:actionTypes.POP_UP, message:message, status:status, action:action}),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Business);