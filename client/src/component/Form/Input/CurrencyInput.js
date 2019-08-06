import ReactCurrencyInput from 'react-currency-input';
import React from 'react';

const CurrencyInput = (props) => {
    return(
        <div className={"input-group"}>
            <h5>{props.label}</h5>
            <ReactCurrencyInput 
                decimalSeparator={","} 
                thousandSeparator={"."} 
                prefix={props.prefix} // "$"
                precision={props.precision}
                style={props.style} 
                type={props.type} 
                step={props.step!=null?props.step:"any"} 
                name={props.name} 
                disabled={props.disabled} 
                className="form-control" 
                value={props.value} 
                onChange={props.handleChange.bind(this)} // deprecated "onChange"
                onChangeEvent={props.onChangeEvent}
                />
        </div>
    );
};
export default CurrencyInput;