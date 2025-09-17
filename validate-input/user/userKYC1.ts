import validator from "validator";
import isEmpty from "../isEmpty";

const validateKYC1input = (data: any) => {
  let error = {
    profession: "",
    accountNumber: "",
    accountDetails: "",
    country: "",
    state: "",
    bvn: "",
  };
  // Convert undefined/null values to empty strings for validation
  data.profession = !isEmpty(data.profession) ? data.profession : "";
  data.accountNumber = !isEmpty(data.email) ? data.accountNumber : "";
  data.accountDetails = !isEmpty(data.accountDetails)
    ? data.accountDetails
    : "";
  data.country = !isEmpty(data.country) ? data.country : "";
  data.state = !isEmpty(data.state) ? data.state : "";
  data.bvn = !isEmpty(data.nin) ? data.nin : "";
  // Validate profession
  if (validator.isEmpty(data.profession)) {
    error.profession = "profession field is Required";
  }
  // Validate account number
  if (validator.isNumeric(data.accountNumber)) {
    error.accountNumber =
      "accountNumber field is Required and must be a number not string";
  }
  // Validate account number length
  if (data.accountNumber.length < 10 || data.accountNumber.length > 10) {
    error.accountNumber = "account number must be a valid 10 digit number .";
  }

  // Validate account Details
  if (validator.isEmpty(data.accountDetails)) {
    error.profession = "accountDetails field is Required";
  }

  //Validate country
  if (validator.isEmpty(data.country)) {
    error.country = "country field is Required";
  }
  //validate state
  if (validator.isEmpty(data.state)) {
    error.state = "state field is Required";
  }
  //validate nin
  if (validator.isEmpty(data.bvn)) {
    error.bvn = "nin field is Required";
  }

  const hasError = (errorObj: typeof error): boolean =>
    Object.values(errorObj).some((value) => value.trim() !== "");
  console.log("error oject:", error);
  return {
    error,
    isNotValid: hasError(error),
  };
};

export default validateKYC1input;
