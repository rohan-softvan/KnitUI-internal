import React, {useEffect, useRef, useState} from "react";
import * as WebDataRocksReact from "react-webdatarocks";
import 'webdatarocks/webdatarocks.css'
import "webdatarocks/webdatarocks.highcharts";
import TabPanel from "./TabPanel";
import {makeStyles, Tab, Tabs} from "@material-ui/core";
import OptionsTab from './OptionsTab';
import {useDispatch, useSelector} from "react-redux";
import {setGeneralConfig, setGraphConfig, setPieChartConfig, setSelectedItems} from "../redux/slice/ChartEditorSlice";
import {chartEditorEnum} from "../enums";


const PivotTable = ({pieConfig, setPieConfig}) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  let generalChartType = useSelector((state) => state.chart.generalChartType);
  let dataJSONConfig = useSelector((state) => state.chart.dataJSON);
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
  let graphConfig = useSelector((state) => state.chart.graphConfig);
  let myRef = useRef();
  let pieRef = useRef();
  let previousRef = useRef(true);

  const reportComplete = () => {
    calculateDynamicWidth();
  };

  const setDefaultGraphProperties = (graphConfig) => {
    // if(JSON.stringify(graphConfig) !== "{}"){}
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
    config.tooltip = {
      valueSuffix: '',
    }
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
        // text: `<span style="cursor:pointer;" id="custom-y-axis-title"> ${config.yAxis.length > 0 && config.yAxis[0].title.text}</span>`
        text: `<span style="cursor:pointer;" id="custom-y-axis-title"> ${config.yAxis?.title?.text || config.yAxis[0]?.title?.text || "Y-axis-title"}</span>`
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
    if (generalChartType === "pie") {
      return JSON.parse(JSON.stringify(pieConfig))
    } else {
      return JSON.parse(JSON.stringify(graphConfig));
    }
  }

  function setGraphConfigs(config) {
    if (generalChartType === "pie") {
      setPieConfig(config);
    } else {
      dispatch(setGraphConfig(JSON.parse(JSON.stringify(config))));
    }
  }

  const renderGraph = (data) => {	
    let newGraphConfig = {};
    let isSameSeries = false;	
    let xAxisTitle = data.xAxis.title.text;
    let yAxisTitle = data.yAxis?.title?.text || data.yAxis[0]?.title?.text;
    // redux data	
    if (Object.values(getGraphConfigs()).length !== 0) {	
      newGraphConfig = JSON.parse(JSON.stringify(getGraphConfigs()));	
      if (data.chart.type === "pie") {	
        if (data.series[0].data.length === newGraphConfig.series[0].data.length && data.series[0].data.every(function (value, index) {	
          return value.name === newGraphConfig.series[0].data[index].name && value.y === newGraphConfig.series[0].data[index].y	
        })) {	
          isSameSeries = true;	
          xAxisTitle = newGraphConfig.xAxis?.title?.text;
          yAxisTitle = newGraphConfig.yAxis?.title?.text;
        } else {	
          isSameSeries = false;	
        }	
      } else {	
        if (data.series.length === newGraphConfig.series.length) {	
          data.series.forEach((e, i) => {	
            if (e.name === newGraphConfig.series[i].name) {	
              if (e.data.length === newGraphConfig.series[i].data.length && e.data.every(function (value, index) {	
                return value === newGraphConfig.series[i].data[index]	
              })) {	
                isSameSeries = true;	
                xAxisTitle = newGraphConfig.xAxis?.title?.text;
                yAxisTitle = newGraphConfig.yAxis?.title?.text;
              } else {	
                isSameSeries = false;	
              }	
            } else {	
              isSameSeries = false;	
            }	
          })	
        } else {	
          isSameSeries = false;	
        }	
      }	
      if (!isSameSeries) {	
        if (generalChartType === "pie") {	
          newGraphConfig.series = data.series;	
          newGraphConfig.xAxis.categories = data.series[0].data.map(e => e.name);	
          newGraphConfig.yAxis = data.yAxis	
        } else {	
          newGraphConfig.series = data.series;	
          newGraphConfig.xAxis.categories = data.xAxis.categories;	
         
          // newGraphConfig.yAxis = data.yAxis	
        }	
      }	
    } else {	
      // if no data in redux(initial graph load)	
      newGraphConfig = JSON.parse(JSON.stringify(data));	
    }	
    let graphData = JSON.parse(JSON.stringify(isSameSeries ? newGraphConfig : setDefaultGraphProperties(newGraphConfig)));	
    // graphData.xAxis.title.text = `<span style="cursor:pointer;" id="custom-x-axis-title"> ${graphData.xAxis.title.text}</span>`;	
    // graphData.yAxis.title.text = `<span style="cursor:pointer;" id="custom-y-axis-title"> ${graphData.yAxis.title.text}</span>`	
    graphData.xAxis.title.text = `<span style="cursor:pointer;" id="custom-x-axis-title"> ${xAxisTitle}</span>`;
    graphData.yAxis.title.text = `<span style="cursor:pointer;" id="custom-y-axis-title"> ${yAxisTitle}</span>`;
    dispatch(setGeneralConfig(data.series));	
    setGraphConfigs(graphData);	
  }

  const createChart = () => {
    const rows1 = myRef && myRef.webdatarocks.getReport().slice && myRef.webdatarocks.getReport().slice.rows ? myRef.webdatarocks.getReport().slice.rows : [];
    const columns1 = myRef && myRef.webdatarocks.getReport().slice && myRef.webdatarocks.getReport().slice.columns ? myRef.webdatarocks.getReport().slice.columns : [];
    const measures1 = myRef  && myRef.webdatarocks.getReport().slice && myRef.webdatarocks.getReport().slice.measures ? myRef.webdatarocks.getReport().slice.measures : [];
    myRef.webdatarocks.highcharts.getData(
        {
          type: generalChartType === "pie" ? "pie" : config.type
        },
        function (data) {
          renderGraph(data);
        },
        function (data) {
          renderGraph(data);
        }
    );
    if (previousRef.current) {
      previousRef.current = false;
      return;
    }
    //do not execute below code while initial load
    dispatch(setSelectedItems([{rows: rows1, columns: columns1, measures: measures1}]));
    setRows(rows1);
    setColumns(columns1);
    setMeasures(measures1);
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

  
    slice: {
      rows: rows,
      columns: columns,
      measures: measures,
      "sorting": {
        "column": {
            "type": "desc",
            "tuple": [],
            "measure": "count"
        }
    },
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
  };

  const handleResize = () => {
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
      [optionsConfig]
  );

  useEffect(
      () => {
        return () => {
          if (myRef && myRef.webdatarocks && activeTab === 0) {
            myRef &&
            myRef.webdatarocks.on("reportchange", function () {
              handleReportFieldModal(activeTab);
            });

          }
        }
      }
      // [value]
  );

  const handleReportFieldModal = (activeTab) => {
    if (activeTab === 0) {
      if(JSON.stringify(dataJSONConfig) !== "{}"){
        let bodyStyles = document.body.style;
        bodyStyles.setProperty('--displayFlag', 'block');
        document.getElementById("wdr-fields-view").style.display = "block !important"
        document.getElementsByClassName("wdr-ui-element wdr-ui wdr-fields-view-wrap")[0].style.display = "block"
      }
    } else {
      let bodyStyles = document.body.style;
      bodyStyles.setProperty('--displayFlag', 'none');
      document.getElementById("wdr-fields-view").style.display = "none !important"
      document.getElementsByClassName("wdr-ui-element wdr-ui wdr-fields-view-wrap")[0].style.display = "none"
    }
  }


  return (
    <>
    {display &&
        <div>
          <div>
            <div className="pivotTable">
              <div>
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
    }
  </>
  );
};

export default PivotTable;
