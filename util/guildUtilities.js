
//import moment from '../lib/moment.js';
import * as utilities from './utilities.js';


/**
 * Get date list in guildDataReference.
 *
 * @param guildDataReference Guild data processed and packaged as a map
 * @return Date list in guildDataReference
 */
export function getDates(guildDataReference)
{
  return guildDataReference.get('dates');
}

/**
 * Get guild list in guildDataReference.
 *
 * @param guildDataReference Guild data processed and packaged as a map
 * @return Guild list in guildDataReference
 */
export function getGuilds(guildDataReference)
{
  return guildDataReference.get('guilds');
}

/**
 * Get guild entry of a specific guild at a specific date.
 *
 * @param guildDataReference Guild data processed and packaged as a map
 * @param date Date to get
 * @param guildName Name of guild to get
 * @return Guild entry for a specific guild at a specific date
 */
export function getGuildEntry(guildDataReference, date, guildName)
{
  return guildDataReference.get(getGuildDataReferenceKey(date, guildName));
}

/**
 * Find the earliest guild entry date from all guilds.
 *
 * @param dates List of all the dates from all guilds
 * @return Moment date of the earliest guild entry date of all guilds
 */
export function findEarliestEntryDate(dates)
{
  let earliestDate;
  for (let i = 0; i < dates.length; i++)
  {
    if (!earliestDate || dates[i].isBefore(earliestDate))
    {
      earliestDate = moment(dates[i]);
    }
  }
  return earliestDate;
}

/**
 * Find the latest guild entry date from all guilds.
 *
 * @param dates List of all the dates from all guilds
 * @return Moment date of the latest guild entry date of all guilds
 */
export function findLatestEntryDate(dates)
{
  let latestDate;
  for (let i = 0; i < dates.length; i++)
  {
    if (!latestDate || dates[i].isAfter(latestDate))
    {
      latestDate = moment(dates[i]);
    }
  }
  return latestDate;
}

/**
 * Find the earliest entry date that has a valid contribution for a specific guild.
 *
 * @param guildDataReference Guild data processed and packaged as a map
 * @param guildName Name of guild to search
 * @return Moment date of the earliest valid guild entry date for contribution for a specific guild
 */
export function findEarliestValidContributionEntryDate(guildDataReference, guildName)
{
  let earliestDate;
  let dates = getDates(guildDataReference);
  for (let i = 0; i < dates.length; i++)
  {
    if (!earliestDate || dates[i].isBefore(earliestDate))
    {
      let guildEntry = getGuildEntry(guildDataReference, dates[i], guildName);
      if (utilities.isNumeric(guildEntry.contribution))
      {
        earliestDate = moment(dates[i]);
      }
    }
  }
  return earliestDate;
}

/**
 * Find the latest entry date that has a valid contribution for a specific guild.
 *
 * @param guildDataReference Guild data processed and packaged as a map
 * @param guildName Name of guild to search
 * @return Moment date of the latest valid guild entry date for contribution for a specific guild
 */
export function findLatestValidContributionEntryDate(guildDataReference, guildName)
{
  let latestDate;
  let dates = getDates(guildDataReference);
  for (let i = 0; i < dates.length; i++)
  {
    if (!latestDate || dates[i].isAfter(latestDate))
    {
      let guildEntry = getGuildEntry(guildDataReference, dates[i], guildName);
      if (utilities.isNumeric(guildEntry.contribution))
      {
        latestDate = moment(dates[i]);
      }
    }
  }
  return latestDate;
}

/**
 * Find the guild entry date that has a valid contribution at least one month prior to latestEntryDate for a specific guild.
 *
 * @param latestEntryDate Latest entry date regardless of whether it is a valid or invalid entry
 * @param guildDataReference Guild data processed and packaged as a map
 * @param guildName Name of guild to search
 * @return Moment date of the latest valid guild entry date for contribution for a specific guild
 */
export function findEarlierMonthValidEntryDate(latestEntryDate, guildDataReference, guildName)
{
  let earlierMonthValidEntryDate = null;
  let earliestValidEntryDate = findEarliestValidContributionEntryDate(guildDataReference, guildName);
  
  // Note: the latest entry date considers all guilds, not individual guild entries.
  for (let loopDate = moment(latestEntryDate).subtract(1, 'months'); loopDate.isSameOrAfter(earliestValidEntryDate); loopDate.subtract(1, 'days'))
  {
    let guildEntry = getGuildEntry(guildDataReference, loopDate, guildName);
    if (utilities.isNumeric(guildEntry.contribution))
    {
      earlierMonthValidEntryDate = moment(loopDate);
      break;
    }
  }
  return earlierMonthValidEntryDate;
}

/**
 * Find the previous valid guild entry date prior to baseEntryDate for a specific guild.
 *
 * @param baseEntryDate Entry date to start looking prior
 * @param guildDataReference Guild data processed and packaged as a map
 * @param guildName Name of guild to search
 * @return Moment date of the previous valid guild entry date for contribution for a specific guild
 */
export function findPreviousValidEntryDate(baseEntryDate, guildDataReference, guildName)
{
  let previousValidEntryDate = null;
  let earliestValidEntryDate = findEarliestValidContributionEntryDate(guildDataReference, guildName);
  
  // The latest entry date considers all guilds, not individual guild entries.
  for (let loopDate = moment(baseEntryDate).subtract(1, 'days'); loopDate.isSameOrAfter(earliestValidEntryDate); loopDate.subtract(1, 'days'))
  {
    if (utilities.isNumeric(getGuildEntry(guildDataReference, loopDate, guildName).contribution))
    {
      previousValidEntryDate = moment(loopDate);
      break;
    }
  }
  return previousValidEntryDate;
}

/**
 * Find the lowest contribution value of a specific guild.
 *
 * @param guildDataReference Guild data processed and packaged as a map
 * @param guildName Name of guild to search
 * @return Lowest contribution value of a specific guild
 */
export function findLowestContributionAmount(guildDataReference, guildName)
{
  let lowestContributionAmount = Number.MAX_SAFE_INTEGER;
  let dates = getDates(guildDataReference);
  for (let i = 0; i < dates.length; i++)
  {
    let guildEntry = getGuildEntry(guildDataReference, dates[i], guildName);
    if (utilities.isNumeric(guildEntry.contribution) && guildEntry.contribution < lowestContributionAmount)
    {
      lowestContributionAmount = guildEntry.contribution;
    }
  }
  return lowestContributionAmount;
}

/**
 * Find the highest contribution value of a specific guild.
 *
 * @param guildDataReference Guild data processed and packaged as a map
 * @param guildName Name of guild to search
 * @return Highest contribution value of a specific guild
 */
export function findHighestContributionAmount(guildDataReference, guildName)
{
  let highestContributionAmount = Number.MIN_SAFE_INTEGER;
  let dates = getDates(guildDataReference);
  for (let i = 0; i < dates.length; i++)
  {
    let guildEntry = getGuildEntry(guildDataReference, dates[i], guildName);
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
 * @param guildDataReference Guild data processed and packaged as a map
 * @return Processed guild data
 */
export function calculateGuildSummaryResults(guildDataReference)
{
  let guildSummaryResults = [];
  let guilds = getGuilds(guildDataReference);
  let latestEntryDate = findLatestEntryDate(getDates(guildDataReference));
  for (let i = 0; i < guilds.length; i++)
  {
    let latestValidEntryDate = findLatestValidContributionEntryDate(guildDataReference, guilds[i].name);
    let latestValidContribution = getGuildEntry(guildDataReference, latestValidEntryDate, guilds[i].name).contribution;
    
    let earlierMonthValidEntryDate = findEarlierMonthValidEntryDate(latestEntryDate, guildDataReference, guilds[i].name);
    if (!earlierMonthValidEntryDate)
    {
      console.log('earlierMonthValidEntryDate is null for ' + guilds[i].name + ', setting it to latestValidEntryDate so it will be caught later as invalid average calculation');
      earlierMonthValidEntryDate = moment(latestValidEntryDate);
    }
    let earlierMonthValidContribution = getGuildEntry(guildDataReference, earlierMonthValidEntryDate, guilds[i].name).contribution;
    
    let averagePerDay = (latestValidContribution - earlierMonthValidContribution) / latestValidEntryDate.diff(earlierMonthValidEntryDate, 'days');
    if (moment.duration(latestEntryDate.diff(earlierMonthValidEntryDate)) > moment.duration(6, 'weeks'))
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
      guildName: guilds[i].name,
      guildColor: guilds[i].color,
      guildBackgroundColor: guilds[i].backgroundColor,
      guildSymbolUrl: guilds[i].symbolUrl,
      latestValidEntryDate: latestValidEntryDate,
      latestValidContribution: latestValidContribution,
      earlierMonthValidEntryDate: earlierMonthValidEntryDate,
      earlierMonthValidContribution: earlierMonthValidContribution,
      averagePerDay: averagePerDay
    }
    guildSummaryResults.push(guildSummaryResult);
  }
  
  return guildSummaryResults;
}

/**
 * Calculate and return processed guild data table rows.
 * Each row contains a date and a list of all the guilds and each guild data entry having contribution/member count, and contribution/member count difference from last valid entry.
 *
 * @param guildDataReference Guild data processed and packaged as a map
 * @return Processed guild data table rows
 */
export function calculateGuildDataTableRows(guildDataReference)
{
  let guildDataTableRows = [];
  
  let previousValidGuildContributionDates = [];
  let previousValidGuildMemberCountDates = [];
  
  let earliestEntryDate = findEarliestEntryDate(getDates(guildDataReference));
  let latestEntryDate = findLatestEntryDate(getDates(guildDataReference));
  
  let guilds = getGuilds(guildDataReference);
  
  for (let loopDate = moment(earliestEntryDate); loopDate.isSameOrBefore(latestEntryDate); loopDate.add(1, 'days'))
  {
    let guildDataTableRow =
    {
      date: moment(loopDate),
      guilds: []
    };
    
    for (let i = 0; i < guilds.length; i++)
    {
      let guildEntry = getGuildEntry(guildDataReference, loopDate, guilds[i].name);
      
      let contribution = guildEntry.contribution ? guildEntry.contribution : '-';
      let memberCount = guildEntry.memberCount ? guildEntry.memberCount : '-';
      
      // Find the averaged contribution given the contribution of the current given date and the previous valid contribution
      let contributionDifferenceFromLastEntryAveraged = '-';
      if (utilities.isNumeric(contribution))
      {
        if (previousValidGuildContributionDates[i])
        {
          contributionDifferenceFromLastEntryAveraged = (contribution - getGuildEntry(guildDataReference, previousValidGuildContributionDates[i], guilds[i].name).contribution) / loopDate.diff(previousValidGuildContributionDates[i], 'days');
        }
        previousValidGuildContributionDates[i] = moment(loopDate);
      }
      
      let memberCountDifferenceFromLastEntry = '-';
      if (utilities.isNumeric(memberCount))
      {
        if (previousValidGuildMemberCountDates[i])
        {
          memberCountDifferenceFromLastEntry = memberCount - getGuildEntry(guildDataReference, previousValidGuildMemberCountDates[i], guilds[i].name).memberCount;
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
  
  return guildDataTableRows;
}

/**
 * Calculate and return guild contribution gain data for that month for a given guild, year, and month.
 *
 * @param guildDataReference Guild data processed and packaged as a map
 * @param guildName Name of guild to calculate
 * @param year Year to calculate
 * @param month Month to calculate
 * @return Guild contribution gain data for that month for a given guild, year, and month
 */
export function calculateGuildContributionGainedMonth(guildDataReference, guildName, year, month)
{
  let earliestValidDate = null;
  let latestValidDate = null;
  
  let earliestContribution = null;
  let latestContribution = null;
  
  let monthDate = utilities.getMomentUtcDate(year, month, 1);
  
  // Find the earliest valid entry of the month
  for (let loopDate = moment(monthDate); loopDate.isBefore(moment(monthDate).add(1, 'months')); loopDate.add(1, 'days'))
  {
    let guildEntry = getGuildEntry(guildDataReference, loopDate, guildName);
    if (guildEntry && utilities.isNumeric(guildEntry.contribution))
    {
      earliestValidDate = moment(loopDate);
      earliestContribution = guildEntry.contribution;
      break;
    }
  }
  
  // Find the latest valid entry of the month
  for (let loopDate = moment(monthDate).add(1, 'months').subtract(1, 'days'); loopDate.isSameOrAfter(monthDate); loopDate.subtract(1, 'days'))
  {
    let guildEntry = getGuildEntry(guildDataReference, loopDate, guildName);
    if (guildEntry && utilities.isNumeric(guildEntry.contribution))
    {
      latestValidDate = moment(loopDate);
      latestContribution = guildEntry.contribution;
      break;
    }
  }
  
  // Check date ranges, then calculate interpolatedContributionGained
  let monthlyAveragedContributionGainedPerDay = null;
  let interpolatedContributionGained = null;
  if (earliestValidDate && latestValidDate && latestValidDate.isBefore(earliestValidDate))
  {
    console.log('GuildContributionGainedMonth, guildName: ' + guildName + ', latestValidDate: ' + utilities.getFormattedDate(latestValidDate) + ' is before earliestValidDate: ' + utilities.getFormattedDate(earliestValidDate));
    earliestValidDate = null;
    latestValidDate = null;
    earliestContribution = null;
    latestContribution = null;
  }
  
  if (earliestValidDate && latestValidDate && moment.duration(latestValidDate.diff(earliestValidDate)) < moment.duration(2, 'weeks'))
  {
    console.log('GuildContributionGainedMonth, guildName: ' + guildName + ', date ranges are too close. latestValidDate: ' + utilities.getFormattedDate(latestValidDate) + ', earliestValidDate: ' + utilities.getFormattedDate(earliestValidDate));
    earliestValidDate = null;
    latestValidDate = null;
    earliestContribution = null;
    latestContribution = null;
  }
  
  if (earliestValidDate && latestValidDate && (earliestValidDate.date() > 7 || latestValidDate.date() < monthDate.daysInMonth() - 7))
  {
    console.log('GuildContributionGainedMonth, guildName: ' + guildName + ', earliestValidDate and/or latestEntryDate have too much gap, need at least a week. latestValidDate: ' + utilities.getFormattedDate(latestValidDate) + ', earliestValidDate: ' + utilities.getFormattedDate(earliestValidDate));
    earliestValidDate = null;
    latestValidDate = null;
    earliestContribution = null;
    latestContribution = null;
  }
  
  if (earliestValidDate && latestValidDate && earliestContribution && latestContribution)
  {
    monthlyAveragedContributionGainedPerDay = (latestContribution - earliestContribution) / latestValidDate.diff(earliestValidDate, 'days');
    
    interpolatedContributionGained = (monthDate.daysInMonth() - 1) * monthlyAveragedContributionGainedPerDay;
  }
  
  let guildContributionGainedMonth =
  {
    year: year,
    month: month,
    guildName: guildName,
    earliestValidDate: earliestValidDate,
    latestValidDate: latestValidDate,
    earliestContribution: earliestContribution,
    latestContribution: latestContribution,
    monthlyAveragedContributionGainedPerDay: monthlyAveragedContributionGainedPerDay,
    interpolatedContributionGained: interpolatedContributionGained
  };
  
  return guildContributionGainedMonth;
}

/**
 * Print debug statements regarding guildData.
 *
 * @param guildData Contains all the guild data and data entries
 */
export function printDebug(guildData)
{
  console.log('\n\n');
  console.info("*****printDebug() TEST PRINT START*****");
  
  console.info('Guild Data:');
  console.log(guildData);
  console.log('\n');
  
  let guildDataReference = calculateGuildDataReference(guildData);
  let dates = getDates(guildDataReference);
  let guilds = getGuilds(guildDataReference);
  console.info('Guild Data Reference:');
  console.log(guildDataReference);
  console.info('Guild Data Reference - Dates:');
  console.log(dates);
  console.info('Guild Data Reference - Guilds:');
  console.log(guilds);
  
  console.log('\n');
  
  console.info('findEarliestEntryDate: ' + utilities.getFormattedDate(findEarliestEntryDate(dates)));
  let latestEntryDate = findLatestEntryDate(dates);
  console.info('findLatestEntryDate: ' + utilities.getFormattedDate(latestEntryDate));
  
  console.log('\n');
  
  for (let i = 0; i < guilds.length; i++)
  {
    let guildName = guilds[i].name;
    
    console.log('guilds[' + i + ']: ' + guildName);
    
    console.info('findEarliestValidContributionEntryDate: ' + utilities.getFormattedDate(findEarliestValidContributionEntryDate(guildDataReference, guildName)));
    console.info('findLatestValidContributionEntryDate: ' + utilities.getFormattedDate(findLatestValidContributionEntryDate(guildDataReference, guildName)));
    
    console.info('findEarlierMonthValidEntryDate: ' + utilities.getFormattedDate(findEarlierMonthValidEntryDate(latestEntryDate, guildDataReference, guildName)));
    console.info('findPreviousValidEntryDate: ' + utilities.getFormattedDate(findPreviousValidEntryDate(latestEntryDate, guildDataReference, guildName)));
    
    console.info('findLowestContributionAmount: ' + findLowestContributionAmount(guildDataReference, guildName));
    console.info('findHighestContributionAmount: ' + findHighestContributionAmount(guildDataReference, guildName));
    
    console.log('\n');
  }
  
  console.info('Guild Data Table Rows:');
  console.log(calculateGuildDataTableRows(guildDataReference));
  
  console.info('Guild Summary Results:');
  let guildSummaryResults = calculateGuildSummaryResults(guildDataReference);
  console.log(guildSummaryResults);
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
  
  console.log("*****printDebug() TEST PRINT END*****");
}

/**
 * Get Guild Data Reference Key for a specific guild at a specific date.
 *
 * @param date Date to get
 * @param guildName Name of guild to get
 * @return Guild Data Reference Key for a specific guild at a specific date
 */
export function getGuildDataReferenceKey(date, guildName)
{
  return utilities.getFormattedDate(date) + '-' + guildName;
}

/**
 * Calculate Guild data and process and package into a map to be used as reference.
 *
 * @param guildData Contains all the guild data and data entries
 */
export function calculateGuildDataReference(guildData)
{
  let guildDataReference = new Map();
  
  let dates = [];
  for (let i = 0; i < guildData.dayEntries.length; i++)
  {
    let date = utilities.getMomentUtcDate(guildData.dayEntries[i].year, guildData.dayEntries[i].month, guildData.dayEntries[i].day);
    for (let j = 0; j < guildData.dayEntries[i].guildEntries.length; j++)
    {
      let guildName = guildData.dayEntries[i].guildEntries[j].name;
      let guildEntry =
      {
        contribution: guildData.dayEntries[i].guildEntries[j].contribution,
        memberCount: guildData.dayEntries[i].guildEntries[j].memberCount
      };
      guildDataReference.set(getGuildDataReferenceKey(date, guildName), guildEntry);
    }
    dates.push(moment(date));
  }
  
  guildDataReference.set('dates', dates);
  getDates(guildDataReference).sort(function(date1, date2)
  {
    return date2.isSameOrBefore(date1);
  });
  
  guildDataReference.set('guilds', guildData.guilds);
  getGuilds(guildDataReference).sort(function(guild1, guild2)
  {
    let latestValidEntryDate1 = findLatestValidContributionEntryDate(guildDataReference, guild1.name);
    let latestValidContribution1 = getGuildEntry(guildDataReference, latestValidEntryDate1, guild1.name).contribution;
    
    let latestValidEntryDate2 = findLatestValidContributionEntryDate(guildDataReference, guild2.name);
    let latestValidContribution2 = getGuildEntry(guildDataReference, latestValidEntryDate2, guild2.name).contribution;
    
    return latestValidContribution2 - latestValidContribution1;
  });
  
  return guildDataReference;
}
