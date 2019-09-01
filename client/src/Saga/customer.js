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
                rows.push({
                        name: customer[index].name,
                        phone: customer[index].phone != null ? customer[index].phone : "",
                        passport_due: passport_due,
                        visa_due: visa_due,
                        update_time: customer[index].update_time,
                        created_by:customer[index].user_name,
                        clickEvent: ()=> {
                            action.history.push({
                                pathname: "/customer/detail",
                                state: {index: index}
                            })
                        }
                    }
                )
            }
        });
    }
    return {
        columns:columns,
        rows:rows
    };

}


function* getAdminDataSet(action){
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

function* findCustomer(data){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["搜索对应客户..."],onExit:null});
    try {
        const response = yield call(axios, {
            method: 'POST',
            url: '/api/customers/find',
            data: data,
        });
        if(response.data.status>=200 && response.data.status<300){
            yield put({type:actionTypes.REMOVE_POP_UP});
            return response.data.response;
        }
        else{
            yield put({type:actionTypes.POP_UP, status:"failure", message:["Error: "+response.data.error.message],onExit:null});
        }
    }
    catch(e){
        yield put({type:actionTypes.POP_UP, status:"failure", message:["搜索客户时出现意外, 请确认网络链接."],onExit:null});
    }
}

function* unlockCustomers(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["正在解锁客户..."],onExit:null});
    let check = true;
    let missing = "";
    if(action.customer.name===""){
        check = false;
        missing = missing+"姓名 ";
    }
    if(action.customer.gender===""){
        check = false;
        missing = missing+"性别 ";
    }
    if(action.customer.dob===""){
        check = false;
        missing = missing+"出生日期 ";
    }
    if(action.customer.passport_number===""){
        check = false;
        missing = missing+"护照号码 ";
    }
    console.log(check);
    if(!check){
        yield put({type:actionTypes.POP_UP, status:"failure", message:["请填入 "+missing+"信息."],onExit:null});
    }
    else{
        const result = yield findCustomer(action.customer);
        if(result.length === 0){
            yield put({type:actionTypes.POP_UP, status:"failure", message:["数据库内没有对应客户."],onExit:null});
        }
        else{
            check = true;
            result.forEach((item)=>{
                if(item.created_by === action.user.id){
                    check = false;
                }
            });
            if(!check){
                yield put({type:actionTypes.POP_UP, status:"failure", message:["你已解锁过此客户."],onExit:null});
            }
            else{
                try {
                    const response = yield call(axios, {
                        method: 'POST',
                        url: '/api/customers/add/customer_user',
                        data: {customer_id:result[0].id, user_id:action.user.id},
                    });
                    if(response.data.status>=200 && response.data.status<300){
                        yield put({type:actionTypes.POP_UP, status:"success", message:["成功解锁客户"],onExit:"/customer"});
                    }
                    else{
                        yield put({type:actionTypes.POP_UP, status:"failure", message:["Error: "+response.data.error.message],onExit:null});
                    }
                }
                catch(e){
                    yield put({type:actionTypes.POP_UP, status:"failure", message:["解锁客户时出现意外, 请确认网络链接."],onExit:null});
                }
            }
        }
    }
    console.log(action);
}

function* addCustomers(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["添加新客户..."],onExit:null});
    let check = true;
    let missing = "";
    if(action.customer.name=== "") {
        yield put({type:actionTypes.POP_UP, status:"failure", message:["请填入客户姓名."],onExit:null});
        check = false;
    }
    if(action.customer.passport_number && action.customer.passport_number!==""){
        const find = yield findCustomer({passport_number:action.customer.passport_number})
        if(find.length>0){
            check = false;
            yield put({type:actionTypes.POP_UP, status:"failure", message:["对应护照号码的客户已存在,请通过解锁界面解锁该客户"],onExit:"/customer/unlock"});
        }
    }

    if(check){
        try{
            const response = yield call (axios, {
                method: 'POST',
                url: '/api/customers/add',
                data:action.customer,
            });
            if(response.data.status>=200 && response.data.status<300){
                yield put({type:actionTypes.POP_UP, status:"success", message:["成功添加客户"],onExit:"/customer"});
            }
            else{
                yield put({type:actionTypes.POP_UP, status:"failure", message:["Error: "+response.data.error.message],onExit:null});
            }
        }
        catch(e){
            yield put({type:actionTypes.POP_UP, status:"failure", message:["Error: Client Side Error."],onExit:null});
        }
    }

}
export function* watchSagaCustomerRequests() {
    yield takeEvery(actionTypes.SAGA_ADMIN_DATASET, getAdminDataSet);
    yield takeEvery(actionTypes.SAGA_UNLOCK_CUSTOMERS, unlockCustomers);
    yield takeEvery(actionTypes.SAGA_ADD_CUSTOMERS, addCustomers);
}