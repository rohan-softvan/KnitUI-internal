import React, { Component } from "react";
import Card from '@material-ui/core/Card';
import { Grid, Typography , Tooltip } from "@material-ui/core";
import Highcharts from "highcharts";
import ExportGraph from "highcharts/modules/exporting";
import {Popover} from "antd";
import { render } from "react-dom";
// import ReactHighCharts from "react-highcharts";
// import bellcurve from "highcharts/modules/histogram-bellcurve";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import DownloadIcon from "../../../assets/images/videos/download.svg"
import {CSVLink} from "react-csv";
ExportGraph(Highcharts);

// bellcurve(ReactHighCharts.Highcharts);

const defaultOptionsDataSet1 = {
    chart: {
        type: 'column',
        width: 575,
        height: 300
    },
    title: {
        text: ""
    },
    xAxis: {
        categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
    },
    yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
            text: 'Number of responses'
        }
    },
    legend: {
        align: 'right',
        verticalAlign: 'top',
        layout: 'vertical',
        itemStyle: {
            'color': '#001839',
            'font-weight': 'normal'
        },
        title: {
            text: 'Legend',
            style: {
                fontSize: '14px',
                color: '#001839',
                fontWeight: 'normal'
            }
        },
    },
    tooltip: {
        formatter: function () {
            return '<b>' + this.x + '</b><br/>' +
                this.series.name + ': ' + this.y + '<br/>' +
                'Total: ' + this.point.stackTotal;
        }
    },
    plotOptions: {
        series: {
            stacking: "normal"
        }
    },
    creadit: {
        enabled: false
    },
    series: [
        {
            name: 'Really Like',
            data: [30, 45, 40, 30, 20],
            stack: 'LikeFruit',
            color: '#001839',
            borderWidth: 0
        }, {
            name: 'Neutral',
            data: [45, 15, 30, 25, 65],
            stack: 'LikeFruit',
            color: '#12988A',
            borderWidth: 0
        }, {
            name: 'Really Dislike',
            data: [45, 60, 50, 65, 35],
            stack: 'LikeFruit',
            color: '#F4A000',
            borderWidth: 0
        }]
};

// const chartOptions = {
//     title: {
//       text: ""
//     },
//     series: [
//       {
//         data: [[1, "Highcharts"], [1, "React"], [3, "Highsoft"]],
//       }
//     ]
//   };

let mainChart;

const Sorting = ({onExport,csvExport,visibleCSV,handlePoperOpen}) =>(
    <>
        <Popover placement="bottomRight" content={
            <div>
                <p style={{marginBottom:"10px" ,cursor:'pointer'}} onClick={()=>{csvExport()}}>Download CSV</p>
                <p className={"mb-0"} style={{cursor:'pointer'}} onClick={()=>{onExport()}}>Download Chart</p>
            </div>
        } 
        trigger="click"
        onVisibleChange={()=>{handlePoperOpen()}}
        visible={visibleCSV}>
            <img src={DownloadIcon} onClick={()=>{handlePoperOpen()}} className={"cursor"} />
        </Popover>

    </>
);
function csvArray(a) {
    let a1=[];
    for (let i in a){
        a1.push([])
    }
   let index = 0;
    while (index < a.length){
        for (let i in a){
            for (let j = 0; j < a[i].data[index]; j++){
                if(a[i].name.includes('img') || a[i].name.includes('src')){
                    var match = a[i].name.match('src\s*=\s*"(.+?)"')
                    if(Array.isArray(match) && match.length > 0){
                        a1[index].push(match[1])
                    }
                }else{
                    a1[index].push(a[i].name)
                }
            }
        }
        index++;
    }
   let listLegnth = [];
    for (let i in a1){
        listLegnth.push(a1[i].length)
    }

    let a2=[];
    var maxL = Math.max(...listLegnth);

    for (let i = 0; i< maxL; i++){
        a2.push([])
    }

  let index2 = 0
    while (index2 < maxL){
        for (let i in a1){
            if(index2 < a1[i].length){
                a2[index2].push(a1[i][index2])
            }else{
                a2[index2].push(' ')
            }
        }
        index2++;
        }
    return a2;
    }


class HighchartStackColumn extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config: {},
            totalQue:[],
            csvData:[],
            visibleCSV:false
        }
        this.downloadLink= React.createRef();
    }
    componentDidMount() {
        this.initailChart();
        this.setState({totalQue:this.props.data},()=>{
            this.genrateCSV();
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.data !== prevProps.data) {
        this.initailChart();
        this.setState({totalQue:this.props.data},()=>{
            this.genrateCSV();
        })
    }
    }



    initailChart = () => {
        if (this.props.index) {
            Highcharts.chart("highchartStackColumn" + this.props.index, this.props.data)
        }
    }

    exportHighstockGraph = () =>{
        this.setState({visibleCSV:false})
        let fileName=this.props.title.substring(0, 30)+"_"+this.formattedCSVFileDate();
        if(this.props.index){
            let id="highchartStackColumn" + this.props.index;
            let chosenChart;
            Highcharts.charts.forEach(function(chart, index) {
                if(chart){
                    if (chart.renderTo.id === id) {
                        chosenChart = chart;
                        chosenChart.exportChart({
                            type: 'image/png',
                            filename: fileName});
                      }
                }
              });
        }
    }
    genrateCSV = ()=>{
        let question = [];
        let title = [];
        let count = 1
        for (let i in this.state.totalQue.series){
            // if(this.state.totalQue.series[i].name.includes('img') || this.state.totalQue.series[i].name.includes('src')){
            //     var match = this.state.totalQue.series[i].name.match('src\s*=\s*"(.+?)"')

            //     if(Array.isArray(match) && match.length > 0){
            //         title.push(match[1])
            //         question.push(this.props.title+" " + count)         
            //     }
            // }else{
                title.push(this.state.totalQue.series[i].name)
                question.push(this.props.title+" " + count)    
            // }
            count++
        }
        let csvData= [];
        let data = csvArray(this.state.totalQue.series);
        data.splice(0,0, question)
         this.setState({csvData:data})
    }

    downloadCSV=()=>{
        this.setState({visibleCSV:false})
        setTimeout(() => { this.downloadLink.link.click();
        }, 1000);

    }

    addZero=(data)=> {
        if (data < 10) {
            data = "0" + data
        }
        return data;
    }

    formattedCSVFileDate = () => {
        let dateObj = new Date();
        let month = this.addZero(dateObj.getMonth() + 1);
        let year=dateObj.getFullYear();
        let date = this.addZero(dateObj.getDate());
        let hours = this.addZero(dateObj.getHours());
        let minutes = this.addZero(dateObj.getMinutes());
        return month+date+year;

    }

    handlePoperOpen=()=>{
        this.setState({visibleCSV:!this.state.visibleCSV})
    }

    render() {
        let questionTitle=this.props.title;

        let fileName=questionTitle.substring(0, 30)+"_"+this.formattedCSVFileDate();
        return (
            <Grid container spacing={2} style={{marginBottom: '20px'}}>
                <Grid item xs={12} sm={6} md={6} lg={12}>
                    <Card className={"padd-20"}>
                        <Grid container>
                            <Grid item xs={12} md={10} lg={10} sm={12} className={"videotitle "}>
                                <Tooltip title={this.props.title} placement="bottom-start" style={{cursor:'pointer'}}>
                                    <Typography className={"videotitle mb-15"}>
                                        {this.props.title ? this.props.title : ""}
                                    </Typography>
                                    </Tooltip>
                            </Grid>
                            <Grid item xs={12} md={2} lg={2} sm={12} style={{textAlign: "right",paddingRight:"25px" ,cursor:'pointer'}}>
                                  <Sorting
                                  handlePoperOpen={()=>{this.handlePoperOpen()}}
                                    visibleCSV={this.state.visibleCSV} 
                                    csvExport={()=>{this.downloadCSV()}} onExport={()=>{this.exportHighstockGraph()}}/>
                            </Grid>
                            <CSVLink data={this.state.csvData}
                                     filename={fileName+".csv"}
                                     target="_blank"
                                     ref={(r) => (this.downloadLink = r)}/>
                            </Grid>
                            {/* <div style={{padding:"20px 0px 0px"}}>
                            <ReactHighCharts config={this.props.data ? this.props.data  : defaultOptionsDataSet1} />
                            </div> */}
                            <div style={{ padding: "20px 0px 0px", width: "100%", display: 'flex' }}>
                                <Grid item xs={12} sm={12} md={12} lg={12}>
                                <div className={"d-flex"}>
                                    {/* <ReactHighCharts config={this.props.data ? this.props.data  : defaultOptionsDataSet1} /> */}
                                    {this.props.index &&                                        
                                        // <div id={"highchartStackColumn" + this.props.index} options={chartOptions}></div>                                        
                                        <div id={"highchartStackColumn" + this.props.index}></div>
                                    }
                                    <div className={"legendDiv"} style={{maxHeight: 300,overflowY: "auto"}}>
                                        <div style={{ height: 10, display: "flex", justifyContent: "flex-start", margin: 10, marginBottom: 20 }}>
                                            {/* <FiberManualRecordIcon /> */}
                                            {this.props.legend && this.props.legend.length > 0 && <span style={{ fontSize: '15px', fontWeight: '400', color: "#001839" }}>Legend</span>}
                                        </div>
                                        {this.props.legend && this.props.legend.map((item, index) => {
                                             return item.title.includes("img") || item.title.includes("src") ?
                                                <div style={{ height: 'auto', display: "flex", justifyContent: "flex-start", margin: 10, marginBottom: 20 }}>
                                                    <FiberManualRecordIcon style={{ color: item.color, width: "20px" }} />
                                                    <Typography style={{ fontSize: '15px', fontWeight: '300', paddingLeft: 10, color: "#001839" }}>
                                                        <div dangerouslySetInnerHTML={{__html: item.title}}  />
                                                    </Typography>
                                                </div>
                                                :
                                                <div style={{ height: 10, display: "flex", justifyContent: "flex-start", margin: 10, marginBottom: 20 }}>
                                                <FiberManualRecordIcon style={{ color: item.color, width: "20px" }} />
                                                <Typography style={{ fontSize: '15px', fontWeight: '300', paddingLeft: 10, color: "#001839" }}>
                                                    {item.title}
                                           
                                                </Typography>
                                            </div>
                                        })}
                                    </div>
                                    </div>
                                </Grid>
                            </div>

                        
                    </Card>
                </Grid>
            </Grid>
        )
    }
}

export default HighchartStackColumn;