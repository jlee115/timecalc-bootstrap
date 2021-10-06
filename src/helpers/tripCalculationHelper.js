

function calculateTripCost(rates, taxes, startDate, startTime, endDate, endTime) {
  const tripDuration = calculateTripDuration(startDate, startTime, endDate, endTime);
  let tripCost = 0.0;
  let accessFeeCost = 0.0;

  tripCost += tripDuration.days * rates.dayRate
  if (tripDuration.hours >= 6) {
    tripCost += rates.dayRate;
  } else {
    tripCost += tripDuration.hours * rates.hourRate;
    if (tripDuration.minutes > 36) {
      tripCost += rates.hourRate;
    } else {
      tripCost += tripDuration.minutes * rates.minuteRate;
    }
  }

  if (tripCost > 0) {
    accessFeeCost = rates.accessFee;
  }

  const pvrtCost = calculatePvrt(rates, tripDuration, startDate, endDate);
  const taxOnTripCost = calculateTax(tripCost, [taxes.pst, taxes.gst]);
  const taxOnPVRT = calculateTax(pvrtCost, [taxes.pst]);
  const taxOnAccessFee = calculateTax(accessFeeCost, [taxes.pst, taxes.gst]);

  const totalCost = {
    tripCost: tripCost,
    taxOnTripCost: taxOnTripCost,
    pvrtCost: pvrtCost,
    taxOnPvrt: taxOnPVRT,
    accessFeeCost: accessFeeCost,
    taxOnAccessFee: taxOnAccessFee,
  }

  return totalCost;
}

function calculatePvrt(rates, tripDuration, startDate, endDate) {
  let pvrtCost = 0
  if (tripDuration.hours >= 8 || tripDuration.days > 0) {
    let tempStartDate = new Date(startDate)
    tempStartDate.setHours(0, 0, 0);

    let tempEndDate = new Date(endDate)
    tempEndDate.setHours(0, 0, 0);

    let dayDifference = Math.floor((tempEndDate - tempStartDate) / 86400000)
    pvrtCost = (dayDifference + 1) * rates.pvrtRate
  }

  return pvrtCost;
}

function calculateTax(costBeforeTaxes, applicableTaxes) {
  const sumTaxes = applicableTaxes.reduce((a, b) => a + b);
  return costBeforeTaxes * sumTaxes / 100;
}

function calculateTripDuration(startDate, startTime, endDate, endTime) {
  let startDateTime = new Date(startDate)
  startDateTime.setHours(parseInt(startTime.slice(0,2)), parseInt(startTime.slice(3)), 0, 0);

  let endDateTime = new Date(endDate)
  endDateTime.setHours(parseInt(endTime.slice(0,2)), parseInt(endTime.slice(3)), 0, 0);

  let timeDifference = endDateTime - startDateTime

  let dayDifference = Math.floor(timeDifference / 86400000)
  let hourDifference = (Math.floor(timeDifference / 3600000)) - (dayDifference * 24)
  let minuteDifference = (Math.floor(timeDifference / 60000)) - (dayDifference * 24 * 60) - (hourDifference * 60)
  var tripDuration = {
    days: dayDifference,
    hours: hourDifference,
    minutes: minuteDifference
  }
  return tripDuration;
}

module.exports = {
  calculateTripCost,
  calculateTripDuration
}