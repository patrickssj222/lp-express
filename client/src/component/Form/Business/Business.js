import React, { Component } from 'react'
import connect from "react-redux/es/connect/connect";
import * as actionTypes from '../../../store/action';
import { MDBDataTable } from "mdbreact";
import "../Form.css";
import {withRouter} from "react-router-dom";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';

class Business extends Component{

    headRows = [
        {id: "customer_name", numeric: false, disablePadding: true, label: "客户姓名"},
        {id: "service_type", numeric: true, disablePadding: false, label: "业务类别"},
        {id: "service_name", numeric: true, disablePadding: false, label: "具体业务"},
        {id: "total_fee", numeric: true, disablePadding: false, label: "总共费用"},
        {id: "progress", numeric: true, disablePadding: false, label: "业务状态"},
        {id: "wenan", numeric: true, disablePadding: false, label: "负责文案"}
    ];

    constructor(props){
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 10,
            order: "asc",
            orderBy: "customer_name",
            textValue: "",
        }
    }

    handleChangePage = (event, newPage) => {
        this.setState({
            page: newPage,
        });
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({
            rowsPerPage: event.target.value,
            page: 0,
        });
    };

    handleChangeSearch = (event) => {
        this.setState({
            textValue: event.target.value,
        });
    };

    searchbyName(array, text) {
        var filteredrow = [];
        Object.keys(array).forEach((index)=>{
            if (array[index].customer_name.includes(text) || array[index].service_type.includes(text) || array[index].service_name.includes(text) || 
                array[index].total_fee.includes(text) || array[index].progress.includes(text) || array[index].wenan.includes(text)){
                filteredrow.push(array[index])
            }
        })
        return filteredrow;
    }

    stableSort(array, order, orderBy){
        if (orderBy === 'customer_name'){
            return order === 'asc' ? array.sort((x,y)=>x.customer_name.localeCompare(y.customer_name, 'zh-CN')) : array.sort((x,y)=>y.customer_name.localeCompare(x.customer_name, 'zh-CN'));
        } else if (orderBy === 'service_type'){
            // need change
            return order === 'asc' ? array.sort((x,y)=>x.customer_name.localeCompare(y.customer_name, 'zh-CN')) : array.sort((x,y)=>y.customer_name.localeCompare(x.customer_name, 'zh-CN'));
        } else if (orderBy === 'service_name'){
           // need change
           return order === 'asc' ? array.sort((x,y)=>x.customer_name.localeCompare(y.customer_name, 'zh-CN')) : array.sort((x,y)=>y.customer_name.localeCompare(x.customer_name, 'zh-CN'));
        } else if (orderBy === 'total_fee'){
            // need change
            return order === 'asc' ? array.sort((x,y)=>x.customer_name.localeCompare(y.customer_name, 'zh-CN')) : array.sort((x,y)=>y.customer_name.localeCompare(x.customer_name, 'zh-CN'));
        } else if (orderBy === 'progress'){
            // need change
            return order === 'asc' ? array.sort((x,y)=>x.customer_name.localeCompare(y.customer_name, 'zh-CN')) : array.sort((x,y)=>y.customer_name.localeCompare(x.customer_name, 'zh-CN'));
        } else if (orderBy === 'wenan'){
            // need change
            return order === 'asc' ? array.sort((x,y)=>x.customer_name.localeCompare(y.customer_name, 'zh-CN')) : array.sort((x,y)=>y.customer_name.localeCompare(x.customer_name, 'zh-CN'));
        } else {
            return order === 'asc' ? array.sort((x,y)=>x.customer_name.localeCompare(y.customer_name, 'zh-CN')) : array.sort((x,y)=>y.customer_name.localeCompare(x.customer_name, 'zh-CN'));
        }
    }

    createSortHandler = property => event => {
        this.handleRequestSort(event, property);
    };

    handleRequestSort(event, property) {
        const isDesc = this.state.orderBy === property && this.state.order === 'desc';
        const order = isDesc ? 'asc' : 'desc';
        this.setState({
            order: order,
            orderBy: property,
        });
    }

    componentWillMount() {
        this.props.getBusiness();
    }

    /*
    handleRedirect(path, id){
        this.props.history.push({
            pathname: path,
            state:{id:id}
        })
    }*/
    handleClick(event, id){
        this.props.history.push({
            pathname: '/business/detail',
            state: { id:id }
        })
    }

    render(){
        let rows = null;
        if(this.props.business!=null){
            const business = this.props.business;
            rows = Object.keys(business).map((index)=>{
                return({
                    customer_name: business[index].customer_name,
                    service_type: business[index].service_type!=null?business[index].service_type:"",
                    service_name: business[index].service_name!=null?business[index].service_name:"",
                    total_fee: business[index].total_fee!=null?business[index].total_fee:"",
                    progress: business[index].progress!=null?business[index].progress:"",
                    wenan: business[index].wenan!=null?business[index].wenan:"",
                    index: index,
                    id: business[index].id,
                })
            });
        }
        if (rows){
            rows = this.searchbyName(rows, this.state.textValue);
        }
        return(
            <div className={"form-wrapper content-wrapper"}>
                <div className={"section-wrapper"}>
                    <div className={"section-header"}>
                        <h3>
                            业务列表
                            <input className='searchStyle'
                            placeholder="Search"
                            onChange={this.handleChangeSearch}
                            value={this.state.textValue}/>
                        </h3>
                    </div>
                    <hr className={"style1"}/>
                    <div className={"section-body"}>
                        { rows &&
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 50]}
                                component="div"
                                count={rows.length}
                                rowsPerPage={this.state.rowsPerPage}
                                page={this.state.page}
                                backIconButtonProps={{
                                    'aria-label': 'previous page',
                                }}
                                nextIconButtonProps={{
                                    'aria-label': 'next page',
                                }}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                            />
                        }
                        <Paper>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {this.headRows.map(row => (
                                            <TableCell className='fixedWidth'
                                                key={row.id}
                                                align={row.numeric ? "left" : "inherit"}
                                                sortDirection={this.state.orderBy === row.id ? this.state.order : false}
                                            >
                                            { <TableSortLabel
                                                        active={this.state.orderBy === row.id}
                                                        direction={this.state.order}
                                                        onClick={this.createSortHandler(row.id)}
                                                    >
                                                {row.label}
                                                </TableSortLabel>
                                            }
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                            <TableBody>
                                {rows &&
                                this.stableSort(rows, this.state.order, this.state.orderBy)
                                .slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage)
                                .map(row => (
                                    <TableRow hover onClick={event => this.handleClick(event, row.id)} className='ChangePointer' key={row.index}>
                                        <TableCell component="th" scope="row"> {row.customer_name}</TableCell>
                                        <TableCell align="left">{row.service_type}</TableCell>
                                        <TableCell align="left">{row.service_name}</TableCell>
                                        <TableCell align="left">{row.total_fee}</TableCell>
                                        <TableCell align="left">{row.progress }</TableCell>
                                        <TableCell align="left">{row.wenan }</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        </Paper>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Business));