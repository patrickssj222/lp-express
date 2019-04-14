import {all} from 'redux-saga/effects'
import {watchSagaRequests} from './request'



export default function* rootSaga() {
    yield all([
        watchSagaRequests()
    ])
}
