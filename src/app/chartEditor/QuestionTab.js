import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Grid, makeStyles, Tab, Tabs, Typography } from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Checkbox from "@material-ui/core/Checkbox";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useDispatch, useSelector } from "react-redux";
import {
  resetGraphConfig,
  setDataJSONConfig,
  setGeneralConfig,
  setGraphConfig,
  setPieChartConfig,
  setSelectedItems,
  setSelectedQuestion,
  setSelectedQuestionsOptionsList,
} from "../redux/slice/ChartEditorSlice";
import MainChartCheckbox from "../../../src/assets/images/charteditor/MainChartCheckbox.png";
import MainChartUncheckbox from "../../../src/assets/images/charteditor/MainChartUnheckBox.png";
import * as WebDataRocksReact from "react-webdatarocks";
import "webdatarocks/webdatarocks.css";
import "webdatarocks/webdatarocks.highcharts";
import TabPanel from "./TabPanel";
import OptionsTab from "./OptionsTab";

import SubCheckboxSelected from "../../../src/assets/images/charteditor/SubCheckboxSelected.png";
import SubCheckboxUnselectedGray from "../../../src/assets/images/charteditor/SubCheckboxUnselectedGray.png";
import { getChartJSONResponse } from "../redux/actions/ChartAction";
import { chartEditorEnum } from "../enums";

export default function QuestionTab(props) {
  const dispatch = useDispatch();
  const questionData = useSelector((store) => store.data.questionCardListBox);
  let generalChartType = useSelector((state) => state.chart.generalChartType);
  const projectId = useSelector((store) => store.project.projectId);
  const selectedQuestionList = useSelector(
    (store) => store.chart.selectedQuestionList
  );
  const selectedQuestionsOptionsList = useSelector(
    (store) => store.chart.selectedQuestionsOptionsList
  );
  const [selectedQuestions, setSelectedQuestions] = React.useState([
    ...selectedQuestionList,
  ]);
  const [subOptionSelected, setSubOptionSelected] = React.useState({});
  const [dataJSON, setDataJSON] = React.useState([]);
  const [expand, setExpand] = React.useState([]);

  const [activeTab, setActiveTab] = useState(0);
  let dataJSONConfig = useSelector((state) => state.chart.dataJSON);
  let selectedQuestion = useSelector((state) => state.chart.selectedItems);
  const [optionsConfig, setOptionsConfig] = useState({
    grandTotal: "on",
    subTotals: "on",
    layout: "compact",
  });
  const [metaData, setMetaData] = useState({
    totalRows: null,
    totalColumns: null,
  });
  const [display, setDisplay] = useState(false);
  const [report, setReport] = useState({});
  let graphConfig = useSelector((state) => state.chart.graphConfig);
  let myRef = useRef();
  let pieRef = useRef();
  let previousRef = useRef(true);

  const reportComplete = () => {
    savePieConfig();
  };

  const setDefaultGraphProperties = (graphConfig) => {
    // if(JSON.stringify(graphConfig) !== "{}"){}
    let config = JSON.parse(JSON.stringify(graphConfig));
    config.chart = { ...chartEditorEnum.chartDefaultProps, ...config.chart };
    config.credits = { enabled: false };
    if (!config.title || !config.title.text) {
      config.title = chartEditorEnum.titleDefaultProps;
    }
    if (!config.subtitle) {
      config.subtitle = chartEditorEnum.subtitleDefaultProps;
    }
    config.exporting = { enabled: false };
    config.tooltip = {
      valueSuffix: "",
    };
    config.xAxis = {
      // title: chartEditorEnum.xAxisDefaultProps.title,
      gridLineColor: chartEditorEnum.xAxisDefaultProps.gridLineColor,
      gridLineWidth: chartEditorEnum.xAxisDefaultProps.gridLineWidth,
      labels: chartEditorEnum.xAxisDefaultProps.labels,
      ...config.xAxis,
    };
    //TODO check this if causes issue in y axis
    config.yAxis = {
      gridLineColor: chartEditorEnum.yAxisDefaultProps.gridLineColor,
      gridLineWidth: chartEditorEnum.yAxisDefaultProps.gridLineWidth,
      labels: chartEditorEnum.yAxisDefaultProps.labels,
      title: {
        enabled: true,
        // text: `<span style="cursor:pointer;" id="custom-y-axis-title"> ${config.yAxis.length > 0 && config.yAxis[0].title.text}</span>`
        text: `<span style="cursor:pointer;" id="custom-y-axis-title"> ${
          config.yAxis?.title?.text ||
          config.yAxis[0]?.title?.text ||
          "Y-axis-title"
        }</span>`,
      },
    };

    if (!("style" in config.xAxis.title)) {
      config.xAxis.title.style = chartEditorEnum.xAxisDefaultProps.style;
    }
    if (!("style" in config.yAxis?.title)) {
      config.yAxis.title.style = chartEditorEnum.yAxisDefaultProps.style;
    }
    if (!("legend" in config)) {
      config.legend = chartEditorEnum.legendsDefaultProps;
    }
    if (!("plotOptions" in config)) {
      config.plotOptions = chartEditorEnum.plotOptionsDefaultProps;
    }

    //setting the colors for multicolor graphs
    if (
      (config.chart.type === "bar" || config.chart.type === "column") &&
      config.plotOptions.series.colorByPoint
    ) {
      config.legend = {
        ...chartEditorEnum.legendsDefaultProps,
        enabled: false,
      };
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
          seriesItem.color =
            chartEditorEnum.defaultSeriesColors["threePoint"][index];
          // seriesItem.showInLegend = true
        });
        // if series is exactly 5
      } else if (config.series[0].data.length === 5) {
        config.series[0].data.forEach((seriesItem, index) => {
          seriesItem.color =
            chartEditorEnum.defaultSeriesColors["fivePoint"][index];
          // seriesItem.showInLegend = true
        });
        // if series is greater than 5 and less than 3 (generalize)
      } else {
        config.series[0].data.forEach((seriesItem, index) => {
          if (index < 6) {
            seriesItem.color =
              chartEditorEnum.defaultSeriesColors["general"][index];
          } else {
            seriesItem.color =
              chartEditorEnum.defaultSeriesColors["general"][index - 6];
          }
          // seriesItem.showInLegend = true
        });
      }
    } else {
      config.legend = { ...chartEditorEnum.legendsDefaultProps };
      if ("colors" in config) {
        delete config.colors;
      }
      // if series is exactly 3
      if (config.series.length === 3) {
        config.series.forEach((seriesItem, index) => {
          seriesItem.color =
            chartEditorEnum.defaultSeriesColors["threePoint"][index];
          seriesItem.showInLegend = true;
        });
        // if series is exactly 5
      } else if (config.series.length === 5) {
        config.series.forEach((seriesItem, index) => {
          seriesItem.color =
            chartEditorEnum.defaultSeriesColors["fivePoint"][index];
          seriesItem.showInLegend = true;
        });
        // if series is greater than 5 and less than 3 (generalize)
      } else {
        config.series.forEach((seriesItem, index) => {
          if (index < 6) {
            seriesItem.color =
              chartEditorEnum.defaultSeriesColors["general"][index];
          } else {
            seriesItem.color =
              chartEditorEnum.defaultSeriesColors["general"][index - 6];
          }
          seriesItem.showInLegend = true;
        });
      }
    }
    return config;
  };

  const getPieConfig = () => {
    myRef.webdatarocks.highcharts.getData(
      {
        type: "pie",
        styledMode: true,
      },
      function (data) {
        dispatch(setPieChartConfig(data.series));
      }
    );
  };

  function getGraphConfigs() {
    if (generalChartType === "pie") {
      return JSON.parse(JSON.stringify(props.pieConfig));
    } else {
      return JSON.parse(JSON.stringify(graphConfig));
    }
  }

  function setGraphConfigs(config) {
    console.log("config::", config);
    if (generalChartType === "pie") {
      props.setPieConfig(config);
    } else {
      dispatch(setGraphConfig(JSON.parse(JSON.stringify(config))));
    }
  }

  const renderGraph = (data) => {
    console.log("data:::", data);
    let newGraphConfig = {};
    let isSameSeries = false;
    let xAxisTitle = data.xAxis.title.text;
    let yAxisTitle = data.yAxis?.title?.text || data.yAxis[0]?.title?.text;
    // redux data
    if (Object.values(getGraphConfigs()).length !== 0) {
      newGraphConfig = JSON.parse(JSON.stringify(getGraphConfigs()));
      if (data.chart.type === "pie") {
        if (
          data.series[0].data.length === newGraphConfig.series[0].data.length &&
          data.series[0].data.every(function (value, index) {
            return (
              value.name === newGraphConfig.series[0].data[index].name &&
              value.y === newGraphConfig.series[0].data[index].y
            );
          })
        ) {
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
              if (
                e.data.length === newGraphConfig.series[i].data.length &&
                e.data.every(function (value, index) {
                  return value === newGraphConfig.series[i].data[index];
                })
              ) {
                isSameSeries = true;
                xAxisTitle = newGraphConfig.xAxis?.title?.text;
                yAxisTitle = newGraphConfig.yAxis?.title?.text;
              } else {
                isSameSeries = false;
              }
            } else {
              isSameSeries = false;
            }
          });
        } else {
          isSameSeries = false;
        }
      }
      if (!isSameSeries) {
        if (generalChartType === "pie") {
          newGraphConfig.series = data.series;
          newGraphConfig.xAxis.categories = data.series[0].data.map(
            (e) => e.name
          );
          newGraphConfig.yAxis = data.yAxis;
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
    let graphData = JSON.parse(
      JSON.stringify(
        isSameSeries
          ? newGraphConfig
          : setDefaultGraphProperties(newGraphConfig)
      )
    );
    // graphData.xAxis.title.text = `<span style="cursor:pointer;" id="custom-x-axis-title"> ${graphData.xAxis.title.text}</span>`;
    // graphData.yAxis.title.text = `<span style="cursor:pointer;" id="custom-y-axis-title"> ${graphData.yAxis.title.text}</span>`
    graphData.xAxis.title.text = `<span style="cursor:pointer;" id="custom-x-axis-title"> ${xAxisTitle}</span>`;
    graphData.yAxis.title.text = `<span style="cursor:pointer;" id="custom-y-axis-title"> ${yAxisTitle}</span>`;
    dispatch(setGeneralConfig(data.series));
    setGraphConfigs(graphData);
  };

  const createChart = () => {
    console.log("in createChart");
    const rows1 =
      myRef &&
      myRef.webdatarocks.getReport().slice &&
      myRef.webdatarocks.getReport().slice.rows
        ? myRef.webdatarocks.getReport().slice.rows
        : [];
    const columns1 =
      myRef &&
      myRef.webdatarocks.getReport().slice &&
      myRef.webdatarocks.getReport().slice.columns
        ? myRef.webdatarocks.getReport().slice.columns
        : [];
    const measures1 =
      myRef &&
      myRef.webdatarocks.getReport().slice &&
      myRef.webdatarocks.getReport().slice.measures
        ? myRef.webdatarocks.getReport().slice.measures
        : [];
    console.log("generalChartType::", generalChartType);
    myRef.webdatarocks.highcharts.getData(
      {
        type: generalChartType === "pie" ? "pie" : "column",
      },
      function (data) {
        renderGraph(data);
      },
      function (data) {
        renderGraph(data);
      }
    );

    // myRef && myRef.webdatarocks && getPieConfig();

    if (previousRef.current) {
      previousRef.current = false;
      return;
    }
    //do not execute below code while initial load
    dispatch(
      setSelectedItems([
        { rows: rows1, columns: columns1, measures: measures1 },
      ])
    );
  };

  const getDynamicWidth = (totalColumns) => {
    let columnWidths = [
      {
        idx: 0,
        width: 200,
      },
    ];
    for (let i = 1; i <= totalColumns; i++) {
      columnWidths.push({ idx: i, width: 100 });
    }
    return columnWidths;
  };

  const savePieConfig = () => {
    pieRef && pieRef.webdatarocks && getPieConfig();
  };

  function a11yProps(index) {
    return {
      id: `pivot-table-tab-${index}`,
      "aria-controls": `pivot-table-tabpanel-${index}`,
    };
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
  }));

  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
    handleReportFieldModal(newValue);
  };

  const renderFieldsTab = () => {};

  const handleOptionsConfigChange = (type, value) => {
    optionsConfig[type] = value;
    setOptionsConfig({ ...optionsConfig });
  };

  // useEffect(() => {
  //   // pieRef && pieRef.webdatarocks && getPieConfig();
  // }, [pieRef]);

  useEffect(() => {
    pieRef = { ...myRef };
    myRef &&
      myRef.webdatarocks &&
      myRef.webdatarocks.on("reportcomplete", function () {
        myRef && myRef.webdatarocks && handleReportFieldModal(activeTab);
        myRef && myRef.webdatarocks && createChart();
      });
    // pieRef && pieRef.webdatarocks && getPieConfig();
  });

  useEffect(() => {
    return () => {
      setDisplay(false);
      setTimeout(() => {
        setMetaData({ totalRows: null, totalColumns: null });
        setDisplay(true);
      }, 50);
    };
  }, [optionsConfig]);

  // useEffect(
  //   () => {
  //     return () => {
  //       if (myRef && myRef.webdatarocks && activeTab === 0) {
  //         myRef &&
  //           myRef.webdatarocks.on("reportchange", function () {
  //             handleReportFieldModal(activeTab);
  //           });
  //       }
  //     };
  //   }
  //   // [value]
  // );

  const handleReportFieldModal = (activeTab) => {
    if (activeTab === 0) {
      if (JSON.stringify(dataJSONConfig) !== "{}") {
        let bodyStyles = document.body.style;
        bodyStyles.setProperty("--displayFlag", "block");
        document.getElementById("wdr-fields-view").style.display =
          "block !important";
        document.getElementsByClassName(
          "wdr-ui-element wdr-ui wdr-fields-view-wrap"
        )[0].style.display = "block";
      }
    } else {
      let bodyStyles = document.body.style;
      bodyStyles.setProperty("--displayFlag", "none");
      document.getElementById("wdr-fields-view").style.display =
        "none !important";
      document.getElementsByClassName(
        "wdr-ui-element wdr-ui wdr-fields-view-wrap"
      )[0].style.display = "none";
    }
  };

  // useEffect(()=>{
  //     setSelectedQuestionsState(selectedQuestionList)
  // })
  // const [isReadMore, setIsReadMore] = React.useState(true);
  // const toggleReadMore = () => {
  //     setIsReadMore(!isReadMore);
  // };

  const [Show, setShow] = React.useState(false);

  useEffect(() => {
    // setDisplay(false);

    const reportList = {
      dataSource: {
        data: dataJSONConfig,
      },
      tableSizes: {
        columns: [...getDynamicWidth(metaData.totalColumns)],
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
        rows: selectedQuestion[0].rows,
        columns: selectedQuestion[0].columns,
        measures: selectedQuestion[0].measures,
        expands: {
          expandAll: true,
        },
        drills: {
          drillAll: false,
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
          showReportFiltersArea: true,
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
        defaultHierarchySortName: "asc",
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
          divideByZeroValue: "Infinity",
        },
      ],
    };
    setReport(reportList);
    // createChart();
    if (dataJSONConfig.length > 0) {
      setDisplay(true);
    }
  }, [dataJSONConfig]);

  const handleClickMenu = () => {
    // if (Height == '30px') setHeight('100%'); else setHeight('30px');
    setShow(!Show);
  };

  useEffect(() => {
    let newList = [];
    Object.entries(subOptionSelected).map(([key, value]) => {
      newList.push({
        question_id: value.questionId,
        numeric_question_ids: key,
        option_list: value.optionList,
      });
    });
    let user_request = {
      knit_project_id: projectId,
      question_dtls: newList,
    };
    // getChartJSON
    if (newList.length > 0) {
      dispatch(getChartJSONResponse(user_request));
    }
  }, [selectedQuestions]);

  const fetchJSONResponse = (subOptionList) => {
    let newList = [];
    Object.entries(subOptionList).map(([key, value]) => {
      newList.push({
        question_id: value.questionId,
        numeric_question_ids: key,
        option_list: value.optionList,
      });
    });
    let user_request = {
      knit_project_id: projectId,
      question_dtls: newList,
    };
    // getChartJSON
    if (newList.length > 0) {
      dispatch(getChartJSONResponse(user_request));
    }
  };

  const setSelectedQuestionsState = (value, isQuestion, subOption, type) => {
    setDisplay(false);
    let questionName = value.questionNumber + " " + value.questionName;
    let dataJson = JSON.parse(JSON.stringify(dataJSON));
    let optionsList = JSON.parse(JSON.stringify(selectedQuestionsOptionsList));
    let newSelectedQuestionList = selectedQuestions;
    let newSelectedQuestionsOptionsList = { ...selectedQuestionsOptionsList };
    if (isQuestion) {
      if (type && type === "remove") {
        let selectedQuestionsUpdated = selectedQuestions.filter(
          (e) => e !== value.numericQuestionId
        );
        setSelectedQuestions([...selectedQuestionsUpdated]);
        // let updatedNewJson = dataJSON.filter(function (item) {
        //   console.log("QUestio nRemove", item[questionName] === questionName)
        //   return item[questionName] === questionName;
        // })
        // setDataJSON(updatedNewJson);
        newSelectedQuestionList = selectedQuestionsUpdated;
        // dispatch(setDataJSONConfig(updatedNewJson));
        delete newSelectedQuestionsOptionsList[value.numericQuestionId];
        dispatch(
          setSelectedQuestion({
            questionList: newSelectedQuestionList,
            text: questionName,
            remove: true,
          })
        );
      } else {
        if (!selectedQuestions.includes(value.numericQuestionId)) {
          selectedQuestions.push(value.numericQuestionId);
          setSelectedQuestions([...selectedQuestions]);
          newSelectedQuestionList = selectedQuestions;
        }
        if (value.questionType === "MC") {
          newSelectedQuestionsOptionsList[value.numericQuestionId] = {
            questionId: value.questionId,
            optionList: value.questionChoice.map((q) => q.choiceText),
          };
        } else {
          newSelectedQuestionsOptionsList[value.numericQuestionId] =
            Object.keys(value.filterGraphData);
        }
        dispatch(
          setSelectedQuestion({
            questionList: newSelectedQuestionList,
            text: questionName,
            remove: false,
          })
        );
      }
      // dispatch(setSelectedQuestion([...selectedQuestions]))

      setSubOptionSelected(newSelectedQuestionsOptionsList);

      dispatch(
        setSelectedQuestionsOptionsList(newSelectedQuestionsOptionsList)
      );
      fetchJSONResponse(newSelectedQuestionsOptionsList);
      // dispatch(
      //   setSelectedQuestion({
      //     questionList: newSelectedQuestionList,
      //     text: questionName,
      //   })
      // );
    } else {
      let updatedOptionsList = [];
      if (type && type === "remove") {
        //let updatedNewJson = dataJSON.filter(item => item[questionName] !== subOption.description);
        updatedOptionsList = optionsList[
          value.numericQuestionId
        ].optionList.filter((opt) => opt !== subOption.description);
        let newSelectedQuestionsOptionsList = JSON.parse(
          JSON.stringify(selectedQuestionsOptionsList)
        );
        newSelectedQuestionsOptionsList[value.numericQuestionId].optionList = [
          ...updatedOptionsList,
        ];

        if (updatedOptionsList.length === 0) {
          delete newSelectedQuestionsOptionsList[value.numericQuestionId];
          let selectedQuestionsUpdated = selectedQuestions.filter(
            (e) => e !== value.numericQuestionId
          );
          setSelectedQuestions([...selectedQuestionsUpdated]);
          newSelectedQuestionList = selectedQuestionsUpdated;
          dispatch(
            setSelectedQuestion({
              questionList: newSelectedQuestionList,
              text: questionName,
              remove: true,
            })
          );
        }

        dispatch(
          setSelectedQuestionsOptionsList(newSelectedQuestionsOptionsList)
        );
        fetchJSONResponse(newSelectedQuestionsOptionsList);
      } else {
        updatedOptionsList = optionsList[value.numericQuestionId]
          ? [...optionsList[value.numericQuestionId]?.optionList]
          : [];
        updatedOptionsList.push(subOption.description);
        let newSelectedQuestionsOptionsList = JSON.parse(
          JSON.stringify(selectedQuestionsOptionsList)
        );
        newSelectedQuestionsOptionsList[value.numericQuestionId] = {};
        newSelectedQuestionsOptionsList[value.numericQuestionId].questionId =
          value.questionId;
        newSelectedQuestionsOptionsList[value.numericQuestionId].optionList =
          updatedOptionsList;
        dispatch(
          setSelectedQuestionsOptionsList(newSelectedQuestionsOptionsList)
        );
        fetchJSONResponse(newSelectedQuestionsOptionsList);

        // if (!subOptionSelected.hasOwnProperty(value.numericQuestionId)) {
        //   subOptionSelected.push(value.numericQuestionId);
        //   setSubOptionSelected([...subOptionSelected]);
        // }
        if (!selectedQuestions.includes(value.numericQuestionId)) {
          selectedQuestions.push(value.numericQuestionId);
          setSelectedQuestions([...selectedQuestions]);

          newSelectedQuestionList = selectedQuestions;
          dispatch(
            setSelectedQuestion({
              questionList: newSelectedQuestionList,
              text: questionName,
              remove: false,
            })
          );
        }
      }
    }
    if (newSelectedQuestionList && newSelectedQuestionList.length === 0) {
      dispatch(resetGraphConfig());
      document.getElementById("highchartsContainer").style.display = "none";
    } else {
      document.getElementById("highchartsContainer").style.display = "block";
    }
  };
  const setSelectedQuestionsStateForGraphType = (
    item,
    subOption,
    key,
    isQuestion,
    type
  ) => {
    let questionName = item.questionNumber + " " + item.questionName;
    let dataJson = JSON.parse(JSON.stringify(dataJSON));
    //let dataJson = [];
    if (isQuestion) {
      if (type && type === "remove") {
        let selectedQuestionsUpdated = selectedQuestions.filter(
          (e) => e !== item.questionId
        );
        setSelectedQuestions([...selectedQuestionsUpdated]);
        let updatedList = dataJSON.filter(function (item) {
          return item[questionName] === questionName;
        });
        setDataJSON(updatedList);
        dispatch(setDataJSONConfig(updatedList));
      } else {
        selectedQuestions.push(item.questionId);
        setSelectedQuestions([...selectedQuestions]);
      }
    } else {
      if (type && type === "remove") {
        let updatedNewJson = dataJSON.filter(
          (item) => item[questionName] != key
        );
        setDataJSON(updatedNewJson);
        dispatch(setDataJSONConfig(updatedNewJson));
      } else {
        if (
          dataJSON.length <= 0 ||
          selectedQuestions.includes(item.questionId)
        ) {
          for (let i = 0; i < subOption.sum; i++) {
            let QuestionAns = key;
            dataJSON.push({ [questionName]: QuestionAns });
          }
        } else {
          let totalLength;
          if (dataJSON.length < subOption.sum) {
            totalLength = subOption.sum - dataJSON.length;
          } else {
            totalLength = subOption.sum;
          }
          let QuestionAns = key;
          // dataJSON[questionName]=QuestionAns
          dataJSON.map((i) => (i[questionName] = QuestionAns));
          // }
          for (let i = 0; i < totalLength; i++) {
            dataJSON.push({ [questionName]: QuestionAns });
          }
        }
        setDataJSON(dataJSON);
        dispatch(setDataJSONConfig(dataJSON));
        selectedQuestions.push(item.questionId);
        setSelectedQuestions([...selectedQuestions]);
      }
      // for (const questionChoice in value.total) {
      //     let QuestionAns = value.filterQuestionChoice[questionChoice].description
      //     dataJSON.push({[questionName]:QuestionAns})
      // }
    }
    dispatch(setSelectedQuestion(selectedQuestions));
  };

  React.useEffect(() => {
    // console.log("selectedQuestions:: ", selectedQuestions);
  }, [selectedQuestions]);

  const handleAccordionExpandClick = (questionId) => {
    if (expand.includes(questionId)) {
      let index = expand.indexOf(questionId);
      if (index !== -1) {
        expand.splice(index, 1);
      }
    } else {
      expand.push(questionId);
    }
    setExpand([...expand]);
  };

  function handleReportChange() {
    savePieConfig();
    handleReportFieldModal(activeTab);
  }

  return (
    <>
      {props.tabValue === 0 &&
        questionData &&
        questionData.map(
          (item, index) =>
            item.questionType === "MC" && (
              <>
                <div key={index} className={"accordianChart"}>
                  <Accordion
                    //expanded={expand.includes(item.numericQuestionId)}
                    style={
                      selectedQuestions.includes(item.numericQuestionId)
                        ? { backgroundColor: "#12988A" }
                        : {}
                    }
                    disabled={
                      selectedQuestions.length >= 3 &&
                      !selectedQuestions.includes(item.numericQuestionId)
                        ? true
                        : false
                    }
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                      onClick={(event) => {
                        handleAccordionExpandClick(item.numericQuestionId);
                      }}
                      className={"questionCardBox"}
                    >
                      <Typography
                        style={
                          selectedQuestions.includes(item.numericQuestionId)
                            ? { color: "#fff" }
                            : {}
                        }
                      >
                        <div style={{ margin: "0px 10px" }}>
                          {selectedQuestions.includes(
                            item.numericQuestionId
                          ) ? (
                            <img
                              src={MainChartCheckbox}
                              height={"18px"}
                              width={"18px"}
                              onClick={(e) => {
                                e.stopPropagation();
                                // e.target.checked ? setSelectedQuestionsState(item, true) : setSelectedQuestionsState(item, true, "remove")
                                setSelectedQuestionsState(
                                  item,
                                  true,
                                  undefined,
                                  "remove"
                                );
                              }}
                            />
                          ) : (
                            <img
                              src={MainChartUncheckbox}
                              height={"18px"}
                              width={"18px"}
                              onClick={(e) => {
                                e.stopPropagation();
                                // e.target.checked ? setSelectedQuestionsState(item, true) : setSelectedQuestionsState(item, true, "remove")
                                setSelectedQuestionsState(
                                  item,
                                  true,
                                  undefined
                                );
                              }}
                            />
                          )}
                        </div>
                        <div style={{ display: "flex" }}>
                          <span
                            style={{
                              paddingRight: "5px",
                              minWidth: "40px",
                            }}
                          >
                            {item.questionNumber ? item.questionNumber : "-"}
                          </span>{" "}
                          {item.questionText ? item.questionText : "-"}
                        </div>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography
                        style={
                          selectedQuestions.includes(item.numericQuestionId)
                            ? { color: "#fff" }
                            : {}
                        }
                      >
                        Select variables to compare:
                      </Typography>
                      <div
                        className={`selectValue ${
                          item.filterQuestionChoice.length > 9
                            ? Show
                              ? "full-questions"
                              : "questions-hidden"
                            : "default-questions"
                        }`}
                        style={
                          selectedQuestions.includes(item.numericQuestionId)
                            ? {
                                color: "#fff",
                              }
                            : {}
                        }
                      >
                        <ul>
                          {item.filterQuestionChoice &&
                            item.filterQuestionChoice.map((el) => (
                              <li>
                                {selectedQuestionsOptionsList[
                                  Number(item.numericQuestionId)
                                ] &&
                                selectedQuestionsOptionsList[
                                  Number(item.numericQuestionId)
                                ].optionList.includes(el.choiceText) ? (
                                  <img
                                    src={SubCheckboxSelected}
                                    width={"19px"}
                                    height={"16px"}
                                    onClick={(e) => {
                                      setSelectedQuestionsState(
                                        item,
                                        false,
                                        el,
                                        "remove"
                                      );
                                    }}
                                  />
                                ) : (
                                  <img
                                    src={SubCheckboxUnselectedGray}
                                    width={"19px"}
                                    height={"16px"}
                                    onClick={(e) => {
                                      setSelectedQuestionsState(
                                        item,
                                        false,
                                        el
                                      );
                                    }}
                                  />
                                )}
                                {el.choiceText}
                              </li>
                            ))}
                        </ul>
                      </div>
                      {item.filterQuestionChoice.length > 9 && (
                        <Grid
                          container
                          spacing={2}
                          style={{ alignItems: "center" }}
                        >
                          <Grid item xs={6}>
                            <Typography
                              onClick={handleClickMenu}
                              style={
                                selectedQuestions.includes(
                                  item.numericQuestionId
                                )
                                  ? {
                                      color: "#fff",
                                      cursor: "pointer",
                                    }
                                  : { cursor: "pointer" }
                              }
                            >
                              {Show ? "View less" : "View more"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            {Show && (
                              <div
                                className="selectOption"
                                style={
                                  selectedQuestions.includes(
                                    item.numericQuestionId
                                  )
                                    ? { color: "#fff" }
                                    : {}
                                }
                              >
                                {/*<RadioGroup*/}
                                {/*    row*/}
                                {/*    aria-labelledby="demo-row-radio-buttons-group-label"*/}
                                {/*    name="row-radio-buttons-group"*/}
                                {/*>*/}
                                {/*    <FormControlLabel value="select" control={<Radio />} label="Select all" />*/}
                                {/*    <FormControlLabel value="deselect" control={<Radio />} label="De-select all" />*/}
                                {/*</RadioGroup>*/}
                                <Checkbox /> Select All
                              </div>
                            )}
                          </Grid>
                        </Grid>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </div>
              </>
            )

          //  :
          //   item.graphType === "stack_bar_chart" || item.graphType === "multi_column_bar_chart" &&
          //   (
          //     <div key={index} className={'accordianChart'}
          //       style={selectedQuestions.includes(item.numericQuestionId) ? {
          //         color: '#fff',
          //         background: '#12988A'
          //       } : {}}>
          //       <div className={'noAccordian'}>
          //         <Typography style={selectedQuestions.includes(item.numericQuestionId) ? {
          //           color: '#fff',
          //         } : {}}>
          //           {selectedQuestions.includes(item.numericQuestionId) ? (
          //             <img
          //               src={MainChartCheckbox}
          //               height={"18px"}
          //               width={"18px"}
          //               onClick={() => {
          //                 setSelectedQuestionsState(item, true, undefined, "remove");
          //               }}
          //             />
          //           ) : (
          //             <img
          //               src={MainChartUncheckbox}
          //               height={"18px"}
          //               width={"18px"}
          //               onClick={() => {
          //                 setSelectedQuestionsState(item, true, undefined);
          //               }}
          //             />
          //           )}

          //           <span>{item.questionNumber ? item.questionNumber : "-"}</span> {item.questionText ? item.questionText : "-"}
          //         </Typography>
          //         <div className='withoutAccordian'>
          //           <ul>
          //             {Object.entries(item.filterGraphData).map(([key, value]) => {
          //               return <li>
          //                 {selectedQuestionsOptionsList[item.numericQuestionId]?.includes(key) ? (
          //                   <img
          //                     src={SubCheckboxSelected}
          //                     width={"19px"}
          //                     height={"16px"}
          //                     onClick={(e) => {
          //                       setSelectedQuestionsState(item, false, {
          //                         description: key,
          //                         choiceText: key
          //                       }, "remove")
          //                     }}
          //                   />
          //                 ) : (
          //                   <img
          //                     src={SubCheckboxUnselectedGray}
          //                     width={"19px"}
          //                     height={"16px"}
          //                     onClick={(e) => {
          //                       setSelectedQuestionsState(item, false, {
          //                         description: key,
          //                         choiceText: key
          //                       })
          //                     }}
          //                   />

          //                 )}
          //                 {key}
          //               </li>
          //             })
          //             }
          //           </ul>
          //         </div>
          //       </div>
          //     </div>)
        )}
      {
        // props.tabValue === 1 &&
        <div
          id="editDataTab"
          style={{ display: props.tabValue === 1 ? "block" : "none" }}
        >
          <div>
            {display && (
              <div className="pivotTable">
                <div>
                  <WebDataRocksReact.Pivot
                    ref={(elem) => {
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
                    reportchange={handleReportChange}
                    aftergriddraw={() => {
                      const grandTotalCell = document.getElementsByClassName(
                        "wdr-header wdr-header-c wdr-grand-total"
                      )[0];
                      if (grandTotalCell) grandTotalCell.innerHTML = "Total";
                      savePieConfig();
                    }}
                  />
                </div>
              </div>
            )}
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
                <OptionsTab
                  handleChange={handleOptionsConfigChange}
                  optionsConfig={optionsConfig}
                />
              </TabPanel>
            </div>
          </div>
        </div>
      }
    </>
  );
}
