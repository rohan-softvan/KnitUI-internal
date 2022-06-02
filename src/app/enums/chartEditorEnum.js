import React, { useState } from 'react';

import { updateCustomizeTab } from "../_helpers/eventHelper"
export const chartEditorEnum = {
  chartDefaultProps: {
    reflow: true,
    backgroundColor: "rgba(0,0,0,0)",
    borderWidth: 1,
    borderColor: "#F1F1F1",
    borderRadius: 3,
    //width: 897 ,
    height: 597,
  },
  titleDefaultProps: {
    // text: `<span style=\"cursor:pointer;\" id=\"custom-title\" onClick=\"`+updateCustomizeTab('heading')+`\"></span>`,
    text:'',
    style: {
      color: "#ff0000",
    },
  },
  subtitleDefaultProps: {
    text: '',
    style: {
      color: "blue"
    }
  },
  xAxisDefaultProps: {
    gridLineColor: "#E6E6E6",
    gridLineWidth: 0, //TODO change to 0
    title: {
      enabled: true,
      text:'<span style="cursor:pointer;" id="custom-x-axis-title"> X Axis Title</span>'
      //rotation: 0
    },
    labels: {
      rotation: 0
    },
    style: {
      fontFamily: 'Roboto',
      color: '#ff00ff'
    }
  },
  yAxisDefaultProps: {
    gridLineColor: "#E6E6E6",
    gridLineWidth: 0,
    title: {
      enabled: true,
      text:'<span style="cursor:pointer;" id="custom-y-axis-title"> Y Axis Title</span>'
      //rotation: 0
    },
    labels: {
      rotation: 0
    },
    style: {
      fontFamily: 'Roboto',
      color: '#ff00ff'
    }
  },
  legendsDefaultProps: {
    enabled: true,
    layout: 'vertical',
    verticalAlign: 'top',
    itemStyle: {
      fontFamily: 'Roboto',
      color: '#000'
    }
  },
  plotOptionsDefaultProps: {
    series: {
      point: {
        events: {
          click: function() {
            updateCustomizeTab("series")
          }
        }
      },
      tooltip: {
        valueDecimals: 0,
      },
      credits: {
        enabled: false
      },
      // dataSorting: {
      //   enabled: true,
      //   sortKey: 'y'
      // },
      dataLabels: {
        enabled: true,
        color: 'red',
        align: 'center',
        style: {
          fontWeight: 'bold',
          fontFamily: 'Roboto',
          fontSize: "11px",
        },
        format: '{point.y:.0f}'// applying precision for data label
      }
    }
  },
  exportingDefaultProps: {enabled: false},
  defaultSeriesColors: {
    general: ["#12284c", "#12988a", "#6f7271", "#F6f3e6", "#f4a000", "#E2dccf", "#Cccac2"],
    fivePoint: ["#12284c", "#12988a", "#6f7271", "#F6f3e6", "#f4a000"],
    threePoint: ["#12284c", "#6f7271", "#f4a000"]
  }
}
