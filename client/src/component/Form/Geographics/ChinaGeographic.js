import React, { Component } from 'react'
import connect from "react-redux/es/connect/connect";
import * as actionTypes from '../../../store/action';
import { MDBDataTable } from "mdbreact";
import "../Form.css";
import Input from "../Input/Input";
class ChinaGeographic extends Component{
    constructor(props){
        super(props);
        this.state={
            china_geo:null,
            add:false
        };
    }

    componentWillMount() {
        this.props.getChinaGeo();
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.china_geo){
            this.setState({
                china_geo:nextProps.china_geo
            })
        }
    }
    handleAddChange(e){
        const { name, value } = e.target;
        this.setState((prevState)=>({
            ...prevState,
            new_geo:{
                ...prevState.new_geo,
                [name]:value
            }
        }));
    }

    handleAddSubmit(e){
        this.props.addChinaGeo(this.state.new_geo);
        this.setState({
            new_geo:{
                city:"",
                province:"",
                region:"",
            }
        })
    }
    handleChange(index, e) {
        const { name, value } = e.target;
        const temp = this.props.china_geo;
        temp[index][name] = value;
        this.setState({
            china_geo:temp
        })
    }
    handleAdd(){
        this.setState({
            add:true,
            new_geo:{
                city:"",
                province:"",
                region:"",
            }
        })
    }
    handleSubmit(){
        this.props.updateChinaGeo(this.state.china_geo);
    }
    render(){
        console.log("geo state", this.state.china_geo);
        const columns = [
            {
                label: '城市',
                field: 'city',
                sort: 'asc',

            },
            {
                label: '省份',
                field: 'province',
                sort: 'asc',

            },
            {
                label: '区域',
                field: 'region',
                sort: 'asc',
            },
            {
                label: '',
                field: 'deleteButton',
                sort: 'asc'
            }
        ];
        let rows = null;
        if(this.state.china_geo){
            rows = this.state.china_geo.map((geo, index)=>{
                console.log("GEO", geo);
                return({
                    city: <input className={"mdb-editable"} type={"text"} name={"city"} onChange={this.handleChange.bind(this,index)} value={geo.city}/>,
                    province:<input className={"mdb-editable"} type={"text"} name={"province"} onChange={this.handleChange.bind(this,index)} value={geo.province}/>,
                    region: <input className={"mdb-editable"} type={"text"} name={"region"} onChange={this.handleChange.bind(this,index)} value={geo.region}/>,
                    delete: <button onClick={this.props.optionPopUp.bind(this, ["删除方式？"],[{name:"彻底删除",handler:this.props.deleteChinaGeo.bind(this,geo.id)}])} className={"btn btn-danger"}>删除</button>
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
                        <h3>中国地理管理</h3>
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
                                <button className={"btn btn-primary"} onClick={this.handleAdd.bind(this)}>添加城市</button>
                                <button className={"btn btn-primary"} onClick={this.handleSubmit.bind(this)}>更新</button>
                            </div>
                        </div>
                    </div>
                    <hr className={"style1"}/>
                    {
                        this.state.add?<div className={"section-body"}>
                            <table className={"business-detail-table"}>
                                <thead/>
                                <tbody>
                                <tr>
                                    <td>
                                        <Input
                                            label={"城市"}
                                            type={"text"}
                                            name={"city"}
                                            value={this.state.new_geo.city}
                                            handleChange={this.handleAddChange.bind(this)}
                                        />
                                    </td>
                                    <td>
                                        <Input
                                            label={"省份"}
                                            type={"text"}
                                            name={"province"}
                                            value={this.state.new_geo.province}
                                            handleChange={this.handleAddChange.bind(this)}
                                        />
                                    </td>
                                    <td>
                                        <Input
                                            label={"区域"}
                                            type={"text"}
                                            name={"region"}
                                            value={this.state.new_geo.region}
                                            handleChange={this.handleAddChange.bind(this)}
                                        />
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <div className={"footer"}>
                                <div className={"form-confirmation button-group"}>
                                    <button className={"btn btn-primary"} onClick={this.handleAddSubmit.bind(this)}>确认添加</button>
                                </div>
                            </div>
                        </div>:null
                    }
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return{
        user:state.user,
        china_geo:state.china_geo,
    };
};

const mapDispatchToProps = dispatch =>{
    return{
        getChinaGeo:()=>dispatch({type:actionTypes.SAGA_GET_CHINA_GEO}),
        updateChinaGeo: (detail) => dispatch({type:actionTypes.SAGA_UPDATE_CHINA_GEOGRAPHIC, detail:detail}),
        addChinaGeo: (detail) => dispatch({type:actionTypes.SAGA_ADD_CHINA_GEOGRAPHIC, detail:detail}),
        deleteChinaGeo:(id)=>dispatch({type:actionTypes.SAGA_DELETE_CHINA_GEOGRAPHIC,id:id}),
        optionPopUp:(message,option)=>dispatch({type:actionTypes.OPTION_POP_UP, message:message,option:option}),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChinaGeographic);