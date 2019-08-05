import React, { Component } from 'react';
import DropDown from '../../DropDown/DropDown';
import '../../Form.css';
import Input from "../../Input/Input";
import connect from "react-redux/es/connect/connect";

class Sales extends Component{
    constructor(props){
        super(props);
        this.state={
            service_category: "not_selected",
            service_specification: "not_selected",
            service_level: "not_selected",
            visa_government_fee: 150.00,
            visa_payment_method:"not_selected",
            visa_company_fee: '',
            temporary_visa_government_fee: 100.00,
            temporary_visa_payment_method:"not_selected",
            temporary_visa_company_fee: '',
            mailing_fee: 50.00,
            mailing_method:"not_selected",
            mailing_company_fee: '',
            service_fee: 0,
            other_fee: 0,
            total_fee: 0,
            confirmed: false,
            service_completion:0,
            visa_completion:0,
            temporary_visa_completion:0,
            mailing_completion:0,
            total_completion:0,
            max_total:30
        };
        this.handleChange = this.handleChange.bind(this);
    }
    updateCompletion(input, updating){
        const update = Object.keys(input).map((key)=>{
            let complete = true;
            let value = input[key].value;
            let variable = input[key].variable;
            for(let i=0;i<variable.length;i++){
                if(variable[i]!==updating){
                    if(this.state[variable[i]] === "not_selected" || this.state[variable[i]] === null){
                        complete = false;
                        break;
                    }
                }
                else{
                    console.log("variable",variable[i]);
                    console.log("updating",updating);
                    if(this.state[variable[i]] !== "not_selected"){

                        console.log("variable",variable[i]);
                        console.log("updating",updating);
                        complete = false;
                        break;
                    }
                }

            }
            console.log("key:",key,"value:",value,"complete:",complete);

            if(complete&&this.state[key]!==value){
                this.setState((prevState) => ({
                    [key]:value,
                    total_completion: prevState.total_completion + value
                }));
            }
            else if(!complete&&this.state[key]===value){
                this.setState((prevState) => ({
                    [key]:0,
                    total_completion: prevState.total_completion - value
                }));
            }
        });

    }
    handleChange(e){
        const { name, value } = e.target;
        switch (name){
            case "visa_payment_method":
                if(value === "company_credit"){
                    this.setState({["visa_company_fee"]: this.state.visa_government_fee});
                }
                else if(value === "personal_credit"){
                    this.setState({["visa_company_fee"]: 0});
                }
                break;

            case "temporary_visa_payment_method":
                if(value === "company_credit"){
                    this.setState({["temporary_visa_company_fee"]: this.state.temporary_visa_government_fee});
                }
                else if(value === "personal_credit"){
                    this.setState({["temporary_visa_company_fee"]: 0});
                }
                break;

            case "mailing_method":
                if(value === "company"){
                    this.setState({["mailing_company_fee"]: this.state.mailing_fee});
                }
                else if(value === "personal"){
                    this.setState({["mailing_company_fee"]: 0});
                }
                break;
            default:
                break;
        }
        this.setState((prevState) => ({
            [name]: value,
            total_fee:
                (prevState.mailing_company_fee!==""?parseFloat(prevState.mailing_company_fee):0)
                +  (prevState.visa_company_fee!==""?parseFloat(prevState.visa_company_fee):0)
                +  (prevState.temporary_visa_company_fee!==""?parseFloat(prevState.temporary_visa_company_fee):0)
        }));
        if(this.state.confirmed) {
            this.setState((prevState) => ({
                confirmed: false,
                total_completion: prevState.total_completion - 10
            }));
        }
        console.log(this.state[name],value);
        this.updateCompletion({
            service_completion:{value:5, variable:["service_category","service_specification","service_level"]},
            visa_completion:{value:5, variable:["visa_payment_method"]},
            temporary_visa_completion:{value:5, variable:["temporary_visa_payment_method"]},
            mailing_completion:{value:5, variable:["mailing_method"]},
        }, name);
        this.props.updateOverallState.bind("total_fee",this.state.total_fee);
    }
    handleSubmit(){
        if(!this.state.confirmed){
            this.setState((prevState) => ({
                confirmed:true,
                total_completion: prevState.total_completion + 10
            }));
        }
    }
    render(){
        return(
            <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>业务员操作界面</h3>
                    </div>
                    <hr className={"style1"}/>
                    <div className={"section-body"}>
                        <div className={"row"}>
                            <DropDown
                                label={"业务类别"}
                                value={this.state.service_category}
                                name={"service_category"}
                                options={{
                                    not_selected:"",
                                    visa_application: "签证申请",
                                    school_application: "学校申请",
                                    immigration_application: "移民申请",
                                    notarization_exchange: "换发公证",
                                    others: "其他"
                                }}
                                handleChange={this.handleChange}
                            />
                            <DropDown
                                label={"具体业务"}
                                value={this.state.service_specification}
                                name={"service_specification"}
                                options={{
                                    not_selected:"",
                                    base_value: "基础值取自",
                                    backend_modification: "后台修改",
                                    basic_data: "基础数据",
                                    visa_service_fee: "签证业务价格",
                                }}
                                handleChange={this.handleChange}
                            />
                            <DropDown
                                label={"业务等级"}
                                value={this.state.service_level}
                                name={"service_level"}
                                options={{
                                    not_selected:"",
                                    normal: "普通",
                                    special: "特殊",
                                }}
                                handleChange={this.handleChange}
                            />
                        </div>
                        <div className={"row"}>
                            <Input
                                label={"签证政府费"}
                                name={"visa_government_fee"}
                                value={this.state.visa_government_fee}
                                type={"number"}
                                step={".01"}
                                handleChange={this.handleChange}
                                disabled={true}
                            />
                            <DropDown
                                label={"支付方式"}
                                value={this.state.visa_payment_method}
                                name={"visa_payment_method"}
                                options={{
                                    not_selected:"",
                                    company_credit: "公司信用卡",
                                    personal_credit: "客人信用卡",
                                }}
                                handleChange={this.handleChange}
                            />
                            <Input
                                label={"公司收费"}
                                name={"visa_company_fee"}
                                value={this.state.visa_company_fee}
                                type={"number"}
                                step={".01"}
                                handleChange={this.handleChange}
                                disabled={true}
                            />
                        </div>
                        <div className={"row"}>
                            <Input
                                label={"小签政府费"}
                                name={"temporary_visa_government_fee"}
                                value={this.state.temporary_visa_government_fee}
                                type={"number"}
                                step={".01"}
                                handleChange={this.handleChange}
                                disabled={true}
                            />
                            <DropDown
                                label={"支付方式"}
                                value={this.state.temporary_visa_payment_method}
                                name={"temporary_visa_payment_method"}
                                options={{
                                    not_selected:"",
                                    company_credit: "公司信用卡",
                                    personal_credit: "客人信用卡",
                                }}
                                handleChange={this.handleChange}
                            />
                            <Input
                                label={"公司收费"}
                                name={"temporary_visa_company_fee"}
                                value={this.state.temporary_visa_company_fee}
                                type={"number"}
                                step={".01"}
                                handleChange={this.handleChange}
                                disabled={true}
                            />
                        </div>
                        <div className={"row"}>
                            <Input
                                label={"邮寄费"}
                                name={"mailing_fee"}
                                value={this.state.mailing_fee}
                                type={"number"}
                                step={".01"}
                                handleChange={this.handleChange}
                                disabled={true}
                            />
                            <DropDown
                                label={"邮寄方式"}
                                value={this.state.mailing_method}
                                name={"mailing_method"}
                                options={{
                                    not_selected:"",
                                    company: "公司邮寄",
                                    personal: "客人邮寄",
                                }}
                                handleChange={this.handleChange}
                            />
                            <Input
                                label={"公司收费"}
                                name={"mailing_company_fee"}
                                value={this.state.mailing_company_fee}
                                type={"number"}
                                step={".01"}
                                handleChange={this.handleChange}
                                disabled={true}
                            />
                        </div>
                        <div className={"row"}>
                            <Input
                                label={"服务费"}
                                name={"service_fee"}
                                value={this.state.service_fee}
                                type={"number"}
                                step={".01"}
                                handleChange={this.handleChange}
                                disabled={true}
                            />
                            <Input
                                label={"其他"}
                                name={"other_fee"}
                                value={this.state.other_fee}
                                type={"number"}
                                step={".01"}
                                handleChange={this.handleChange}
                                disabled={true}
                            />
                            <Input
                                label={"收费总计"}
                                name={"total_fee"}
                                value={this.state.total_fee}
                                type={"number"}
                                step={".01"}
                                handleChange={this.handleChange}
                                disabled={true}
                            />
                        </div>
                        <div className={"footer"}>
                            <div className={"form-confirmation button-group"}>
                                <small>完成值: {Math.round(this.state.total_completion/this.state.max_total*100)}%</small>
                                <small>目前状态:{this.state.confirmed?"已认证":"未认证"}</small>
                                <button className={"btn btn-primary"} onClick={this.handleSubmit.bind(this)}>业务员认证</button>
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
    };
};
export default connect(mapStateToProps, null)(Sales);