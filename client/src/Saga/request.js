import * as actionTypes from '../store/action';
import {takeEvery, put,call,delay,select} from 'redux-saga/effects';
import axios from 'axios';
import {getPriceConstants} from "./service_constants";

function* logIn(action){
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/users',
            data:{
                username: action.username,
                password: action.password
            },
        });
        if(response.data.status>=200 && response.data.status<300){
            const result = response.data.response;
            if(result.length===1){
                yield put({type:actionTypes.LOG_IN,user:result[0],LoginError:null});
            }
        }
        else{
            yield put({type:actionTypes.LOG_IN_ERROR, LoginError:response.data.error});
            console.log("Error " + response.data.status);
        }
    }
    catch(e){
        console.log(e);
    }
}

export function* getCustomers(){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["获取客户列表..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/customers/all',
        });
        if(response.data.status>=200 && response.data.status<300){
            console.log("Done");
            const result = response.data.response;
            result.forEach((customer, index)=>{
                Object.keys(customer).forEach((key)=>{
                    if(customer[key]===null){
                        result[index][key] = "";
                    }
                })
            });
            console.log("All Customer RESULT",result);
            yield put({type:actionTypes.UPDATE_CUSTOMERS, customer:result});
            yield put({type:actionTypes.REMOVE_POP_UP});
        }
        else{
            yield put({type:actionTypes.REMOVE_POP_UP});
            yield put({type:actionTypes.POP_UP, status:"failure", message:["Error: "+response.data.status],onExit:null});
        }
    }
    catch(e){
        console.log(e);
    }
}


function* updateCustomers(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["更新客户信息..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/customers/update/one',
            data:action.customer,
        });
        if(response.data.status>=200 && response.data.status<300){
            yield put({type:actionTypes.REMOVE_POP_UP});
            yield put({type:actionTypes.POP_UP, status:"success", message:["成功更新客户信息"],onExit:"/customer"});
        }
        else{
            yield put({type:actionTypes.REMOVE_POP_UP});
            yield put({type:actionTypes.POP_UP, status:"failure", message:["Error: "+response.data.error.sqlMessage],onExit:null});
        }
    }
    catch(e){
        console.log(e);
    }
}

function* forceDeleteCustomers(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["正在删除客户..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/customers/delete/force',
            data:action.customer,
        });
        if(response.data.status>=200 && response.data.status<300){
            yield put({type:actionTypes.REMOVE_POP_UP});
            yield put({type:actionTypes.POP_UP, status:"success", message:["成功删除客户"],onExit:"/customer"});
        }
        else{
            yield put({type:actionTypes.REMOVE_POP_UP});
            yield put({type:actionTypes.POP_UP, status:"failure", message:["Error: "+response.data.status],onExit:null});
        }
    }
    catch(e){
        console.log(e);
    }
}

function* getChinaGeo(){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["正在获取其他信息..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/geographic/china/',
        });
        if(response.data.status>=200 && response.data.status<300){
            console.log(response);
            const result = response.data.response;
            yield put({type:actionTypes.UPDATE_CHINA_GEO, china_geo:result});
            yield put({type:actionTypes.REMOVE_POP_UP});
        }
        else{
            yield put({type:actionTypes.REMOVE_POP_UP});
            yield put({type:actionTypes.POP_UP, status:"failure", message:["Error: "+response.data.status],onExit:null});

        }
    }
    catch(e){
        console.log(e);
    }
}

function* updateChinaGeo(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["正在更新中国地理信息..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/geographic/china/update/',
            data: action.detail
        });
        if(response.data.status>=200 && response.data.status<300){
            yield put({type:actionTypes.REMOVE_POP_UP});
            yield getChinaGeo();
        }
        else{
            yield put({type:actionTypes.REMOVE_POP_UP});
            yield put({type:actionTypes.POP_UP, status:"failure", message:["Error: "+response.data.status],onExit:null});

        }
    }
    catch(e){
        console.log(e);
    }
}

function* addChinaGeo(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["正在添加新中国地理信息..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/geographic/china/add/',
            data: action.detail
        });
        if(response.data.status>=200 && response.data.status<300){
            yield put({type:actionTypes.REMOVE_POP_UP});
            yield getChinaGeo();
        }
        else{
            yield put({type:actionTypes.REMOVE_POP_UP});
            yield put({type:actionTypes.POP_UP, status:"failure", message:["Error: "+response.data.status],onExit:null});

        }
    }
    catch(e){
        console.log(e);
    }
}

function* deleteChinaGeo(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["正在删除中国地理信息..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/geographic/china/delete/',
            data: {
                id:action.id
            }
        });
        if(response.data.status>=200 && response.data.status<300){
            yield put({type:actionTypes.REMOVE_POP_UP});
            yield getChinaGeo();
        }
        else{
            yield put({type:actionTypes.REMOVE_POP_UP});
            yield put({type:actionTypes.POP_UP, status:"failure", message:["Error: "+response.data.status],onExit:null});

        }
    }
    catch(e){
        console.log(e);
    }
}

function* checkUser(){
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/users/check',
        });
        if(response.data.status>=200 && response.data.status<300){
            const result = response.data.response;
            if(result){
            } else {
                yield put({type:actionTypes.SIGN_OUT});
            }
        }
        else{
            console.log("Error " + response.data.status);
        }
    }
    catch(e){
        console.log(e);
    }
}

function* signout(){
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/users/signout',
        });
        if(response.data.status>=200 && response.data.status<300){
            yield put({type:actionTypes.SIGN_OUT});
        }
        else{
            console.log("Error " + response.data.status);
        }
    }
    catch(e){
        console.log(e);
    }
}

export function* watchSagaRequests() {
    yield takeEvery(actionTypes.SAGA_LOG_IN, logIn);

    yield takeEvery(actionTypes.SAGA_GET_CUSTOMERS, getCustomers);
    yield takeEvery(actionTypes.SAGA_UPDATE_CUSTOMERS, updateCustomers);
    yield takeEvery(actionTypes.SAGA_FORCE_DELETE_CUSTOMER, forceDeleteCustomers);

    yield takeEvery(actionTypes.SAGA_GET_CHINA_GEO, getChinaGeo);
    yield takeEvery(actionTypes.SAGA_UPDATE_CHINA_GEOGRAPHIC, updateChinaGeo);
    yield takeEvery(actionTypes.SAGA_ADD_CHINA_GEOGRAPHIC, addChinaGeo);
    yield takeEvery(actionTypes.SAGA_DELETE_CHINA_GEOGRAPHIC, deleteChinaGeo);

    yield takeEvery(actionTypes.SAGA_CHECK_USER, checkUser);
    yield takeEvery(actionTypes.SAGA_SIGN_OUT, signout);
}

