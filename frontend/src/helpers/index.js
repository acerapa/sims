export const Helpers = {
  /**
   * Reset object to it's default form
   * @param {*} obj
   * @returns
   */
  objectReset: (obj) => {
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
  },

  /**
   * Date formatter
   * Please refer to this formats
   *
   * NOTE: Same way as DAY
   * for MONTHS = use M or MM
   * M = 1,2 => single digits
   * MM = 01,02 => double digits
   *
   * for YEARS = use YYYY or YY
   * ex.
   * YYYY = 2024
   * YY = 24
   *
   * @param { String | Date } date
   * @param { String } format
   * @returns { String }
   */
  formatDate: (date, format = "MM/DD/YYYY") => {
    if (!date || isNaN(new Date(date))) {
      console.error("Helpers => formatDate(): Invalid date");
      return;
    }

    const dt = new Date(date);

    const year = dt.getFullYear().toString();
    const day = dt.getDate();
    const month = dt.getMonth() + 1;

    // formatting month start
    if (format.includes("MM")) {
      format = format.replaceAll("MM", month.toString().padStart(2, "0"));
    }

    if (format.includes("M")) {
      format = format.replaceAll("M", month.toString());
    }
    // formatting month end

    // formatting day start
    if (format.includes("DD")) {
      format = format.replaceAll("DD", day.toString().padStart(2, "0"));
    }

    if (format.includes("D")) {
      format = format.replaceAll("D", day.toString());
    }
    // formatting day end

    // formatting year start
    if (format.includes("YYYY")) {
      format = format.replaceAll("YYYY", year);
    }

    if (format.includes("YY")) {
      format = format.replaceAll(
        "YY",
        (year % 100).toString().padStart(2, "0")
      );
    }
    // formatting year end

    return format;
  },
};
