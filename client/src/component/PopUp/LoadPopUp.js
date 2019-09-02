import React from 'react';
import "./PopUp.css";
import * as actionTypes from "../../store/action";
import connect from "react-redux/es/connect/connect";
import { ClipLoader } from 'react-spinners';

const LoadPopUp = (props) => {
    return(
        <div className={"pop-up"}>
            <div className="modal-dialog modal-confirm">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className={"loader"}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoadPopUp);