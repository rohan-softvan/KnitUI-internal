import React from "react";
import {Grid, Typography} from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "@material-ui/core/Button";
import ButtonComponent from "../components/button/Button";
import LogoImage from "../../assets/images/knit-logo.svg";
import GraphEditorIcon from '../../assets/images/charteditor/GraphEditorIcon.png';
import './chartEditor.scss';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from "@material-ui/core/Box";
import QuestionTab from '../chartEditor/QuestionTab';
import CustomizeTab from '../chartEditor/CustomizeTab';
import PivotTable from './PivotTable';
import ChartEditorTypeCard from "./customize/components/ChartEditorTypeCard";
import DataLabelsIcon from "../../assets/images/charteditor/Datalabels.png";
import ExportJpg from "../../assets/images/charteditor/exportJPG.png";
import ExportPng from "../../assets/images/charteditor/exportPNG.png";
import ExportPdf from "../../assets/images/charteditor/exportPDF.png";
import PieChartSmall from "../../assets/images/charteditor/PieChart.png";
import DonutChartSmall from "../../assets/images/charteditor/DonutChart.png";
import WaveChartSmall from "../../assets/images/charteditor/WaveChart.png";
import Appearance from '../../assets/images/charteditor/Appearance.png';
import Barchart from "../../assets/images/charteditor/BasicBar.svg";
import StackedBarCharts from "../../assets/images/charteditor/StackedBar.svg";
import PercentStackedBarChart from "../../assets/images/charteditor/StackedPercentBar.svg";
import MulticolorBar from "../../assets/images/charteditor/MulticolorBar.svg";
import BasicArea from "../../assets/images/charteditor/BasicArea.svg";
import StackedArea from "../../assets/images/charteditor/StackedArea.svg";
import StackedPercentageArea from "../../assets/images/charteditor/StackedPercentageArea.svg";
import BasicColumn from "../../assets/images/charteditor/BasicColumn.svg";
import MultiColorColumn from "../../assets/images/charteditor/Multicolorcolumn.svg";
import StackedColumn from "../../assets/images/charteditor/StackedColumn.svg";
import StackedPercentColumn from "../../assets/images/charteditor/StackedPercentColumn.svg";
import LineChart from "../../assets/images/charteditor/LineChart.svg";
import ScatterChart from "../../assets/images/charteditor/ScatterChart.svg";
import PieChart from "../../assets/images/charteditor/PieChart.svg";
import DonutChart from "../../assets/images/charteditor/DonutChart.svg";
import ThreeDPieChart from "../../assets/images/charteditor/3DPieChart.svg";
import ThreeDDonutChart from "../../assets/images/charteditor/3DDonutChart.svg";
import BarChart from "../../assets/images/charteditor/LineCharts.png"
import LineCharts from "../../assets/images/charteditor/Line Chart.svg"
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Highcharts from "highcharts";
import highcharts3d from "highcharts/highcharts-3d";
import HighchartsExporting from "highcharts/modules/exporting";
import {useDispatch, useSelector} from "react-redux";
import {setChartType, setGeneralChartType, setGraphConfig, setTabValueConfig} from "../redux/slice/ChartEditorSlice";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import {chartEditorEnum} from "../enums";
import {setDefaultEventsForGraph, updateCustomizeTab} from "../_helpers/eventHelper"
import {Resizable} from "re-resizable";

HighchartsExporting(Highcharts);
highcharts3d(Highcharts);

/*Main Tab*/
function TabPanel(props) {
  const {children, value, index, ...other} = props;

  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}
      >
        {value === index && (
            <Typography>{children}</Typography>
        )}
      </div>
  );

}

/*Sub Tab*/
function SubTabPanel(props) {
  const {children, value, index, ...other} = props;

  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`subsimple-tabpanel-${index}`}
          aria-labelledby={`subsimple-tab-${index}`}
          {...other}
      >
        {value === index && (
            <Typography>{children}</Typography>
        )}
      </div>
  );

}

/*Main Tab*/
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

/*Sub Tab*/
function suba11yProps(index) {
  return {
    id: `subsimple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function ChartEditor(handleClick) {
  const dispatch = useDispatch();
  let graphConfig = useSelector((state) => state.chart.graphConfig);
  let pieSeriesConfig = useSelector((state) => state.chart.pieChartConfig);
  let generalSeriesConfig = useSelector((state) => state.chart.generalConfig);
  let tabValue = useSelector((state) => state.chart.currentTab);
  let chartType = useSelector((state) => state.chart.chartType);
  console.log('chartType==>', chartType)
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [value, setValue] = React.useState(tabValue);
  const [subvalue, subsetValue] = React.useState(0);
  const [pieConfig, setPieConfig] = React.useState({});

  /*Setting config for pie chart and rendering graph*/
  const handleSetPieConfig = (config) => {
    console.log("in handleSetPieConfig", config);
    const finalConfig = setDefaultEventsForGraph(config);
    console.log("finalConfig:: ", finalConfig)
    setPieConfig(finalConfig);
    Highcharts.chart("highchartsContainer", finalConfig);
  }

  /*Main Tab*/
  const handleChange = (event, newValue) => {
    setValue(newValue);
    dispatch(setTabValueConfig(newValue))
  };

  /*Sub Tab*/
  const subHandleChange = (event, newValue) => {
    subsetValue(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getStackingGraphConfig = graphType => {
    if (
        graphType === "stacked-percent-bar" ||
        graphType === "stacked-percent-column" ||
        graphType === "stacked-percent-area"
    )
      return "percent";
    else if (
        graphType === "stacked-bar" ||
        graphType === "stacked-column" ||
        graphType === "stacked-area"
    )
      return "normal";
    else return false;
  };

  const getPlotOptionsForDonut = () => ({
    allowPointSelect: true,
    cursor: true,
    innerSize: "60%",
    dataLabels: {
      enabled: true
    }
  });

  const getPlotOptionsFor3dDonut = () => ({
    allowPointSelect: true,
    depth: 35,
    cursor: "pointer",
    innerSize: "60%"
  });

  const getPlotOptionsFor3dPie = () => ({
    allowPointSelect: true,
    depth: 35,
    cursor: "pointer"
  });


  const getPlotOptionsForSemicircleDonut = () => ({
    allowPointSelect: false,
    dataLabels: {
      distance: -30,
      style: {
        fontWeight: "bold",
        color: "white",
        textShadow: "0px 1px 2px black"
      }
    },
    innerSize: "50%",
    startAngle: -90,
    endAngle: 90,
    center: ["50%", "75%"]
  });

  const setDefaultGraphProperties = (graphConfig) => {
    console.log("setDefaultGraphProperties:graphConfig ", graphConfig)
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
      gridLineColor: chartEditorEnum.xAxisDefaultProps.gridLineColor,
      gridLineWidth: chartEditorEnum.xAxisDefaultProps.gridLineWidth,
      ...config.xAxis
    }
    config.yAxis = {
      gridLineColor: chartEditorEnum.yAxisDefaultProps.gridLineColor,
      gridLineWidth: chartEditorEnum.yAxisDefaultProps.gridLineWidth,
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
    } else {
      config.plotOptions = graphConfig.plotOptions
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
      config.legend = {...chartEditorEnum.legendsDefaultProps, enabled: true};
      config.plotOptions.pie = {...config.plotOptions.pie, showInLegend: true};
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
      config.legend = {...chartEditorEnum.legendsDefaultProps, enabled: true};
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


  const handleChartChange = type => {
    let newConfig = JSON.parse(JSON.stringify(graphConfig));
    dispatch(setChartType(type))
    let chartType;
    switch (type) {
      case "multicolor-bar":
      case "stacked-bar":
      case "stacked-percent-bar":
        chartType = "bar";
        break;

      case "donut":
      case "3d-pie":
      case "3d-donut":
      case "semi-circle-donut":
        chartType = "pie";
        break;

      case "multicolor-column":
      case "stacked-column":
      case "stacked-percent-column":
        chartType = "column";
        break;

      case "stacked-area":
      case "stacked-percent-area":
        chartType = "area";
        break;

      default:
        chartType = type
    }
    newConfig.chart['type'] = chartType
    dispatch(setGeneralChartType(chartType));
    //set option for 3d Chart Type
    if (type === "3d-pie" || type === "3d-donut") {
      newConfig.chart.options3d = {
        enabled: true,
        alpha: 45,
        beta: 0
      };
      newConfig.chart.polar = false;
    } else {
      if ("options3d" in newConfig.chart) {
        delete newConfig.chart.options3d;
      }
    }

    // For set All Types of Pie Chart
    let plotOptions = {
      pie:
          type === "donut"
              ? getPlotOptionsForDonut()
              : type === "3d-donut"
                  ? getPlotOptionsFor3dDonut()
                  : type === "3d-pie"
                      ? getPlotOptionsFor3dPie()
                      : type === "semi-circle-donut"
                          ? getPlotOptionsForSemicircleDonut()
                          : {},
      series: {
        ...chartEditorEnum.plotOptionsDefaultProps.series,
        cursor: "pointer",
        stacking: getStackingGraphConfig(type),
        point: {
          events: {
            click: function () {
              updateCustomizeTab("series")
              // handleChange(3)
            }
          }
        },
      },
      dataLabels: {
        enabled: true
      }
    }

    // For Multi Color Charts
    if (
        type === "multicolor-bar" ||
        type === "multicolor-column"
    ) {
      plotOptions.series.colorByPoint = true;
    } else {
      delete plotOptions.series.colorByPoint;
    }
    newConfig.plotOptions = plotOptions

    // To set Pie Chart Config after chart change
    if (chartType === "pie") {
      newConfig.series = pieSeriesConfig
      // if(type === 'pie'){
      //   newConfig.plotOptions={}
      // }
    } else {
      newConfig.series = generalSeriesConfig
    }

    let graphData = setDefaultGraphProperties(newConfig);
    console.log("graphData final::: ", graphData);
    if (chartType === "pie") {
      handleSetPieConfig(graphData);
    } else {
      dispatch(setGraphConfig(graphData));
    }
    handleSetPieConfig(graphData);
  };

  async function downloadPngBtn() {
    Highcharts.charts.forEach(function (chart, index) {
      if (chart) {
        if (chart.renderTo.id === "highchartsContainer") {
          chart.exportChart({
            type: "image/png"
          });
        }
      }
    });
  }


  async function exportPDF() {
    Highcharts.charts.forEach(function (chart, index) {
      if (chart) {
        if (chart.renderTo.id === "highchartsContainer") {
          chart.exportChart({
            type: "application/pdf"
          });
        }
      }
    });
  }

  async function exportJPG() {
    Highcharts.charts.forEach(function (chart, index) {
      if (chart) {
        if (chart.renderTo.id === "highchartsContainer") {
          chart.exportChart({
            type: "image/jpg"
          });
        }
      }
    });
  }

  const handleChangeWidth = (width, height) => {
    // console.log("handleChangeWidth", event.nativeEvent.layerX, event.nativeEvent.pageY)
    // let newValueW = event.nativeEvent.layerX;
    // let newValueH = event.nativeEvent.layerY;
    // console.log("Final W H", newValueW, newValueH)
    let newConfig = JSON.parse(JSON.stringify(graphConfig));
    newConfig["chart"]["width"] = width;
    newConfig["chart"]["height"] = height
    console.log("handleChangeHeight", newConfig)
    dispatch(setGraphConfig(newConfig));
  }

  return (
      <React.Fragment>
        <ButtonComponent
            iconPosition={"left"}
            fontSize={13}
            width={"120px"}
            margin={"0px 15px 0px 0px"}
            text={"Chart Editor"}
            onClick={handleClickOpen}
        ></ButtonComponent>


        <Dialog
            fullWidth={true}
            maxWidth={'xl'}
            open={open}
            onClose={handleClose}
            className={"chartModal"}
        >
          <DialogTitle className={"chartEditorTitle"}>
            <div>
              <img src={LogoImage} className="LogoImg"/> <img src={GraphEditorIcon} className="barIcon"/> Graph Editor
            </div>
            <IconButton onClick={handleClose}>
              <CloseIcon style={{width: 18}}/><Typography style={{fontSize: 18}}></Typography>
            </IconButton>
          </DialogTitle>
          <DialogContent className={"padd-LR-10"}>
            <DialogContentText>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{width: '100%'}}>
                    <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                      <Tabs value={tabValue} onChange={handleChange} aria-label="basic tabs example"
                            className="charEditorTabs">
                        <Tab label="Data" {...a11yProps(0)} />
                        <Tab label="Chart Type" {...a11yProps(1)} />
                        <Tab label="Customize" {...a11yProps(2)} />
                        <Tab label="Export" {...a11yProps(3)} />
                      </Tabs>
                    </Box>

                    <div className={'InnerScrollTab'}>
                      <TabPanel value={tabValue} index={0}>
                        <div className="subTabs">
                          <Tabs value={subvalue} onChange={subHandleChange} aria-label="basic tabs example"
                                className="charEditorTabs">
                            <Tab label="Questions" {...suba11yProps(0)} />
                            <Tab label="Edit Data" {...suba11yProps(1)} />
                          </Tabs>
                          <TabPanel value={subvalue} index={0}>
                            <Typography className="questiontitle">Questions:</Typography>
                            <QuestionTab/>
                          </TabPanel>
                          <TabPanel value={subvalue} index={1}>
                            <PivotTable/>
                          </TabPanel>
                        </div>
                      </TabPanel>
                      <TabPanel value={tabValue} index={1}>
                        <div className="subTabs">
                          <Typography className={"chooseChartTitle"}><img src={Appearance}/> Choose chart</Typography>
                          <div className={'chartTypes'}>
                            <Accordion>
                              <AccordionSummary
                                  expandIcon={<ExpandMoreIcon/>}
                                  aria-controls="panel2a-content"
                                  id="panel2a-header">
                                <Typography className='AccordTitle rootTitle'><img src={BarChart}/>Bar
                                  charts</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Grid container spacing={2}>
                                  <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <ChartEditorTypeCard title={"Basic Bar Chart"}
                                                         handleChartChange={() => handleChartChange("bar")}
                                                         isSelected={chartType == "bar" ? true : false} icon={Barchart}
                                                         component={"export"}/>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <ChartEditorTypeCard title={"Multicolor Bar Chart"}
                                                         handleChartChange={() => handleChartChange("multicolor-bar")}
                                                         isSelected={chartType == "multicolor-bar" ? true : false}
                                                         icon={MulticolorBar} component={"export"}/>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <ChartEditorTypeCard title={"Stacked Bar Chart"}
                                                         handleChartChange={() => handleChartChange("stacked-bar")}
                                                         isSelected={chartType == "stacked-bar" ? true : false}
                                                         icon={StackedBarCharts} component={"export"}/>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <ChartEditorTypeCard title={"Stacked Percent Bar Chart"}
                                                         handleChartChange={() => handleChartChange("stacked-percent-bar")}
                                                         isSelected={chartType == "stacked-percent-bar" ? true : false}
                                                         icon={PercentStackedBarChart} component={"export"}/>
                                  </Grid>
                                </Grid>
                              </AccordionDetails>
                            </Accordion>

                            <Accordion>
                              <AccordionSummary
                                  expandIcon={<ExpandMoreIcon/>}
                                  aria-controls="panel2a-content"
                                  id="panel2a-header">
                                <Typography className='AccordTitle rootTitle'><img src={PieChartSmall}/>Pie
                                  charts</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Grid container spacing={2}>
                                  <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <ChartEditorTypeCard title={"Pie Chart"}
                                                         handleChartChange={() => handleChartChange("pie")}
                                                         isSelected={chartType == "pie" ? true : false} icon={PieChart}
                                                         component={"export"}/>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <ChartEditorTypeCard title={"Donut Chart"}
                                                         handleChartChange={() => handleChartChange("donut")}
                                                         isSelected={chartType == "donut" ? true : false}
                                                         icon={DonutChart} component={"export"}/>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <ChartEditorTypeCard title={"3D Pie Chart"}
                                                         handleChartChange={() => handleChartChange("3d-pie")}
                                                         isSelected={chartType == "3d-pie" ? true : false}
                                                         icon={ThreeDPieChart} component={"export"}/>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <ChartEditorTypeCard title={"3D Donut Chart"}
                                                         handleChartChange={() => handleChartChange("3d-donut")}
                                                         isSelected={chartType == "3d-donut" ? true : false}
                                                         icon={ThreeDDonutChart} component={"export"}/>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <ChartEditorTypeCard title={"Semi-circle Donut Chart"}
                                                         handleChartChange={() => handleChartChange("semi-circle-donut")}
                                                         isSelected={chartType == "semi-circle-donut" ? true : false}
                                                         icon={ThreeDDonutChart} component={"export"}/>
                                  </Grid>
                                </Grid>
                              </AccordionDetails>
                            </Accordion>

                            <Accordion>
                              <AccordionSummary
                                  expandIcon={<ExpandMoreIcon/>}
                                  aria-controls="panel2a-content"
                                  id="panel2a-header">
                                <Typography className='AccordTitle rootTitle'><img src={DataLabelsIcon}/>Column
                                  charts</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Grid container spacing={2}>
                                  <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <ChartEditorTypeCard title={"Basic Column"}
                                                         handleChartChange={() => handleChartChange("column")}
                                                         isSelected={chartType == "column" ? true : false}
                                                         icon={BasicColumn} component={"export"}/>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <ChartEditorTypeCard title={"Multi-color Column"}
                                                         handleChartChange={() => handleChartChange("multicolor-column")}
                                                         isSelected={chartType == "multicolor-column" ? true : false}
                                                         icon={MultiColorColumn} component={"export"}/>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <ChartEditorTypeCard title={"Stacked Column"}
                                                         handleChartChange={() => handleChartChange("stacked-column")}
                                                         isSelected={chartType == "stacked-column" ? true : false}
                                                         icon={StackedColumn} component={"export"}/>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <ChartEditorTypeCard title={"Stacked Percent Column"}
                                                         handleChartChange={() => handleChartChange("stacked-percent-column")}
                                                         isSelected={chartType == "stacked-percent-column" ? true : false}
                                                         icon={StackedPercentColumn} component={"export"}/>
                                  </Grid>
                                </Grid>
                              </AccordionDetails>
                            </Accordion>

                            <Accordion>
                              <AccordionSummary
                                  expandIcon={<ExpandMoreIcon/>}
                                  aria-controls="panel2a-content"
                                  id="panel2a-header">
                                <Typography className='AccordTitle rootTitle'><img src={LineCharts}/>Line
                                  charts</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Grid container spacing={2}>
                                  <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <ChartEditorTypeCard title={"Line Chart"}
                                                         handleChartChange={() => handleChartChange("line")}
                                                         isSelected={chartType == "line" ? true : false}
                                                         icon={LineChart} component={"export"}/>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <ChartEditorTypeCard title={"Scatter Chart"}
                                                         handleChartChange={() => handleChartChange("scatter")}
                                                         isSelected={chartType == "scatter" ? true : false}
                                                         icon={ScatterChart} component={"export"}/>
                                  </Grid>
                                </Grid>
                              </AccordionDetails>
                            </Accordion>

                            <Accordion>
                              <AccordionSummary
                                  expandIcon={<ExpandMoreIcon/>}
                                  aria-controls="panel2a-content"
                                  id="panel2a-header">
                                <Typography className='AccordTitle rootTitle'><img src={WaveChartSmall}/>Area
                                  charts</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Grid container spacing={2}>
                                  <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <ChartEditorTypeCard title={"Basic Area Chart"}
                                                         handleChartChange={() => handleChartChange("area")}
                                                         isSelected={chartType == "area" ? true : false}
                                                         icon={BasicArea} component={"export"}/>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <ChartEditorTypeCard title={"Stacked Area Chart"}
                                                         handleChartChange={() => handleChartChange("stacked-area")}
                                                         isSelected={chartType == "stacked-area" ? true : false}
                                                         icon={StackedArea} component={"export"}/>
                                  </Grid>
                                  <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <ChartEditorTypeCard title={"Stacked Percentage Area Chart"}
                                                         handleChartChange={() => handleChartChange("stacked-percent-area")}
                                                         isSelected={chartType == "stacked-percent-area" ? true : false}
                                                         icon={StackedPercentageArea} component={"export"}/>
                                  </Grid>
                                </Grid>
                              </AccordionDetails>
                            </Accordion>
                          </div>
                        </div>
                      </TabPanel>
                      <TabPanel value={tabValue} index={2}>
                        <div className="subTabs">
                          <CustomizeTab pieConfig={pieConfig} setPieConfig={handleSetPieConfig}/>
                        </div>
                      </TabPanel>
                      <TabPanel value={tabValue} index={3}>
                        <div className="subTabs exportTab">
                          <Typography className={"exportTitle"}>Choose format:</Typography>
                          <Grid container spacing={2}>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <ChartEditorTypeCard
                                  title={"Recommended for graphs with logos, illustrations, and charts"}
                                  handleChartChange={downloadPngBtn} icon={ExportPng} component={"export"}/>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <ChartEditorTypeCard title={"Recommended for graphs with photos or mixed media"}
                                                   handleChartChange={exportJPG} icon={ExportJpg} component={"export"}/>
                            </Grid>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                              <ChartEditorTypeCard title={"Printer-friendly, use as a document or email to others."}
                                                   handleChartChange={exportPDF} icon={ExportPdf} component={"export"}/>
                            </Grid>
                          </Grid>
                        </div>
                      </TabPanel>
                    </div>
                  </Box>
                </Grid>
                <Grid item xs={6} className={'chartBox'}>
                  <div className={'ChartSection'}>
                    <div className={'mostUsedChart'}>
                      <div className={'chartIcons'}>
                        <img src={PieChartSmall} onClick={() => handleChartChange("pie")}/>
                      </div>
                      <div className={'chartIcons'}>
                        <img src={WaveChartSmall} onClick={() => handleChartChange("area")}/>
                      </div>
                      <div className={'chartIcons'}>
                        <img src={BarChart} onClick={() => handleChartChange("bar")}/>
                      </div>
                      <div className={'chartIcons'}>
                        <img src={DonutChartSmall} onClick={() => handleChartChange("donut")}/>
                      </div>
                    </div>
                    <Resizable
                        onResizeStop={(e, direction, ref, d) => {
                          let width= graphConfig.chart.width ? Number(graphConfig.chart.width) + d.width : 934 + d.width;
                          let height= Number(graphConfig.chart.height) + d.height;
                          console.log('e==>',e,d,graphConfig,Number(graphConfig.chart.width),width)
                          handleChangeWidth(width,height)
                        }}
                    >

                      <div id="highchartsContainer"/>
                    </Resizable>
                    {/*<div*/}
                    {/*    className="charResize"*/}

                    {/*    // onDragEnter={handleChangeWidth}*/}
                    {/*    // onMouseUpCapture={() => {*/}
                    {/*    //*/}
                    {/*    //   Highcharts.charts.forEach(function (chart, index) {*/}
                    {/*    //     if (chart) {*/}
                    {/*    //       if (chart.renderTo.id === "highchartsContainer") {*/}
                    {/*    //*/}
                    {/*    //         const ResizeWidth = document.getElementById('highchartsContainer').clientWidth;*/}
                    {/*    //         const ResizeHeight = document.getElementById('highchartsContainer').clientHeight;*/}
                    {/*    //*/}
                    {/*    //         console.log("Checked High chart Width & Height",ResizeWidth,ResizeHeight)*/}
                    {/*    //*/}
                    {/*    //         // console.log("Checked Resize Event for Width",document.getElementsByClassName("charResize").offsetWidth);*/}
                    {/*    //         // console.log("Checked Resize Event for Height",document.getElementsByClassName("charResize").offsetHeight);*/}
                    {/*    //         // chart.reflow();*/}
                    {/*    //       }*/}
                    {/*    //     }*/}
                    {/*    //   });*/}
                    {/*    // }}*/}
                    {/*>*/}
                    {/*  <HeightIcon  onMouseUpCapture = {handleChangeWidth}/>*/}
                    {/*  <div id="highchartsContainer"/>*/}
                    {/*</div>*/}
                    <div className={'downloadPng'}>
                      <Button onClick={downloadPngBtn}><img src={ExportPng}/>Download in PNG</Button>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </DialogContentText>
          </DialogContent>
          {/* <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions> */}
        </Dialog>
      </React.Fragment>
  );
}
