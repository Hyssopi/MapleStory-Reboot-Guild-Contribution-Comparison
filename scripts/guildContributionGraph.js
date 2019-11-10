
import '../lib/highcharts.js';
import * as utilities from '../util/utilities.js';
import * as guildUtilities from '../util/guildUtilities.js';


let chart =
{
  type: 'line',
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

let time =
{
  useUTC: true
}

let title =
{
  text: 'MapleStory Top Reboot Guild Contribution',
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
  itemMarginTop: 0,
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
  type: 'datetime',
  lineWidth: 2,
  lineColor: '#000000',
  gridLineWidth: 1,
  gridLineColor: '#C0C0C0',
  labels:
  {
    format: '{value: %d %b %Y}',
    style:
    {
      color: '#000000',
      fontWeight: 'normal',
      fontSize: '14px',
      fontFamily: 'Arial, Liberation Sans, sans-serif'
    },
    overflow: 'justify'
  },
  tickPixelInterval: 200,
  title:
  {
    text: null
  },
  crosshair:
  {
    width: 2,
    color: 'gray'
  }
}

let yAxis =
{
  tickmarkPlacement: 'on',
  lineWidth: 2,
  lineColor: '#000000',
  gridLineWidth: 1,
  gridLineColor: '#C0C0C0',
  plotLines:
  [
    {
      value: 0,
      color: 'black',
      width: 2,
      zIndex: 1
    }
  ],
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

let caption =
{
  useHTML: true,
  text: '<span >* Left click + drag to zoom in graph</span>'
        + '<br>'
        + '<span style="color: #000000;">* Hold <span style="font-weight: bold;">[Shift]</span> to pan with left mouse button</span>'
        + '<br>'
        + '<span style="color: #000000;">* Click on guild name on legend to toggle visibility</span>',
  style:
  {
    color: '#000000',
    fontWeight: 'normal',
    fontSize: '12px',
    fontFamily: 'Arial, Liberation Sans, sans-serif'
  },
  align: 'left'
}

let tooltip =
{
  useHTML: true,
  xDateFormat: '%A, %d %B %Y',
  headerFormat: '<span><strong>{point.key}</strong></span><br/>',
  pointFormatter: function()
  {
    let legendSymbol = '<img src="' + this.series.legendSymbol.element.href.baseVal + '" style="height: 14px;">';
    return '<div style="font-size: 12px; font-weight: bold;">' + legendSymbol + '<span style="font-size: 14px;"> ' + this.series.name + '</span>: ' + utilities.thousandsCommaFormatNumber(this.y) + '</div>';
  },
  split: true,
  backgroundColor:
  {
    linearGradient: [0, 0, 0, 60],
    stops:
    [
      [0, '#FFFFFFEE'],
      [1, '#E0E0E0EE']
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
        opacity: 0.2
      },
      hover:
      {
        lineWidthPlus: 0
      }
    },
    turboThreshold: 0
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
 * Extract data from guildDataReference and create the list of series. Each series entry being a guild entry.
 *
 * @param guildDataReference Guild data processed and packaged as a map
 * @param showAllGuilds Ignore guild visible flag and process all guilds
 * @return List of series with data extracted from guildDataReference
 */
function generateSeries(guildDataReference, showAllGuilds)
{
  let series = [];
  let seriesGuildEntryReferenceTable = [];
  let guilds = guildUtilities.getGuilds(guildDataReference);
  for (let i = 0; i < guilds.length; i++)
  {
    if (guilds[i] && (showAllGuilds || guilds[i].visible))
    {
      // Add in series entry for each guild into the series list for each guild
      let seriesGuildEntry =
      {
        name: guilds[i].name,
        color: guilds[i].color,
        marker:
        {
          // TODO: Clicking "Reset zoom" messes up the symbol image size and uses the original width and height of the source image instead of the resized width and height specified here. Temporary fix is to resize the source images, temporarily placed in "MapleStory-Reboot-Guild-Contribution-Comparison/images/icons/HalfSized".
          // TODO: Strange but adding this hack fix here seems to fix the same issue in Monthly Contribution Gained Graph (triggered differently: by switching between line/bar after causing the issue in Guild Contribution Graph).
          symbol: 'url('
            + guilds[i].iconUrl.substring(0, guilds[i].iconUrl.lastIndexOf('/'))
            + '/HalfSized'
            + guilds[i].iconUrl.substring(guilds[i].iconUrl.lastIndexOf('/'))
            + ')',
          //symbol: 'url(' + guilds[i].iconUrl + ')',
          width: 22,
          height: 22
        },
        data: []
      }
      series.push(seriesGuildEntry);
      seriesGuildEntryReferenceTable[guilds[i].name] = seriesGuildEntry;
    }
  }
  
  let dates = guildUtilities.getDates(guildDataReference);
  for (let i = 0; i < dates.length; i++)
  {
    for (let j = 0; j < series.length; j++)
    {
      let guildEntry = guildUtilities.getGuildEntry(guildDataReference, dates[i], series[j].name);
      if (!guildEntry.contribution)
      {
        continue;
      }
      
      let seriesDataEntry =
      {
        x: Date.UTC(dates[i].year(), dates[i].month(), dates[i].date()),
        y: guildEntry.contribution
      }
      seriesGuildEntryReferenceTable[series[j].name].data.push(seriesDataEntry);
    }
  }
  
  // Sort the data points of a guild by date
  for (let i = 0; i < series.length; i++)
  {
    series[i].data.sort(function(seriesDataEntry1, seriesDataEntry2)
    {
      return seriesDataEntry1.x - seriesDataEntry2.x;
    });
  }
  
  return series;
}

/**
 * Extracts data from guildDataReference and draws the chart to the HTML container ID.
 *
 * @param chartHtmlContainerId HTML ID to draw chart on
 * @param guildDataReference Guild data processed and packaged as a map
 * @param showAllGuilds Ignore guild visible flag and process all guilds
 */
export function drawContributionGraph(chartHtmlContainerId, guildDataReference, showAllGuilds)
{
  let series = generateSeries(guildDataReference, showAllGuilds);
  
  // TODO: Find a better way to improve adding bolded interval axis
  // Adding plot lines to bold certain interval axis
  let highestContributionValue = 0;
  for (let i = 0; i < series.length; i++)
  {
    for (let j = 0; j < series[i].data.length; j++)
    {
      if (series[i].data[j].y > highestContributionValue)
      {
        highestContributionValue = series[i].data[j].y;
      }
    }
  }
  let boldYAxisInterval = 10e6;
  for (let i = 0; i < Math.floor(highestContributionValue / boldYAxisInterval) * 2; i++)
  {
    let plotLine =
    {
      value: i * boldYAxisInterval,
      color: '#A0A0A0',
      width: 1,
      zIndex: 1
    }
    yAxis.plotLines.push(plotLine);
  }
  
  let graphChart = Highcharts.chart(chartHtmlContainerId,
  {
    chart: chart,
    credits: credits,
    time: time,
    title: title,
    legend: legend,
    xAxis: xAxis,
    yAxis: yAxis,
    caption: caption,
    tooltip: tooltip,
    plotOptions: plotOptions,
    series: series
  });
  
  // Zoom in chart to a time frame of one month prior to latest date to latest date
  let latestEntryDate = guildUtilities.findLatestEntryDate(guildUtilities.getDates(guildDataReference));
  let oneMonthPriorLatestEntryDate = moment(latestEntryDate).subtract(1, 'months');
  graphChart.xAxis[0].zoom(oneMonthPriorLatestEntryDate.valueOf(), latestEntryDate.valueOf());
  graphChart.redraw();
  if (!graphChart.resetZoomButton)
  {
    graphChart.showResetZoom();
  }
}
