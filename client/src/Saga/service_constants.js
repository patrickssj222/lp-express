import * as actionTypes from '../store/action';
import {takeEvery, put,call,delay,select} from 'redux-saga/effects';
import axios from 'axios';

export function* getPriceConstants(){
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
    console.log("UPDATE", action);
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/constants/price/update',
            data:action.constants,
        });
        if(response.data.status>=200 && response.data.status<300){
            yield getPriceConstants();
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

function* deletePriceConstants(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["删除基础价格常量..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/constants/price/delete',
            data: {
                id:action.id
            }
        });
        if(response.data.status>=200 && response.data.status<300){
            yield getPriceConstants();
            yield put({type:actionTypes.REMOVE_POP_UP});
            yield put({type:actionTypes.POP_UP, status:"success", message:["成功删除基础价格常量"],onExit:null});
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

function* addPriceConstants(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["添加基础价格常量..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/constants/price/add',
            data:action.constants,
        });
        if(response.data.status>=200 && response.data.status<300){
            yield getPriceConstants();
            yield put({type:actionTypes.REMOVE_POP_UP});
            yield put({type:actionTypes.POP_UP, status:"success", message:["成功添加基础价格常量"],onExit:null});
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


export function* watchSagaPriceConstantsRequests() {
    yield takeEvery(actionTypes.SAGA_GET_PRICE_CONSTANTS, getPriceConstants);
    yield takeEvery(actionTypes.SAGA_UPDATE_PRICE_CONSTANTS, updatePriceConstants);
    yield takeEvery(actionTypes.SAGA_DELETE_PRICE_CONSTANTS, deletePriceConstants);
    yield takeEvery(actionTypes.SAGA_ADD_PRICE_CONSTANTS, addPriceConstants);
}