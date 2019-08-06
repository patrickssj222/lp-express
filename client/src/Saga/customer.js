import * as actionTypes from '../store/action';
import {takeEvery, put,call,delay,select} from 'redux-saga/effects';
import axios from 'axios';
import React from "react";
import {getCustomers} from "./request";
import {getAllUsers} from "./users";
function findNested (obj, key, value){
    // Base case
    if (obj[key] === value) {
        return obj;
    } else {
        for (let i = 0, len = Object.keys(obj).length; i < len; i++) {
            const next_obj = obj[Object.keys(obj)[i]];
            if (typeof next_obj == 'object') {
                let found = findNested(next_obj, key, value);
                if (found) {
                    // If the object was found in the recursive call, bubble it up.
                    return found;
                }
            }
        }
    }
}

function* populateSet(action){
    const state = yield select();
    const columns = [
        {
            label: '姓名',
            field: 'name',
            sort: 'asc',
        },
        {
            label: '电话',
            field: 'phone',
            sort: 'asc',
        },
        {
            label: '护照到期日',
            field: 'passport_due',
            sort: 'asc',
        },
        {
            label: '签证到期日',
            field: 'visa_due',
            sort: 'asc',
        },
        {
            label: '上次更新时间',
            field: 'update_time',
        },
        {
            label: '规划师',
            field: 'created_by',
            sort: 'asc',
        },
    ];
    let rows = null;
    let customer_pushed = null;
    if(state.customer!=null){
        rows = [];
        customer_pushed = [];
        const customer = state.customer;
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
            if(state.users_list){
                const user = findNested(state.users_list, "id", customer[index].created_by);
                if(!findNested(customer_pushed,"id",customer[index].id)) {
                    customer_pushed.push(customer[index]);
                    rows.push({
                            name: customer[index].name,
                            phone: customer[index].phone != null ? customer[index].phone : "",
                            passport_due: passport_due,
                            visa_due: visa_due,
                            update_time: customer[index].update_time,
                            created_by: user ? user.name : "",
                            clickEvent: ()=> {
                                action.history.push({
                                    pathname: "/customer/detail",
                                    state: {index: index}
                                })
                            }
                        }
                    )
                }
            }
        });
    }
    return {
        columns:columns,
        rows:rows
    };

}


function* adminDataSet(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["正在生成公司客户列表..."],onExit:null});
    const state = yield select;
    if(!state.users_list){
        yield call(getAllUsers);
    }
    yield call(getCustomers);
    const data = yield populateSet(action);
    yield put({type:actionTypes.SET_ADMIN_DATASET, admin_dataset:data});
    yield put({type:actionTypes.REMOVE_POP_UP});
}

export function* watchSagaCustomerRequests() {
    yield takeEvery(actionTypes.SAGA_ADMIN_DATASET, adminDataSet);
}