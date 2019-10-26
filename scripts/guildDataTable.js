
import * as utilities from '../util/utilities.js';
import * as guildUtilities from '../util/guildUtilities.js';


/**
 * Generates HTML for guild data table using guildDataReference.
 *
 * @param guildDataReference Guild data processed and packaged as a map
 * @param showAllGuilds Ignore guild visible flag and process all guilds
 * @param isChronologicalOrder Order of the guild data rows in either: ascending order/oldest first (chronological order) or descending order/newest first (reverse chronological order)
 * @return HTML code to generate guild data table
 */
export default function(guildDataReference, showAllGuilds, isChronologicalOrder)
{
  let html = '';
  
  html += '<table align="center" style="border-collapse: collapse;">';
  
  let guilds = guildUtilities.getGuilds(guildDataReference);
  // Make a deep copy of the guilds array
  let guildsFiltered = JSON.parse(JSON.stringify(guilds));
  // Remove guilds that should not be shown
  for (let i = guildsFiltered.length - 1; i >= 0; i--)
  {
    if (!showAllGuilds && !guildsFiltered[i].visible)
    {
      guildsFiltered.splice(i, 1);
    }
  }
  
  html += '<thead>';
  html += generateTableHeader(guildsFiltered);
  html += '</thead>';
  
  // Creating color range for a specific guild based on its total lowest and highest contribution.
  let colorScales = new Map();
  for (let i = 0; i < guildsFiltered.length; i++)
  {
    let lowestContribution = guildUtilities.findLowestContributionAmount(guildDataReference, guildsFiltered[i].name);
    let highestContribution = guildUtilities.findHighestContributionAmount(guildDataReference, guildsFiltered[i].name);
    let colorScale = chroma.scale(['red', 'yellow', '#228B22']).domain([lowestContribution, highestContribution]);
    colorScales.set(guildsFiltered[i].name, colorScale);
  }
  
  html += '<tbody class="hoverRowHighlight">';
  let tableRowHtmls = [];
  let guildDataTableRows = guildUtilities.calculateGuildDataTableRows(guildDataReference, showAllGuilds);
  // guildDataTableRows should already be sorted in chronological order
  for (let i = 0; i < guildDataTableRows.length; i++)
  {
    tableRowHtmls.push(generateTableRow(guildDataTableRows[i].date, guildDataTableRows[i].guilds, colorScales));
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
  html += '</tbody>';
  
  html += '<thead>';
  html += generateTableFooter(guildsFiltered);
  html += '</thead>';
  
  html += '</table>';
  
  return html;
}

/**
 * Generates HTML for guild data table headers.
 *
 * @param guilds Contents of the guilds from guildDataReference
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
 * @param guilds Contents of the guilds from guildDataTableRows
 * @param colorScales Chroma colorscale ranges as value in map, guild name is the key
 * @return HTML code to generate guild data table row
 */
function generateTableRow(date, guilds, colorScales)
{
  let dateRowContentHtml = '';
  for (let i = 0; i < guilds.length; i++)
  {
    let contribution = guilds[i].contribution;
    let contributionDifferenceFromLastEntryAveraged = guilds[i].contributionDifferenceFromLastEntryAveraged;
    let memberCount = guilds[i].memberCount;
    let memberCountDifferenceFromLastEntry = guilds[i].memberCountDifferenceFromLastEntry;
    
    let contributionBackgroundColor = utilities.isNumeric(contribution) ? colorScales.get(guilds[i].name)(contribution).hex() : guilds[i].backgroundColor;
    
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
      <td nowrap style="text-align: end; background-color: ${guilds[i].backgroundColor}; font-size: 12px;">${utilities.isNumeric(contributionDifferenceFromLastEntryAveraged) ? utilities.thousandsCommaFormatNumber(Math.floor(contributionDifferenceFromLastEntryAveraged)) : '-'}</td>
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
 * @param guilds Contents of the guilds from guildDataReference
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
