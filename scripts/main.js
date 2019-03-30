
import * as guildUtilities from '../util/guildUtilities.js';
import { drawGraph } from './guildContributionGraph.js';
import guildSummaryBlock from './guildSummaryBlock.js';
import guildDataTable from './guildDataTable.js';
import guildAbout from './guildAbout.js';


const GUILD_DATA_JSON_PATH = 'data/guildData.json';

let guildDataReference = null;
let isDataTableChronologicalOrder = false;

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
    
    guildDataReference = guildUtilities.calculateGuildDataReference(guildData);
    console.log(guildDataReference);
    setupTabs(guildDataReference);
    
    guildUtilities.printDebug(guildData);
  })
  .catch (function(error)
  {
    console.error('Error in fetching: ' + error);
  })

/**
 * Handles and setup all the main page's tabs and put it to the HTML.
 *
 * @param guildDataReference Guild data processed and packaged as a map
 */
function setupTabs(guildDataReference)
{
  // Guild Contribution Graph
  let chartHtmlContainerId = 'chartContainer';
  let guildContributionGraphHtml = '<div id=' + chartHtmlContainerId + ' style="width: 99%; height: 90%; position: absolute;"></div>';
  document.getElementById("guildContributionGraphHtmlWrapper").innerHTML = guildContributionGraphHtml;
  drawGraph(chartHtmlContainerId, guildDataReference);
  
  let guildSummaryResults = guildUtilities.calculateGuildSummaryResults(guildDataReference);
  
  // Guild Summary Block
  let guildSummaryBlockHtml = guildSummaryBlock(guildSummaryResults);
  document.getElementById("guildSummaryBlockHtmlWrapper").innerHTML = guildSummaryBlockHtml;
  
  // Guild Data Table
  let guildDataTableHtml = guildDataTable(guildDataReference, isDataTableChronologicalOrder);
  document.getElementById("guildDataTableHtmlWrapper").innerHTML = guildDataTableHtml;
  
  // Guild About
  let guildAboutHtml = guildAbout();
  document.getElementById("guildAboutHtmlWrapper").innerHTML = guildAboutHtml;
}

window.addEventListener("keydown", keydownResponse, false);

function keydownResponse(event)
{
  if (event.keyCode === 82 || event.keyCode === 83)
  {
    // Buttons 'r' or 's' pressed
    // Update Guild Data Table order
    isDataTableChronologicalOrder = !isDataTableChronologicalOrder;
    console.info('Reversing Data Table order, now isDataTableChronologicalOrder: ' + isDataTableChronologicalOrder);
    let guildDataTableHtml = guildDataTable(guildDataReference, isDataTableChronologicalOrder);
    document.getElementById("guildDataTableHtmlWrapper").innerHTML = guildDataTableHtml;
  }
}
