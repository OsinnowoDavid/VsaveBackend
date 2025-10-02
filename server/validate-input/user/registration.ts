import validator from "validator";
import isEmpty from "../isEmpty";

const validateRegistrationInput = (data: any) => {
    let error = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    };
    // Convert undefined/null values to empty strings for validation
    data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
    data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    // Validate fullName
    if (validator.isEmpty(data.firstName)) {
        error.firstName = "firstName field is Required";
    }
    // Validate fullName leNgth
    if (validator.isEmpty(data.lastName)) {
        error.lastName = "lastName field is Required";
    }
    // Validate email
    if (validator.isEmpty(data.email)) {
        error.email = "email field is Required";
    }
    // Validate email format
    if (!validator.isEmail(data.email)) {
        error.email = "Email is invalid.";
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

export default validateRegistrationInput;
