class ObjectHelpers {
  // TODO: Need to create a function that will identify if the object is change depending on the
  // TODO: values form before and after.
  // TODO: The function is already created but the logic is not yet add (name: isObjectDifferent)

  static isObjectDifferent = () => true;

  static assignSameFields = (target, source) => {
    // parameter check
    if (typeof target != "object" && Array.isArray(target)) {
      console.error("target must be object");
      return;
    }

    if (typeof source != "object" && Array.isArray(source)) {
      console.error("source must be object");
      return;
    }

    for (const key in source) {
      if (target.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }

    return target;
  };

  /**
   * Reset object to it's default form
   * @param {*} obj
   * @returns
   */
  static objectReset = (obj, options) => {
    const keys = Object.keys(obj);
    const newObj = {};
    keys.forEach((key) => {
      switch (typeof obj[key]) {
        case "string":
          newObj[key] = "";
          break;
        case "number":
          newObj[key] = 0;
        case "object":
          if (Array.isArray(obj[key])) {
            newObj[key] = [];
          } else {
            // reset the child objects recursively
            newObj[key] = this.objectReset(obj[key]);
          }
      }
    });

    return newObj;
  };

  /**
   * This function will create a copy of the object cutting any references from the original
   *
   * @param {*} obj target object
   * @param {*} preserveType preserve the type of the values in the object
   * @returns object
   */
  static copyObj = (obj, preserveType = false) => {
    if (typeof obj != "object" || Array.isArray(obj)) {
      console.error("`obj` must be of type object");
      return;
    }

    return !preserveType ? JSON.parse(JSON.stringify(obj)) : obj;
  };
}

module.exports = { ObjectHelpers };
