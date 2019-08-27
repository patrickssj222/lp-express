    import React, { Component} from "react";
import "./Navigation.css";
import $ from "jquery";
import * as actionTypes from "../../store/action";
import connect from "react-redux/es/connect/connect";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
class Navigation extends Component {
    constructor(props){
        super(props);
    }
    componentDidMount() {
        $(".sidebar-dropdown > a").click(function() {
            $(".sidebar-submenu").slideUp(200);
            if (
                $(this)
                    .parent()
                    .hasClass("active")
            ) {
                $(".sidebar-dropdown").removeClass("active");
                $(this)
                    .parent()
                    .removeClass("active");
            } else {
                $(".sidebar-dropdown").removeClass("active");
                $(this)
                    .next(".sidebar-submenu")
                    .slideDown(200);
                $(this)
                    .parent()
                    .addClass("active");
            }
        });
    }
    render() {
        const adminContent = <div className="sidebar-menu">
            <ul>
                <li className="sidebar-dropdown">
                    <a>
                        <i className="fas fa-user"/>
                        <span>客户</span>
                    </a>
                    <div className="sidebar-submenu">
                        <ul>
                            <li>
                                <Link to={'/customer'}><i className="fas fa-angle-right"/>私人客户列表</Link>
                            </li>
                            <li>
                                <Link to={'/all-customer'}><i className="fas fa-angle-right"/>公司客户列表</Link>
                            </li>
                        </ul>
                    </div>
                </li>
                <li className="sidebar-dropdown">
                    <a>
                        <i className="fas fa-file"/>
                        <span>业务</span>
                    </a>
                    <div className="sidebar-submenu">
                        <ul>
                            <li>
                                <Link to={'/business'}><i className="fas fa-angle-right"/>业务列表</Link>
                            </li>
                        </ul>
                    </div>
                </li>
                <li className="sidebar-dropdown">
                    <a>
                        <i className="fa fa-dollar-sign"/>
                        <span>常量</span>
                    </a>
                    <div className="sidebar-submenu">
                        <ul>
                            <li>
                                <Link to={'/constants/price'}><i className="fas fa-angle-right"/>基础价格</Link>
                            </li>
                        </ul>
                    </div>
                </li>
                <li className="sidebar-dropdown">
                    <a>
                        <i className={"fas fa-tools"}/>
                        <span>管理</span>
                    </a>
                    <div className="sidebar-submenu">
                        <ul>
                            <li>
                                <Link to={'/user'}><i className="fas fa-angle-right"/>用户管理</Link>
                            </li>
                            <li>
                                <Link to={'/china_geo'}><i className="fas fa-angle-right"/>中国地理管理</Link>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>;
        const wenanContent = <div className="sidebar-menu">
            <ul>
                <li className="sidebar-dropdown">
                    <a>
                        <i className="fas fa-user"/>
                        <span>客户</span>
                    </a>
                    <div className="sidebar-submenu">
                        <ul>
                            <li>
                                <Link to={'/customer'}><i className="fas fa-angle-right"/>客户列表</Link>
                            </li>
                        </ul>
                    </div>
                </li>
                <li className="sidebar-dropdown">
                    <a>
                        <i className={"fas fa-tools"}/>
                        <span>管理</span>
                    </a>
                    <div className="sidebar-submenu">
                        <ul>
                            <li>
                                <Link to={'/user/self'}><i className="fas fa-angle-right"/>账户管理</Link>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>;
        return (
            <nav id="sidebar" className="sidebar-wrapper">
                <div className="sidebar-content">
                    <div className="sidebar-brand">
                        <a>La Promesse Inc.</a>
                    </div>
                    <div className="sidebar-header">
                        <div className="user-pic">
                            <img className="img-responsive img-rounded"
                                 src={require("../../img/user.jpg")}
                                 alt="User picture"/>
                        </div>
                        <div className="user-info">
                              <span className="user-name">{this.props.user.name}</span>
                                    <span className="user-role">{this.props.user.role}</span>
                                    <span className="user-status">
                                    <i className="fa fa-circle"/>
                                    <span>Online</span>
                              </span>
                        </div>
                    </div>
                    <div className="sidebar-search">
                        <div>
                            <div className="input-group">
                                <input type="text" className="form-control search-menu" placeholder="Search..."/>
                                    <div className="input-group-append">
                                      <span className="input-group-text">
                                        <i className="fa fa-search" aria-hidden="true"/>
                                      </span>
                                    </div>
                            </div>
                        </div>
                    </div>
                    {
                        this.props.user.role==="管理员"?adminContent:wenanContent
                    }
                    <div className="sidebar-menu">
                        <ul>
                            <li className="sidebar-signout">
                                <Link to={'/'} onClick={this.props.signout}>
                                    <i className="fas fa-sign-out-alt"/>
                                    <span>注销</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}
const mapStateToProps = state => {
    return{
        user: state.user,
    };
};

const mapDispatchToProps = dispatch => {
    return{
        switchView: (component, payload) => dispatch({type: actionTypes.SWITCH_VIEW, component:component, payload:null}),
        signout: () => dispatch({type: actionTypes.SAGA_SIGN_OUT}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);