import React, {useEffect, useMemo, useRef, useState} from "react";
import Highcharts from "highcharts";
import * as WebDataRocksReact from "react-webdatarocks";
import 'webdatarocks/webdatarocks.css'
import "webdatarocks/webdatarocks.highcharts";
import {DataJson} from './jsondata/DataJson';
import TabPanel from "./TabPanel";
import {makeStyles, Tab, Tabs} from "@material-ui/core";
import OptionsTab from './OptionsTab';
import {useDispatch, useSelector} from "react-redux";
import {setGeneralConfig, setGraphConfig, setPieChartConfig} from "../redux/slice/ChartEditorSlice";
import {chartEditorEnum} from "../enums";
import {updateCustomizeTab} from "../_helpers/eventHelper";


const PivotTable = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  let dataJSON = useSelector((state) => state.chart.dataJSON);
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
  const [rows, setRows] = useState([
    {
      uniqueName: "Q8 Do you have a meal plan for on-campus dining?",
      sort: "asc"
    }
    // {
    //   "uniqueName": "Q6 We would like to learn a little bit more about how you structure meal time between home, work and school. Which of these best describes you?",
    //   "sort": "asc"
    // },
  ]);

  const [columns, setColumns] = useState([
    {
      uniqueName:
          "Q20 Would you be interested in ordering from a food locker like this?",
      sort: "asc"
    }
  ]);
  const [measures, setMeasures] = useState([
    {
      uniqueName:
          "Q20 Would you be interested in ordering from a food locker like this?",
      aggregation: "sum"
    }
    // {
    //   uniqueName: "Q8 Do you have a meal plan for on-campus dining?",
    //   aggregation: "sum",
    // },
    // {
    //   "uniqueName": "Q6 We would like to learn a little bit more about how you structure meal time between home, work and school. Which of these best describes you?",
    //   "aggregation": "sum"
    // },
  ]);
  let graphConfig = useSelector((state) => state.chart.graphConfig);
  let myRef = useRef();
  let pieRef = useRef();

  const reportComplete = () => {
    calculateDynamicWidth();
    // setTimeout(() => {
    //myRef && myRef.webdatarocks && createChart();
    // }, 500)

  };

  const handleTitleClick = event => {
    console.log("handleTitleClick invoked 😁");
  };

  const handleSubTitleClick = event => {
    console.log("handleSubTitleClick invoked 😄");
  };

  const handleAxisTitleClick = (event, axisType) => {
    console.log("handleAxisTitleClick invoked 😄", axisType);
  };

  const handleDataLabelClick = event => {
    console.log("handleDataLabelClick invoked 😄");
  };

  const openLegendsTabEvent = (seriesItem) => {
    seriesItem.events = {
      legendItemClick: function () {
        console.log("legendItemClick::: ");
        updateCustomizeTab("legend");
      }
    }
  }

  const setDefaultGraphProperties = (graphConfig) => {
    let config = JSON.parse(JSON.stringify(graphConfig));
    console.log("setDefaultGraphProperties data: ", config)
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
      gridLineColor: chartEditorEnum.xAxisDefaultProps.gridLineColor,
      gridLineWidth: chartEditorEnum.xAxisDefaultProps.gridLineWidth,
      labels: chartEditorEnum.xAxisDefaultProps.labels,
      ...config.xAxis
    }
    config.yAxis = {
      gridLineColor: chartEditorEnum.yAxisDefaultProps.gridLineColor,
      gridLineWidth: chartEditorEnum.yAxisDefaultProps.gridLineWidth,
      labels: chartEditorEnum.yAxisDefaultProps.labels,
      ...config.yAxis
    }
    config.xAxis.title = {...chartEditorEnum.xAxisDefaultProps.title, ...config.xAxis.title}
    config.yAxis.title = {...chartEditorEnum.yAxisDefaultProps.title, ...config.yAxis.title}

    if (!("style" in config.xAxis.title)) {
      config.xAxis.title.style = chartEditorEnum.xAxisDefaultProps.style
    }
    if (!("style" in config.yAxis.title)) {
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
      console.log("its a multicolor graph 🙃");
      // config.legend = {...chartEditorEnum.legendsDefaultProps, enabled: false};
      // if (config.series.length === 3) {
      //   config.colors = chartEditorEnum.defaultSeriesColors["threePoint"];
      //   // if series is exactly 5
      // } else if (config.series.length === 5) {
      //   config.colors = chartEditorEnum.defaultSeriesColors["fivePoint"];
      //   // if series is greater than 5 and less than 3 (generalize)
      // } else {
      //   config.colors = chartEditorEnum.defaultSeriesColors["general"];
      // }
      //setting the colors for  general graphs
    } else if (config.chart.type === "pie") {
      console.log("its a pie graph 😉", config.chart.type);

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
    // config.series.map(seriesItem => openLegendsTabEvent(seriesItem));
    console.log("setDefaultGraphProperties final", config)
    return config;
  }

  const getPieConfig = () => {
    myRef.webdatarocks.highcharts.getData(
        {
          type: "pie",
          styledMode: true
        },
        function (data) {
          console.log("graph config >>  data:: in Pie Chart ", data);
          console.log("graphConfig redux >>  data:: in pie ", graphConfig, Object.values(graphConfig).length);
          dispatch(setPieChartConfig(data.series))
          // dispatch(setGraphConfig(data))
        }
    );
  }
  const createChart = () => {
    console.log("in createChart::: ", myRef)
    myRef.webdatarocks.highcharts.getData(
        {
          type: config.type,
          "backgroundColor": "#fff",
          "borderColor": "#EBBA95",
          "borderRadius": 20,
          "borderWidth": 2,
          "events": {},
          "height": 400,
          "reflow": true,
        },
        function (data) {
          console.log("graph config >>  data:: ", data);
          console.log("graphConfig redux >>  data:: ", graphConfig, Object.values(graphConfig).length);

          let graphData = Object.values(graphConfig).length !== 0 ? setDefaultGraphProperties(graphConfig) : setDefaultGraphProperties(data);
          console.log('graphConfig==>', graphData)
          dispatch(setGeneralConfig(data.series))
          console.log("graphData ", graphData)
          dispatch(setGraphConfig(graphData))
          // Highcharts.chart("highchartsContainer", graphData ? graphData : data);
        },
        function (data) {
          console.log('graphConfig==>', graphConfig)
          dispatch(setGraphConfig(data))
          // Highcharts.chart("highchartsContainer", graphConfig);
          // Highcharts.reflow();
        }
    );
  };


  const report = {
    dataSource: {
      data: JSON.parse(JSON.stringify(dataJSON))
    },
    tableSizes: {
      columns: [
        {
          idx: 0,
          width: 200
        }
      ]
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
      }
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

  // const handleChangeData = () => {
  //     console.log("changed data");
  //     // setData(DataJson2);
  //     // setMeasures([
  //     //   {
  //     //     uniqueName:
  //     //       "Q11 Please explain why you would probably not or not be interested in ordering from a food locker like this.",
  //     //     aggregation: "sum",
  //     //   },
  //     //   {
  //     //     uniqueName: "Q14 Click to write the question text",
  //     //     aggregation: "sum",
  //     //   },
  //     // ]);
  //     // setRows([
  //     //   {
  //     //     uniqueName: "Q14 Click to write the question text",
  //     //     sort: "asc",
  //     //   },
  //     // ]);
  //     // setColumns([
  //     //   {
  //     //     uniqueName:
  //     //       "Q11 Please explain why you would probably not or not be interested in ordering from a food locker like this.Q20 Would you be interested in ordering from a food locker like this?",
  //     //     sort: "asc",
  //     //   },
  //     // ]);
  //
  //     setData(DataJson);
  //     setMeasures([
  //         {
  //             uniqueName:
  //                 "Q6 We would like to learn a little bit more about how you structure meal time between home, work and school. Which of these best describes you?",
  //             sort: "asc",
  //             aggregation: "sum"
  //         }
  //     ]);
  //     setRows([
  //         {
  //             uniqueName: "Q8 Do you have a meal plan for on-campus dining?",
  //             sort: "asc",
  //             aggregation: "sum"
  //         },
  //         {
  //             uniqueName:
  //                 "Q20 Would you be interested in ordering from a food locker like this?",
  //             sort: "asc",
  //             aggregation: "sum"
  //         }
  //     ]);
  //     setRows([
  //         {
  //             uniqueName: "Q8 Do you have a meal plan for on-campus dining?",
  //             sort: "asc"
  //         }
  //     ]);
  //     setColumns([
  //         {
  //             uniqueName:
  //                 "Q20 Would you be interested in ordering from a food locker like this?",
  //             sort: "asc"
  //         },
  //         {
  //             uniqueName:
  //                 "Q6 We would like to learn a little bit more about how you structure meal time between home, work and school. Which of these best describes you?",
  //             sort: "asc"
  //         }
  //     ]);
  // };

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
  const applyButtonStyle = () => {
    // let applyButton = document.getElementsByClassName(
    //     "wdr-ui-element wdr-ui wdr-ui-btn wdr-ui-btn-dark"
    // );
    // console.log("applyButton ", applyButton);
    // applyButton[0] && applyButton[0].classList.add("wdr-ui-disabled");
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
    // console.log("type: ", type);
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
    // console.log('config size==>', config, e.target.value)
    // setConfig({ ...config });
    // setTimeout(() => {

    // }, 2000);
  }

  const handleChangeFamily = (e) => {
    setFontFamily(e.target.value)
    // console.log('config size==>', config, e.target.value)
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
    // console.log("Checked Resieze Event");
    // this.chart.reflow();
    document.getElementById("#highchartsContainer").chart.reflow();
  };

  const handleSaveClick = () => {
    // console.log('config==>', config)
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
    console.log("type, value: ", type, value);
    optionsConfig[type] = value;
    setOptionsConfig({...optionsConfig});
  };

  useEffect(() => {

    pieRef && pieRef.webdatarocks && getPieConfig()
    // myRef && myRef.webdatarocks &&
  }, [pieRef])

  useEffect(() => {
    myRef && myRef.webdatarocks && myRef.webdatarocks.on("reportcomplete", function () {
      console.log("reportcomplete")
      // setActiveTab(0)
      myRef && myRef.webdatarocks && handleReportFieldModal(activeTab);
      // setActiveTab(0)
      myRef && myRef.webdatarocks && createChart()
      // myRef && myRef.webdatarocks &&
    })
  })

  useEffect(() => {
    console.log("graphConfig ===>", graphConfig, Highcharts)
    if (JSON.stringify(graphConfig) != '{}') {
      // Highcharts.chart("highchartContainer",function (chart) {
      //     window.charts[chart.options.chart.renderTo] = chart;
      // });
      let newGraphConfig = JSON.parse(JSON.stringify(graphConfig));
      console.log("graphConfig ===> new", newGraphConfig, Highcharts)
      Highcharts.chart("highchartsContainer", graphConfig);
    }

  }, [graphConfig])

  useEffect(
      () => {
        return () => {
          // console.log("in use effect");
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
              // console.log('report Change==>',activeTab)
              // let bodyStyles = document.body.style;
              // bodyStyles.setProperty('--displayFlag', 'block');
              // // console.log("Field list is opened!", document.getElementsByClassName("wdr-ui-element wdr-ui wdr-fields-view-wrap"));
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
    console.log('active Tab==>>>', activeTab)
    if (activeTab === 0) {
      let bodyStyles = document.body.style;
      bodyStyles.setProperty('--displayFlag', 'block');
      // console.log("Field list is opened!", document.getElementsByClassName("wdr-ui-element wdr-ui wdr-fields-view-wrap"));
      document.getElementById("wdr-fields-view").style.display = "block !important"
      document.getElementsByClassName("wdr-ui-element wdr-ui wdr-fields-view-wrap")[0].style.display = "block"
    } else {
      let bodyStyles = document.body.style;
      bodyStyles.setProperty('--displayFlag', 'none');
      // console.log("Field list is opened!", document.getElementsByClassName("wdr-ui-element wdr-ui wdr-fields-view-wrap"));
      document.getElementById("wdr-fields-view").style.display = "none !important"
      document.getElementsByClassName("wdr-ui-element wdr-ui wdr-fields-view-wrap")[0].style.display = "none"
    }
  }
  return (
      // style={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}
      display && (
          <div>
            <div>
              <div className="pivotTable">
                <div>
                  {/* <div style={{ width: '500px !important', minWidth: '700px' }}> */}
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
                </div>
              </div>


            </div>
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
          </div>
      )
  );
};

export default PivotTable;
