import React, {useEffect, useRef, useState} from "react";
import * as WebDataRocksReact from "react-webdatarocks";
import 'webdatarocks/webdatarocks.css'
import "webdatarocks/webdatarocks.highcharts";
import TabPanel from "./TabPanel";
import {makeStyles, Tab, Tabs} from "@material-ui/core";
import OptionsTab from './OptionsTab';
import {useDispatch, useSelector} from "react-redux";
import {setGeneralConfig, setGraphConfig, setPieChartConfig} from "../redux/slice/ChartEditorSlice";
import {chartEditorEnum} from "../enums";


const PivotTable = ({pieConfig, setPieConfig}) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  let generalChartType = useSelector((state) => state.chart.generalChartType);
  let dataJSONConfig = useSelector((state) => state.chart.dataJSON);
  console.log('dataJSNCOnfig==>', dataJSONConfig)
  let selectedQuestion = useSelector((state) => state.chart.selectedItems);
  const [optionsConfig, setOptionsConfig] = useState({
    grandTotal: "on",
    subTotals: "on",
    layout: "compact"
  });
  const [color, setColor] = useState("#4E4E4E");
  const [data, setData] = useState([]);
  const [config, setConfig] = useState({
    type: "column",
    title: "My Graph Title",
    height: 600,
    reflow: true,
  });
  const [metaData, setMetaData] = useState({
    totalRows: null,
    totalColumns: null
  });
  const [newTitle, setNewTitle] = useState("MARVEL");
  const [display, setDisplay] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('Roboto');
  const [rows, setRows] = useState(selectedQuestion[0].rows);

  const [columns, setColumns] = useState(selectedQuestion[0].columns);
  const [measures, setMeasures] = useState(selectedQuestion[0].measures);
  // const [rows, setRows] = useState({
  //   uniqueName: "Q8 Do you have a meal plan for on-campus dining?"
  // });

  // const [columns, setColumns] = useState({
  //   uniqueName: "Q6 We would like to learn a little bit more about how you structure meal time between home, work and school. Which of these best describes you?"
  // }, {
  //   uniqueName: "Q20 Would you be interested in ordering from a food locker like this?"
  // });
  // const [measures, setMeasures] = useState({
  //   uniqueName: "sum"
  // });
  let graphConfig = useSelector((state) => state.chart.graphConfig);
  let myRef = useRef();
  let pieRef = useRef();

  const reportComplete = () => {
    calculateDynamicWidth();
    // setTimeout(() => {
    //myRef && myRef.webdatarocks && createChart();
    // }, 500)

  };

  const setDefaultGraphProperties = (graphConfig) => {
    let config = JSON.parse(JSON.stringify(graphConfig));
    config.chart = {...chartEditorEnum.chartDefaultProps, ...config.chart}
    config.credits = {enabled: false}
    if (!config.title || !config.title.text) {
      config.title = chartEditorEnum.titleDefaultProps
    }
    if (!config.subtitle) {
      config.subtitle = chartEditorEnum.subtitleDefaultProps
    }
    config.exporting = {enabled: false}
    config.xAxis = {
      // title: chartEditorEnum.xAxisDefaultProps.title,
      gridLineColor: chartEditorEnum.xAxisDefaultProps.gridLineColor,
      gridLineWidth: chartEditorEnum.xAxisDefaultProps.gridLineWidth,
      labels: chartEditorEnum.xAxisDefaultProps.labels,
      ...config.xAxis
    }
    //TODO check this if causes issue in y axis
    config.yAxis = {
      gridLineColor: chartEditorEnum.yAxisDefaultProps.gridLineColor,
      gridLineWidth: chartEditorEnum.yAxisDefaultProps.gridLineWidth,
      labels: chartEditorEnum.yAxisDefaultProps.labels,
      title: {
        enabled: true,
        text: `<span style="cursor:pointer;" id="custom-y-axis-title"> ${config.yAxis[0].title.text}</span>`
      }
    }

    if (!("style" in config.xAxis.title)) {
      config.xAxis.title.style = chartEditorEnum.xAxisDefaultProps.style
    }
    if (!("style" in config.yAxis?.title)) {
      config.yAxis.title.style = chartEditorEnum.yAxisDefaultProps.style
    }
    if (!("legend" in config)) {
      config.legend = chartEditorEnum.legendsDefaultProps
    }
    if (!("plotOptions" in config)) {
      config.plotOptions = chartEditorEnum.plotOptionsDefaultProps;
    }

    //setting the colors for multicolor graphs
    if ((config.chart.type === "bar" || config.chart.type === "column") && config.plotOptions.series.colorByPoint) {
      config.legend = {...chartEditorEnum.legendsDefaultProps, enabled: false};
      if (config.series.length === 3) {
        config.colors = chartEditorEnum.defaultSeriesColors["threePoint"];
        // if series is exactly 5
      } else if (config.series.length === 5) {
        config.colors = chartEditorEnum.defaultSeriesColors["fivePoint"];
        // if series is greater than 5 and less than 3 (generalize)
      } else {
        config.colors = chartEditorEnum.defaultSeriesColors["general"];
      }
      //setting the colors for  general graphs
    } else if (config.chart.type === "pie") {
      // if series is exactly 3
      if (config.series[0].data.length === 3) {
        config.series[0].data.forEach((seriesItem, index) => {
          seriesItem.color = chartEditorEnum.defaultSeriesColors["threePoint"][index]
          // seriesItem.showInLegend = true
        });
        // if series is exactly 5
      } else if (config.series[0].data.length === 5) {
        config.series[0].data.forEach((seriesItem, index) => {
          seriesItem.color = chartEditorEnum.defaultSeriesColors["fivePoint"][index]
          // seriesItem.showInLegend = true
        });
        // if series is greater than 5 and less than 3 (generalize)
      } else {
        config.series[0].data.forEach((seriesItem, index) => {
          if (index < 6) {
            seriesItem.color = chartEditorEnum.defaultSeriesColors["general"][index]
          } else {
            seriesItem.color = chartEditorEnum.defaultSeriesColors["general"][index - 6]
          }
          // seriesItem.showInLegend = true
        });
      }

    } else {
      config.legend = {...chartEditorEnum.legendsDefaultProps};
      if ("colors" in config) {
        delete config.colors;
      }
      // if series is exactly 3
      if (config.series.length === 3) {
        config.series.forEach((seriesItem, index) => {
          seriesItem.color = chartEditorEnum.defaultSeriesColors["threePoint"][index]
          seriesItem.showInLegend = true
        });
        // if series is exactly 5
      } else if (config.series.length === 5) {
        config.series.forEach((seriesItem, index) => {
          seriesItem.color = chartEditorEnum.defaultSeriesColors["fivePoint"][index]
          seriesItem.showInLegend = true
        });
        // if series is greater than 5 and less than 3 (generalize)
      } else {
        config.series.forEach((seriesItem, index) => {
          if (index < 6) {
            seriesItem.color = chartEditorEnum.defaultSeriesColors["general"][index]
          } else {
            seriesItem.color = chartEditorEnum.defaultSeriesColors["general"][index - 6]
          }
          seriesItem.showInLegend = true
        });
      }
    }
    return config;
  }

  const getPieConfig = () => {
    myRef.webdatarocks.highcharts.getData(
        {
          type: "pie",
          styledMode: true
        },
        function (data) {
          dispatch(setPieChartConfig(data.series))
          // dispatch(setGraphConfig(data))
        }
    );
  }

  function getGraphConfigs() {
    console.log("in getGraphConfigs: ", generalChartType)
    if (generalChartType === "pie") {
      return JSON.parse(JSON.stringify(pieConfig))
    } else {
      return JSON.parse(JSON.stringify(graphConfig));
    }
  }

  function setGraphConfigs(config) {
    console.log("in setGraphConfigs:: ", config)
    if (generalChartType === "pie") {
      setPieConfig(config);
    } else {
      dispatch(setGraphConfig(JSON.parse(JSON.stringify(config))));
    }
  }

  const renderGraph = (data) => {
    let graphData = Object.values(getGraphConfigs()).length !== 0 ? JSON.parse(JSON.stringify(setDefaultGraphProperties(generalChartType === "pie" ? pieConfig : data))) : setDefaultGraphProperties(data);
    graphData.xAxis.title.text = `<span style="cursor:pointer;" id="custom-x-axis-title"> ${graphData.xAxis.title.text}</span>`;
    graphData.yAxis.title.text = `<span style="cursor:pointer;" id="custom-y-axis-title"> ${graphData.yAxis.title.text}</span>`
    dispatch(setGeneralConfig(data.series));
    console.log("in createChart");
    setGraphConfigs(graphData);
  }

  const createChart = () => {
    myRef.webdatarocks.highcharts.getData(
        {
          type: config.type,
        },
        function (data) {
          console.log("11 callbackHandler", data)
          renderGraph(data);
        },
        function (data) {
          console.log("11 updateHandler")
          renderGraph(data);
        }
    );
  };

  const getDynamicWidth = (totalColumns) => {
    let columnWidths = [{
      idx: 0,
      width: 200
    }];
    for (let i = 1; i <= totalColumns; i++) {
      columnWidths.push({idx: i, width: 100})
    }
    return columnWidths;
  }

  const report = {
    dataSource: {
      data: dataJSONConfig
    },
    tableSizes: {
      columns: [...getDynamicWidth(metaData.totalColumns)]
    },

    // tableSizes: {
    //     columns: [
    //         {
    //             idx: 0,
    //             width: 200
    //         },
    //         {
    //             idx: 1,
    //             width: 100
    //         },
    //         {
    //             idx: 2,
    //             width: 100
    //         },
    //         {
    //             idx: 3,
    //             width: 100
    //         },
    //         {
    //             idx: 4,
    //             width: 100
    //         },
    //         {
    //             idx: 5,
    //             width: 100
    //         },
    //         {
    //             idx: 6,
    //             width: 100
    //         },
    //         {
    //             idx: 7,
    //             width: 100
    //         },
    //         {
    //             idx: 8,
    //             width: 100
    //         },
    //         {
    //             idx: 9,
    //             width: 100
    //         },
    //         {
    //             idx: 10,
    //             width: 100
    //         },
    //         {
    //             idx: 11,
    //             width: 100
    //         },
    //         {
    //             idx: 12,
    //             width: 100
    //         }
    //     ]
    // },
    slice: {
      rows: rows,
      columns: columns,
      measures: measures,
      expands: {
        expandAll: true
      },
      drills: {
        drillAll: false
      },
    },
    options: {
      grid: {
        type: optionsConfig.layout,
        title: "",
        showFilter: false, // hide setting icon from Table head
        showHeaders: false,
        showTotals: optionsConfig.subTotals,
        showGrandTotals: optionsConfig.grandTotal,
        showHierarchies: true,
        showHierarchyCaptions: true,
        showReportFiltersArea: true
      },
      configuratorActive: true,
      configuratorButton: false,
      showAggregations: true,
      showCalculatedValuesButton: true,
      drillThrough: true,
      showDrillThroughConfigurator: true,
      sorting: "false",
      datePattern: "dd/MM/yyyy",
      dateTimePattern: "dd/MM/yyyy HH:mm:ss",
      saveAllFormats: false,
      showDefaultSlice: true,
      defaultHierarchySortName: "asc"
    },
    formats: [
      {
        name: "",
        thousandsSeparator: " ",
        decimalSeparator: ".",
        decimalPlaces: 0,
        maxSymbols: 20,
        currencySymbol: "",
        currencySymbolAlign: "left",
        nullValue: " ",
        infinityValue: "Infinity",
        divideByZeroValue: "Infinity"
      }
    ]
  };

  const calculateDynamicHeight = () => {
    // let finalHeight = (metaData.totalRows + 1) * 30 + 2 + 70 + "px";
    // let wdrGridView = document.getElementById("wdr-grid-view");
    // if (wdrGridView)
    //     document.getElementById("wdr-grid-view").style.height = finalHeight;
    // let wdrPivotView = document.getElementById("wdr-pivot-view");
    // if (wdrPivotView)
    //     document.getElementById("wdr-pivot-view").style.height = finalHeight;
    // wdrPivotView.parentElement.style.height = finalHeight;
  };

  const calculateDynamicWidth = () => {
    // let finalWidth =
    //     (metaData.totalColumns + 1) * 113.2 + metaData.totalColumns + 3.5;
    // const pivotTable = document.querySelector(".wdr-ui-element");
    // pivotTable.style.width = finalWidth + "px";
    // calculateDynamicHeight();
    // applyButtonStyle();
  };

  const handleChartChange = type => {
    config.type = type;
    setConfig({...config});
    // createChart();
  };

  const handleNewTtileChange = e => {
    setNewTitle(e.target.value);
  };

  const handleFontChangeSize = (e) => {
    // config.title = {
    //   // text: `<p style="cursor:pointer;" id="custom-title">`+ newTitle?newTitle : '-' +`</p>`,
    //   style: {
    //     color: config.color ? config.color : color,
    //     fontWeight: config.fontWeight ? config.fontWeight : "bold",
    //     fontFamily: config.fontWeight ? config.fontWeight  : "Roboto",
    //     // fontSize: '50px',
    //     "fontSize": e.target.value+'px'
    //   }
    // };
    setFontSize(e.target.value)
    // config.title.style.color = color;
    // setConfig({ ...config });
    // setTimeout(() => {

    // }, 2000);
  }

  const handleChangeFamily = (e) => {
    setFontFamily(e.target.value)
  }

  const handleTitleSave = () => {
    config.title = {text: newTitle};
    setConfig({...config});
    // createChart();
  };

  function a11yProps(index) {
    return {
      id: `pivot-table-tab-${index}`,
      "aria-controls": `pivot-table-tabpanel-${index}`
    };
  }

  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper
    }
  }));

  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
    handleReportFieldModal(newValue);
  };

  const renderFieldsTab = () => {
    // console.log("rendering renderFieldsTab...");

  };
  const handleResize = () => {
    // this.chart.reflow();
    document.getElementById("#highchartsContainer").chart.reflow();
  };

  const handleSaveClick = () => {
    config.title = {
      // text: `<p style="cursor:pointer;" id="custom-title">`+ newTitle?newTitle : '-' +`</p>`,
      style: {
        color: color,
        fontWeight: config.fontWeight ? config.fontWeight : "bold",
        fontFamily: config.fontWeight ? config.fontWeight : "Roboto"
      }
    };
    // config.title.style.color = color;
    setConfig({...config});
    // createChart()
  }

  const handleOptionsConfigChange = (type, value) => {
    optionsConfig[type] = value;
    setOptionsConfig({...optionsConfig});
  };

  useEffect(() => {

    pieRef && pieRef.webdatarocks && getPieConfig()
    // myRef && myRef.webdatarocks &&
  }, [pieRef])

  useEffect(() => {
    myRef && myRef.webdatarocks && myRef.webdatarocks.on("reportcomplete", function () {
      myRef && myRef.webdatarocks && handleReportFieldModal(activeTab);
      myRef && myRef.webdatarocks && createChart();
    })
  })

  useEffect(
      () => {
        return () => {
          setDisplay(false);
          setTimeout(() => {
            setMetaData({totalRows: null, totalColumns: null});
            setDisplay(true);
          }, 50);
        }
      },
      [rows, columns, measures, optionsConfig]
  );

  useEffect(
      () => {
        return () => {
          if (myRef && myRef.webdatarocks && activeTab === 0) {
            myRef &&
            myRef.webdatarocks.on("reportchange", function () {
              console.log('handleReportFieldModal--->', report)
              // let bodyStyles = document.body.style;
              // bodyStyles.setProperty('--displayFlag', 'block');
              // document.getElementById("wdr-fields-view").style.display = "block !important"
              // document.getElementsByClassName("wdr-ui-element wdr-ui wdr-fields-view-wrap")[0].style.display = "block"
              handleReportFieldModal(activeTab);
            });

          }
        }
      }
      // [value]
  );

  const handleReportFieldModal = (activeTab) => {
    if (activeTab === 0) {
      let bodyStyles = document.body.style;
      bodyStyles.setProperty('--displayFlag', 'block');
      document.getElementById("wdr-fields-view").style.display = "block !important"
      document.getElementsByClassName("wdr-ui-element wdr-ui wdr-fields-view-wrap")[0].style.display = "block"
    } else {
      let bodyStyles = document.body.style;
      bodyStyles.setProperty('--displayFlag', 'none');
      document.getElementById("wdr-fields-view").style.display = "none !important"
      document.getElementsByClassName("wdr-ui-element wdr-ui wdr-fields-view-wrap")[0].style.display = "none"
    }
  }


  return (
      <>
        {display && <div className="pivotTable">
          <WebDataRocksReact.Pivot
              ref={elem => {
                myRef = elem;
                pieRef = elem;
              }}
              width={"100%"}
              height={"100%"}
              toolbar={false}
              report={report}
              reportcomplete={reportComplete}
              localizationloaded
              customizeCell={(cellBuilder, cellData) => {
                if (cellData.columnIndex > metaData.totalColumns)
                  metaData.totalColumns = cellData.columnIndex;
                if (cellData.rowIndex > metaData.totalRows)
                  metaData.totalRows = cellData.rowIndex;
              }}
              reportchange={calculateDynamicWidth}
              aftergriddraw={() => {
                const grandTotalCell = document.getElementsByClassName(
                    "wdr-header wdr-header-c wdr-grand-total"
                )[0];
                if (grandTotalCell) grandTotalCell.innerHTML = "Total";
                calculateDynamicWidth();
                calculateDynamicHeight();
                // handleResize()
              }}
          />
        </div>}
        <div className={"TabRoot"}>
          <div className={classes.root}>
            <Tabs
                value={activeTab}
                onChange={handleChange}
                aria-label="pivot-table-tabs"
            >
              <Tab label="Fields" {...a11yProps(0)} />
              <Tab label="Options" {...a11yProps(1)} />
            </Tabs>

            <TabPanel value={activeTab} index={0}>
              {renderFieldsTab()}
            </TabPanel>
            <TabPanel value={activeTab} index={1}>
              <OptionsTab handleChange={handleOptionsConfigChange}
                          optionsConfig={optionsConfig}/>
            </TabPanel>
          </div>
        </div>
      </>
  );
};

export default PivotTable;
