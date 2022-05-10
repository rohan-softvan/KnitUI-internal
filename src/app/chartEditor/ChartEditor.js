import React, { Component } from "react";
import { Grid, Typography } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
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
import Series from '../../assets/images/charteditor/Series.png';
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
import AreaLineChart from "../../assets/images/charteditor/AreaLineChart.svg";
import LineAndColumnChart from "../../assets/images/charteditor/LineAndColumn.svg";
import ScatterLineChart from "../../assets/images/charteditor/ScatterLine.svg";
import LineCharts from "../../assets/images/charteditor/LineCharts.png"
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Highcharts from "highcharts";
import HighchartsExporting from "highcharts/modules/exporting";
import {useDispatch, useSelector} from "react-redux";
import {setGraphConfig} from "../redux/slice/ChartEditorSlice";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
HighchartsExporting(Highcharts);

/*Main Tab*/
function TabPanel(props) {
  const { children, value, index, ...other } = props;

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
  const { children, value, index, ...other } = props;

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
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [value, setValue] = React.useState(0);
  const [subvalue, subsetValue] = React.useState(1);

  /*Main Tab*/
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  /*Sub Tab*/
  const subHandleChange = (event , newValue) => {
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

  const handleChartChange = type => {
    console.log('type==>',type)
    // if (type === "scatter") {
    //   setMeasures([
    //     {
    //       uniqueName:
    //           "Q20 Would you be interested in ordering from a food locker like this?",
    //       aggregation: "count"
    //     },
    //     {
    //       uniqueName: "Q8 Do you have a meal plan for on-campus dining?",
    //       aggregation: "count"
    //     }
    //   ]);
    // } else {
    //   setMeasures([
    //     {
    //       uniqueName:
    //           "Q20 Would you be interested in ordering from a food locker like this?",
    //       aggregation: "count"
    //     }
    //   ]);
    // }
    let newConfig = JSON.parse(JSON.stringify(graphConfig));
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


    let plotOptions = {
      pie:
          type === "donut"
              ? getPlotOptionsForDonut()
                          : {},
      series: {
        cursor: "pointer",
        stacking: getStackingGraphConfig(type),
        },
        dataLabels: {
          enabled: true
        }
      }

    if (
       type === "multicolor-bar" ||
        type === "multicolor-column"
    ) {
      plotOptions.series.colorByPoint = true;
    }else{
      plotOptions.series.colorByPoint = false;
    }
    newConfig.plotOptions= plotOptions
    console.log('graphConfig after', newConfig)
    dispatch(setGraphConfig(newConfig))
  };

  async function downloadPngBtn() {
    Highcharts.charts.forEach(function(chart, index) {
      if (chart) {
        if (chart.renderTo.id === "highchartsContainer") {
          chart.exportChart({
            type: "image/png"
          });
        }
      }
    });
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
            <img src={LogoImage} className="LogoImg" /> <img src={GraphEditorIcon} className="barIcon" /> Graph Editor
          </div>
          <IconButton onClick={handleClose}>
            <CloseIcon style={{width:18}}/><Typography style={{fontSize:18}}> Close</Typography>
          </IconButton>
        </DialogTitle>
        <DialogContent className={"padd-LR-10"}>
          <DialogContentText>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" className="charEditorTabs">
                      <Tab label="Data" {...a11yProps(0)} />
                      <Tab label="Chart Type" {...a11yProps(1)} />
                      <Tab label="Customize" {...a11yProps(2)} />
                      <Tab label="Export" {...a11yProps(3)} />
                    </Tabs>
                  </Box>

                  <div className={'InnerScrollTab'}>
                    <TabPanel value={value} index={0}>
                      <div className="subTabs">
                          <Tabs value={subvalue} onChange={subHandleChange} aria-label="basic tabs example" className="charEditorTabs">
                            <Tab label="Questions" {...suba11yProps(0)} />
                            <Tab label="Edit Data" {...suba11yProps(1)} />
                          </Tabs>
                          <TabPanel value={subvalue} index={0}>
                            <Typography className="questiontitle">Questions:</Typography>
                            <QuestionTab />
                          </TabPanel>
                          <TabPanel value={subvalue} index={1}>
                            <PivotTable />
                          </TabPanel>
                      </div>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                      <div className="subTabs">
                        <Typography className={"chooseChartTitle"}><img src={Appearance} /> Choose chart</Typography>
                        <div className={'chartTypes'}>
                          <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header">
                              <Typography className='AccordTitle rootTitle'><img src={LineCharts} />Bar charts</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container spacing={2}>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <ChartEditorTypeCard title={"Basic Bar Chart"} handleChartChange={() => handleChartChange("bar")} icon={Barchart} component={"export"}/>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <ChartEditorTypeCard title={"Multicolor Bar Chart"} handleChartChange={() => handleChartChange("multicolor-bar")} icon={MulticolorBar} component={"export"}/>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <ChartEditorTypeCard title={"Stacked Bar Chart"} handleChartChange={() => handleChartChange("stacked-bar")}  icon={StackedBarCharts} component={"export"}/>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <ChartEditorTypeCard title={"Stacked Percent Bar Chart"} handleChartChange={() => handleChartChange("stacked-percent-bar")}  icon={PercentStackedBarChart} component={"export"}/>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>

                          <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header">
                              <Typography className='AccordTitle rootTitle'><img src={PieChartSmall} />Pie charts</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container spacing={2}>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <ChartEditorTypeCard title={"Pie Chart"} handleChartChange={() => handleChartChange("pie")} icon={PieChart} component={"export"}/>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <ChartEditorTypeCard title={"Donut Chart"} handleChartChange={() => handleChartChange("donut")} icon={DonutChart} component={"export"}/>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <ChartEditorTypeCard title={"3D Pie Chart"}  handleChartChange={() => handleChartChange("3d-pie")}   icon={ThreeDPieChart} component={"export"}/>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <ChartEditorTypeCard title={"3D Donut Chart"}  handleChartChange={() => handleChartChange("3d-donut")}  icon={ThreeDDonutChart} component={"export"}/>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <ChartEditorTypeCard title={"Semi-circle Donut Chart"}  handleChartChange={() => handleChartChange("semi-circle-donut")}  icon={ThreeDDonutChart} component={"export"}/>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>

                          <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header">
                              <Typography className='AccordTitle rootTitle'><img src={DataLabelsIcon} />Column charts</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container spacing={2}>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <ChartEditorTypeCard title={"Basic Column"} handleChartChange={() => handleChartChange("column")}  icon={BasicColumn} component={"export"}/>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <ChartEditorTypeCard title={"Multi-color Column"} handleChartChange={() => handleChartChange("multicolor-column")} icon={MultiColorColumn} component={"export"}/>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <ChartEditorTypeCard title={"Stacked Column"} handleChartChange={() => handleChartChange("stacked-column")} icon={StackedColumn} component={"export"}/>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <ChartEditorTypeCard title={"Stacked Percent Column"} handleChartChange={() => handleChartChange("stacked-percent-column")} icon={StackedPercentColumn} component={"export"}/>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>

                          <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header">
                              <Typography className='AccordTitle rootTitle'><img src={LineCharts} />Line charts</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container spacing={2}>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <ChartEditorTypeCard title={"Line Chart"} handleChartChange={() => handleChartChange("line")}  icon={LineChart} component={"export"}/>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <ChartEditorTypeCard title={"Scatter Chart"} handleChartChange={() => handleChartChange("scatter")} icon={ScatterChart} component={"export"}/>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>

                          <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header">
                              <Typography className='AccordTitle rootTitle'><img src={WaveChartSmall} />Area charts</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Grid container spacing={2}>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <ChartEditorTypeCard title={"Basic Area Chart"} handleChartChange={() => handleChartChange("area")}  icon={BasicArea} component={"export"}/>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <ChartEditorTypeCard title={"Stacked Area Chart"}  handleChartChange={() => handleChartChange("stacked-area")} icon={StackedArea} component={"export"}/>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <ChartEditorTypeCard title={"Stacked Percentage Area Chart"}  handleChartChange={() => handleChartChange("stacked-percent-area")} icon={StackedPercentageArea} component={"export"}/>
                                </Grid>
                              </Grid>
                            </AccordionDetails>
                          </Accordion>

                          {/*<Accordion>*/}
                          {/*  <AccordionSummary*/}
                          {/*      expandIcon={<ExpandMoreIcon />}*/}
                          {/*      aria-controls="panel2a-content"*/}
                          {/*      id="panel2a-header">*/}
                          {/*    <Typography className='AccordTitle rootTitle'><img src={LineCharts} />Combination charts</Typography>*/}
                          {/*  </AccordionSummary>*/}
                          {/*  <AccordionDetails>*/}
                          {/*    <Grid container spacing={2}>*/}
                          {/*      <Grid item lg={6} md={6} sm={12} xs={12}>*/}
                          {/*        <ChartEditorTypeCard title={"Area Line Chart"} icon={AreaLineChart} component={"export"}/>*/}
                          {/*      </Grid>*/}
                          {/*      <Grid item lg={6} md={6} sm={12} xs={12}>*/}
                          {/*        <ChartEditorTypeCard title={"Line and Column Chart"} icon={LineAndColumnChart} component={"export"}/>*/}
                          {/*      </Grid>*/}
                          {/*      <Grid item lg={6} md={6} sm={12} xs={12}>*/}
                          {/*        <ChartEditorTypeCard title={"Scatter Line Chart"} icon={ScatterLineChart} component={"export"}/>*/}
                          {/*      </Grid>*/}
                          {/*    </Grid>*/}
                          {/*  </AccordionDetails>*/}
                          {/*</Accordion>*/}
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                      <div className="subTabs">
                        <CustomizeTab />
                      </div>
                    </TabPanel>
                    <TabPanel value={value} index={3}>
                        <div className="subTabs exportTab">
                          <Typography className={"exportTitle"}>Choose format:</Typography>
                              <Grid container spacing={2}>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <ChartEditorTypeCard title={"Recommended for graphs with logos, illustrations, and charts"} icon={ExportPng} component={"export"}/>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <ChartEditorTypeCard title={"Recommended for graphs with photos or mixed media"} icon={ExportJpg} component={"export"}/>
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <ChartEditorTypeCard title={"Printer-friendly, use as a document or email to others."} icon={ExportPdf} component={"export"}/>
                                </Grid>
                              </Grid>
                        </div>
                    </TabPanel>
                  </div>
                </Box>
              </Grid>
              <Grid item xs={6}>
              <div className={'ChartSection'}>
                <div className={'mostUsedChart'}>
                    <div className={'chartIcons'}>
                      <img src={PieChartSmall} onClick={() => handleChartChange("pie")}/>
                    </div>
                    <div className={'chartIcons'}>
                      <img src={WaveChartSmall} onClick={() => handleChartChange("area")} />
                    </div>
                    <div className={'chartIcons'}>
                      <img src={LineCharts} />
                    </div>
                    <div className={'chartIcons'}>
                      <img src={DonutChartSmall} />
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
                  <div id="highchartsContainer"/>
                </div>
                <div className={'downloadPng'}>
                  <Button onClick={downloadPngBtn}><img src={ExportPng} />Download in PNG</Button>
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
