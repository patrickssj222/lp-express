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
                    加诺资讯-加拿大境内客户信息收集表
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
