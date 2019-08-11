
import '../lib/highcharts.js';
import * as utilities from '../util/utilities.js';
import * as guildUtilities from '../util/guildUtilities.js';


let chart =
{
  type: 'column',
  plotBorderWidth: 0,
  plotShadow: false,
  backgroundColor: '#DCDCDC',
  spacingTop: 10,
  spacingBottom: 10,
  zoomType: 'x',
  resetZoomButton:
  {
    position:
    {
      align: 'right',
      verticalAlign: 'top',
      x: -10,
      y: 10
    },
    relativeTo: 'chart',
    theme:
    {
      fill: 'white',
      stroke: 'silver',
      r: 10,
      states:
      {
        hover:
        {
          fill: '#41739D',
          style:
          {
            color: 'white'
          }
        }
      },
      style:
      {
        color: '#000000',
        fontWeight: 'normal',
        fontSize: '22px',
        fontFamily: 'Arial, Liberation Sans, sans-serif'
      }
    }
  },
  panning: true,
  panKey: 'shift'
}

let credits =
{
  enabled: false
}

let title =
{
  text: 'Total Guild Contribution Gained By Month',
  style:
  {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: '26px',
    fontFamily: 'Arial, Liberation Sans, sans-serif'
  }
}

let legend =
{
  layout: 'horizontal',
  align: 'center',
  verticalAlign: 'top',
  floating: false,
  padding: 10,
  margin: 5,
  itemStyle:
  {
    color: '#000000',
    fontWeight: 'normal',
    fontSize: '18px',
    fontFamily: 'Arial, Liberation Sans, sans-serif'
  },
  itemHoverStyle:
  {
    color: '#708090'
  },
  itemHiddenStyle:
  {
    color: '#A0A0A0'
  }
}

let xAxis =
{
  lineWidth: 1,
  lineColor: '#000000',
  gridLineWidth: 1,
  gridLineColor: '#C0C0C0',
  labels:
  {
    style:
    {
      color: '#000000',
      fontWeight: 'normal',
      fontSize: '14px',
      fontFamily: 'Arial, Liberation Sans, sans-serif'
    },
    overflow: 'justify'
  },
  title:
  {
    text: null
  },
  crosshair:
  {
    color: 'rgba(204, 214, 235, 0.5)'
  }
}

let yAxis =
{
  tickmarkPlacement: 'on',
  lineWidth: 1,
  lineColor: '#000000',
  gridLineWidth: 1,
  gridLineColor: '#C0C0C0',
  labels:
  {
    format: '{value:,.0f}',
    style:
    {
      color: '#000000',
      fontWeight: 'normal',
      fontSize: '14px',
      fontFamily: 'Arial, Liberation Sans, sans-serif'
    },
    overflow: 'justify'
  },
  title:
  {
    text: 'Contribution',
    style:
    {
      color: '#000000',
      fontWeight: 'bold',
      fontSize: '16px',
      fontFamily: 'Arial, Liberation Sans, sans-serif'
    }
  }
}

let subtitle =
{
  text: '<span >* Left click + drag to zoom in graph</span>'
        + '<br>'
        + '<span style="color: #000000;">* Hold [Shift] to pan with left mouse button</span>'
        + '<br>'
        + '<span style="color: #000000;">* Click on guild name on legend to toggle visibility</span>',
  style:
  {
    color: '#000000',
    fontWeight: 'normal',
    fontSize: '12px',
    fontFamily: 'Arial, Liberation Sans, sans-serif'
  },
  align: 'left',
  verticalAlign: 'top',
  useHTML: true
}

let tooltip =
{
  headerFormat: '<span style="font-size: 10px;"><strong>{point.key}</strong></span><br/>',
  valueDecimals: 0,
  shared: true,
  backgroundColor:
  {
    linearGradient: [0, 0, 0, 60],
    stops:
    [
      [0, '#FFFFFF'],
      [1, '#E0E0E0']
    ]
  },
  borderWidth: 2,
  borderColor: '#A0A0A0'
}

let plotOptions =
{
  series:
  {
    states:
    {
      inactive:
      {
        opacity: 0.15
      }
    },
    turboThreshold: 0
  },
  column:
  {
    borderWidth: 1,
    borderColor: 'black',
    pointWidth: 20,
    groupPadding: 0.15
  }
}

Highcharts.setOptions(
{
  lang:
  {
    thousandsSep: ','
  }
});

/**
 * Extracts data from guildDataReference, calculates guild contribution gained each month for each guild, and draws the chart to the HTML container ID.
 *
 * @param chartHtmlContainerId HTML ID to draw chart on
 * @param guildDataReference Guild data processed and packaged as a map
 */
export function drawMonthlyContributionGainedGraph(chartHtmlContainerId, guildDataReference)
{
  // Find the start and end months to loop
  let earliestEntryDate = guildUtilities.findEarliestEntryDate(guildUtilities.getDates(guildDataReference));
  let latestEntryDate = guildUtilities.findLatestEntryDate(guildUtilities.getDates(guildDataReference));
  
  // .month() indexes are from 0 to 11
  let startMonthDate = utilities.getMomentUtcDate(earliestEntryDate.year(), earliestEntryDate.month() + 1, 1);
  let endMonthDate = utilities.getMomentUtcDate(latestEntryDate.year(), latestEntryDate.month() + 1, 1);
  
  let guilds = guildUtilities.getGuilds(guildDataReference);
  let series = [];
  xAxis.categories = [];
  
  // Initialize the series
  for (let i = 0; i < guilds.length; i++)
  {
    let seriesEntry =
    {
      name: guilds[i].name,
      color: guilds[i].color,
      data: []
    };
    series.push(seriesEntry);
  }
  
  // Calculate guild contribution gained each month for each guild, looped through by month
  for (let loopDate = moment(startMonthDate); loopDate.isSameOrBefore(endMonthDate); loopDate.add(1, 'months'))
  {
    xAxis.categories.push(moment(loopDate).format('MMMM YYYY'));
    for (let i = 0; i < guilds.length; i++)
    {
      let guildContributionGainedMonth = guildUtilities.calculateGuildContributionGainedMonth(guildDataReference, guilds[i].name, loopDate.year(), loopDate.month() + 1);
      
      if (series[i].name === guilds[i].name)
      {
        series[i].data.push(guildContributionGainedMonth.interpolatedContributionGained);
      }
      else
      {
        console.warn('Mismatch series indexes not corresponding to the correct guild, should not happen');
      }
    }
  }
  
  console.info('drawMonthlyContributionGainedGraph:');
  console.log('xAxis.categories:');
  console.log(xAxis.categories);
  console.log('series');
  console.log(series);
  
  let graphChart = Highcharts.chart(chartHtmlContainerId,
  {
    chart: chart,
    credits: credits,
    title: title,
    legend: legend,
    xAxis: xAxis,
    yAxis: yAxis,
    subtitle: subtitle,
    tooltip: tooltip,
    plotOptions: plotOptions,
    series: series
  });
  
  /*
  // BUG: Reset zoom button is messed up on first load up, disabled until fixed
  // Zoom in chart to show the most recent months in year to date
  graphChart.xAxis[0].zoom(xAxis.categories.length - 13, xAxis.categories.length - 1);
  graphChart.redraw();
  if (!graphChart.resetZoomButton)
  {
    graphChart.showResetZoom();
  }
  */
  
}
