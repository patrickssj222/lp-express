import React, { Component } from 'react'
import connect from "react-redux/es/connect/connect";
import * as actionTypes from '../../../store/action';
import "../Form.css";
import {Link, withRouter} from "react-router-dom";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';

class AdminCustomer extends Component{

    headRows = [
        {id: "name", numeric: false, disablePadding: true, label: "姓名"},
        {id: "phone", numeric: true, disablePadding: false, label: "电话"},
        {id: "passport_due", numeric: true, disablePadding: false, label: "护照到期日"},
        {id: "visa_due", numeric: true, disablePadding: false, label: "签证到期日"},
        {id: "update_time", numeric: true, disablePadding: false, label: "上次更新时间"},
        {id: "planner", numeric: true, disablePadding: false, label: "规划师"}
    ];

    constructor(props){
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 10,
            order: "asc",
            orderBy: "name",
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
            if (array[index].name.includes(text) || array[index].phone.includes(text) || array[index].passport_due_raw.includes(text) || 
                array[index].visa_due_raw.includes(text) || array[index].update_time.includes(text) || array[index].planner.includes(text)){
                filteredrow.push(array[index])
            }
        })
        return filteredrow;
    }

    stableSort(array, order, orderBy){
        if (orderBy === 'name'){
            return order === 'asc' ? array.sort((x,y)=>x.name.localeCompare(y.name, 'zh-CN')) : array.sort((x,y)=>y.name.localeCompare(x.name, 'zh-CN'));
        } else if (orderBy === 'passport_due'){
            return order === 'asc' ? array.sort((x,y)=>new Date(x.passport_due_raw) - new Date(y.passport_due_raw)) : array.sort((x,y)=>new Date(y.passport_due_raw) - new Date(x.passport_due_raw))
        } else if (orderBy === 'visa_due'){
           return order === 'asc' ? array.sort((x,y)=>new Date(x.visa_due_raw) - new Date(y.visa_due_raw)) : array.sort((x,y)=>new Date(y.visa_due_raw) - new Date(x.visa_due_raw))
        } else if (orderBy === 'update_time'){
            return order === 'asc' ? array.sort((x,y)=>new Date(x.update_time) - new Date(y.update_time)) : array.sort((x,y)=>new Date(y.update_time) - new Date(x.update_time))
        } else if (orderBy === 'planner'){
            // need change
            return order === 'asc' ? array.sort((x,y)=>x.name.localeCompare(y.name, 'zh-CN')) : array.sort((x,y)=>y.name.localeCompare(x.name, 'zh-CN'));
        } else {
            return order === 'asc' ? array.sort((x,y)=>x.name.localeCompare(y.name, 'zh-CN')) : array.sort((x,y)=>y.name.localeCompare(x.name, 'zh-CN'));
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
        console.log("admin will mount");
        //this.props.getAdminDataset(this.props.history);
        this.props.getCustomers();
    }

    handleClick(event, index){
        this.props.history.push({
            pathname: '/customer/detail',
            state: { index:index }
        })
    }

    render(){
        let rows = [];
        if (this.props.customer != null){
            const customer = this.props.customer;
            Object.keys(customer).forEach((index)=>{
                let visa_due = "";
                if(customer[index].visa_due){
                    const today = new Date();
                    const offset = today.getTimezoneOffset();
                    const visa_time = new Date(customer[index].visa_due);
                    const diffTime = visa_time.getTime() - today.getTime() + (60000*offset);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if(diffDays<=90&&diffDays>=0){
                        visa_due=<div className={"blue-text"}>{customer[index].visa_due} 剩余时间:{diffDays}天</div>
                    }
                    else if(diffDays<0&&diffDays>=-90){
                        visa_due=<div className={"orange-text"}>{customer[index].visa_due}  过期时间:{Math.abs(diffDays)}天</div>
                    }
                    else if(diffDays<-90){
                        visa_due=<div className={"red-text"}>{customer[index].visa_due}</div>
                    }
                    else{
                        visa_due=customer[index].visa_due;
                    }
                }
                let passport_due = "";
                if(customer[index].passport_due){
                    const today = new Date();
                    const offset = today.getTimezoneOffset();
                    const passport_time = new Date(customer[index].passport_due);
                    const diffTime = passport_time.getTime() - today.getTime() + (60000*offset);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if(diffDays<=180&&diffDays>=0){
                        passport_due=<div className={"blue-text"}>{customer[index].passport_due} 剩余时间:{diffDays}天</div>
                    }
                    else if(diffDays<0){
                        passport_due=<div className={"orange-text"}>{customer[index].passport_due}  过期时间:{Math.abs(diffDays)}天</div>
                    }
                    else{
                        passport_due=customer[index].passport_due;
                    }
                }
                rows.push({
                    name:customer[index].name,
                    phone: customer[index].phone!=null?customer[index].phone:"",
                    passport_due: passport_due,
                    passport_due_raw: customer[index].passport_due,
                    visa_due: visa_due,
                    visa_due_raw:customer[index].visa_due,
                    update_time:customer[index].update_time,
                    index: index
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
                        <h3>客户列表
                            <input className='searchStyle'
                            placeholder="Search"
                            onChange={this.handleChangeSearch}
                            value={this.state.textValue}
                        /></h3>
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
                                                { row.id !== 'phone' ?
                                                    <TableSortLabel
                                                        active={this.state.orderBy === row.id}
                                                        direction={this.state.order}
                                                        onClick={this.createSortHandler(row.id)}
                                                    >
                                                {row.label}
                                                    </TableSortLabel> : row.label
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
                                    <TableRow hover onClick={event => this.handleClick(event, row.index)} className='ChangePointer' key={row.name}>
                                        <TableCell component="th" scope="row"> {row.name}</TableCell>
                                        <TableCell align="left">{row.phone}</TableCell>
                                        <TableCell align="left">{row.passport_due}</TableCell>
                                        <TableCell align="left">{row.visa_due}</TableCell>
                                        <TableCell align="left">{row.update_time }</TableCell>
                                        <TableCell align="left">{ }</TableCell>
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
        customer: state.customer,
        users_list:state.users_list,
        china_geo:state.china_geo,
        admin_dataset:state.admin_dataset
    };
};

const mapDispatchToProps = dispatch =>{
    return{
        getCustomers: () => dispatch({type:actionTypes.SAGA_GET_CUSTOMERS}),
        switchView: (component, payload) => dispatch({type:actionTypes.SWITCH_VIEW, component:component, payload:payload}),
        getAllUsers: () => dispatch({type:actionTypes.SAGA_GET_ALL_USERS}),
        getChinaGeo:()=>dispatch({type:actionTypes.SAGA_GET_CHINA_GEO}),
        getAdminDataset:(history)=>dispatch({type:actionTypes.SAGA_ADMIN_DATASET, history:history}),
        popUp: (status, message, action) => dispatch({type:actionTypes.POP_UP, message:message, status:status, action:action}),
        removePopUp: ()=>dispatch({type:actionTypes.REMOVE_POP_UP})
    };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AdminCustomer));