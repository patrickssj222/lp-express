import React from 'react';

const Input = (props) => {
    return(
        <div className={"input-group"}>
            <h5>{props.label}</h5>
            <input style={props.style} type={props.type} step={props.step!=null?props.step:"any"} name={props.name} disabled={props.disabled} className="form-control" value={props.value} onChange={props.handleChange.bind(this)}/>
        </div>
    );
};
export default Input;