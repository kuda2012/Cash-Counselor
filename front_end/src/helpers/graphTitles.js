export const graphTitles = (showBar, trendTransactions) => {
  let title;

  /* Date Periods for Date by Date*/

  /* Dates in same month*/
  if (
    showBar &&
    trendTransactions.labels.dates &&
    trendTransactions.labels.monthYear[0][0] ===
      trendTransactions.labels.monthYear[1][0]
  ) {
    /* Dates in same month*/
    title = `${trendTransactions.labels.monthYear[0][0]} ${trendTransactions.labels.monthYear[0][1]}`;
  } else if (
    showBar &&
    trendTransactions.labels.dates &&
    trendTransactions.labels.monthYear[0][1] !==
      trendTransactions.labels.monthYear[1][1]
  ) {
    /* Dates in different months */
    title = `${trendTransactions.labels.monthYear[0][0]} ${trendTransactions.labels.monthYear[0][1]} - ${trendTransactions.labels.monthYear[1][0]} ${trendTransactions.labels.monthYear[1][1]} `;
  } else if (
    showBar &&
    trendTransactions.labels.dates &&
    trendTransactions.labels.monthYear[0][1] ===
      trendTransactions.labels.monthYear[1][1] &&
    trendTransactions.labels.monthYear[0][0] !==
      trendTransactions.labels.monthYear[1][0]
  ) {
    /* One Month */
    title = `${trendTransactions.labels.monthYear[0][0]} - ${trendTransactions.labels.monthYear[1][0]} ${trendTransactions.labels.monthYear[0][1]}`;
  } else if (
    (showBar || !showBar) &&
    trendTransactions.labels.months &&
    trendTransactions.labels.monthYear[0][1] ===
      trendTransactions.labels.monthYear[1][1] &&
    trendTransactions.labels.monthYear[0][0].concat(
      trendTransactions.labels.monthYear[1][0]
    ) !== "JanDec"
  ) {
    /* Month to given month except for Jan-dec */
    title = `${trendTransactions.labels.monthYear[0][0]} - ${trendTransactions.labels.monthYear[1][0]} ${trendTransactions.labels.monthYear[0][1]}`;
  } else if (
    (showBar || !showBar) &&
    trendTransactions.labels.months &&
    trendTransactions.labels.monthYear[0][1] ===
      trendTransactions.labels.monthYear[1][1] &&
    trendTransactions.labels.monthYear[0][0] === "Jan"
  ) {
    /* Full Year */
    title = `${trendTransactions.labels.monthYear[0][1]}`;
  } else if (
    (showBar || !showBar) &&
    trendTransactions.labels.months &&
    trendTransactions.labels.monthYear[0][1] !==
      trendTransactions.labels.monthYear[1][1]
  ) {
    /* Month to given month if they have different years */
    title = `${trendTransactions.labels.monthYear[0][0]} ${trendTransactions.labels.monthYear[0][1]} - ${trendTransactions.labels.monthYear[1][0]} ${trendTransactions.labels.monthYear[1][1]}`;
  } else if (
    !showBar &&
    trendTransactions.labels.dates &&
    trendTransactions.labels.dates.length < 15
  ) {
    /* Last 7 or last 15 days */
    title = `${trendTransactions.labels.monthYear[0][0]} ${
      trendTransactions.labels.dates[0].name
    } - ${trendTransactions.labels.monthYear[1][0]} ${
      trendTransactions.labels.dates[trendTransactions.labels.dates.length - 1]
        .name
    } `;
  } else if (
    !showBar &&
    trendTransactions.labels.dates &&
    trendTransactions.labels.dates.length > 15
  ) {
    /* Full Month */
    title = `${trendTransactions.labels.monthYear[0][0]} ${trendTransactions.labels.monthYear[0][1]}`;
  }
  return title;
};
