export const chartEditorEnum = {
  chartDefaultProps: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 3,
  },
  titleDefaultProps: {
    text: "Chart Title",
    style: {
      color: "#ff0000",
    },
  },
  subtitleDefaultProps: {
    text: 'Chart subtitle',
    style: {
      color: "blue"
    }
  },
  xAxisDefaultProps: {
    gridLineColor: "#E6E6E6",
    gridLineWidth: 1, //TODO change to 0
    title: {
      enabled: true,
      //rotation: 0
    },
    labels: {
      rotation: 0
    },
    style: {
      fontFamily: 'Rubik Default',
      color: '#ff00ff'
    }
  },
  yAxisDefaultProps: {
    gridLineColor: "#E6E6E6",
    gridLineWidth: 1,
    title: {
      enabled: true,
      //rotation: 0
    },
    labels: {
      rotation: 0
    },
    style: {
      fontFamily: 'Rubik Default',
      color: '#ff00ff'
    }
  },
  legendsDefaultProps: {
    enabled: true,
    layout: 'vertical',
    verticalAlign: 'top',
    itemStyle: {
      fontFamily: 'Rubik Default',
      color: '#000'
    }
  },
  plotOptionsDefaultProps: {
    series: {
      dataLabels: {
        enabled: true,
        color: 'red',
        align: 'center',
        style: {
          fontWeight: 'bold',
          fontFamily: 'Rubik Default',
          fontSize: "11px",
        }
      }
    }
  },
  exportingDefaultProps: {enabled: false}
}
