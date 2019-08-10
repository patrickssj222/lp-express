import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './store/reducer';
import 'bootstrap/dist/css/bootstrap.min.css';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './Saga/root';
import { BrowserRouter } from 'react-router-dom';
import { persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/lib/integration/react';

const sagaMiddleware = createSagaMiddleware();

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

const store = createStore(persistedReducer, composeWithDevTools(
    applyMiddleware(sagaMiddleware),
    // other store enhancers if any
));

const persistor = persistStore(store)

sagaMiddleware.run(rootSaga);

const app = (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </PersistGate>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
