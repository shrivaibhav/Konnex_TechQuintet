const Validator = require("validator");
const isEmpty = require("./isEmpty");

var validations = {};

validations.validateUsername = (username) => {
  let errors = {};
  if (Validator.isEmpty(username)) {
    errors.username = "Username is invalid";
  } else if (!Validator.isLength(username, { min: 2, max: 30 })) {
    errors.username = "username must be 2 to 30 chars long";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

validations.validateRegisterInput = function validateRegisterInput(data) {
  data.name = !isEmpty(data.name) ? data.name : "";
  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.type = !isEmpty(data.type) ? data.type : "";

  let errors = validations.validateUsername(data.username).errors;

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  } else if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "Name must be between 2 and 30 characters";
  }

  // if (Validator.isEmpty(data.username)) {
  //   errors.username = "Username is invalid";
  // } else if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
  //   errors.username = "username must be 2 to 30 chars long";
  // }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  } else if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be 6 to 30 chars long";
  }

  if (Validator.isEmpty(data.type)) {
    errors.type = "Type field is required";
  } else if (typeof data.type !== "string") {
    errors.type = "Invalid Type value";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

validations.validateLoginInput = function validateLoginInput(data) {
  let errors = {};
  // data.email = !isEmpty(data.email) ? data.email : "";
  // data.password = !isEmpty(data.password) ? data.password : "";
  if (Validator.isEmpty(data.type)) {
    errors.type = "Type field is required";
  } else if (typeof data.type !== "string") {
    errors.type = "Invalid Type value";
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = "username is invalid";
  } else if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.username = "username must be 2 to 30 chars long";
  }

  if (
    Validator.isEmpty(data.password) ||
    !Validator.isLength(data.password, { min: 6, max: 30 })
  ) {
    errors.password = "Password is invalid";
  }

  return { errors, isValid: isEmpty(errors) };
};

module.exports = validations;
