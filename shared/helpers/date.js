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

    const hour = dt.getHours();
    const minutes = dt.getMinutes();
    const seconds = dt.getSeconds();

    const meridiems = ["-A", "-a"];

    const doFormatHasRmMeridiem = meridiems.find((m) => format.includes(m));

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

    // formatting hour start
    if (format.includes("HH")) {
      if (format.includes("A")) {
        format = format.replaceAll("HH", hour.toString().padStart(2, "0"));
        if (!doFormatHasRmMeridiem) {
          format = format.replaceAll("a", hour > 12 ? "PM" : "AM");
        }
      } else if (format.includes("a")) {
        // converting military time to standard
        const h = hour > 12 ? hour - 12 : hour;
        format = format.replaceAll("HH", h.toString().padStart(2, "0"));
        if (!doFormatHasRmMeridiem) {
          format = format.replaceAll("a", hour > 12 ? "PM" : "AM");
        }
      } else {
        format = format.replaceAll("HH", hour.toString().padStart(2, "0"));
      }
    }

    if (format.includes("H")) {
      if (format.includes("A")) {
        format = format.replaceAll("H", hour.toString());
        format = format.replaceAll("a", hour > 12 ? "PM" : "AM");
      } else if (format.includes("a")) {
        // converting military time to standard
        const h = hour > 12 ? hour - 12 : hour;
        format = format.replaceAll("H", h.toString());
        format = format.replaceAll("a", hour > 12 ? "PM" : "AM");
      } else {
        format = format.replaceAll("H", hour.toString());
      }
    }
    // formatting hours end

    // formatting minutes start
    if (format.includes("II")) {
      format = format.replaceAll("II", minutes.toString().padStart(2, "0"));
    }

    if (format.includes("I")) {
      format = format.replaceAll("I", minutes.toString());
    }
    // formatting minutes end

    // formatting seconds start
    if (format.includes("SS")) {
      format = format.replaceAll("SS", seconds.toString().padStart(2, "0"));
    }

    if (format.includes("S")) {
      format = format.replaceAll("S", seconds.toString());
    }
    // formatting seconds end

    if (doFormatHasRmMeridiem) {
      format = format.replaceAll(doFormatHasRmMeridiem, "").trim();
    }

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
