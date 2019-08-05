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
        console.log("price constants");
        console.log(this.props);
        this.props.getPriceConstants();
    }


    handleChange(index, e) {
        console.log(e);
        console.log("index:",index);
        const { name, value } = e.target;
        const temp = this.props.constants.fee;
        temp[index][name] = value;
        this.props.updatePriceConstants(temp);
    }
    handleSubmit(){
        this.props.submitPriceConstants(this.props.constants.fee);
    }
    render(){
        const columns = [
            {
                label: '具体业务',
                field: 'name',
                sort: 'asc',

            },
            {
                label: '业务类别',
                field: 'name',
                sort: 'asc',

            },
            {
                label: '服务费用',
                field: 'service_fee',
                sort: 'asc',
            },
            {
                label: '政府费用',
                field: 'government_fee',
                sort: 'asc',
            },
            {
                label: '邮寄费用/指模费用',
                field: 'misc_fee',
                sort: 'asc',
            },
        ];
        let rows = null;
        if(this.props.constants.fee!=null){
            const fee = this.props.constants.fee;
            rows = Object.keys(fee).map((index)=>{
                return({
                    name: fee[index].name,
                    type:fee[index].type,
                    service_fee: <input className={"mdb-editable"} type={"number"} step={".01"} name={"service_fee"} onChange={this.handleChange.bind(this,index)} value={fee[index].service_fee!=null?fee[index].service_fee:""}/>,
                    government_fee: <input className={"mdb-editable"} type={"number"} step={".01"} name={"government_fee"} onChange={this.handleChange.bind(this,index)} value={fee[index].government_fee!=null?fee[index].government_fee:""}/>,
                    misc_fee: <input className={"mdb-editable"} type={"number"} step={".01"} name={"misc_fee"} onChange={this.handleChange.bind(this,index)} value={fee[index].misc_fee!=null?fee[index].misc_fee:""}/>
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
                        <h3>基础价格常量</h3>
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
                        <div className={"footer"}>
                            <div className={"form-confirmation button-group"}>
                                <button className={"btn btn-primary"} onClick={this.handleSubmit.bind(this)}>确认</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return{
        user:state.user,
        constants: state.constants
    };
};

const mapDispatchToProps = dispatch =>{
    return{
        getPriceConstants: () => dispatch({type:actionTypes.SAGA_GET_PRICE_CONSTANTS}),
        updatePriceConstants: (constants) => dispatch({type:actionTypes.UPDATE_PRICE_CONSTANTS, constants:constants}),
        submitPriceConstants: (constants) => dispatch({type:actionTypes.SAGA_UPDATE_PRICE_CONSTANTS, constants:constants}),
        popUp: (status, message, action) => dispatch({type:actionTypes.POP_UP, message:message, status:status, action:action}),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Price_Constants);