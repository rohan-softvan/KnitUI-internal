import React, { useState } from 'react';

import { updateCustomizeTab } from "../_helpers/eventHelper"
export const chartEditorEnum = {
  chartDefaultProps: {
    reflow: true,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 3,
    width: 800,
    height: 600,
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
    gridLineWidth: 1, //TODO change to 0
    title: {
      enabled: true,
      text:'<span style="cursor:pointer;" id="custom-x-axis-title"> X axis Hai</span>'
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
    gridLineWidth: 1,
    title: {
      enabled: true,
      text:'<span style="cursor:pointer;" id="custom-y-axis-title"> Y axis Hai</span>'
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
      dataLabels: {
        enabled: true,
        color: 'red',
        align: 'center',
        style: {
          fontWeight: 'bold',
          fontFamily: 'Roboto',
          fontSize: "11px",
        }
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
