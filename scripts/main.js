
import * as guildUtilities from '../util/guildUtilities.js';
import { drawContributionGraph } from './guildContributionGraph.js';
import guildSummaryBlock from './guildSummaryBlock.js';
import guildDataTable from './guildDataTable.js';
import { drawMonthlyContributionGainedGraph } from './guildMonthlyContributionGainedGraph.js';
import guildAbout from './guildAbout.js';


const GUILD_DATA_JSON_PATH = 'data/guildData.json';
const GUILD_MONTHLY_CONTRIBUTION_GAINED_GRAPH_CONTAINER_ID = 'monthlyContributionGainedGraphChartContainer';

let guildDataReference = null;
let isDataTableChronologicalOrder = false;
let isBarGuildMonthlyContributionGainedGraph = false;

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
  let chartHtmlContainerId = 'contributionGraphChartContainer';
  let guildContributionGraphHtml = '<div id=' + chartHtmlContainerId + ' style="width: 99%; height: 90%; position: absolute;"></div>';
  document.getElementById("guildContributionGraphHtmlWrapper").innerHTML = guildContributionGraphHtml;
  drawContributionGraph(chartHtmlContainerId, guildDataReference);
  
  let guildSummaryResults = guildUtilities.calculateGuildSummaryResults(guildDataReference);
  
  // Guild Summary Block
  let guildSummaryBlockHtml = guildSummaryBlock(guildSummaryResults);
  document.getElementById("guildSummaryBlockHtmlWrapper").innerHTML = guildSummaryBlockHtml;
  
  // Guild Data Table
  let guildDataTableHtml = guildDataTable(guildDataReference, isDataTableChronologicalOrder);
  document.getElementById("guildDataTableHtmlWrapper").innerHTML = guildDataTableHtml;
  
  // Guild Monthly Contribution Gained Graph
  let guildMonthlyContributionGainedGraphHtml = '<div id=' + GUILD_MONTHLY_CONTRIBUTION_GAINED_GRAPH_CONTAINER_ID + ' style="width: 99%; height: 90%; position: absolute;"></div>';
  document.getElementById("guildMonthlyContributionGainedGraphHtmlWrapper").innerHTML = guildMonthlyContributionGainedGraphHtml;
  drawMonthlyContributionGainedGraph(GUILD_MONTHLY_CONTRIBUTION_GAINED_GRAPH_CONTAINER_ID, guildDataReference, isBarGuildMonthlyContributionGainedGraph);
  
  // Guild About
  let guildAboutHtml = guildAbout();
  document.getElementById("guildAboutHtmlWrapper").innerHTML = guildAboutHtml;
}

window.addEventListener("keydown", keydownResponse, false);

function keydownResponse(event)
{
  if (event.keyCode === 82 || event.keyCode === 83)
  {
    // Keys 'r' or 's' pressed
    // Update Guild Data Table order
    isDataTableChronologicalOrder = !isDataTableChronologicalOrder;
    console.info('Reversing Data Table order, now isDataTableChronologicalOrder: ' + isDataTableChronologicalOrder);
    
    let guildDataTableHtml = guildDataTable(guildDataReference, isDataTableChronologicalOrder);
    document.getElementById("guildDataTableHtmlWrapper").innerHTML = guildDataTableHtml;
  }
  if (event.keyCode === 77)
  {
    // Key 'm' pressed
    // Update Guild Monthly Contribution Gained Graph mode: bar or line graph
    isBarGuildMonthlyContributionGainedGraph = !isBarGuildMonthlyContributionGainedGraph;
    console.info('Switching Guild Monthly Contribution Gained Graph mode, now isBarGuildMonthlyContributionGainedGraph: ' + isBarGuildMonthlyContributionGainedGraph);
    
    drawMonthlyContributionGainedGraph(GUILD_MONTHLY_CONTRIBUTION_GAINED_GRAPH_CONTAINER_ID, guildDataReference, isBarGuildMonthlyContributionGainedGraph);
  }
}
