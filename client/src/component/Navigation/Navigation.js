import React, { Component} from "react";
import "./Navigation.css";
import $ from "jquery";
import * as actionTypes from "../../store/action";
import connect from "react-redux/es/connect/connect";
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
        return (
            <nav id="sidebar" className="sidebar-wrapper">
                <div className="sidebar-content">
                    <div className="sidebar-brand">
                        <a href="#">La Promesse Inc.</a>
                    </div>
                    <div className="sidebar-header">
                        <div className="user-pic">
                            <img className="img-responsive img-rounded"
                                 src={require("../../img/user.jpg")}
                                 alt="User picture"/>
                        </div>
                        <div className="user-info">
                              <span className="user-name">{this.props.user.name}</span>
                                    <span className="user-role">{this.props.user.position_name}</span>
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
                    <div className="sidebar-menu">
                        <ul>
                            <li className="header-menu">
                                <span>General</span>
                            </li>
                            <li className="sidebar-dropdown">
                                <a href="#">
                                    <i className="fa fa-tachometer-alt"/>
                                    <span>Dashboard</span>
                                    <span className="badge badge-pill badge-warning">new</span>
                                </a>
                                <div className="sidebar-submenu">
                                    <ul>
                                        <li>
                                            <a href="#">Dashboard 1</a>
                                        </li>
                                        <li>
                                            <a href="#">Dashboard 2</a>
                                        </li>
                                        <li>
                                            <a href="#">Dashboard 3</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="sidebar-dropdown">
                                <a href="#">
                                    <i className="fas fa-user"/>
                                    <span>客户</span>
                                </a>
                                <div className="sidebar-submenu">
                                    <ul>
                                        <li>
                                            <a href="#" onClick={this.props.switchView.bind(this,"Customer",null)}>客户列表</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="sidebar-dropdown">
                                <a href="#">
                                    <i className="fas fa-file"/>
                                    <span>业务</span>
                                </a>
                                <div className="sidebar-submenu">
                                    <ul>
                                        <li>
                                            <a href="#" onClick={this.props.switchView.bind(this,"Business",null)}>业务列表</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="sidebar-submenu">
                                    <ul>
                                        <li>
                                            <a href="#" onClick={this.props.switchView.bind(this,"VisaApplication_2",null)}>业务添加</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="sidebar-dropdown">
                                <a href="#">
                                    <i className="fas fa-graduation-cap"/>
                                    <span>院校申请</span>
                                </a>
                                <div className="sidebar-submenu">
                                    <ul>
                                        <li>
                                            <a href="#" onClick={this.props.switchView.bind(this,"VisaApplication_2",null)}>高中申请</a>
                                            <a href="#" onClick={this.props.switchView.bind(this,"VisaApplication_2",null)}>学院申请</a>
                                            <a href="#" onClick={this.props.switchView.bind(this,"VisaApplication_2",null)}>大学申请</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="sidebar-dropdown">
                                <a href="#">
                                    <i className="fa fa-dollar-sign"/>
                                    <span>常量</span>
                                </a>
                                <div className="sidebar-submenu">
                                    <ul>
                                        <li>
                                            <a href="#" onClick={this.props.switchView.bind(this,"Price_Constants",null)}>基础价格</a>
                                        </li>
                                    </ul>
                                </div>
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);