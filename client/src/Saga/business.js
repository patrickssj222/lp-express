import * as actionTypes from "../store/action";
import {takeEvery, put,call,delay,select} from 'redux-saga/effects';
import axios from 'axios';
import React from "react";
import {getPriceConstants} from "./service_constants";

function* getBusiness(){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["获取业务列表..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/business/all',
        });
        if(response.data.status>=200 && response.data.status<300){
            const result = response.data.response;
            console.log("get business", result);
            yield put({type:actionTypes.UPDATE_BUSINESS, business:result});
            yield put({type:actionTypes.REMOVE_POP_UP});
        }
        else{
            yield put({type:actionTypes.REMOVE_POP_UP});
            yield put({type:actionTypes.POP_UP, status:"failure", message:["Error: "+response.data.status],onExit:"Reinitialize"});
        }
    }
    catch(e){
        console.log(e);
    }
}
function* getCustomerBusiness(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["获取业务信息..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/business/customer',
            data:{
                customer_id:action.id
            }
        });
        if(response.data.status>=200 && response.data.status<300){
            let result = response.data.response;
            yield put({type:actionTypes.UPDATE_CUSTOMER_BUSINESS, customer_business:result});
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
function* getBusinessDetail(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["获取规划信息..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/business/one',
            data:{
                id:action.id
            }
        });
        if(response.data.status>=200 && response.data.status<300){
            let result = response.data.response[0];
            yield put({type:actionTypes.REMOVE_POP_UP});
            return result;
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
function* getWenAnDetail(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["获取文案信息..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/business/wenan',
            data:{
                business_id:action.id
            }
        });
        if(response.data.status>=200 && response.data.status<300){
            let result = response.data.response[0];
            yield put({type:actionTypes.REMOVE_POP_UP});
            return result;
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
function* getBusinessPayment(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["获取缴款信息..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/business/payment_transaction/one',
            data:{
                id:action.id
            }
        });
        if(response.data.status>=200 && response.data.status<300){
            const result = response.data.response;
            yield put({type:actionTypes.UPDATE_BUSINESS_PAYMENT, business_payment:result});
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

function* addBusinessPayment(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["正在添加新缴费..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/business/payment_transaction/add',
            data:{
                id:action.id,
                payment_info: action.payment_info
            }
        });
        if(response.data.status>=200 && response.data.status<300){
            yield call(getBusinessPayment, action);
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

function* deleteBusinessPayment(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["正在删除新缴费..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/business/payment_transaction/delete',
            data:{
                id:action.id,
            }
        });
        if(response.data.status>=200 && response.data.status<300){
            const payload = {
                id: action.business_id
            };
            yield call(getBusinessPayment, payload);
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

function* addBusiness(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["正在添加新业务..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/business/add',
            data:action.detail
        });
        if(response.data.status>=200 && response.data.status<300){
            yield getBusiness;
            yield getBusinessDetail({id:action.detail.customer_id});
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
function* addWenAnDetail(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["正在添加新文案记录..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/business/wenan/add',
            data:action.detail
        });
        if(response.data.status>=200 && response.data.status<300){
            yield initBusinessDetail({id:action.detail.business_id});
            yield put({type:actionTypes.REMOVE_POP_UP});
            yield put({type:actionTypes.POP_UP, status:"success", message:["成功更新规划内容"],onExit:null});
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
function* updateBusiness(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["更新规划内容..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/business/update/',
            data:action.detail,
        });
        if(response.data.status>=200 && response.data.status<300){
            yield initBusinessDetail({id:action.detail.id});
            yield put({type:actionTypes.REMOVE_POP_UP});
            yield put({type:actionTypes.POP_UP, status:"success", message:["成功更新规划内容"],onExit:null});
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
function* updateWenAnDetail(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["更新文案记录..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/business/wenan/update/',
            data:action.detail,
        });
        if(response.data.status>=200 && response.data.status<300){
            yield initBusinessDetail({id:action.detail.business_id});
            yield put({type:actionTypes.REMOVE_POP_UP});
            yield put({type:actionTypes.POP_UP, status:"success", message:["成功更新文案记录"],onExit:null});
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

function* initBusinessDetail(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["获取业务信息..."],onExit:null});
    try{
        yield getPriceConstants();
        let businessResponse = yield getBusinessDetail(action);
        Object.keys(businessResponse).forEach((key)=>{
            if(businessResponse[key]===null){
                businessResponse[key]="";
            }
        });
        const wenAnResponse = yield getWenAnDetail(action);
        Object.keys(wenAnResponse).forEach((key)=>{
            if(wenAnResponse[key]===null){
                wenAnResponse[key]="";
            }
        });
        let result = {
            ...businessResponse,
            wenan_detail:wenAnResponse
        };

        yield put({type:actionTypes.UPDATE_BUSINESS_DETAIL, business_detail:result});
        yield put({type:actionTypes.REMOVE_POP_UP});

    }
    catch(e){
        yield put({type:actionTypes.REMOVE_POP_UP});
        yield put({type:actionTypes.POP_UP, status:"failure", message:["Error:"+e],onExit:null});
    }
}

export function* watchSagaBusinessRequests() {
    yield takeEvery(actionTypes.SAGA_GET_BUSINESS,getBusiness); //business/all
    yield takeEvery(actionTypes.SAGA_UPDATE_BUSINESS, updateBusiness); //business/update
    yield takeEvery(actionTypes.SAGA_GET_BUSINESS_DETAIL, initBusinessDetail);
    yield takeEvery(actionTypes.SAGA_GET_CUSTOMER_BUSINESS, getCustomerBusiness);
    yield takeEvery(actionTypes.SAGA_ADD_PAYMENT_TRANSACTION, addBusinessPayment);
    yield takeEvery(actionTypes.SAGA_DELETE_PAYMENT_TRANSACTION, deleteBusinessPayment);
    yield takeEvery(actionTypes.SAGA_ADD_BUSINESS, addBusiness); //business/add
    yield takeEvery(actionTypes.SAGA_ADD_WENAN_DETAIL, addWenAnDetail);
    yield takeEvery(actionTypes.SAGA_UPDATE_WENAN_DETAIL, updateWenAnDetail);
}