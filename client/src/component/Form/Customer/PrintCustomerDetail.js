import React, { Component } from 'react';
import ReactToPrint from 'react-to-print';
import * as actionTypes from "../../../store/action";
import connect from "react-redux/es/connect/connect";
import { withRouter } from 'react-router-dom';
import "./PrintCustomerDetail.css";

class PrintCustomerDetail extends Component{
    constructor(props){
        super(props);
        this.state={
        }
    }
    componentWillMount() {
        try{
            this.setState(this.props.location.state);
        }
        catch{
            this.props.history.push("/customer");
        }
    }
    render() {
        const info = this.state.detail;
        console.log("PRINT PROP",info);
        return(
            <div className={"print-wrapper"}>
                <div className={"print-header"}>
                    加诺咨询-加拿大境内客户信息收集表
                </div>
                <div className={"print-body"}>
                    <div className={"flex-table"}>
                        <div className={"flex-row"}>
                            <div className={"flex-cell"}>
                                基本信息
                            </div>
                        </div>
                        <div className={"flex-row"}>
                            <div className={"flex-cell label"}>
                                姓名
                            </div>
                            <div className={"flex-cell"}>
                                {info.detail.name}
                            </div>
                            <div className={"flex-cell label"}>
                                曾用名
                            </div>
                            <div className={"flex-cell"}>
                                {info.detail.used_name}
                            </div>
                            <div className={"flex-cell label"}>
                                性别
                            </div>
                            <div className={"flex-cell"}>
                                {info.detail.gender}
                            </div>
                        </div>
                        <div className={"flex-row"}>
                            <div className={"flex-cell label"}>
                                出生日期
                            </div>
                            <div className={"flex-cell"}>
                                {info.detail.dob}
                            </div>
                            <div className={"flex-cell label"}>
                                出生地
                            </div>
                            <div className={"flex-cell"}>
                                {info.birth_geo.city+", "+info.birth_geo.province+", "+info.birth_geo.region}
                            </div>
                        </div>
                        <div className={"flex-row"}>
                            <div className={"flex-cell label"}>
                                电话
                            </div>
                            <div className={"flex-cell"}>
                                {info.detail.phone}
                            </div>
                            <div className={"flex-cell label"}>
                                邮箱
                            </div>
                            <div className={"flex-cell"}>
                                {info.detail.email}
                            </div>
                        </div>
                        <div className={"flex-row"}>
                            <div className={"flex-cell label"}>
                                国籍
                            </div>
                            <div className={"flex-cell"}>
                                {info.detail.citizenship}
                            </div>
                            <div className={"flex-cell label"}>
                                中国身份证号码
                            </div>
                            <div className={"flex-cell"}>
                                {info.detail.identification_number}
                            </div>
                        </div>
                        <div className={"flex-row"}>
                            <div className={"flex-cell label"}>
                                护照号码
                            </div>
                            <div className={"flex-cell"}>
                                {info.detail.passport_number}
                            </div>
                            <div className={"flex-cell label"}>
                                护照到期日
                            </div>
                            <div className={"flex-cell"}>
                                {info.detail.passport_due}
                            </div>
                        </div>
                        <div className={"flex-row"}>
                            <div className={"flex-cell label"}>
                                在加身份
                            </div>
                            <div className={"flex-cell"}>
                                {info.detail.visa_type}
                            </div>
                            <div className={"flex-cell label"}>
                                签证到期日
                            </div>
                            <div className={"flex-cell"}>
                                {info.detail.visa_due}
                            </div>
                        </div>
                        <div className={"flex-row"}>
                            <div className={"flex-cell label"}>
                                加拿大UCI号码
                            </div>
                            <div className={"flex-cell"}>
                                {info.detail.uci_number}
                            </div>
                            <div className={"flex-cell label"}>
                                中国现居地址
                            </div>
                            <div className={"flex-cell"}>
                                {info.china_geo.city+", "+info.china_geo.province+", "+info.china_geo.region}
                            </div>
                        </div>
                        <div className={"flex-row"}>
                            <div className={"flex-cell label"}>
                                加拿大现居地址
                            </div>
                            <div className={"flex-cell"}>
                                {info.detail.canada_address}
                            </div>
                            <div className={"flex-cell label"}>
                                加拿大现址邮编
                            </div>
                            <div className={"flex-cell"}>
                                {info.detail.postal_code}
                            </div>
                        </div>
                    </div>
                    <div className={"flex-table"}>
                        <div className={"flex-row"}>
                            <div className={"flex-cell label"}>
                                客户
                            </div>
                            <div className={"flex-cell"}>
                                {info.detail.name}
                            </div>
                            <div className={"flex-cell label"}>
                                信息收集人
                            </div>
                            <div className={"flex-cell"}>
                            </div>
                        </div>
                        <div className={"flex-row large-row"}>
                            <div className={"flex-cell label"}>
                                客户签字
                            </div>
                            <div className={"flex-cell to-fill"}>
                                <small>请与护照签名一致</small>
                            </div>
                            <div className={"flex-cell label"}>
                                日期
                            </div>
                            <div className={"flex-cell to-fill"}>
                                <small>YYYY-MM-DD</small>
                            </div>
                        </div>
                        <div className={"flex-row large-row"}>
                            <div className={"flex-cell label"}>
                                信息收集人签字
                            </div>
                            <div className={"flex-cell"}>
                            </div>
                            <div className={"flex-cell label"}>
                                日期
                            </div>
                            <div className={"flex-cell to-fill"}>
                                <small>YYYY-MM-DD</small>
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
    };
};

const mapDispatchToProps = dispatch =>{
    return{
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(PrintCustomerDetail);
