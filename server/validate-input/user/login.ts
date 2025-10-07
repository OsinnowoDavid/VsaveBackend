import validator from "validator";
import isEmpty from "../isEmpty";

const validateLoginInput = (data: any) => {
    let error = {
        email: "",
        password: "",
    };
    // Convert undefined/null values to empty strings for validation
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    // Validate email
    if (validator.isEmpty(data.email)) {
        error.email = "email field is Required";
    }
    // Validate email format
    if (!validator.isEmail(data.email)) {
        error.email = "email is invalid.";
    }
    // Validate password
    if (validator.isEmpty(data.password)) {
        error.password = "password field is Required";
    }
    // Validate password length
    if (!validator.isLength(data.password, { min: 6, max: 100 })) {
        error.password = "password must be at least 6 characters.";
    }

    const hasError = (errorObj: typeof error): boolean =>
        Object.values(errorObj).some((value) => value.trim() !== "");

    return {
        error,
        isNotValid: hasError(error),
    };
};

export default validateLoginInput;
