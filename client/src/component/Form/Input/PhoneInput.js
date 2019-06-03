import React from 'react';
import ReactPhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/dist/style.css';
import './input.css';

const PhoneInput = (props) => {
    return(
        <div className={"input-group"}>
            <h5>{props.label}</h5>
            <ReactPhoneInput defaultCountry={'ca'} value={props.value} inputExtraProps={{name:props.name, onChange:props.handleChange.bind(this)}}/>
        </div>
    );
};
export default PhoneInput;