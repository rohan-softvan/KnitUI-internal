import React, {useEffect, useMemo, useRef, useState} from "react";
import Highcharts from "highcharts";
import * as WebDataRocksReact from "react-webdatarocks";
import 'webdatarocks/webdatarocks.css'
import "webdatarocks/webdatarocks.highcharts";
import {DataJson} from './jsondata/DataJson';
import TabPanel from "./TabPanel";
import {makeStyles, Tab, Tabs} from "@material-ui/core";
import OptionsTab from './OptionsTab';

const PivotTable = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [optionsConfig, setOptionsConfig] = useState({
        grandTotal: "on",
        subTotals: "on",
        layout: "compact"
    });
    const [color, setColor] = useState("red");
    const [data, setData] = useState(DataJson);
    const [config, setConfig] = useState({
        type: "column",
        title: "My Graph Title",
        height: 400,
        reflow: true
    });
    const [metaData, setMetaData] = useState({
        totalRows: null,
        totalColumns: null
    });
    const [newTitle, setNewTitle] = useState("LOl");
    const [display, setDisplay] = useState(true);
    const [fontSize, setFontSize] = useState(10);
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

    let myRef = useRef();

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

    const createChart = () => {
        console.log("in createChart::: ", myRef.webdatarocks)
        myRef.webdatarocks.highcharts.getData(
            {
                type: config.type,
                styledMode: true
            },

            function (data) {
                // console.log("graph config >>  data:: ", data);
                // data.chart.height = config.height;
                // data.chart.reflow = config.reflow;
                // data.chart.events = {
                //     load: function () {
                //         console.log("loaded chart");
                //         // document
                //         //   .getElementById("custom-title")
                //         //   .addEventListener("click", handleTitleClick);
                //         // document
                //         //   .getElementById("custom-subtitle")
                //         //   .addEventListener("click", handleSubTitleClick);
                //         // document
                //         //   .getElementById("custom-x-axis-title")
                //         //   .addEventListener("click", e => handleAxisTitleClick(e, "x"));
                //         // document
                //         //   .getElementById("custom-y-axis-title")
                //         //   .addEventListener("click", e => handleAxisTitleClick(e, "y"));
                //     },
                //     click: function () {
                //         // click event background color graph
                //     }
                // };
                // // data.chart.height = config.height
                // // data.chart.backgroundColor = "#ccc";
                // data.chart.borderColor = "#EBBA95";
                // //data.chart.borderRadius = 20;
                // //data.chart.borderWidth = 2;
                // data.chart.reflow = config.reflow;
                // // console.log('newTitle==>', newTitle, fontSize)
                // data.title = {
                //     text: `<p style="cursor:pointer;" id="custom-title">` + newTitle ? newTitle : '-' + `</p>`,
                //     align: 'left',
                //     style: {
                //         color: color,
                //         fontWeight: "bold",
                //         fontFamily: fontFamily,
                //         fontSize: fontSize + 'px',
                //     }
                // };
                // data.subtitle = {
                //     text: `<p style="color: blue;cursor:pointer;" id="custom-subtitle"> LOL-subtitle </p>`,
                //     style: {
                //         color: "#000",
                //         fontWeight: "normal"
                //         // fontFamily: 'Roboto',
                //         // fontFamily: 'Rubik',
                //         // fontFamily: 'Roboto slab',
                //         // fontFamily: 'Script MT',
                //     }
                // };
                // data.credits = {
                //     enabled: false
                // };
                // data.tooltip = {
                //     enabled: true
                // };
                // data.xAxis.title.text = `<p style="cursor:pointer;" id="custom-x-axis-title"> ${
                //     data.xAxis.title.text
                // } </p>`;
                // data.yAxis[0].title.text = `<p style="cursor:pointer;" id="custom-y-axis-title"> ${
                //     data.yAxis[0].title.text
                // } </p>`;
                //
                // let seriesData = data.series;
                // seriesData.map(
                //     e =>
                //         (e.events = {
                //             legendItemClick: function () {
                //                 // console.log("legendItemClick::: ", this);
                //             }
                //         })
                // );
                // data.series = seriesData;
                // data.plotOptions = {
                //     series: {
                //         cursor: "pointer",
                //         point: {
                //             events: {
                //                 click: function () {
                //                     // console.log("seriesClick::: ", this);
                //                 }
                //             }
                //         },
                //         dataLabels: {
                //             enabled: true
                //         }
                //     }
                // };
                Highcharts.chart("highchartsContainer", data);
            },
            function (data) {
                Highcharts.chart("highchartsContainer", data);
                // Highcharts.reflow();
            }
        );
    };

    const report = {
        dataSource: {
            data: data
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
        myRef && myRef.webdatarocks && myRef.webdatarocks.on("reportcomplete", function () {
            console.log("reportcomplete")

            myRef && myRef.webdatarocks && handleReportFieldModal(activeTab);
            myRef && myRef.webdatarocks && createChart();
        });
    })

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

    const handleReportFieldModal=(activeTab)=>{
        console.log('active Tab==>>>',activeTab)
        if(activeTab === 0){
            let bodyStyles = document.body.style;
            bodyStyles.setProperty('--displayFlag', 'block');
            // console.log("Field list is opened!", document.getElementsByClassName("wdr-ui-element wdr-ui wdr-fields-view-wrap"));
            document.getElementById("wdr-fields-view").style.display = "block !important"
            document.getElementsByClassName("wdr-ui-element wdr-ui wdr-fields-view-wrap")[0].style.display = "block"
        }else{
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

                    <div
                        className="charResize"
                        onMouseUpCapture={() => {
                            Highcharts.charts.forEach(function (chart, index) {
                                if (chart) {
                                    if (chart.renderTo.id === "highchartsContainer") {
                                        chart.reflow();
                                    }
                                }
                            });
                        }}
                    >
                        {/*<div id="highchartsContainer"/>*/}
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