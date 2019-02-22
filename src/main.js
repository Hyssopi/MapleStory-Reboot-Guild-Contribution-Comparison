
import * as guildUtilities from '../util/guildUtilities.js';
import { drawGraph } from './guildContributionGraph.js';
import guildSummaryBlock from './guildSummaryBlock.js';
import guildDataTable from './guildDataTable.js';
import guildAbout from './guildAbout.js';


const GUILD_DATA_JSON_PATH = 'data/guildData.json';

console.info('Reading: \'' + GUILD_DATA_JSON_PATH + '\'');
fetch(GUILD_DATA_JSON_PATH)
  .then(response =>
  {
    if (response.ok)
    {
      return response.json();
    }
    else
    {
      console.error('Configuration was not ok.');
    }
  })
  .then(guildData =>
  {
    console.info('Successfully read guild data:');
    console.log(guildData);
    setupTabs(guildData);
  })
  .catch (function(error)
  {
    console.error('Error in fetching: ' + error);
  })

/**
 * Handles and setup all the main page's tabs and put it to the HTML.
 *
 * @param guildData Contains all the guild data and data entries
 */
function setupTabs(guildData)
{
  // Guild Contribution Graph
  let chartContainerId = 'chartContainer';
  let guildContributionGraphHtml = '<div id=' + chartContainerId + ' style="width: 99%; height: 90%; position: absolute;"></div>';
  document.getElementById("guildContributionGraphHtmlWrapper").innerHTML = guildContributionGraphHtml;
  drawGraph(chartContainerId, guildData);
  
  // Guild Summary Block
  let guildSummaryBlockHtml = guildSummaryBlock(guildData);
  document.getElementById("guildSummaryBlockHtmlWrapper").innerHTML = guildSummaryBlockHtml;
  
  // Guild Data Table
  let guildDataTableHtml = guildDataTable(guildData);
  document.getElementById("guildDataTableHtmlWrapper").innerHTML = guildDataTableHtml;
  
  // Guild About
  let guildAboutHtml = guildAbout(guildData);
  document.getElementById("guildAboutHtmlWrapper").innerHTML = guildAboutHtml;
  
  guildUtilities.printDebug(guildData);
}
