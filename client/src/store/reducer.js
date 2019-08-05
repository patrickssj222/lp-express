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
    users_list:null,
    admin_dataset: null,
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
                    onExit:action.onExit
                }
            };
        case actionTypes.REMOVE_POP_UP:
            return{
                ...store,
                popUp: null
            };

        case actionTypes.OPTION_POP_UP:
            console.log("clicked delete",action.message, action.option);
            return{
                ...store,
                popUp:{
                    status:"option",
                    message:action.message,
                    option:action.option,
                }
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
        case actionTypes.UPDATE_USERS_LIST:
            return{
                ...store,
                users_list:action.users_list
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
        case actionTypes.SET_ADMIN_DATASET:
            return{
                ...store,
                admin_dataset:action.admin_dataset
            }
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


