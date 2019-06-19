import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LogIn from "./component/LogIn/LogIn";
import VisaApplication_2 from "./component/Form/VisaApplication_2/VisaApplication_2";
import connect from "react-redux/es/connect/connect";
import Price_Constants from "./component/Form/Price_Constants/Price_Constants";
import Customer from "./component/Form/Customer/Customer";

import Navigation from "./component/Navigation/Navigation";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIgloo } from '@fortawesome/free-solid-svg-icons'
import SuccessPopUp from "./component/PopUp/SuccessPopUp";
import FailurePopUp from "./component/PopUp/FailurePopUp";
import LoadPopUp from "./component/PopUp/LoadPopUp";
import CustomerDetail from "./component/Form/Customer/CustomerDetail";
import Business from "./component/Form/Business/Business";
import BusinessDetail from "./component/Form/Business/BusinessDetail";
import AddCustomer from "./component/Form/Customer/AddCustomer";
import AddBusiness from "./component/Form/Business/AddBusiness";
import UserAdministration from "./component/Form/UserAdministration/UserAdministration";
import OptionPopUp from "./component/PopUp/OptionPopUp";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

library.add(faIgloo);

class App extends Component {
    constructor(props){
        super(props);
    }
    render() {
        let popUp = null;
        if(this.props.popUp!=null){
            switch(this.props.popUp.status){
                case "success":
                    popUp = <SuccessPopUp/>;
                    break;
                case "failure":
                    popUp = <FailurePopUp/>;
                    break;
                case "loading":
                    popUp = <LoadPopUp/>;
                    break;
                case "option":
                    popUp = <OptionPopUp/>
                    break;
                default:
                    popUp = null;
            }
        }
        let view = null;
        switch(this.props.view.component){
            case "CustomerDetail":
                view = <CustomerDetail payload={this.props.view.payload}/>;
                break;
            case "BusinessDetail":
                view = <BusinessDetail payload={this.props.view.payload}/>;
                break;
            default:
                view = null;
        }
        let content = <LogIn/>;
        if(this.props.user!=null){
            content =
                <Router>
                    <div className={"page-wrapper chiller-theme toggled"}>
                        <Navigation/>
                        <main className="page-content">
                            <Switch>
                                <Route exact path={'/'} component={Customer}/>
                                <Route exact path={'/customer'} component={Customer}/>
                                <Route exact path={'/customer/detail'} component={CustomerDetail}/>
                                <Route exact path={'/customer/add'} component={AddCustomer}/>
                                <Route exact path={'/business'} component={Business}/>
                                <Route exact path={'/customer/add'} component={AddBusiness}/>
                                <Route exact path={'/constants/price'} component={Price_Constants}/>
                                <Route exact path={'/administration/user'} component={UserAdministration}/>
                            </Switch>
                        </main>
                        {popUp}
                    </div>;
                </Router>

        }

        return (
            <div>
                {content}
            </div>
        );
    }
}
const mapStateToProps = state => {
    return{
        user:state.user,
        popUp:state.popUp,
        view:state.view
    };
};
export default connect(mapStateToProps, null)(App);
