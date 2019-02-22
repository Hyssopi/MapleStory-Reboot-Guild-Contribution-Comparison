
import '../lib/highcharts.js';
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
        fontFamily: 'Roboto, sans-serif'
      }
    }
  },
  panning: true,
  panKey: 'ctrl'
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
  text: 'Top Reboot Guilds Contribution Comparison',
  style:
  {
    color: '#000000',
    fontWeight: 'normal',
    fontSize: '26px',
    fontFamily: 'Roboto, sans-serif'
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
    fontFamily: 'Roboto, sans-serif'
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
  lineWidth: 1,
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
      fontFamily: 'Roboto, sans-serif'
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
      fontFamily: 'Roboto, sans-serif'
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
      fontFamily: 'Roboto, sans-serif'
    }
  }
}

let subtitle =
{
  text: '<span >* Left click + drag to zoom in graph</span>'
        + '<br>'
        + '<span style="color: #000000;">* Hold [Ctrl] to pan with left mouse button</span>'
        + '<br>'
        + '<span style="color: #000000;">* Click on guild name on legend to toggle visibility</span>',
  style:
  {
    color: '#000000',
    fontWeight: 'normal',
    fontSize: '12px',
    fontFamily: 'Roboto, sans-serif'
  },
  align: 'left',
  verticalAlign: 'top',
  useHTML: true
}

let tooltip =
{
  crosshairs: true,
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
    turboThreshold: 0,
    states:
    {
      hover:
      {
        lineWidthPlus: 0
      }
    }
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
 * Extract data from guildData and create the list of series. Each series entry being a guild entry.
 *
 * @param guildData Contains all the guild data and data entries
 * @return List of series with data extracted from guildData
 */
function generateSeries(guildData)
{
  let series = [];
  let seriesGuildEntryReferenceTable = [];
  for (let i = 0; i < guildData.guilds.length; i++)
  {
    if (guildData.guilds[i])
    {
      // Add in series entry for each guild into the series list for each guild.
      let seriesGuildEntry =
      {
        name: guildData.guilds[i].name,
        color: guildData.guilds[i].color,
        marker:
        {
          symbol: 'url(' + guildData.guilds[i].symbolUrl + ')',
          width: 20,
          height: 20
        },
        data: []
      }
      series.push(seriesGuildEntry);
      seriesGuildEntryReferenceTable[guildData.guilds[i].name] = seriesGuildEntry;
    }
  }
  
  for (let i = 0; i < guildData.dayEntries.length; i++)
  {
    let year = guildData.dayEntries[i].year;
    let month = guildData.dayEntries[i].month;
    let day = guildData.dayEntries[i].day;
    
    for (let j = 0; j < guildData.dayEntries[i].guildEntries.length; j++)
    {
      let guildName = guildData.dayEntries[i].guildEntries[j].name;
      let contribution = guildData.dayEntries[i].guildEntries[j].contribution;
      
      if (!contribution)
      {
        continue;
      }
      
      let seriesDataEntry =
      {
        // Date month is from 0 to 11.
        x: Date.UTC(year, month - 1, day),
        y: contribution
      }
      seriesGuildEntryReferenceTable[guildName].data.push(seriesDataEntry);
    }
  }
  
  // Sort the data points of a guild by date.
  for (let i = 0; i < series.length; i++)
  {
    series[i].data.sort(function(a, b){return a.x - b.x;});
  }
  
  return series;
}

/**
 * Extracts data from guildData and draws the chart to the HTML container ID.
 *
 * @param containerId HTML ID to draw chart at
 * @param guildData Contains all the guild data and data entries
 */
export function drawGraph(containerId, guildData)
{
  let series = generateSeries(guildData);
  let graphChart = Highcharts.chart(containerId,
  {
    chart: chart,
    credits: credits,
    time: time,
    title: title,
    legend: legend,
    xAxis: xAxis,
    yAxis: yAxis,
    subtitle: subtitle,
    tooltip: tooltip,
    plotOptions: plotOptions,
    series: series
  });
  
  // Zoom in chart to a time frame of one month prior to latest date to latest date.
  let latestEntryDate = guildUtilities.findLatestEntryDate(guildData.dayEntries);
  let oneMonthPriorLatestEntryDate = moment(latestEntryDate).subtract(1, 'months');
  graphChart.xAxis[0].zoom(oneMonthPriorLatestEntryDate.valueOf(), latestEntryDate.valueOf());
  graphChart.redraw();
  if (!graphChart.resetZoomButton)
  {
    graphChart.showResetZoom();
  }
}
