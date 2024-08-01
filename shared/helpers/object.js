class ObjectHelpers {
  static assignSameFields = (target, source) => {
    Object.keys(target).forEach((key) => {
      target[key] = source[key];
    });

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
