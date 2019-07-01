import React from 'react';
import { FormattedInput } from "@buttercup/react-formatted-input";

const CustomFormatInput = (props) => {
    return(
        <div className={"input-group"}>
            <h5>{props.label}</h5>
            <FormattedInput
                format={props.format}
                value={props.value}
                onChange={props.handleChange.bind(this, props.name)}
                placeholder={props.placeholder}
                name={props.name}
                disabled={props.disabled}
            />
        </div>
    );
};
export default CustomFormatInput;