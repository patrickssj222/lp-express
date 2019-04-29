import React, { Component } from 'react';
import DropDown from '../DropDown/DropDown';
import '../Form.css';
import './CustomerDetail.css';
import Input from "../Input/Input";
import connect from "react-redux/es/connect/connect";
import * as actionTypes from "../../../store/action";
import axios from "axios";
import {MDBDataTable} from "mdbreact";


class CustomerDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:this.props.customer[this.props.payload.index],
            business:null
        };
        this.columns = [
            {
                label: '具体业务',
                field: 'subservice_name',
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
            },
            {
                label: '余款',
                field: 'amount',
                sort: 'asc',
            },
        ];
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentWillMount() {
        try{
            axios({
                method: 'POST',
                url: '/api/customers/business',
                data:{
                    id:this.state.detail.id
                }
            }).then(response=>{
                if(response.status>=200 && response.status<300){
                    const result = response.data.response;
                    this.setState({business:result});
                }
                else{
                }
            });

        }
        catch(e){
            console.log(e);
        }
    }

    handleChange(e){
        const { name, value } = e.target;
        this.setState((prevState) => ({
            ...prevState,
            detail:{
                ...prevState.detail,
                [name]:value,
            }
        }));
    }
    handleSubmit(e){
        this.props.updateCustomer(this.state.detail);
    }
    render(){
        let rows = [];
        if(this.state.business!=null){
            rows = this.state.business.map((item)=>{
                console.log(item);
                return({
                    subservice_name:item.subservice_name,
                    progress:item.progress,
                    wenan:item.wenan,
                    amount:item.amount
                })
            })
        }
        console.log("rows", rows);
        const data = {
            columns:this.columns,
            rows:rows
        };
        console.log("detail:",this.state.detail);
        return(
            <div className={"form-wrapper content-wrapper customer-detail"}>
                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>个人基本信息</h3>
                    </div>
                    <hr className={"style1"}/>
                    <div className={"section-body"}>
                        <table className={"customer-detail-table"}>
                            <thead/>
                            <tbody>
                                <tr>
                                    <td colSpan="2" rowSpan="6">IMG</td>
                                    <td>
                                        <Input label={"姓名："}
                                           name={"name"}
                                           value={this.state.detail.name}
                                           type={"text"}
                                           handleChange={this.handleChange}
                                        />
                                    </td>
                                    <td>
                                        <Input label={"性别："}
                                               name={"gender"}
                                               value={this.state.detail.gender}
                                               type={"text"}
                                               handleChange={this.handleChange}
                                        />
                                    </td>
                                    <td>
                                        <Input label={"出生日期："}
                                               name={"dob"}
                                               value={this.state.detail.dob.replace(/\//g, '-')}
                                               type={"date"}
                                               handleChange={this.handleChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>曾用名：</td>
                                    <td>
                                        <Input label={"邮箱："}
                                               name={"email"}
                                               value={this.state.detail.email}
                                               type={"email"}
                                               handleChange={this.handleChange}
                                        />
                                    </td>
                                    <td>
                                        <Input label={"电话："}
                                               name={"phone"}
                                               value={this.state.detail.phone}
                                               type={"tel"}
                                               handleChange={this.handleChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Input label={"中国现居城市："}
                                               name={"city"}
                                               value={this.state.detail.city}
                                               type={"text"}
                                               handleChange={this.handleChange}
                                        />
                                    </td>
                                    <td>
                                        <Input label={"省份："}
                                           name={"province"}
                                           value={this.state.detail.province}
                                           type={"text"}
                                           handleChange={this.handleChange}
                                        />
                                    </td>
                                    <td>
                                        <Input label={"区域："}
                                               name={"region"}
                                               value={this.state.detail.region}
                                               type={"text"}
                                               handleChange={this.handleChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>国籍：</td>
                                    <td>在加身份/状态：</td>
                                    <td>
                                        <Input label={"身份证号码："}
                                               name={"chinese_id"}
                                               value={this.state.detail.chinese_id}
                                               type={"text"}
                                               handleChange={this.handleChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Input label={"护照到期日："}
                                               name={"passport_due"}
                                               value={this.state.detail.passport_due.replace(/\//g, '-')}
                                               type={"date"}
                                               handleChange={this.handleChange}
                                        />
                                    </td>
                                    <td>护照类型：</td>
                                    <td>
                                        <Input label={"护照号码："}
                                               name={"passport_number"}
                                               value={this.state.detail.passport_number}
                                               type={"text"}
                                               handleChange={this.handleChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <Input label={"签证到期日："}
                                               name={"visa_due"}
                                               value={this.state.detail.visa_due.replace(/\//g, '-')}
                                               type={"date"}
                                               handleChange={this.handleChange}
                                        />
                                    </td>
                                    <td>
                                        <Input label={"签证类型："}
                                               name={"visa_type"}
                                               value={this.state.detail.visa_type}
                                               type={"text"}
                                               handleChange={this.handleChange}
                                        />
                                    </td>
                                    <td>
                                        <Input label={"UCI 号码："}
                                               name={"uci"}
                                               value={this.state.detail.uci}
                                               type={"text"}
                                               handleChange={this.handleChange}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>父亲：</td>
                                    <td>母亲：</td>
                                    <td>
                                        <Input label={"第一次登陆时间："}
                                               name={"landing_time"}
                                               value={this.state.detail.landing_time.replace(/\//g, '-')}
                                               type={"text"}
                                               handleChange={this.handleChange}
                                        />
                                    </td>
                                    <td>
                                        <Input label={"第一次登陆地点："}
                                               name={"landing_location"}
                                               value={this.state.detail.landing_location}
                                               type={"text"}
                                               handleChange={this.handleChange}
                                        />
                                    </td>
                                    <td/>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>紧急联系人信息</h3>
                    </div>
                    <div className={"section-body"}>
                        <div className={"row"}>
                            <Input
                                label={"姓名"}
                                name={"contact_name"}
                                value={this.state.detail.contact_name}
                                type={"text"}
                                handleChange={this.handleChange}
                            />
                            <Input
                                label={"关系"}
                                name={"contact_relationship"}
                                value={this.state.detail.contact_relationship}
                                type={"text"}
                                handleChange={this.handleChange}
                            />
                            <Input
                                label={"电话"}
                                name={"contact_phone"}
                                value={this.state.detail.contact_phone}
                                type={"tel"}
                                handleChange={this.handleChange}
                            />
                        </div>
                    </div>
                </div>
                <div className={"footer"}>
                    <div className={"form-confirmation button-group"}>
                        <small>完成值: {Math.round(this.state.total_completion/this.state.max_total*100)}%</small>
                        <button className={"btn btn-primary"} onClick={this.handleSubmit.bind(this)}>更新</button>
                    </div>
                </div>
                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>对应业务</h3>
                    </div>
                    <div className={"section-body"}>
                        <MDBDataTable
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
        customer:state.customer
    };
};

const mapDispatchToProps = dispatch =>{
    return{
        updateCustomer:(customer)=>dispatch({type:actionTypes.SAGA_UPDATE_CUSTOMERS,customer: customer}),
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(CustomerDetail);