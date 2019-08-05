import React, { Component } from 'react';
import './App.css';
import LogIn from "./component/LogIn/LogIn";
import connect from "react-redux/es/connect/connect";
import Price_Constants from "./component/Form/Price_Constants/Price_Constants";
import Customer from "./component/Form/Customer/Customer";
import Navigation from "./component/Navigation/Navigation";
import { library } from '@fortawesome/fontawesome-svg-core'
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
import ChinaGeographic from "./component/Form/Geographics/ChinaGeographic";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import AdminCustomer from "./component/Form/Customer/AdminCustomer";
import PrintCustomerDetail from "./component/Form/Customer/PrintCustomerDetail";

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
                    popUp = <OptionPopUp/>;
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
                    <Switch>
                        <Route exact path={'/customer/detail/print'} component={PrintCustomerDetail}/>
                        <Route path={'/'}>
                            <div className={"page-wrapper chiller-theme toggled"}>
                                <Navigation/>
                                <main className="page-content">
                                    <Switch>
                                        <Route exact path={'/'} component={Customer}/>
                                        <Route exact path={'/customer'} component={Customer}/>
                                        <Route exact path={'/all-customer'} component={AdminCustomer}/>
                                        <Route exact path={'/customer/detail'} component={CustomerDetail}/>
                                        <Route exact path={'/customer/add'} component={AddCustomer}/>
                                        <Route exact path={'/business'} component={Business}/>
                                        <Route exact path={'/business/add'} component={AddBusiness}/>
                                        <Route exact path={'/business/detail'} component={BusinessDetail}/>
                                        <Route exact path={'/constants/price'} component={Price_Constants}/>
                                        <Route exact path={'/user'} component={UserAdministration}/>
                                        <Route exact path={'/china_geo'} component={ChinaGeographic}/>
                                    </Switch>
                                </main>
                                {popUp}
                            </div>
                        </Route>
                    </Switch>
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
