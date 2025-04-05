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
   * @returns object
   */
  static copyObj = (obj) => {
    if (typeof obj != "object" || Array.isArray(obj)) {
      console.error("`obj` must be of type object");
      return;
    }

    const newObj = {};

    for (let key in obj) {
      if (typeof obj[key] == "object") {
        if (Array.isArray(obj[key])) {
          newObj[key] = this.copyArr(obj[key]);
        } else {
          newObj[key] = this.copyObj(obj[key]);
        }
      } else {
        newObj[key] = obj[key];
      }
    }

    return newObj;
  };

  /**
   * Cloning an array and cut references from the original
   * @param {*} arr
   * @returns
   */
  static copyArr = (arr) => {
    if (!Array.isArray(arr)) {
      console.error("`arr` must be of type array");
      return;
    }
    const copiedArr = [];

    for (let ndx = 0; ndx < arr.length; ndx++) {
      if (typeof arr[ndx] == "object") {
        if (Array.isArray(arr[ndx])) {
          copiedArr.push(this.copyArr(arr[ndx]));
        } else {
          copiedArr.push(this.copyObj(arr[ndx]));
        }
      } else {
        copiedArr.push(arr[ndx]);
      }
    }

    return copiedArr;
  };

  /**
   * This function will compare two objects and returns boolean
   *
   * Criteria for validating:
   * 1. The number of keys must be the same
   * 2. The values of the keys must be the same
   *
   * @param {*} obj1
   * @param {*} obj2
   *
   * @returns boolean
   */
  static compareObjects = (obj1, obj2) => {
    if (typeof obj1 != "object" || typeof obj2 != "object") {
      console.error("`obj1` and `obj2` must be of type object");
      return;
    } else if (Array.isArray(obj1) || Array.isArray(obj2)) {
      console.error("`obj1` and `obj2` must not be of type array");
      return;
    }

    // validating if keys are the same
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length != keys2.length) {
      return false;
    } else {
      for (const key of keys1) {
        if (!keys2.includes(key)) {
          return false;
        }
      }
    }

    // validating if values are the same
    for (const key in obj1) {
      // type checking
      if (typeof obj1[key] != typeof obj2[key]) {
        return false;
      } else {
        if (typeof obj1[key] == "object") {
          if (Object.is(null, obj1[key]) != Object.is(null, obj2[key])) {
            return false;
          } else if (
            Object.is(null, obj1[key]) == true &&
            Object.is(null, obj2[key]) == true
          ) {
            continue;
          } else if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
            if (!this.compareArrays(obj1[key], obj2[key])) return false;
          } else if (!Array.isArray(obj1[key]) && !Array.isArray(obj2[key])) {
            if (!this.compareObjects(obj1[key], obj2[key])) return false;
          } else {
            return false;
          }
        } else {
          if (obj1[key] != obj2[key]) {
            return false;
          }
        }
      }
    }

    return true;
  };

  /**
   * This function will compare two array and returns boolean
   * Criteria for validating
   * 1. Values must be the same
   * 2. Order must be the same
   *
   * @param {*} arr1
   * @param {*} arr2
   *
   * @returns boolean
   */
  static compareArrays = (arr1, arr2) => {
    if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
      console.error("`arr1` and `arr2` must be of type array");
      return;
    }

    // check the length of both arrays
    if (arr1.length != arr2.length) {
      return false;
    }

    // check if the values are the same
    for (let i = 0; i < arr1.length; i++) {
      // type checking
      if (typeof arr1[i] != typeof arr2[i]) {
        return false;
      } else {
        if (typeof arr1[i] == "object") {
          if (Object.is(null, arr1[i]) != Object.is(null, arr2[i]))
            return false;
          else if (Object.is(null, arr1[i]) == Object.is(null, arr2[i]))
            continue;
          if (Array.isArray(arr1[i]) && Array.isArray(arr2[i])) {
            if (!this.compareArrays(arr1[i], arr2[i])) return false;
          } else if (!Array.isArray(arr1[i]) && !Array.isArray(arr2[i])) {
            if (!this.compareObjects(arr1[i], arr2[i])) return false;
          } else {
            return false;
          }
        } else {
          if (arr1[i] != arr2[i]) {
            return false;
          }
        }
      }
    }

    return true;
  };
}

module.exports = { ObjectHelpers };
