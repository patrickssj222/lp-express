import {all} from 'redux-saga/effects'
import {watchSagaRequests} from './request'
import {watchSagaUserRequests} from "./users";
import {watchSagaCustomerRequests} from "./customer";
import {watchSagaPriceConstantsRequests} from "./service_constants";
import {watchSagaBusinessRequests} from "./business";


export default function* rootSaga() {
    yield all([
        watchSagaRequests(),
        watchSagaUserRequests(),
        watchSagaCustomerRequests(),
        watchSagaBusinessRequests(),
        watchSagaPriceConstantsRequests(),
    ])
}
