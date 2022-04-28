import React, { Component } from "react";
import Card from '@material-ui/core/Card';
import { Grid, Typography ,Tooltip } from "@material-ui/core";
import Highcharts from "highcharts";
import {Popover} from "antd";
import bellcurve from "highcharts/modules/histogram-bellcurve";
import DownloadIcon from "../../../assets/images/videos/download.svg";
import "./MultiHighchartHistogram.scss"
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import ExportGraph from "highcharts/modules/exporting";
import { CSVLink } from "react-csv";
ExportGraph(Highcharts);
bellcurve(Highcharts);
const xdata = [40, 65, 75, 100, 90, 110, 80, 20, 45];
const x2data = [30, 65, 75, 100, 90, 110, 80, 20, 45];
const x3data = [20, 65, 75, 100, 90, 110, 80, 20, 45];

let mainChart;
const Sorting = ({onExport,onCSVExport,visible,openPopover}) =>(
    <>
        <Popover placement="bottomRight" content={
            <div>
                <p style={{marginBottom:"10px",cursor:"pointer"}}  onClick={()=>{onCSVExport()}}>Download CSV</p>
                <p className={"mb-0"} style={{cursor:"pointer"}} onClick={()=>{onExport()}}>Download Chart</p>
            </div>
        } trigger="click"
        onVisibleChange={()=>{openPopover()}}
        visible={visible}>
            <img src={DownloadIcon} className={"cursor"} onClick={()=>{openPopover()}}/>
        </Popover>

    </>
);

class MultiHighchartHistogram extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: {},
            allData:[],
            csvData:[],
            sortingVisible:false
        };
        this.downloadChartLink=React.createRef();
    }
    componentDidMount() {
        if(this.props.data){
            this.setState({allData:this.props.data},()=>{
                this.initailChart();
                this.genrateCSV();
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.props.data !== prevProps.data) {
        this.initailChart();
        if(this.props.data){
            this.setState({allData:this.props.data},()=>{
                this.genrateCSV();
            })
        }
        }
    }


    initailChart = () => {
        console.log('indexc==>',this.props.index)
        // if(this.props.index && this.props.data){
        //     Highcharts.chart("multiHighchartHistogram"+this.props.index,this.props.data)
        // }

        if (this.props.index) {
            Highcharts.chart("multiHighchartHistogram" + this.props.index, JSON.parse(JSON.stringify(this.props.data)) )
        }
    }
    exportMultiChartHistogramChart = () =>{        
        // mainChart.exportChart();
        let fileName=this.props.title.substring(0, 30)+"_"+this.formattedCSVFileDate();
        if(this.props.index){
            let id="multiHighchartHistogram" + this.props.index;
            let chosenChart;
            Highcharts.charts.forEach(function(chart, index) {
                if(chart){
                    if (chart.renderTo.id === id) {
                        chart.exporting.filename='custom-file-name';
                        chosenChart = chart;
                        chosenChart.exportChart({
                            type: 'image/png',
                            filename: fileName});
                      }
                }               
              });              
        } 
        this.setState({sortingVisible:false})
    }


 
    genrateCSV = ()=>{
        let csvData= [];
        let csvHeader = [];
        let mainDataList=[]
        let count=0;
        for (let i in this.state.allData.series){
            let questionTitle=this.props.title +" - "+ this.state.allData.series[i].name
            csvHeader.push(questionTitle);
            csvData.push(this.state.allData.series[i].data);
            count=this.state.allData.series[i].data.length;
        }
        
        for(let j=0;j<count;j++){
            let finalData=[]
            for(let i in csvData){
                finalData.push(csvData[i][j])
            }
            mainDataList.push(finalData);
        }
        let mainCSVData=[];
        mainCSVData.push(csvHeader)
        for(let i in mainDataList){
            mainCSVData.push(mainDataList[i])
        }
        this.setState({csvData:mainCSVData})
    }

    downloadCSV=()=>{
        this.setState({sortingVisible:false})
        setTimeout(() => { this.downloadChartLink.link.click();
        }, 1000);

    }

    addZero = (data) => {
        if (data < 10) {
          data = "0" + data
        }
        return data;
      }
      
      formattedCSVFileDate = () => {
        let dateObj = new Date();
        let month = this.addZero(dateObj.getMonth() + 1);
        let year = dateObj.getFullYear();
        let date = this.addZero(dateObj.getDate());
        let hours = this.addZero(dateObj.getHours());
        let minutes = this.addZero(dateObj.getMinutes());
        return month + date + year;
      }
      
      openPopover=()=>{
          this.setState({sortingVisible:!this.state.sortingVisible})
      }
    
    render() {
        // let questionTitle=this.props.data.questionNumber+" "+this.props.data.questionName;
    let fileName=this.props.title.substring(0, 30)+"_"+this.formattedCSVFileDate();
        return (
            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Card className={"padd-20"}>
                        <Grid container>
                            <Grid item xs={12} md={10} lg={10} sm={12} className={"videotitle "}>
                                <Tooltip title={this.props.title} placement="bottom-start" style={{cursor:'pointer'}}>
                                    <Typography className={"videotitle grid-question-title mb-15"}>
                                        {this.props.title ? this.props.title : ""}
                                    </Typography>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12} md={2} lg={2} sm={12} style={{textAlign: "right",paddingRight:"25px"}}>
                                  <Sorting onExport={()=>{this.exportMultiChartHistogramChart()}}
                                    onCSVExport={()=>{this.downloadCSV(fileName)}}
                                    openPopover={()=>{this.openPopover()}}
                                    visible={this.state.sortingVisible}/>
                            </Grid>
                            <CSVLink data={this.state.csvData}
                                     filename={fileName + ".csv"}
                                     target="_blank"
                                     ref={(r) => (this.downloadChartLink = r)}/>
                        </Grid>
                            <div className={"multichart"} style={{ padding: "20px 0px 0px", width: "100%", display: 'flex' }}>
                                <Grid item xs={12} sm={12} md={12} lg={12} style={{display:"flex"}}>
                                    {/* <ReactHighCharts config={this.props.data} /> */}
                                    <div style={{ marginRight: "20px",width:"calc(100% - 200px)",height:'400px',padding:"0px 0px 15px", overflow:'scroll !important' }}>
                                        <div id={"multiHighchartHistogram" + this.props.index} style={{width:"100%"}}></div>
                                    </div>

                                    <div style={{maxHeight: 300,overflowY: "auto"}}>
                                        <div style={{ height: 10, display: "flex", justifyContent: "flex-start", margin: 10, marginBottom: 20 }}>
                                            {/* <FiberManualRecordIcon /> */}
                                            {this.props.legend && this.props.legend.length > 0 && <span style={{ fontSize: '15px', fontWeight: '400', color: "#001839" }}>Legend</span>}
                                        </div>
                                        {this.props.legend && this.props.legend.map((item, index) => {
                                            return (
                                                <div style={{ height: 10, display: "flex", justifyContent: "flex-start", margin: 10, marginBottom: 20 }}>
                                                    <FiberManualRecordIcon style={{ color: item.color, width: "20px" }} />
                                                    <Typography style={{ fontSize: '15px', fontWeight: '300', paddingLeft: 10, color: "#001839" }}>
                                                        {item.title}
                                                    </Typography>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </Grid>
                            </div>
                        
                    </Card>
                </Grid>
            </Grid>
        )
    }
}


export default MultiHighchartHistogram;