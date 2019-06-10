import React from 'react';
import "./PopUp.css";
import MaterialIcon from 'material-icons-react';
import * as actionTypes from "../../store/action";
import connect from "react-redux/es/connect/connect";
import {Link} from "react-router-dom";

const SuccessPopUp = (props) => {
    return(
        <div className={"pop-up"}>
            <div className="modal-dialog modal-confirm">
                <div className="modal-content">
                    <div className="modal-header">
                        <MaterialIcon icon={"check_circle_outline"} color="green"/>
                        <h4 className="modal-title">Success!</h4>
                    </div>
                    <div className="modal-body">
                        {
                            props.popUp.message.map((message, index)=>{
                                return(
                                    <p className="text-center" key={index}>{message}</p>
                                );
                            })
                        }
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-success btn-block" onClick={props.removePopUp}><Link to={props.onExit}>OK</Link></button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    return{
        popUp: state.popUp,
    };
};

const mapDispatchToProps = dispatch => {
    return{
        removePopUp: () => dispatch({type: actionTypes.REMOVE_POP_UP}),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SuccessPopUp);