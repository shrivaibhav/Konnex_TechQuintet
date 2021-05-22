const Validator = require("validator");
const isEmpty = require("./isEmpty");
const usersValidations = require("./usersValidation");

var ideasValidations = {};

ideasValidations.validateUpdate = (description) => {
  let errors = {};
  description = !isEmpty(description) ? description : "";
  if (!Validator.isLength(description, { min: 8, max: 500 })) {
    errors.description = "description must be between  and 500 characters";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

ideasValidations.validateUpdateReward = (data) => {
  let errors = usersValidations.validateUsername(data.username).errors;
  if (
    typeof data.reward !== "number" ||
    (typeof data.reward === "number" && data.reward < 0)
  ) {
    errors.reward = "reward value is invalid";
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};

ideasValidations.validateRegisterIdea = function validateRegisterIdea(data) {
  let errors = {};

  data.description = !isEmpty(data.description) ? data.description : "";
  data.username = !isEmpty(data.username) ? data.username : "";
  //   data.rewardsEarned =
  //     typeof data.rewardsEarned === "number" && data.rewardsEarned >= 0
  //       ? data.rewardsEarned
  //       : 0;
  data.tags = !isEmpty(data.tags) ? data.tags : [];
  data.rewardsEarned =
    data.rewardsEarned === undefined || data.rewardsEarned === null
      ? 0
      : data.rewardsEarned;

  if (Validator.isEmpty(data.description)) {
    errors.description = "description field is required";
  } else if (!Validator.isLength(data.description, { min: 8, max: 500 })) {
    errors.description = "description must be between  and 500 characters";
  }

  if (Validator.isEmpty(data.username)) {
    errors.username = "Username is invalid";
  } else if (!Validator.isLength(data.username, { min: 2, max: 30 })) {
    errors.username = "username must be 2 to 30 chars long";
  }

  if (
    typeof data.rewardsEarned !== "number" ||
    (typeof data.rewardsEarned === "number" && data.rewardsEarned < 0)
  ) {
    errors.rewardsEarned = "rewardsEarned is invalid";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

module.exports = ideasValidations;
