class DateHelpers {
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

  static formatDate = (date, format = "MM/DD/YYYY") => {
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
  };

  static getRangeDates = (from, to, compareTo) => {
    let poDate = new Date(compareTo);
    if (from && to) {
      let f = new Date(from);
      let t = new Date(to);

      return poDate >= f && poDate <= t;
    } else if (from && !to) {
      let f = new Date(from);
      return poDate >= f;
    } else if (!from && to) {
      let t = new Date(to);
      return poDate <= t;
    } else {
      return true;
    }
  };
}

module.exports = { DateHelpers };
