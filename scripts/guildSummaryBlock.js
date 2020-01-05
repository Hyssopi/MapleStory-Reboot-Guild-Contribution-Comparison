
import * as utilities from '../util/utilities.js';
import * as guildUtilities from '../util/guildUtilities.js';


/**
 * Generates HTML for guild summary block using guildSummaryResults.
 *
 * @param guildSummaryResults Array of results of the calculations done, each index specifies a different guild
 * @return HTML code to generate guild summary block
 */
export default function(guildSummaryResults)
{
  let html = '';
  html += generateGuildLatestHtmlBlock(guildSummaryResults);
  html += '<hr>';
  html += generateGuildAverageHtmlBlock(guildSummaryResults);
  html += '<hr>';
  html += generateGuildTrendsHtmlBlock(guildSummaryResults);
  
  return html;
}

/**
 * Generates HTML for guild summary block - latest.
 *
 * @param guildSummaryResults Array of results of the calculations done, each index specifies a different guild
 * @return HTML code to generate guild summary block - latest
 */
function generateGuildLatestHtmlBlock(guildSummaryResults)
{
  let tableRowsHtml = '';
  for (let i = 0; i < guildSummaryResults.length; i++)
  {
    let guildSummaryResult = guildSummaryResults[i];
    tableRowsHtml += `
      <tr style="color: ${guildSummaryResult.guildColor};">
        <td nowrap class="tableCellVerticalAlignMiddle" style="padding: 5px 10px 5px 0px; font-weight: bold; border: none;">
          ${getFormattedGuildNameHtml(guildSummaryResult)}<span>:</span>
        </td>
        <td nowrap style="padding: 5px 0px 5px 0px; font-weight: bold; text-align: right; border: none;">${utilities.thousandsCommaFormatNumber(guildSummaryResult.latestValidContribution)}</td>
        <td nowrap style="padding: 5px 0px 5px 10px; border: none;">Contribution as of ${getFormattedDateHtml(guildSummaryResult.latestValidEntryDate)}</td>
      </tr>
    `;
  }
  let html = `
    <div style="margin: 20px 0px 20px 20px;">
      <h1 style="margin: 0px 0px 5px 0px;">Latest Contribution</h1>
      <div style="padding: 0px 0px 0px 20px; font-size: 22px;">
        <table>
          ${tableRowsHtml}
        </table>
      </div>
    </div>
  `;
  return html;
}

/**
 * Generates HTML for guild summary block - average.
 *
 * @param guildSummaryResults Array of results of the calculations done, each index specifies a different guild
 * @return HTML code to generate guild summary block - average
 */
function generateGuildAverageHtmlBlock(guildSummaryResults)
{
  let tableRowsHtml = '';
  for (let i = 0; i < guildSummaryResults.length; i++)
  {
    let guildSummaryResult = guildSummaryResults[i];
    tableRowsHtml += `
      <tr style="color: ${guildSummaryResult.guildColor};">
        <td nowrap class="tableCellVerticalAlignMiddle" style="padding: 5px 10px 5px 0px; font-weight: bold; border: none;">
          ${getFormattedGuildNameHtml(guildSummaryResult)}<span>:</span>
        </td>
        <td nowrap style="padding: 5px 0px 5px 0px; font-weight: bold; text-align: right; border: none;">${utilities.isNumeric(guildSummaryResult.averagePerDay) ? utilities.thousandsCommaFormatNumber(Math.floor(guildSummaryResult.averagePerDay)) : 'N/A'}</td>
        <td nowrap style="padding: 5px 0px 5px 10px; border: none;">Contribution / Day</td>
      </tr>
    `;
  }
  let html = `
    <div style="margin: 20px 0px 20px 20px;">
      <h1 style="margin: 0px 0px 5px 0px;">Average (Most Recent Month)</h1>
      <div style="padding: 0px 0px 0px 20px; font-size: 22px;">
        <table>
          ${tableRowsHtml}
        </table>
      </div>
    </div>
  `;
  return html;
}

/**
 * Generates HTML for guild summary block - trends.
 *
 * @param guildSummaryResults Array of results of the calculations done, each index specifies a different guild
 * @return HTML code to generate guild summary block - trends
 */
function generateGuildTrendsHtmlBlock(guildSummaryResults)
{
  // guildSummaryResults should be sorted by latestValidContribution but have loop to find highestGuildSummaryResult just in case.
  let highestGuildSummaryResult = guildSummaryResults[0];
  for (let i = 1; i < guildSummaryResults.length; i++)
  {
    if (guildSummaryResults[i].latestValidContribution > highestGuildSummaryResult.latestValidContribution)
    {
      console.log('Unexpected behavior, guildSummaryResults is not sorted by latestValidContribution first?');
      console.log(guildSummaryResults);
      highestGuildSummaryResult = guildSummaryResults[i];
    }
  }
  
  let rowsHtml = '';
  for (let i = 0; i < guildSummaryResults.length; i++)
  {
    rowsHtml += '<div style="padding: 0px 0px 10px 0px;">';
    if (guildSummaryResults[i].guildName === highestGuildSummaryResult.guildName)
    {
      rowsHtml += generateHighestGuildHtmlSubBlock(highestGuildSummaryResult);
      continue;
    }
    for (let j = 0; j < guildSummaryResults.length; j++)
    {
      console.info('generateGuildComparisonHtmlSubBlock for: ' + guildSummaryResults[i].guildName + '-' + guildSummaryResults[j].guildName);
      rowsHtml += generateGuildComparisonHtmlSubBlock(guildSummaryResults[i], guildSummaryResults[j]);
    }
    rowsHtml += '</div>';
  }
  
  let html = `
    <div style="margin: 20px 0px 20px 20px;">
      <h1 style="margin: 0px 0px 5px 0px;">Trends</h1>
      <div style="padding: 0px 0px 0px 20px; font-size: 22px;">
        ${rowsHtml}
      </div>
    </div>
  `;
  return html;
}

/**
 * Generates HTML for guild summary block - highest guild sub-block.
 *
 * @param highestGuildSummaryResult Results of the calculations done for the guild with the highest latestValidContribution
 * @return HTML code to generate guild summary block - highest guild sub-block
 */
function generateHighestGuildHtmlSubBlock(highestGuildSummaryResult)
{
  let blockContentHtml = `
    ${getFormattedGuildNameHtml(highestGuildSummaryResult)} is currently in the lead with <span style="font-weight: bold;">${utilities.thousandsCommaFormatNumber(highestGuildSummaryResult.latestValidContribution)}</span> Contribution as of ${getFormattedDateHtml(highestGuildSummaryResult.latestValidEntryDate)}.
  `;
  return `
    <div style="padding: 10px 10px 10px 0px; font-weight: normal; border: none; color: ${highestGuildSummaryResult.guildColor};">
      ${blockContentHtml}
    </div>
  `;
}

/**
 * Generates HTML for guild summary block - guild comparison sub-block. guildSummaryResult1.latestValidContribution should be less than or equal to guildSummaryResult2.latestValidContribution.
 *
 * @param guildSummaryResult1 Results of the calculations done for the base guild
 * @param guildSummaryResult2 Results of the calculations done for the guild to compare to
 * @return HTML code to generate guild summary block - guild comparison sub-block
 */
function generateGuildComparisonHtmlSubBlock(guildSummaryResult1, guildSummaryResult2)
{
  if (guildSummaryResult1.guildName === guildSummaryResult2.guildName)
  {
    console.log('Cannot generateGuildComparisonHtmlSubBlock for ' + guildSummaryResult1.guildName + '-' + guildSummaryResult2.guildName + '. ' + guildSummaryResult1.guildName + ' has the same guild name as ' + guildSummaryResult2.guildName + '.');
    return '';
  }
  
  if (guildSummaryResult1.latestValidContribution > guildSummaryResult2.latestValidContribution)
  {
    console.log('Cannot generateGuildComparisonHtmlSubBlock for ' + guildSummaryResult1.guildName + '-' + guildSummaryResult2.guildName + '. ' + guildSummaryResult1.guildName + ' has more contribution than ' + guildSummaryResult2.guildName + '.');
    return '';
  }
  
  if (utilities.getFormattedDate(guildSummaryResult1.latestValidEntryDate) !== utilities.getFormattedDate(guildSummaryResult2.latestValidEntryDate))
  {
    console.log('Cannot generateGuildComparisonHtmlSubBlock for ' + guildSummaryResult1.guildName + '-' + guildSummaryResult2.guildName + '. ' + guildSummaryResult1.guildName + ' does not have the same latest valid entry date as ' + guildSummaryResult2.guildName + '.');
    return '';
  }
  
  let blockContentHtml = '';
  blockContentHtml += `
    ${getFormattedGuildNameHtml(guildSummaryResult1)} is currently behind ${getFormattedGuildNameHtml(guildSummaryResult2)} by <span style="font-weight: bold;">${utilities.thousandsCommaFormatNumber(guildSummaryResult2.latestValidContribution-guildSummaryResult1.latestValidContribution)}</span> Contribution as of ${getFormattedDateHtml(guildSummaryResult1.latestValidEntryDate)}.
  `;
  
  let daysUntilIntersect = Math.ceil((guildSummaryResult2.latestValidContribution - guildSummaryResult1.latestValidContribution) / (guildSummaryResult1.averagePerDay - guildSummaryResult2.averagePerDay));
  
  console.log('daysUntilIntersect = Math.ceil((' + guildSummaryResult2.latestValidContribution + ' - ' + guildSummaryResult1.latestValidContribution + ') / (' + guildSummaryResult1.averagePerDay + ' - ' + guildSummaryResult2.averagePerDay + ')) = ' + daysUntilIntersect);
  
  if (utilities.isNumeric(daysUntilIntersect))
  {
    blockContentHtml += `
      <div style="padding: 5px 0px 0px 0px;"></div>
      ${getFormattedGuildNameHtml(guildSummaryResult1)} is 
    `;
    // daysUntilIntersect can be 0, meaning daysUntilIntersect before Math.ceil is like -0.75 but after Math.ceil is 0.
    // This situation happened on 04 Jan 2020 for Elite-Bounce, when Bounce overtook Elite and Elite trends showed: "Elite is estimated to overtake Bounce in 0 days on [04 Jan 2020]."
    // daysUntilIntersect = Math.ceil((205740176 - 205576171) / (68846.83870967742 - 286476.3548387097)) = 0
    if (daysUntilIntersect <= 0)
    {
      blockContentHtml += `
        <u>not</u> estimated to overtake ${getFormattedGuildNameHtml(guildSummaryResult2)}.
      `;
    }
    else
    {
      let intersectDate = moment(guildSummaryResult1.latestValidEntryDate).add(daysUntilIntersect, 'days');
      blockContentHtml += `
        estimated to overtake ${getFormattedGuildNameHtml(guildSummaryResult2)} in <span style="font-weight: bold;">${utilities.getFormattedDateDifferenceDuration(intersectDate, guildSummaryResult1.latestValidEntryDate)}</span> on ${getFormattedDateHtml(intersectDate)}.
      `;
    }
  }
  
  return `
    <div style="padding: 10px 10px 10px 0px; font-weight: normal; border: none; color: ${guildSummaryResult1.guildColor};">
      ${blockContentHtml}
    </div>
  `;
}

/**
 * Generates HTML for formatted guild name in [Icon]GuildName format.
 *
 * @param guildSummaryResult Results of the calculations done for the guild
 * @return HTML code for formatted guild name with icon
 */
function getFormattedGuildNameHtml(guildSummaryResult)
{
  return `<img src="${guildSummaryResult.guildIconUrl}" style="height: 20px; padding: 0px 5px 0px 0px;"><span style="font-weight: bold; color: ${guildSummaryResult.guildColor};">${guildSummaryResult.guildName}</span>`;
}

/**
 * Generates HTML for formatted date.
 *
 * @param date Date or moment Date object
 * @return HTML code for formatted date
 */
function getFormattedDateHtml(date)
{
  return `[<span style="font-weight: bold;">${utilities.getFormattedDate(date)}</span>]`;
}
