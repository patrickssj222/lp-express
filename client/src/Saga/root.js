import {all} from 'redux-saga/effects'
import {watchSagaRequests} from './request'
import {watchSagaUserRequests} from "./users";
import {watchSagaCustomerRequests} from "./customer";


export default function* rootSaga() {
    yield all([
        watchSagaRequests(),
        watchSagaUserRequests(),
        watchSagaCustomerRequests()
    ])
}
