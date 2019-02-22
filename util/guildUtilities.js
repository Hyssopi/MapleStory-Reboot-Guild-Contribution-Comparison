
import * as utilities from './utilities.js';


/**
 * Find guild entry of an implied specified day for a specific guild.
 *
 * @param guildEntries Entries containing all the guilds' data for that specific day
 * @param guildName Name of guild to search
 * @return Guild entry for a specific guild
 */
export function findGuildEntry(guildEntries, guildName)
{
  for (let i = 0; i < guildEntries.length; i++)
  {
    if (guildEntries[i].name === guildName)
    {
      return guildEntries[i];
    }
  }
}

/**
 * Find guild entry based on date in the day entries list for a specific guild.
 *
 * @param dayEntries List of entries by days, each day entry containing all the guilds and its data for that day
 * @param date Specific date (YYYY MM DD) of the entry to find
 * @param guildName Name of guild to search
 * @return Guild entry for a specific guild
 */
export function findGuildEntryByDate(dayEntries, date, guildName)
{
  for (let i = 0; i < dayEntries.length; i++)
  {
    // Date monthIndex is from 0 to 11.
    if (dayEntries[i].year === date.year() && (dayEntries[i].month - 1) === date.month() && dayEntries[i].day === date.date())
    {
      return findGuildEntry(dayEntries[i].guildEntries, guildName);
    }
  }
}

/**
 * Find guild entries based on date.
 *
 * @param dayEntries List of entries by days, each day entry containing all the guilds and its data for that day
 * @param date Specific date (YYYY MM DD) of the entry to find
 * @return Guild entries for a specific date
 */
export function findGuildEntriesByDate(dayEntries, date)
{
  for (let i = 0; i < dayEntries.length; i++)
  {
    // Date monthIndex is from 0 to 11.
    if (dayEntries[i].year === date.year() && (dayEntries[i].month - 1) === date.month() && dayEntries[i].day === date.date())
    {
      return dayEntries[i].guildEntries;
    }
  }
}

/**
 * Find the earliest guild entry date from all guilds.
 *
 * @param dayEntries List of entries by days, each day entry containing all the guilds and its data for that day
 * @return Moment date of the earliest guild entry date of all guilds
 */
export function findEarliestEntryDate(dayEntries)
{
  let earliestDate;
  for (let i = 0; i < dayEntries.length; i++)
  {
    let loopEntryDate = utilities.getMomentUtcDate(dayEntries[i].year, dayEntries[i].month, dayEntries[i].day);
    if (!earliestDate || moment(loopEntryDate).isBefore(earliestDate))
    {
      earliestDate = loopEntryDate;
    }
  }
  return earliestDate;
}

/**
 * Find the latest guild entry date from all guilds.
 *
 * @param dayEntries List of entries by days, each day entry containing all the guilds and its data for that day
 * @return Moment date of the latest guild entry date of all guilds
 */
export function findLatestEntryDate(dayEntries)
{
  let latestDate;
  for (let i = 0; i < dayEntries.length; i++)
  {
    let loopEntryDate = utilities.getMomentUtcDate(dayEntries[i].year, dayEntries[i].month, dayEntries[i].day);
    if (!latestDate || moment(loopEntryDate).isAfter(latestDate))
    {
      latestDate = loopEntryDate;
    }
  }
  return latestDate;
}

/**
 * Find the earliest entry date that has a valid contribution given a list of day entries for a specific guild.
 *
 * @param dayEntries List of entries by days, each day entry containing all the guilds and its data for that day
 * @param guildName Name of guild to search
 * @return Moment date of the earliest valid guild entry date for contribution for a specific guild
 */
export function findEarliestValidContributionEntryDate(dayEntries, guildName)
{
  let earliestDate;
  for (let i = 0; i < dayEntries.length; i++)
  {
    let loopEntryDate = utilities.getMomentUtcDate(dayEntries[i].year, dayEntries[i].month, dayEntries[i].day);
    if (!earliestDate || moment(loopEntryDate).isBefore(earliestDate))
    {
      let guildEntry = findGuildEntry(dayEntries[i].guildEntries, guildName);
      if (utilities.isNumeric(guildEntry.contribution))
      {
        earliestDate = loopEntryDate;
      }
    }
  }
  return earliestDate;
}

/**
 * Find the latest entry date that has a valid contribution given a list of day entries for a specific guild.
 *
 * @param dayEntries List of entries by days, each day entry containing all the guilds and its data for that day
 * @param guildName Name of guild to search
 * @return Moment date of the latest valid guild entry date for contribution for a specific guild
 */
export function findLatestValidContributionEntryDate(dayEntries, guildName)
{
  let latestDate;
  for (let i = 0; i < dayEntries.length; i++)
  {
    let loopEntryDate = utilities.getMomentUtcDate(dayEntries[i].year, dayEntries[i].month, dayEntries[i].day);
    if (!latestDate || moment(loopEntryDate).isAfter(latestDate))
    {
      let guildEntry = findGuildEntry(dayEntries[i].guildEntries, guildName);
      if (utilities.isNumeric(guildEntry.contribution))
      {
        latestDate = loopEntryDate;
      }
    }
  }
  return latestDate;
}

/**
 * Find the guild entry date that has a valid contribution at least one month prior to latestEntryDate, given a list of day entries for a specific guild.
 *
 * @param latestEntryDate Latest entry date regardless of whether it is a valid or invalid entry
 * @param dayEntries List of entries by days, each day entry containing all the guilds and its data for that day
 * @param guildName Name of guild to search
 * @return Moment date of the latest valid guild entry date for contribution for a specific guild
 */
export function findEarlierMonthValidEntryDate(latestEntryDate, dayEntries, guildName)
{
  let earliestValidEntryDate = findEarliestValidContributionEntryDate(dayEntries, guildName);
  let earlierMonthValidEntryDate = null;
  
  // Note: the latest entry date considers all guilds, not individual guild entries.
  for (let loopDate = moment(latestEntryDate).subtract(1, 'months'); loopDate.isSameOrAfter(earliestValidEntryDate); loopDate.subtract(1, 'days'))
  {
    if (utilities.isNumeric(findGuildEntryByDate(dayEntries, loopDate, guildName).contribution))
    {
      earlierMonthValidEntryDate = loopDate;
      break;
    }
  }
  return earlierMonthValidEntryDate;
}

/**
 * Find the lowest contribution value of a given guild given a list of day entries.
 *
 * @param dayEntries List of entries by days, each day entry containing all the guilds and its data for that day
 * @param guildName Name of guild to search
 * @return Lowest contribution value of a specific guild
 */
export function findLowestContributionAmount(dayEntries, guildName)
{
  let lowestContributionAmount = Number.MAX_SAFE_INTEGER;
  for (let i = 0; i < dayEntries.length; i++)
  {
    let guildEntry = findGuildEntry(dayEntries[i].guildEntries, guildName);
    if (utilities.isNumeric(guildEntry.contribution) && guildEntry.contribution < lowestContributionAmount)
    {
      lowestContributionAmount = guildEntry.contribution;
    }
  }
  return lowestContributionAmount;
}

/**
 * Find the highest contribution value of a given guild given a list of day entries.
 *
 * @param dayEntries List of entries by days, each day entry containing all the guilds and its data for that day
 * @param guildName Name of guild to search
 * @return Highest contribution value of a specific guild
 */
export function findHighestContributionAmount(dayEntries, guildName)
{
  let highestContributionAmount = Number.MIN_SAFE_INTEGER;
  for (let i = 0; i < dayEntries.length; i++)
  {
    let guildEntry = findGuildEntry(dayEntries[i].guildEntries, guildName);
    if (utilities.isNumeric(guildEntry.contribution) && guildEntry.contribution > highestContributionAmount)
    {
      highestContributionAmount = guildEntry.contribution;
    }
  }
  return highestContributionAmount;
}

/**
 * Print debug statements regarding guildData.
 *
 * @param guildData Contains all the guild data and data entries
 */
export function printDebug(guildData)
{
  console.log("*****printDebug() TEST PRINT START*****");
  console.log('Guild data:');
  console.log(guildData);
  console.log('\n');
  console.log('findEarliestEntryDate = ' + utilities.getFormattedDate(findEarliestEntryDate(guildData.dayEntries)));
  let latestEntryDate = findLatestEntryDate(guildData.dayEntries);
  console.log('findLatestEntryDate = ' + utilities.getFormattedDate(latestEntryDate));
  console.log('\n');
  
  for (let i = 0; i < guildData.guilds.length; i++)
  {
    let guildName = guildData.guilds[i].name;
    let guildEntries = guildData.guilds[i].entries;
    
    console.log('guildData.guilds[' + i + ']: ' + guildName);
    
    console.log('findEarliestValidContributionEntryDate = ' + utilities.getFormattedDate(findEarliestValidContributionEntryDate(guildData.dayEntries, guildName)));
    console.log('findLatestValidContributionEntryDate = ' + utilities.getFormattedDate(findLatestValidContributionEntryDate(guildData.dayEntries, guildName)));
    console.log('findEarlierMonthValidEntryDate = ' + utilities.getFormattedDate(findEarlierMonthValidEntryDate(latestEntryDate, guildData.dayEntries, guildName)));
    
    console.log('findLowestContributionAmount = ' + findLowestContributionAmount(guildData.dayEntries, guildName));
    console.log('findHighestContributionAmount = ' + findHighestContributionAmount(guildData.dayEntries, guildName));
    
    console.log('\n');
  }
  console.log("*****printDebug() TEST PRINT END*****");
}
