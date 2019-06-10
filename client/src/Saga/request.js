import * as actionTypes from '../store/action';
import {takeEvery, put,call,delay,select} from 'redux-saga/effects';
import axios from 'axios';

function* logIn(action){
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/users',
            data:{
                user: action.username,
                password: action.password
            },
        });
        if(response.data.status>=200 && response.data.status<300){
            const result = response.data.response;
            if(result.length===1){
                yield put({type:actionTypes.LOG_IN,user:result[0]});
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

function* getPriceConstants(){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["加载基础价格常量表格..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/constants/price',
        });
        if(response.data.status>=200 && response.data.status<300){
            const result = response.data.response;
            yield put({type:actionTypes.UPDATE_PRICE_CONSTANTS,constants:result});
        }
        else{
            console.log("Error " + response.data.status);
        }
    }
    catch(e){
        console.log(e);
    }
    yield put({type:actionTypes.REMOVE_POP_UP});
}

function* updatePriceConstants(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["更新基础价格常量..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/constants/price/update',
            data:action.constants,
        });
        if(response.data.status>=200 && response.data.status<300){
            yield put({type:actionTypes.REMOVE_POP_UP});
            yield put({type:actionTypes.POP_UP, status:"success", message:["成功更新基础价格常量"],onExit:null});
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

function* getCustomers(){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["获取客户列表..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/customers/all',
        });
        if(response.data.status>=200 && response.data.status<300){
            const result = response.data.response;
            yield put({type:actionTypes.UPDATE_CUSTOMERS, customer:result});
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

function* addCustomers(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["添加新客户..."],onExit:null});
    if(action.customer.name!== ""){
        try{
            const response = yield call (axios, {
                method: 'POST',
                url: '/api/customers/add/one',
                data:action.customer,
            });
            if(response.data.status>=200 && response.data.status<300){
                yield put({type:actionTypes.REMOVE_POP_UP});
                yield put({type:actionTypes.POP_UP, status:"success", message:["成功添加新客户"],onExit:null});
            }
            else{
                yield put({type:actionTypes.REMOVE_POP_UP});
                yield put({type:actionTypes.POP_UP, status:"failure", message:["Error: "+response.data.status],onExit:null});
            }
        }
        catch(e){
            yield put({type:actionTypes.REMOVE_POP_UP});
            yield put({type:actionTypes.POP_UP, status:"failure", message:["Error: Client Side Error."],onExit:null});
        }
    }
    else{
        yield put({type:actionTypes.REMOVE_POP_UP});
        yield put({type:actionTypes.POP_UP, status:"failure", message:["请填入客户姓名."],onExit:null});
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
        console.log(response)
        if(response.data.status>=200 && response.data.status<300){
            yield put({type:actionTypes.REMOVE_POP_UP});
            yield put({type:actionTypes.POP_UP, status:"success", message:["成功更新客户信息"],onExit:null});
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
            yield put({type:actionTypes.POP_UP, status:"success", message:["成功删除客户"],onExit:null});
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

function* getBusiness(){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["获取业务列表..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/business/all',
        });
        if(response.data.status>=200 && response.data.status<300){
            const result = response.data.response;
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
function* updateBusiness(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["更新业务信息..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/business/update/',
            data:action.business,
        });
        if(response.data.status>=200 && response.data.status<300){
            yield put({type:actionTypes.REMOVE_POP_UP});
            yield put({type:actionTypes.POP_UP, status:"success", message:["成功更新业务信息"],onExit:null});
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
    yield put({type:actionTypes.POP_UP, status:"loading", message:["获取业务信息..."],onExit:null});
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
            const keys = Object.keys(result);
            keys.forEach((key)=>{
                if(result[key]==null){
                    result[key] = "";
                }
            });
            yield put({type:actionTypes.UPDATE_BUSINESS_DETAIL, business_detail:result});/*
            yield put({type:actionTypes.REMOVE_POP_UP});*/
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
            yield put({type:actionTypes.SWITCH_VIEW, component:"CustomerDetail", payload:{index:action.customer_id}});
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

function* initBusinessDetail(action){
    yield call(getPriceConstants);
    yield call(getBusinessDetail,action);
    yield call(getBusinessPayment,action);
}

function* getChinaGeo(){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["正在获取其他信息..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/customers/geo/china/',
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
export function* watchSagaRequests() {
    yield takeEvery(actionTypes.SAGA_LOG_IN, logIn);
    yield takeEvery(actionTypes.SAGA_GET_PRICE_CONSTANTS, getPriceConstants);
    yield takeEvery(actionTypes.SAGA_UPDATE_PRICE_CONSTANTS, updatePriceConstants);
    yield takeEvery(actionTypes.SAGA_GET_CUSTOMERS, getCustomers);
    yield takeEvery(actionTypes.SAGA_UPDATE_CUSTOMERS, updateCustomers);
    yield takeEvery(actionTypes.SAGA_ADD_CUSTOMERS, addCustomers);
    yield takeEvery(actionTypes.SAGA_GET_BUSINESS,getBusiness);
    yield takeEvery(actionTypes.SAGA_UPDATE_BUSINESS, updateBusiness);
    yield takeEvery(actionTypes.SAGA_GET_BUSINESS_DETAIL, initBusinessDetail);
    yield takeEvery(actionTypes.SAGA_ADD_PAYMENT_TRANSACTION, addBusinessPayment);
    yield takeEvery(actionTypes.SAGA_DELETE_PAYMENT_TRANSACTION, deleteBusinessPayment);
    yield takeEvery(actionTypes.SAGA_ADD_BUSINESS, addBusiness);
    yield takeEvery(actionTypes.SAGA_GET_CHINA_GEO, getChinaGeo);
    yield takeEvery(actionTypes.SAGA_FORCE_DELETE_CUSTOMER, forceDeleteCustomers);
}

