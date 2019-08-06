import React, { Component } from 'react';
import './LogIn.css';
import connect from "react-redux/es/connect/connect";
import * as actionTypes from '../../store/action';

class LogIn extends Component {
    constructor(props){
        super(props);
        this.state={
            email:"",
            password: ""
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e){
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    render() {
        const { email, password } = this.state;
        return (
            <div className="login-wrapper">
                <div className="container">
                    <div className="card card-container">
                        <img id="profile-img" className="profile-img-card" src={require("../../img/user.jpg")} alt={"Profile"}/>
                        <p id="profile-name" className="profile-name-card"/>
                        <div className="form-signin">
                            <span id="reauth-email" className="reauth-email"/>
                            <input type="email" id="inputEmail" className="form-control" placeholder="Email Address" name="email" value={email} onChange={this.handleChange} required autoFocus/>
                            <input type="password" id="inputPassword" className="form-control" placeholder="Password" name="password" value={password} onChange={this.handleChange} required/>
                            <button className="btn btn-lg btn-primary btn-block btn-signin" onClick={this.props.logIn.bind(this,email,password)}>Sign in</button>
                        </div>
                        {this.props.LoginError && <p className="login-error">{this.props.LoginError}</p>}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return{
        LoginError:state.LoginError,
    };
};

const mapDispatchToProps = dispatch => {
    return{
        logIn: (username,password) => dispatch({type:actionTypes.SAGA_LOG_IN, username:username, password:password}),
    };
};
export default connect(mapStateToProps,mapDispatchToProps)(LogIn);
