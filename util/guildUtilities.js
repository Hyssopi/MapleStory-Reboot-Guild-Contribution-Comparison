
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
 * Calculate and return processed guild data packaged as a neat object.
 *
 * @param guildData Contains all the guild data and data entries
 * @return Processed guild data
 */
export function calculateGuildSummaryResults(guildData)
{
  let latestEntryDate = findLatestEntryDate(guildData.dayEntries);
  let guildSummaryResults = [];
  for (let i = 0; i < guildData.guilds.length; i++)
  {
    console.info('Calculating average for ' + guildData.guilds[i].name + '...');
    
    let latestValidEntryDate = findLatestValidContributionEntryDate(guildData.dayEntries, guildData.guilds[i].name);
    let latestValidContribution = findGuildEntryByDate(guildData.dayEntries, latestValidEntryDate, guildData.guilds[i].name).contribution;
    
    let earlierMonthValidEntryDate = findEarlierMonthValidEntryDate(latestEntryDate, guildData.dayEntries, guildData.guilds[i].name);
    if (!earlierMonthValidEntryDate)
    {
      console.log('earlierMonthValidEntryDate is null for ' + guildData.guilds[i].name + ', setting it to latestValidEntryDate so it will be caught later as invalid average calculation');
      earlierMonthValidEntryDate = moment(latestValidEntryDate);
    }
    let earlierMonthValidContribution = findGuildEntryByDate(guildData.dayEntries, earlierMonthValidEntryDate, guildData.guilds[i].name).contribution;
    
    let averagePerDay = (latestValidContribution - earlierMonthValidContribution) / latestValidEntryDate.diff(earlierMonthValidEntryDate, 'days');
    if (moment.duration(latestEntryDate.diff(earlierMonthValidEntryDate)) > moment.duration(5, 'weeks'))
    {
      console.log('averagePerDay date ranges are too far. latestEntryDate: ' + utilities.getFormattedDate(latestEntryDate) + ', earlierMonthValidEntryDate: ' + utilities.getFormattedDate(earlierMonthValidEntryDate));
      averagePerDay = '-';
    }
    else if (moment.duration(latestValidEntryDate.diff(earlierMonthValidEntryDate)) < moment.duration(2, 'weeks'))
    {
      console.log('averagePerDay date ranges are too close. latestValidEntryDate: ' + utilities.getFormattedDate(latestValidEntryDate) + ', earlierMonthValidEntryDate: ' + utilities.getFormattedDate(earlierMonthValidEntryDate));
      averagePerDay = '-';
    }
    
    let guildSummaryResult =
    {
      guildName: guildData.guilds[i].name,
      guildColor: guildData.guilds[i].color,
      guildBackgroundColor: guildData.guilds[i].backgroundColor,
      guildSymbolUrl: guildData.guilds[i].symbolUrl,
      latestValidEntryDate: latestValidEntryDate,
      latestValidContribution: latestValidContribution,
      earlierMonthValidEntryDate: earlierMonthValidEntryDate,
      earlierMonthValidContribution: earlierMonthValidContribution,
      averagePerDay: averagePerDay
    }
    guildSummaryResults.push(guildSummaryResult);
  }
  
  guildSummaryResults.sort(function(a, b){return b.latestValidContribution - a.latestValidContribution;});
  
  for (let i = 0; i < guildSummaryResults.length; i++)
  {
    let guildSummaryResult = guildSummaryResults[i];
    console.table(
    {
      guildName: guildSummaryResult.guildName,
      guildColor: guildSummaryResult.guildColor,
      guildBackgroundColor: guildSummaryResult.guildBackgroundColor,
      guildSymbolUrl: guildSummaryResult.guildSymbolUrl,
      latestValidEntryDate: utilities.getFormattedDate(guildSummaryResult.latestValidEntryDate),
      latestValidContribution: utilities.thousandsCommaFormatNumber(guildSummaryResult.latestValidContribution),
      earlierMonthValidEntryDate: utilities.getFormattedDate(guildSummaryResult.earlierMonthValidEntryDate),
      earlierMonthValidContribution: utilities.thousandsCommaFormatNumber(guildSummaryResult.earlierMonthValidContribution),
      averagePerDay: utilities.thousandsCommaFormatNumber(guildSummaryResult.averagePerDay)
    });
  }
  console.log('guildSummaryResults:');
  console.log(guildSummaryResults);
  
  return guildSummaryResults;
}

/**
 * Calculate and return processed guild data table rows.
 * Each row contains a date and a list of all the guilds and each guild data entry having contribution/member count, and contribution/member count difference from last valid entry.
 *
 * @param guilds Contents of the guilds from guildData
 * @param dayEntries List of entries by days, each day entry containing all the guilds and its data for that day
 * @return Processed guild data table rows
 */
export function calculateGuildDataTableRows(guilds, dayEntries)
{
  let guildDataTableRows = [];
  
  let previousValidGuildContributionDates = [];
  let previousValidGuildMemberCountDates = [];
  
  let earliestEntryDate = findEarliestEntryDate(dayEntries);
  let latestEntryDate = findLatestEntryDate(dayEntries);
  
  for (let loopDate = moment(earliestEntryDate); loopDate.isSameOrBefore(latestEntryDate); loopDate.add(1, 'days'))
  {
    let guildDataTableRow =
    {
      date: moment(loopDate),
      guilds: []
    };
    
    let guildEntries = findGuildEntriesByDate(dayEntries, loopDate);
    for (let i = 0; i < guilds.length; i++)
    {
      let guildEntry = findGuildEntry(guildEntries, guilds[i].name);
      
      let contribution = (guildEntry && guildEntry.contribution) ? guildEntry.contribution : '-';
      let memberCount = (guildEntry && guildEntry.memberCount) ? guildEntry.memberCount : '-';
      
      // Find the averaged contribution given the contribution of the current given date and the previous valid contribution.
      let contributionDifferenceFromLastEntryAveraged = '-';
      if (utilities.isNumeric(contribution))
      {
        if (previousValidGuildContributionDates[i])
        {
          contributionDifferenceFromLastEntryAveraged = (contribution - findGuildEntryByDate(dayEntries, previousValidGuildContributionDates[i], guilds[i].name).contribution) / loopDate.diff(previousValidGuildContributionDates[i], 'days');
        }
        previousValidGuildContributionDates[i] = moment(loopDate);
      }
      
      let memberCountDifferenceFromLastEntry = '-';
      if (utilities.isNumeric(memberCount))
      {
        if (previousValidGuildMemberCountDates[i])
        {
          memberCountDifferenceFromLastEntry = memberCount - findGuildEntryByDate(dayEntries, previousValidGuildMemberCountDates[i], guilds[i].name).memberCount;
        }
        previousValidGuildMemberCountDates[i] = moment(loopDate);
      }
      
      guildDataTableRow.guilds.push(
      {
        name: guilds[i].name,
        backgroundColor: guilds[i].backgroundColor,
        contribution: contribution,
        contributionDifferenceFromLastEntryAveraged: contributionDifferenceFromLastEntryAveraged,
        memberCount: memberCount,
        memberCountDifferenceFromLastEntry: memberCountDifferenceFromLastEntry
      });
    }
    guildDataTableRows.push(guildDataTableRow);
  }
  
  console.log('guildDataTableRows:');
  console.log(guildDataTableRows);
  
  return guildDataTableRows;
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

/**
 * Formatted guild text line with the format: [Guild name    Guild contribution  Text].
 * Guild name is first and left aligned, Guild contribution is right aligned, and then Text is after.
 *
 * @param guildName Guild name
 * @param contribution Guild contribution as a number
 * @param description Text to append after
 * @return Formatted guild text line
 */
export function getFormattedGuildTextLine(guildName, contribution, description)
{
  const GUILD_NAME_CONTRIBUTION_MAXIMUM_LENGTH = 11 + 12;
  const DESCRIPTION_PRE_GAP = 3;
  
  // Setup base string with whitespaces
  let formattedGuildTextLine = ' ';
  formattedGuildTextLine = formattedGuildTextLine.repeat(GUILD_NAME_CONTRIBUTION_MAXIMUM_LENGTH + DESCRIPTION_PRE_GAP);
  
  // Adding Guild name
  formattedGuildTextLine = utilities.stringReplaceAt(formattedGuildTextLine, 0, guildName);
  
  // Adding Guild contribution
  // Guild contribution is added after Guild name, so contribution text will overwrite name text if there are any overlaps
  // Guild contribution is right aligned
  let formattedContribution = utilities.isNumeric(contribution) ? utilities.thousandsCommaFormatNumber(Math.floor(contribution)) : 'N/A';
  formattedGuildTextLine = utilities.stringReplaceAt(formattedGuildTextLine, GUILD_NAME_CONTRIBUTION_MAXIMUM_LENGTH - formattedContribution.length, formattedContribution);
  
  // Adding text after
  formattedGuildTextLine = utilities.stringReplaceAt(formattedGuildTextLine, GUILD_NAME_CONTRIBUTION_MAXIMUM_LENGTH + DESCRIPTION_PRE_GAP, description);
  
  return formattedGuildTextLine;
}

/**
 * Find the previous valid guild entry date prior to baseEntryDate, given a list of day entries for a specific guild.
 *
 * @param baseEntryDate Entry date to start looking prior
 * @param dayEntries List of entries by days, each day entry containing all the guilds and its data for that day
 * @param guildName Name of guild to search
 * @return Moment date of the previous valid guild entry date for contribution for a specific guild
 */
export function findPreviousValidEntryDate(baseEntryDate, dayEntries, guildName)
{
  let earliestValidEntryDate = findEarliestValidContributionEntryDate(dayEntries, guildName);
  let previousValidEntryDate = null;
  
  // Note: the latest entry date considers all guilds, not individual guild entries.
  for (let loopDate = moment(baseEntryDate).subtract(1, 'days'); loopDate.isSameOrAfter(earliestValidEntryDate); loopDate.subtract(1, 'days'))
  {
    if (utilities.isNumeric(findGuildEntryByDate(dayEntries, loopDate, guildName).contribution))
    {
      previousValidEntryDate = loopDate;
      break;
    }
  }
  return previousValidEntryDate;
}
