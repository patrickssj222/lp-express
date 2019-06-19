import React, {Component} from 'react';
import "./PopUp.css";
import MaterialIcon from 'material-icons-react';
import * as actionTypes from "../../store/action";
import connect from "react-redux/es/connect/connect";
import { withRouter } from 'react-router-dom';

class SuccessPopUp extends Component {
    constructor(props){
        super(props);
    }

    handleSubmit(){
        this.props.history.push(this.props.popUp.onExit);
    }

    render() {
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
                                this.props.popUp.message.map((message, index)=>{
                                    return(
                                        <p className="text-center" key={index}>{message}</p>
                                    );
                                })
                            }
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-success btn-block" onClick={this.handleSubmit.bind(this)}>OK</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SuccessPopUp));