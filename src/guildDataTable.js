
import * as utilities from '../util/utilities.js';
import * as guildUtilities from '../util/guildUtilities.js';


/**
 * Generates HTML for guild data table using guildData.
 *
 * @param guildData Contains all the guild data and data entries
 * @param isChronologicalOrder Order of the guild data rows in either: ascending order/oldest first (chronological order) or descending order/newest first (reverse chronological order)
 * @return HTML code to generate guild data table
 */
export default function(guildData, isChronologicalOrder)
{
  let html = '';
  
  html += '<table align="center" class="hoverRowHighlight" style="border-collapse: collapse;">';
  
  html += generateTableHeader(guildData.guilds);
  
  let earliestEntryDate = guildUtilities.findEarliestEntryDate(guildData.dayEntries);
  let latestEntryDate = guildUtilities.findLatestEntryDate(guildData.dayEntries);
  
  let previousValidGuildContributionDates = [];
  let previousValidGuildMemberCountDates = [];
  
  // Creating color range for a specific guild based on its total lowest and highest contribution.
  let colorScales = [];
  for (let i = 0; i < guildData.guilds.length; i++)
  {
    let lowestContribution = guildUtilities.findLowestContributionAmount(guildData.dayEntries, guildData.guilds[i].name);
    let highestContribution = guildUtilities.findHighestContributionAmount(guildData.dayEntries, guildData.guilds[i].name);
    let colorScale = chroma.scale(['red', 'yellow', '#228B22']).domain([lowestContribution, highestContribution]);
    colorScales.push(colorScale);
  }
  
  let tableRowHtmls = [];
  for (let loopDate = moment(earliestEntryDate); loopDate.isSameOrBefore(latestEntryDate); loopDate.add(1, 'days'))
  {
    tableRowHtmls.push(generateTableRow(loopDate, guildData.guilds, guildData.dayEntries, previousValidGuildContributionDates, previousValidGuildMemberCountDates, colorScales));
  }
  if (isChronologicalOrder)
  {
    for (let i = 0; i < tableRowHtmls.length; i++)
    {
      html += tableRowHtmls[i];
    }
  }
  else
  {
    for (let i = tableRowHtmls.length - 1; i >= 0; i--)
    {
      html += tableRowHtmls[i];
    }
  }
  
  html += generateTableFooter(guildData.guilds);
  
  html += '</table>';
  
  return html;
}

/**
 * Generates HTML for guild data table headers.
 *
 * @param guilds Contents of the guilds from guildData
 * @return HTML code to generate guild data table headers
 */
function generateTableHeader(guilds)
{
  let guildNameHeadersHtml = '';
  let descriptionHeadersHtml = '';
  for (let i = 0; i < guilds.length; i++)
  {
    guildNameHeadersHtml += `
      <th colspan="3" style="background-color: ${guilds[i].backgroundColor}; font-size: 20px;">
        <img src="${guilds[i].symbolUrl}" style="height: 20px;"><span style="font-weight: bold; color: ${guilds[i].color};"> ${guilds[i].name}</span>
      </th>
    `;
    descriptionHeadersHtml += `
      <th style="background-color: ${guilds[i].backgroundColor};">Contribution</th>
      <th style="background-color: ${guilds[i].backgroundColor};">Difference From Last Entry (Average Per Day)</th>
      <th style="background-color: ${guilds[i].backgroundColor};">Member<br>Count</th>
    `;
  }
  
  return `
    <tr>
      <th rowspan="2" style="background-color: #DCDCDC;">Date</th>
      ${guildNameHeadersHtml}
    </tr>
    <tr style="border-bottom: 4px solid black;">
      ${descriptionHeadersHtml}
    </tr>
  `;
}

/**
 * Generates HTML for guild data table row which contains the date and all guild entries for that date.
 *
 * @param date Date for this particular row
 * @param guilds Contents of the guilds from guildData
 * @param dayEntries List of entries by days, each day entry containing all the guilds and its data for that day
 * @param previousValidGuildContributionDates Array of the previous valid guild contribution dates, each index specifies a different guild in the same order as guilds parameter
 * @param previousValidGuildMemberCountDates Array of the previous valid guild member count dates, each index specifies a different guild in the same order as guilds parameter
 * @param colorScales Chroma colorscale ranges, each index specifies a different guild in the same order as guilds parameter
 * @return HTML code to generate guild data table row
 */
function generateTableRow(date, guilds, dayEntries, previousValidGuildContributionDates, previousValidGuildMemberCountDates, colorScales)
{
  let dateRowContentHtml = '';
  
  let guildEntries = guildUtilities.findGuildEntriesByDate(dayEntries, date);
  for (let i = 0; i < guilds.length; i++)
  {
    let guildEntry = guildUtilities.findGuildEntry(guildEntries, guilds[i].name);
    
    let contribution = (guildEntry && guildEntry.contribution) ? guildEntry.contribution : '-';
    let memberCount = (guildEntry && guildEntry.memberCount) ? guildEntry.memberCount : '-';
    
    // Find the averaged contribution given the contribution of the current given date and the previous valid contribution.
    let averagedContributionDifferenceFromLastEntry = '-';
    if (utilities.isNumeric(contribution))
    {
      if (previousValidGuildContributionDates[i])
      {
        averagedContributionDifferenceFromLastEntry = (contribution - guildUtilities.findGuildEntryByDate(dayEntries, previousValidGuildContributionDates[i], guilds[i].name).contribution) / date.diff(previousValidGuildContributionDates[i], 'days');
      }
      previousValidGuildContributionDates[i] = moment(date);
    }
    
    let memberCountDifferenceFromLastEntry = '-';
    if (utilities.isNumeric(memberCount))
    {
      if (previousValidGuildMemberCountDates[i])
      {
        memberCountDifferenceFromLastEntry = memberCount - guildUtilities.findGuildEntryByDate(dayEntries, previousValidGuildMemberCountDates[i], guilds[i].name).memberCount;
      }
      previousValidGuildMemberCountDates[i] = moment(date);
    }
    
    let contributionBackgroundColor = utilities.isNumeric(contribution) ? colorScales[i](contribution).hex() : guilds[i].backgroundColor;
    
    let memberCountDifferenceFromLastEntryIconHtml = `<i class="material-icons" style="color: ${guilds[i].backgroundColor};">remove</i>`;
    if (memberCountDifferenceFromLastEntry > 0)
    {
      memberCountDifferenceFromLastEntryIconHtml = `<i class="material-icons" style="color: green;">arrow_upward</i>`;
    }
    else if (memberCountDifferenceFromLastEntry < 0)
    {
      memberCountDifferenceFromLastEntryIconHtml = `<i class="material-icons" style="color: red;">arrow_downward</i>`;
    }
    else if (memberCountDifferenceFromLastEntry == 0)
    {
      memberCountDifferenceFromLastEntryIconHtml = `<i class="material-icons" style="color: yellow;">remove</i>`;
    }
    
    dateRowContentHtml += `
      <td nowrap style="text-align: end; background-color: ${contributionBackgroundColor}; font-size: 12px;">${utilities.thousandsCommaFormatNumber(contribution)}</td>
      <td nowrap style="text-align: end; background-color: ${guilds[i].backgroundColor}; font-size: 12px;">${utilities.isNumeric(averagedContributionDifferenceFromLastEntry) ? utilities.thousandsCommaFormatNumber(Math.floor(averagedContributionDifferenceFromLastEntry)) : '-'}</td>
      <td nowrap style="text-align: center; background-color: ${guilds[i].backgroundColor}; font-size: 12px;">${memberCountDifferenceFromLastEntryIconHtml} ${memberCount}</td>
    `;
  }
  
  return `
    <tr>
      <td nowrap style="text-align: end; background-color: #DCDCDC; font-size: 12px;">${utilities.getFormattedDate(date)}</td>
      ${dateRowContentHtml}
    </tr>
  `;
}

/**
 * Generates HTML for guild data table footers.
 *
 * @param guilds Contents of the guilds from guildData
 * @return HTML code to generate guild data table footers
 */
function generateTableFooter(guilds)
{
  let guildNameFootersHtml = '';
  let descriptionFootersHtml = '';
  for (let i = 0; i < guilds.length; i++)
  {
    guildNameFootersHtml += `
      <th colspan="3" style="background-color: ${guilds[i].backgroundColor}; font-size: 20px;">
        <img src="${guilds[i].symbolUrl}" style="height: 20px;"><span style="font-weight: bold; color: ${guilds[i].color};"> ${guilds[i].name}</span>
      </th>
    `;
    descriptionFootersHtml += `
      <th style="background-color: ${guilds[i].backgroundColor};">Contribution</th>
      <th style="background-color: ${guilds[i].backgroundColor};">Difference From Last Entry (Average Per Day)</th>
      <th style="background-color: ${guilds[i].backgroundColor};">Member<br>Count</th>
    `;
  }
  
  return `
    <tr style="border-top: 4px solid black;">
      <th rowspan="2" style="background-color: #DCDCDC;">Date</th>
      ${descriptionFootersHtml}
    </tr>
    <tr>
      ${guildNameFootersHtml}
    </tr>
  `;
}
