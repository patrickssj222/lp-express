import React, { Component } from 'react';
import DropDown from '../../DropDown/DropDown';
import '../../Form.css';
import Input from "../../Input/Input";
import connect from "react-redux/es/connect/connect";

class Reception extends Component{
    constructor(props){
        super(props);
        this.state={
            visa_progress: "not_selected",
            visa_submit_date:"",
            visa_expire:"",
            temp_visa_progress: "not_selected",
            temp_visa_submit_date:"",
            principal:"",
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
    handleSubmit(){
        if(!this.state.confirmed){
            this.setState((prevState) => ({
                confirmed:true,
                total_completion: prevState.total_completion + 10
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
                    <div className={"row"}>
                        <DropDown
                            label={"签证进度"}
                            value={this.state.visa_progress}
                            name={"visa_progress"}
                            options={{
                                not_selected:"",
                                cash: "现金",
                                emt: "电子转账",
                                debit: "银行卡(Debit)",
                                cheque: "支票",
                            }}
                            handleChange={this.handleChange}
                        />
                        <Input
                            label={"递交日期"}
                            name={"visa_submit_date"}
                            value={this.state.visa_submit_date}
                            type={"date"}
                            handleChange={this.handleChange}
                        />
                        <Input
                            label={"签证获批至"}
                            name={"visa_expire"}
                            value={this.state.visa_expire}
                            type={"date"}
                            handleChange={this.handleChange}
                        />
                    </div>
                    <div className={"row"}>
                        <DropDown
                            label={"小签进度"}
                            value={this.state.temp_visa_progress}
                            name={"visa_progress"}
                            options={{
                                not_selected:"",
                                cash: "现金",
                                emt: "电子转账",
                                debit: "银行卡(Debit)",
                                cheque: "支票",
                            }}
                            handleChange={this.handleChange}
                        />
                        <Input
                            label={"递交日期"}
                            name={"temp_visa_submit_date"}
                            value={this.state.temp_visa_submit_date}
                            type={"date"}
                            handleChange={this.handleChange}
                        />
                        <Input
                            label={"负责文案"}
                            name={"principal"}
                            value={this.state.principal}
                            type={"text"}
                            handleChange={this.handleChange}
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
    };
};
export default connect(mapStateToProps, null)(Reception);