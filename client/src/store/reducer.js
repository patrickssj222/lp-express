import * as actionTypes from './action';

const initialState = {
    user:null,
    constants:{
        fee:null
    },
    popUp:null,
    view:{
        component:null,
        payload:null
    },
    customer:null,
    business:null,
    business_detail:null,
    business_payment:null,
    china_geo:null,

};

const reducer = (store = initialState, action) => {
/*
    let state = deepCopy(store);
*/

    switch (action.type) {
        case actionTypes.LOG_IN:
            return{
                ...store,
                user:action.user
            };

        case actionTypes.UPDATE_PRICE_CONSTANTS:
            return{
                ...store,
                constants:{
                    ...store.constants,
                    fee:action.constants
                }
            };
        case actionTypes.SWITCH_VIEW:
            return{
                ...store,
                view:{
                    component: action.component,
                    payload: action.payload
                },
            };
        case actionTypes.POP_UP:
            return{
                ...store,
                popUp:{
                    status:action.status,
                    message:action.message,
                    onExit:action.action
                }
            };
        case actionTypes.REMOVE_POP_UP:
            if (store.popUp.onExit === "Reinitialize"){
                window.location.reload();
            }
            return{
                ...store,
                popUp: null
            };
        case actionTypes.UPDATE_CUSTOMERS:
            return{
                ...store,
                customer:action.customer
            };
        case actionTypes.UPDATE_BUSINESS:
            return{
                ...store,
                business:action.business
            };
        case actionTypes.UPDATE_BUSINESS_DETAIL:
            return{
                ...store,
                business_detail:action.business_detail
            };
        case actionTypes.UPDATE_BUSINESS_PAYMENT:
            return{
                ...store,
                business_payment:action.business_payment
            };
        case actionTypes.UPDATE_CHINA_GEO:
            return{
                ...store,
                china_geo: action.china_geo
            };
        default:
            return store;
    }
};

export default reducer;
function deepCopy(obj) {
    let rv;
    const toString = Object.prototype.toString;

    switch (typeof obj) {
        case "object":
            if (obj === null) {
                // null => null
                rv = null;
            } else {
                switch (toString.call(obj)) {
                    case "[object Array]":
                        // It's an array, create a new array with
                        // deep copies of the entries
                        rv = obj.map(deepCopy);
                        break;
                    case "[object Date]":
                        // Clone the date
                        rv = new Date(obj);
                        break;
                    case "[object RegExp]":
                        // Clone the RegExp
                        rv = new RegExp(obj);
                        break;
                    // ...probably a few others
                    default:
                        // Some other kind of object, deep-copy its
                        // properties into a new object
                        rv = Object.keys(obj).reduce(function(prev, key) {
                            prev[key] = deepCopy(obj[key]);
                            return prev;
                        }, {});
                        break;
                }
            }
            break;
        default:
            // It's a primitive, copy via assignment
            rv = obj;
            break;
    }
    return rv;
}


