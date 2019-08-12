import * as actionTypes from '../store/action';
import {takeEvery, put,call,delay,select} from 'redux-saga/effects';
import axios from 'axios';

export function* getAllUsers(){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["获取所有用户信息..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/users/all',
        });
        if(response.data.status>=200 && response.data.status<300){
            const result = response.data.response;
            console.log("ALL USER", result);
            yield put({type:actionTypes.UPDATE_USERS_LIST, users_list:result});
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

function* addUser(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["正在添加新用户..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/users/add',
            data:action.user
        });
        if(response.data.status>=200 && response.data.status<300){
            yield getAllUsers();
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

function* updateUser(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["正在更新用户..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/users/update',
            data:action.user
        });
        if(response.data.status>=200 && response.data.status<300){
            yield getAllUsers();
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

function* deleteUser(action){
    yield put({type:actionTypes.POP_UP, status:"loading", message:["正在删除用户..."],onExit:null});
    try{
        const response = yield call (axios, {
            method: 'POST',
            url: '/api/users/delete',
            data:{
                id:action.id
            }
        });
        if(response.data.status>=200 && response.data.status<300){
            yield getAllUsers();
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
export function* watchSagaUserRequests() {
    yield takeEvery(actionTypes.SAGA_GET_ALL_USERS, getAllUsers);
    yield takeEvery(actionTypes.SAGA_ADD_USER, addUser);
    yield takeEvery(actionTypes.SAGA_UPDATE_USER, updateUser);
    yield takeEvery(actionTypes.SAGA_DELETE_USER, deleteUser);
}