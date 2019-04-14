import React from 'react';

const DropDown = (props) => {
    return(
        <div className={"select-group"}>
            <h5>{props.label}</h5>
            <select style={props.style} className={"custom-select"} name={props.name} disabled={props.disabled!=null?props.disabled:false} value={props.value} onChange={props.handleChange.bind(this)}>
                {
                    props.options.map((option,index)=>{
                        return(
                            <option key={index} value={option}>{option}</option>
                        );
                    })
                }
            </select>
        </div>
    );
};
export default DropDown;