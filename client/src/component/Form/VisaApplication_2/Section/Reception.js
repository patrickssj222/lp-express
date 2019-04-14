import React, { Component } from 'react';
import DropDown from '../../DropDown/DropDown';
import '../../Form.css';
import Input from "../../Input/Input";
import connect from "react-redux/es/connect/connect";

class Reception extends Component{x
    constructor(props){
        super(props);
        this.state={
            payment:[{amount:"", method:"",date:""}],
            //10% on 0
            balance:this.props.total_fee,
            special:false,

            //10% on confirm
            confirmed: false,
            //5% on select
            copywriting_selection:"not_selected",
            current_copywriting_salary:"",
            special_comment:"",
            passport_send_date:"",
            passport_return_date:"",
            passport_status:"waiting",

            payment_completion:0,
            total_completion:0,
            max_total:35
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
                    if(this.state[variable[i]] === "not_selected" || this.state[variable[i]] === null || this.state[variable[i]] === ""){
                        complete = false;
                        break;
                    }
                }
                else{
                    console.log("variable",variable[i]);
                    console.log("updating",updating);
                    if(this.state[variable[i]] !== "not_selected" && this.state[variable[i]] !== null && this.state[variable[i]] !== ""){

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
        this.setState({[name]: value});
        if(this.state.confirmed) {
            this.setState((prevState) => ({
                confirmed: false,
                total_completion: prevState.total_completion - 10
            }));
        }
        this.updateCompletion({
            service_completion:{value:10, variable:["first_time_payment","payment_method","payment_date"]},
        }, name);
    }
    handleFeeChange(e, index){
        const { name, value } = e.target;
        const payment = this.state.payment;
        payment[index] = {[name]:value};
        this.setState({payment:payment});
    }
    handleSubmit(){
        if(!this.state.confirmed){
            let balance = this.state.balance;
            for(let i =0; i<this.state.payment.length;i++){
                balance = balance - this.state.payment[i].amount;
            }
            let payment = this.state.payment;
            if(balance>0){
                payment.push({amount:"", method:"",date:""});
            }
            this.setState((prevState) => ({
                confirmed:true,
                total_completion: prevState.total_completion + 10,
                balance:balance,
                payment:payment
            }));

        }
    }

    handleSpecial(){
        if(!this.state.special){
            this.setState({special:true});
        }
    }
    render(){
        return(
            <div className={"section-wrapper"}>
                <div className={"section-header"}>
                    <h3>收款员操作界面</h3>
                </div>
                <hr className={"style1"}/>
                <div className={"section-body"}>
                    {
                        this.state.payment.map((item,index)=>{
                            return(
                                <div key={index}>
                                    <div className={"row"}>
                                        <Input
                                            label={"缴费"}
                                            name={"amount"}
                                            value={item.amount}
                                            type={"number"}
                                            step={".01"}
                                            handleChange={this.handleFeeChange.bind(this,index)}
                                        />
                                        <DropDown
                                            label={"缴费方式"}
                                            value={item.method}
                                            name={"method"}
                                            options={{
                                                not_selected:"",
                                                cash: "现金",
                                                emt: "电子转账",
                                                debit: "银行卡(Debit)",
                                                cheque: "支票",
                                            }}
                                            handleChange={this.handleFeeChange.bind(this,index)}
                                        />
                                        <Input
                                            label={"缴费日期"}
                                            name={"date"}
                                            value={item.date}
                                            type={"date"}
                                            handleChange={this.handleFeeChange.bind(this,index)}
                                        />
                                    </div>
                                    <div className={"footer"}>
                                        <div className={"form-confirmation button-group"}>
                                            <button className={"btn btn-primary"} onClick={this.handleSubmit.bind(this)}>确认缴费</button>
                                            <button className={"btn btn-primary"} onClick={this.handleSpecial.bind(this)}>特殊情况</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }

                    <div className={"row"}>
                        <Input
                            label={"余款"}
                            name={"balance"}
                            value={this.state.balance}
                            type={"number"}
                            step={".01"}
                            handleChange={this.handleChange}
                            disabled={true}
                        />
                        <DropDown
                            label={"选择文案"}
                            value={this.state.copywriting_selection}
                            name={"copywriting_selection"}
                            options={{
                                not_selected:"",
                            }}
                            handleChange={this.handleChange}
                        />
                        <Input
                            label={"当前文案工资值"}
                            name={"current_copywriting_salary"}
                            value={this.state.current_copywriting_salary}
                            type={"number"}
                            step={".01"}
                            handleChange={this.handleChange}
                            disabled={true}
                        />
                    </div>
                    {
                        this.state.special &&
                        <div className={"row"}>
                            <Input
                                label={"特殊情况备注"}
                                name={"special_comment"}
                                value={this.state.special_comment}
                                type={"text"}
                                handleChange={this.handleChange}
                            />
                        </div>
                    }
                    <div className={"row"}>
                        <Input
                            label={"护照寄出日期"}
                            name={"passport_send_date"}
                            value={this.state.passport_send_date}
                            type={"date"}
                            handleChange={this.handleChange}
                        />
                        <Input
                            label={"护照寄回日期"}
                            name={"passport_return_date"}
                            value={this.state.passport_return_date}
                            type={"date"}
                            handleChange={this.handleChange}
                        />
                        <DropDown
                            label={"护照状态"}
                            value={this.state.passport_status}
                            name={"passport_status"}
                            options={{
                                waiting: "等待",
                                received: "收到",
                            }}
                            handleChange={this.handleChange}
                        />
                    </div>
                    <div className={"footer"}>
                        <div className={"form-confirmation button-group"}>
                            <small>完成值: {Math.round(this.state.total_completion/this.state.max_total*100)}%</small>
                            <small>目前状态:{this.state.confirmed?"已认证":"未认证"}</small>
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
export default connect(mapStateToProps, null)(Reception);