import React, { Component } from 'react';
import DropDown from '../DropDown/DropDown';
import '../Form.css';
import Input from "../Input/Input";
import findObject from "../../../utility/findObject";
import CustomFormatInput from "../Input/CustomFormatInput";
import connect from "react-redux/es/connect/connect";
import update from 'immutability-helper';
import * as actionTypes from "../../../store/action";
import moment from "moment";

class WenAnDetail extends Component{
    constructor(props){
        super(props);
        this.state={
            detail:{
                id: this.props.wenan?this.props.wenan.id:null,
                business_id:this.props.business_id,
                progress:this.props.wenan?this.props.wenan.progress:"收集材料",
                visa_submit_date:this.props.wenan?this.props.wenan.visa_submit_date:"",
                visa_accept_date:this.props.wenan?this.props.wenan.visa_accept_date:"",
                wenan_id:this.props.wenan?this.props.wenan_id:this.props.user.id
            },
            clicked: {
                wenan_type: false,
                progress:false,
            },
            walevel: 0,
            new:!this.props.wenan
        };
        this.watable = ["progress"];
    };
    componentWillMount() {
    }

    addC = (name) => {
        if (!this.state.clicked[name]) {
            const newClicked = update(this.state.clicked, {
                [name]: {$set: true}
            });
            this.setState({
                clicked: newClicked
            });
            if (this.watable.includes(name)) {
                this.setState({
                    walevel: this.state.walevel + (1.0 / this.watable.length * 100.0)
                })
            }
        }
    };
    handleChange= (e) =>{
        const { name, value } = e.target;
        this.addC(name);
        this.setState((prevState) => {
            return {
                ...prevState,
                detail:{
                    ...prevState.detail,
                    [name]:value,
                }
            }
        });
    };
    handleSpecialChange = (name, value) => {
        this.addC(name);
        this.setState((prevState) => ({
            ...prevState,
            detail:{
                ...prevState.detail,
                [name]: value,
            }
        }));
    };
    handleSubmit = () =>{
        if(!this.props.wenan){
            console.log("Adding wenan: ", this.state.detail);
            this.props.addWenAnDetail(this.state.detail);
        }
        else{
            console.log("Updating wenan:", this.state.detail);
            this.props.updateWenAnDetail(this.state.detail);
        }
    };
    render(){
        return(
            <div>
                <div className={"section-wrapper"}>
                    <div className={"section-body"}>
                        <table className={"business-detail-table"}>
                            <thead/>
                            <tbody>
                            <tr>
                                <td>
                                    <DropDown
                                        label={"签证进度"}
                                        value={this.state.detail.progress}
                                        name={"progress"}
                                        options={
                                            ["收集材料","申请递交","签证获批","签证被拒"]
                                        }
                                        handleChange={this.handleChange}
                                    />
                                </td>
                                <td>
                                    <CustomFormatInput
                                        label={"递交日期"}
                                        name={"visa_submit_date"}
                                        value={this.state.detail.visa_submit_date}
                                        format={[
                                            {char: /\d/, repeat:4},
                                            { exactly: "-" },
                                            {char: /\d/, repeat:2},
                                            { exactly: "-" },
                                            {char: /\d/, repeat:2},
                                        ]}
                                        placeholder={"YYYY-MM-DD"}
                                        handleChange={this.handleSpecialChange}
                                        disabled={this.state.detail.progress !== "申请递交" && this.state.detail.progress !== "签证获批"}
                                    />
                                </td>
                                <td>
                                    <CustomFormatInput
                                        label={"获批日期"}
                                        name={"visa_accept_date"}
                                        value={this.state.detail.visa_accept_date}
                                        format={[
                                            {char: /\d/, repeat:4},
                                            { exactly: "-" },
                                            {char: /\d/, repeat:2},
                                            { exactly: "-" },
                                            {char: /\d/, repeat:2},
                                        ]}
                                        placeholder={"YYYY-MM-DD"}
                                        handleChange={this.handleSpecialChange}
                                        disabled={this.state.detail.progress !== "签证获批"}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className={"footer"}>
                    <div className={"form-confirmation button-group"}>
                        <small>完成值: {this.state.walevel}%</small>
                        <button className={"btn btn-primary"} onClick={this.handleSubmit.bind(this)}>更新文案记录</button>
                    </div>
                </div>
            </div>
        )};
}

const mapStateToProps = state => {
    return{
        user: state.user,
        business_detail: state.business_detail
    };
};

const mapDispatchToProps = dispatch => {
    return{
        addWenAnDetail:(detail)=>dispatch({type:actionTypes.SAGA_ADD_WENAN_DETAIL, detail:detail}),
        updateWenAnDetail:(detail)=>dispatch({type:actionTypes.SAGA_UPDATE_WENAN_DETAIL, detail:detail})
    }
};
export default connect(mapStateToProps,mapDispatchToProps)(WenAnDetail);