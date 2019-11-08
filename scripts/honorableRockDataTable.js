
import * as utilities from '../util/utilities.js';
import * as guildUtilities from '../util/guildUtilities.js';


/**
 * Generates HTML for Honorable Rock data table using honorableRockDataReference.
 *
 * @param honorableRockDataReference Honorable Rock data processed and packaged as a map
 * @return HTML code to generate Honorable Rock data table
 */
export default function(honorableRockDataReference)
{
  let html = '';
  
  html += '<table align="center" style="border-collapse: collapse;">';
  
  let startDate = honorableRockDataReference.get('startDate');
  let endDate = honorableRockDataReference.get('endDate');
  
  html += '<thead>';
  html += generateTableHeader(startDate, endDate);
  html += '</thead>';
  
  // Creating color range for the lowest and highest contribution
  let lowestContribution = 0;
  let highestContribution = 0;
  for (let loopDate = moment(startDate); loopDate.isSameOrBefore(endDate); loopDate.add(1, 'months'))
  {
    for (let i = 1; i <= 50; i++)
    {
      let entry = honorableRockDataReference.get(guildUtilities.getHonorableRockDataReferenceKeyByDate(loopDate, i));
      
      if (entry.contribution < lowestContribution)
      {
        lowestContribution = entry.contribution;
      }
      if (entry.contribution > highestContribution)
      {
        highestContribution = entry.contribution;
      }
    }
  }
  let colorScale = chroma.scale(['red', 'yellow', '#228B22']).domain([lowestContribution, highestContribution]);
  
  html += '<tbody class="hoverRowHighlight">';
  for (let i = 1; i <= 50; i++)
  {
    html += generateTableRow(honorableRockDataReference, startDate, endDate, i, colorScale);
  }
  html += '</tbody>';
  
  html += '</table>';
  
  return html;
}

/**
 * Generates HTML for Honorable Rock data table headers.
 *
 * @param startDate Start date, only care about month and year
 * @param endDate End date, only care about month and year
 * @return HTML code to generate Honorable Rock data table headers
 */
function generateTableHeader(startDate, endDate)
{
  let tableHeaderHtml = '';
  
  tableHeaderHtml += '<tr style="border-color: black; border-style: solid; border-width: 4px 4px 0px 4px;">';
  for (let loopDate = moment(startDate); loopDate.isSameOrBefore(endDate); loopDate.add(1, 'months'))
  {
    tableHeaderHtml += `
      <th colspan="4" style="background-color: #DCDCDC; font-size: 20px; padding: 5px 5px 5px 5px;">${loopDate.format('MMMM YYYY')}</th>
    `;
  }
  tableHeaderHtml += '</tr>';
  
  tableHeaderHtml += '<tr style="border-color: black; border-style: solid; border-width: 0px 4px 4px 4px;">';
  for (let loopDate = moment(startDate); loopDate.isSameOrBefore(endDate); loopDate.add(1, 'months'))
  {
    tableHeaderHtml += `
      <th colspan="2" style="background-color: #DCDCDC; font-size: 20px; padding: 2px 5px 2px 5px;">Rank</th>
      <th style="background-color: #DCDCDC; font-size: 20px; padding: 2px 5px 2px 5px;">Name</th>
      <th style="background-color: #DCDCDC; font-size: 20px; padding: 2px 5px 2px 5px;">Contribution</th>
    `;
  }
  tableHeaderHtml += '</tr>';
  
  return tableHeaderHtml;
}

/**
 * Generates HTML for Honorable Rock data table row. Each row having different guilds from different months of a specified rank.
 *
 * @param honorableRockDataReference Honorable Rock data processed and packaged as a map
 * @param startDate Start date, only care about month and year
 * @param endDate End date, only care about month and year
 * @param rank Rank number of row
 * @param colorScale Chroma colorscale ranges from lowest contribution to highest contribution
 * @return HTML code to generate Honorable Rock data table row
 */
function generateTableRow(honorableRockDataReference, startDate, endDate, rank, colorScale)
{
  let tableRowHtml = '';
  
  for (let loopDate = moment(startDate); loopDate.isSameOrBefore(endDate); loopDate.add(1, 'months'))
  {
    let currentEntry = honorableRockDataReference.get(guildUtilities.getHonorableRockDataReferenceKeyByDate(loopDate, rank));
    let previousEntry = honorableRockDataReference.get(guildUtilities.getHonorableRockDataReferenceKeyByDate(moment(loopDate).subtract(1, 'months'), currentEntry.name));
    
    let differenceRankFromLastMonth = previousEntry ? previousEntry.rank - currentEntry.rank : 0;
    
    let differenceIconHtml = `<i class="material-icons" style="color: black;">remove</i>`;
    if (differenceRankFromLastMonth > 0)
    {
      differenceIconHtml = `<i class="material-icons" style="color: green;">navigation</i>`;
    }
    else if (differenceRankFromLastMonth < 0)
    {
      differenceIconHtml = `<i class="material-icons" style="color: red; transform: rotate(180deg);">navigation</i>`;
    }
    else if (differenceRankFromLastMonth == 0)
    {
      differenceIconHtml = `<i class="material-icons" style="color: yellow;">remove</i>`;
    }
    
    let defaultBackgroundColor = '#DEDEDE';
    
    let guildEntryReference = honorableRockDataReference.get(currentEntry.name);
    let guildBackgroundColor;
    
    if (guildEntryReference && guildEntryReference.backgroundColor)
    {
      guildBackgroundColor = guildEntryReference.backgroundColor;
    }
    else
    {
      console.warn('WARNING: ' + currentEntry.name + ' does not have backgroundColor in Honorable Rock.');
      guildBackgroundColor = defaultBackgroundColor;
    }
    
    let contributionBackgroundColor = utilities.isNumeric(currentEntry.contribution) ? colorScale(currentEntry.contribution).hex() : defaultBackgroundColor;
    
    tableRowHtml += `
      <td nowrap style="text-align: center; background-color: ${defaultBackgroundColor}; font-size: 18px; border-left: 4px solid black; padding: 0px 5px 0px 5px;"><b>${rank}</b></td>
      
      <td nowrap style="text-align: center; background-color: ${defaultBackgroundColor}; font-size: 20px; padding: 0px 5px 0px 5px;">${differenceIconHtml}</td>
      
      <td nowrap class="tableCellVerticalAlignMiddle" style="text-align: start; background-color: ${guildBackgroundColor}; font-size: 18px; padding: 0px 5px 0px 5px;">${getFormattedGuildNameHtml(honorableRockDataReference, currentEntry.name)}</td>
      
      <td nowrap style="text-align: end; background-color: ${contributionBackgroundColor}; font-size: 18px; border-right: 4px solid black; padding: 0px 5px 0px 5px;">${utilities.thousandsCommaFormatNumber(currentEntry.contribution)}</td>
    `;
  }
  
  return `
    <tr>
      ${tableRowHtml}
    </tr>
  `;
}

/**
 * Generates HTML for formatted guild name in [Icon]GuildName format.
 *
 * @param honorableRockDataReference Honorable Rock data processed and packaged as a map
 * @param guildName Name of guild
 * @return HTML code for formatted guild name with icon
 */
function getFormattedGuildNameHtml(honorableRockDataReference, guildName)
{
  let guildEntryReference = honorableRockDataReference.get(guildName);
  
  let guildIconUrl = guildEntryReference ? guildEntryReference.iconUrl : '';
  // Color is currently unused
  let guildColor = guildEntryReference ? guildEntryReference.color : 'black';
  
  return `<img src="${guildIconUrl}" style="height: 20px; padding: 0px 5px 0px 0px;"><span style="font-weight: normal; color: ${guildColor};">${guildName}</span>`;
}
