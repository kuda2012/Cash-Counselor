let moment = require("moment");
var month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
function setPeriod(startOfPeriod) {
  let period = new Map();
  if (startOfPeriod === "last_7_days") {
    period.start_date = moment().subtract(6, "days").format("YYYY-MM-DD");
    period.end_date = moment().format("YYYY-MM-DD");
  } else if (startOfPeriod === "last_14_days") {
    period.start_date = moment().subtract(13, "days").format("YYYY-MM-DD");
    period.end_date = moment().format("YYYY-MM-DD");
  } else if (startOfPeriod === "this_month") {
    period.start_date = moment().startOf("month").format("YYYY-MM-DD");
    period.end_date = moment().format("YYYY-MM-DD");
  } else if (startOfPeriod === "last_month") {
    period.start_date = moment()
      .subtract(1, "month")
      .startOf("month")
      .format("YYYY-MM-DD");
    period.end_date = moment()
      .subtract(1, "month")
      .endOf("month")
      .format("YYYY-MM-DD");
  } else if (startOfPeriod === "last_3_months") {
    period.start_date = moment()
      .subtract(2, "month")
      .startOf("month")
      .format("YYYY-MM-DD");
    period.end_date = moment().format("YYYY-MM-DD");
  } else if (startOfPeriod === "last_6_months") {
    period.start_date = moment()
      .subtract(5, "month")
      .startOf("month")
      .format("YYYY-MM-DD");
    period.end_date = moment().format("YYYY-MM-DD");
  } else if (startOfPeriod === "last_12_months") {
    period.start_date = moment()
      .subtract(11, "month")
      .startOf("month")
      .format("YYYY-MM-DD");
    period.end_date = moment().format("YYYY-MM-DD");
  } else if (startOfPeriod === "this_year") {
    period.start_date = moment().startOf("year").format("YYYY-MM-DD");
    period.end_date = moment().format("YYYY-MM-DD");
  } else if (startOfPeriod === "last_year") {
    period.start_date = moment()
      .subtract(1, "year")
      .startOf("year")
      .format("YYYY-MM-DD");
    period.end_date = moment()
      .subtract(1, "year")
      .endOf("year")
      .format("YYYY-MM-DD");
  } else if (startOfPeriod === "last_24_months") {
    period.start_date = moment()
      .subtract(23, "months")
      .startOf("month")
      .format("YYYY-MM-DD");
    period.end_date = moment().format("YYYY-MM-DD");
  } else if (startOfPeriod === "last_30_days") {
    period.start_date = moment()
      .subtract(8, "month")
      .subtract(30, "days")
      .format("YYYY-MM-DD");
    period.end_date = moment().subtract(8, "month").format("YYYY-MM-DD");
  }
  return period;
}

function getPeriodLabels({ start_date, end_date }) {
  let beginning = moment(start_date);
  let end = moment(end_date);
  let diff = end.diff(beginning, "days");
  let labels = new Map();
  if (diff <= 30) {
    labels.dates = [];
    if (beginning.date() < end.date()) {
      for (let i = beginning.date(); i <= end.date(); i++) {
        labels.dates.push({ name: i, amount: 0 });
      }
    } else {
      for (
        let i = beginning.date();
        i <= end.date() + beginning.daysInMonth();
        i++
      ) {
        if (i <= beginning.daysInMonth()) {
          labels.dates.push({ name: i, amount: 0 });
        } else {
          labels.dates.push({ name: i - beginning.daysInMonth(), amount: 0 });
        }
      }
    }
    labels.monthYear = [
      [beginning.format("MMM"), beginning.format("YYYY")],
      [end.format("MMM"), end.format("YYYY")],
    ];
  } else {
    labels.monthYear = [
      [beginning.format("MMM"), beginning.format("YYYY")],
      [end.format("MMM"), end.format("YYYY")],
    ];
    let interim = beginning.clone();
    labels.months = [];
    while (end > interim || interim.format("M") === end.format("M")) {
      labels.months.push({ name: interim.format("MMM"), amount: 0 });
      interim.add(1, "month");
    }
  }
  return labels;
}

module.exports = { setPeriod, getPeriodLabels };
