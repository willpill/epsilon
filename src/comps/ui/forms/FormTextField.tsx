import { ChangeEvent, useEffect } from "react";
import { TextField, TextFieldProps } from "@mui/material"

type Requirements = {
    minChar?: number,
    maxChar?: number,
    minWords?: number,
    maxWords?: number,
    disableSpaces?: boolean,  /* replace spaces with dashes */
    onlyAlpha?: boolean
}

type Props = {
    field: string,
    description?: string,
    required?: boolean,
    requirements?: Requirements,
    value?: string,
    onChange?: (field: string, updatedValue: string) => void,
    status?: {
        dirty: boolean,
        value: boolean
    },
    changeStatus?: (newStatus : boolean) => void
}

const FormTextField = (
    { 
        field, 
        description,
        required,
        requirements,
        value,
        onChange,
        status,
        changeStatus,
        ...textFieldProps
    } :
    Props & TextFieldProps
) => {
    useEffect(() => {
        /* set initial validation status */
        validate(value || "");
    }, [required]);

    const validate = (targetValue : string) => {
        if (!changeStatus) return;

        if (requirements) {
            if (requirements.minChar && targetValue.length < requirements.minChar) {
                changeStatus(false);
                return;
            }

            // does not work with onlyAlpha
            if (requirements.minWords && targetValue.trim().split(" ").length < requirements.minWords) {
                changeStatus(false);
                return;
            }

            changeStatus(true);
        } else {
            if (required) {
                changeStatus(targetValue.length > 0);
            }
        }
    }

    const textChanged = (event: ChangeEvent<HTMLInputElement>) => {
        let targetValue = event.target.value;

        if (
            (requirements?.maxChar && targetValue.length > requirements.maxChar) ||
            (
                requirements?.maxWords && 
                targetValue.replace(/  +/g, ' ').split(" ").length > requirements.maxWords 
            )
        ) {
            return;
        }

        if (
            requirements?.disableSpaces && 
            targetValue.charAt(targetValue.length-1) === ' '
        ) {
            if (targetValue.length === 1) {
                targetValue = ""
            } else if (targetValue.charAt(targetValue.length-2) === '-') {
                return;
            } else {
                targetValue = targetValue.replace(/ +/g, '-');
            }
        } else if (requirements?.onlyAlpha) {
            targetValue = targetValue.replace(/[^a-z0-9\- ]/gi, '')
        }

        if (onChange) {
            onChange(field, targetValue);
        }

        validate(targetValue);
    }

    return (
        <TextField
            onChange={textChanged}
            value={value}
            {...textFieldProps}
        />
    )
}

export default FormTextField;