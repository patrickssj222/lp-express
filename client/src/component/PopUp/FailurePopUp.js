import React from 'react';
import "./PopUp.css";
import MaterialIcon from 'material-icons-react';
import * as actionTypes from "../../store/action";
import connect from "react-redux/es/connect/connect";

const FailurePopUp = (props) => {
    return(
        <div className={"pop-up"}>
            <div className="modal-dialog modal-confirm">
                <div className="modal-content">
                    <div className="modal-header">
                        <MaterialIcon icon={"error_outline"} color="red"/>
                        <h4 className="modal-title">Failure</h4>
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
                        <button className="btn btn-failure btn-block" onClick={props.removePopUp}>OK</button>
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
        removePopUp: () => dispatch({type: actionTypes.REMOVE_POP_UP})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(FailurePopUp);