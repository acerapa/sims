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
  static objectReset = (obj) => {
    const keys = Object.keys(obj);
    const newObj = {};
    keys.forEach((key) => {
      switch (typeof obj[key]) {
        case "string":
          obj[key] = "";
          break;
        case "number":
          obj[key] = 0;
        case "object":
          if (Array.isArray(obj[key])) {
            obj[key] = [];
          } else {
            obj[key] = {};
          }
      }
      newObj[key] = "";
    });

    return newObj;
  };
}

module.exports = { ObjectHelpers };
