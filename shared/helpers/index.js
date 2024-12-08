const { DateHelpers } = require("./date");
const { ObjectHelpers } = require("./object");
const FunctionCooldownManager = require("./fn-cooldown-manager");
const { ValidatorHelpers } = require("./validators-helpers");

class GeneralHelpers {
  /**
   * Get range from start to end
   *
   * @param {*} start Number
   * @param {*} end Number
   */
  static getRange(start, end) {
    if (!start && !end) {
      throw "GeneralHelpers: getRange() => Require to pass atleast on parameter";
    }

    if (start > end) {
      // TODO: Create a method to automatically get the classname and function name to generate message for errors
      throw "GeneralHelpers: getRange() => Start should not be greater than end";
    }

    const inc = end ? start : 0;
    const diff = end ? end - start : start;
    return Array.from(Array(diff), (i, key) => key + inc);
  }
}

module.exports = {
  DateHelpers,
  ObjectHelpers,
  GeneralHelpers,
  ValidatorHelpers,
  FunctionCooldownManager,
};
