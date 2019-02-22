
/**
 * Checks to see if input is a valid number.
 *
 * @param input Possible number
 * @return Whether the input is a valid number
 */
export function isNumeric(input)
{
  return !isNaN(parseFloat(input)) && isFinite(input);
}

/**
 * Get Moment date with UTC inputs.
 *
 * @param year Year
 * @param month Month ranging from 1 to 12
 * @param day Day
 * @param hours Hours
 * @param minutes Minutes
 * @param seconds Seconds
 * @param milliseconds Milliseconds
 * @return Moment date in UTC
 */
export function getMomentUtcDate(year, month, day, hours = 0, minutes = 0, seconds = 0, milliseconds = 0)
{
  let dateString = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + '.' + milliseconds + '+0000';
  return moment(dateString, "YYYY-MM-DDTHH:mm:ss.SSSZ").utc();
}

/**
 * Returns formatted number with comma in thousands places.
 *
 * @param number Number to be formatted
 * @return Formatted number with comma in thousands places
 */
export function thousandsCommaFormatNumber(number)
{
  let parts = number.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

/**
 * Returns formatted date in DD MMM YYYY format.
 *
 * @param date Date object or Moment date to be formatted
 * @return Formatted date
 */
export function getFormattedDate(date)
{
  return moment(date).format('DD MMM YYYY');
}

/**
 * Get the difference duration of two dates in "X years, Y months, Z days" format.
 *
 * @param date1 Moment date
 * @param date2 Moment date to difference
 * @return String text difference duration of two dates in "X years, Y months, Z days" format
 */
export function getFormattedDateDifferenceDuration(date1, date2)
{
  let dateDifference = date1.diff(date2);
  let dateDifferenceDuration = moment.duration(dateDifference);
  
  let formattedDateDifferenceText = '';
  if (dateDifferenceDuration.years() > 0)
  {
    formattedDateDifferenceText += dateDifferenceDuration.years() + ' ';
    formattedDateDifferenceText += (dateDifferenceDuration.years() === 1) ? 'year' : 'years';
    formattedDateDifferenceText += ', ';
  }
  if (dateDifferenceDuration.months() > 0)
  {
    formattedDateDifferenceText += dateDifferenceDuration.months() + ' ';
    formattedDateDifferenceText += (dateDifferenceDuration.months() === 1) ? 'month' : 'months';
    formattedDateDifferenceText += ', ';
  }
  if (dateDifferenceDuration.days() > 0)
  {
    formattedDateDifferenceText += dateDifferenceDuration.days() + ' ';
    formattedDateDifferenceText += (dateDifferenceDuration.days() === 1) ? 'day' : 'days';
  }
  if (!formattedDateDifferenceText)
  {
    formattedDateDifferenceText = '0 days';
  }
  
  return formattedDateDifferenceText;
}

/**
 * Generate random integer between inclusive min and inclusive max.
 *
 * @param min Inclusive minimum
 * @param max Inclusive maximum
 * @return Random integer between inclusive min and inclusive max
 */
export function generateRandomInteger(min, max)
{
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Determine if random roll is successful.
 *
 * @param successRate Success rate from 1 to 100
 * @return Boolean whether the random roll is successful
 */
export function isRandomSuccess(successRate)
{
  return generateRandomInteger(1, 100) <= successRate;
}
