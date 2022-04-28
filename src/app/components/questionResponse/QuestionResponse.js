import React, {Component} from "react";
import { Grid,Typography,Tooltip } from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import Box from "@material-ui/core/Box";
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from "prop-types";
import "./QuestionResponse.scss"
import "../../css/common.scss";
import MultiChoiceBarChart from "../../components/multiChoiceBarChart/MultiChoiceBarChart";
import Highcharts from "highcharts";
import {Popover} from "antd";
import DownloadIcon from "../../../assets/images/videos/download.svg";
import SortIcon from "../../../assets/images/sort_icon.svg"
import { CSVLink, CSVDownload } from "react-csv";
const styles ={

}

const Sorting = ({csvExport,onExport,asc,des,def,visibleCSV,visibleSorting,handleSortingOpen,handleCSVOpen}) =>(    <>
        <Popover placement="bottomRight" content={
            <div>
                <p style={{marginBottom:"10px", cursor:'pointer'}} onClick={()=>{des()}}>Descending</p>
                <p style={{marginBottom:"10px", cursor:'pointer'}} onClick={()=>{asc()}}>Ascending</p>
                <p className={"mb-0 cursor"} onClick={()=>{def()}}>Default</p>
            </div>
        } trigger="click"
        onVisibleChange={()=>{handleSortingOpen()}}
        visible={visibleSorting}>
            <img src={SortIcon} onClick={()=>{handleSortingOpen()}} className={"cursor sorting-icon"} />
        </Popover>

        <Popover placement="bottomRight" content={
            <div>
                <p style={{marginBottom:"10px", cursor:'pointer'}} onClick={()=>{csvExport()}}>Download CSV</p>
                <p className={"mb-0"}style={{cursor:'pointer'}}  onClick={()=>{onExport()}}>Download Chart</p>
            </div>
        } 
        trigger="click"
        onVisibleChange={()=>{handleCSVOpen()}}
        visible={visibleCSV}>
            <img src={DownloadIcon} className={"cursor"} onClick={()=>{handleCSVOpen()}} />
        </Popover>
    </>
);
class QuestionResponse extends Component {
    constructor(props){
        super(props);
        this.state={
            config:{},
            data:[],
            selectedQuestionId:'',
            totalQue:[],
            csvData:[]
        }
        this.downloadLink= React.createRef();
    }
    componentDidMount=()=>{
        this.setState({data:this.props.data.questionChoice},()=>{
            this.generateConfig();
            this.descending(this.state.data);
        });
        document.addEventListener('get_updated_list',
            e =>{
                if(Array.isArray(e.detail.questionCardListBox) && e.detail.questionCardListBox.length > 0){
                    let newList=e.detail.questionCardListBox.filter(el=>el.questionId == this.state.selectedQuestionId);
                    if(Array.isArray(newList) && newList.length > 0){
                        this.setState({data:newList[0].questionChoice,config:{},visibleCSV:false,visibleSorting:false},()=>{
                            this.generateConfig();
                            this.generateCSV();
                        })
                    }
                    }
                }
        );

        this.setState({totalQue:this.props.data.questionChoice},()=>{
            this.generateCSV();
        })
}


componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.props.data.questionChoice !== prevProps.data.questionChoice) {
        this.setState({data: this.props.data.questionChoice}, () => {
            this.generateConfig();
            this.descending(this.state.data);
        });
        document.addEventListener('get_updated_list',
            e => {
                if (Array.isArray(e.detail.questionCardListBox) && e.detail.questionCardListBox.length > 0) {
                    let newList = e.detail.questionCardListBox.filter(el => el.questionId == this.state.selectedQuestionId);
                    if (Array.isArray(newList) && newList.length > 0) {
                        this.setState({
                            data: newList[0].questionChoice,
                            config: {},
                            visibleCSV: false,
                            visibleSorting: false
                        }, () => {
                            this.generateConfig();
                            this.generateCSV();
                        })
                    }
                }
            }
        );
        this.setState({totalQue: this.props.data.questionChoice}, () => {
            this.generateCSV();
        })
        }
    }

componentWillUnmount=()=>{
    this.setState({data:[]})
}
    ascendingSort=(data)=>{
        this.setState({config:{},visibleCSV:false,visibleSorting:false})
        data= data.slice().sort(function(a, b) {
        return a.percentage - b.percentage;
        });
        this.setState({data:data},()=>{
            this.generateConfig();
            this.generateCSV();
        })
    }

    descending=(data)=>{
        this.setState({config:{},visibleCSV:false,visibleSorting:false})
        data= data.slice().sort(function(a, b) {
            return b.percentage - a.percentage;
        });
        this.setState({data:data},()=>{
            this.generateConfig()
            this.generateCSV();
        })
    }

    generateCSV = ()=>{
        let questionTitle=this.props.data.questionNumber+this.props.data.questionText;
        let csvData= [[questionTitle,'Percentage of respondents','Number of Responses'],];
        for (let i in this.state.data){
            let arr = []
            arr.push(this.state.data[i].choiceText,this.state.data[i].percentage+"%",this.state.data[i].total)
            csvData.push(arr)
        }
        this.setState({csvData:csvData})
    }

    downloadCSV=()=>{
        this.setState({visibleCSV:false,visibleSorting:false})
        setTimeout(() => { this.downloadLink.link.click();
        }, 1000);

    }


    generateConfig=()=>{
        let  data =this.state.data;
        let categories=[];
        let seriesData=[];
        let seriesLabel=[];
        for(let i in data){
            categories.push(data[i].choiceText)
            seriesData.push(data[i].percentage)
            seriesLabel.push({ 
                id: i,
                y: data[i].percentage,
                name: data[i].choiceText,
                text: data[i].total})
        }
        let config={
            colors: ['#001839'],
            chart: {
                // overflow:'auto',
                type: 'bar',
                marginLeft: 150,
                marginRight:150,
                backgroundColor: 'transparent',
                events: {
                  load: function() {
                    var chart = this,
                      marginTop = 10,
                      marginBottom = 10,
                      seriesLength = chart.series[0].points.length,
                      lengthPerPoint = 50;
                    chart.setSize(null, (lengthPerPoint * seriesLength + marginTop + marginBottom));
                    
                  }
                },
                style: {
                    fontFamily: 'Rubik',
                    // overflow:'auto'                    
                }   
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: [{
                categories: categories,
                
                }],
            yAxis: {
                title: {
                  text: null
                },
                gridLineWidth: 0,
                labels: {
                  enabled: false,
                },
            },
            plotOptions: {
                series: {
                    borderWidth: 0,
                    dataLabels: {
                    inside: false,
                    allowOverlap: true,
                    style: {
                        fontSize: "10pt",
                        fontWeight: "400",
                        textOutline: false 
                    },
                    enabled: true,
                    color: '#001839',
                    crop: false,
                    overflow: 'none',
                    formatter: function () {
                        return this.point.y.toFixed(1) + '% , '+ this.point.text + " Responses";
                    },
                },
                pointWidth: 30,
                animation: {
                    duration: 100
                }
                },
               
            },
            scrollbar: {
                enabled: true
          },
            tooltip: {
                enabled:false,
            },
            credits: {
                enabled: false
            },
            exporting: {
                enabled:false,
            },
            series: [{
                showInLegend: false,
                data: seriesLabel
                }],
            
            }
            
      
            this.setState({config})
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

      handleCSVOpen=()=>{
          this.setState({visibleCSV:!this.state.visibleCSV})
      }

      handleSortingOpen=()=>{
          this.setState({visibleSorting:!this.state.visibleSorting})
      }
    render() {
        let questionTitle=this.props.data.questionNumber+" "+this.props.data.questionText;
        let fileName=questionTitle.substring(0, 30)+"_"+this.formattedCSVFileDate();
        return (
            <Card className={"padd-20  mb-20"}>
                <Grid item xs={12} sm={6} md={6} lg={12}>
                        <Grid container>
                            <Grid item xs={12} md={11} lg={11} sm={12} className={"videotitle "}>
                            <Tooltip title={questionTitle} placement="bottom-start" style={{cursor:'pointer'}}>
                                <Typography className={"videotitle grid-question-title mb-20"}>
                                    {this.props.data.questionNumber && this.props.data.questionNumber} {this.props.data.questionText && this.props.data.questionText}
                                </Typography>
                            </Tooltip>
                            </Grid>
                            <Grid item xs={12} md={1} lg={1} sm={12} style={{textAlign: "right",paddingRight:"25px"}}>

                                  <Sorting onExport={()=>{ this.setState({visibleCSV:false,visibleSorting:false}); this.clickChild()}}
                                  csvExport={()=>{this.downloadCSV()}}
                                  asc={()=>{this.ascendingSort(this.state.data)}}
                                  des={()=>{this.descending(this.state.data)}}
                                  def={()=>{
                                      this.setState({selectedQuestionId:this.props.data.questionId,data:this.props.data.questionChoice,visibleSorting:false},()=>{
                                          this.generateConfig()
                                      })
                                  }}
                                  visibleCSV={this.state.visibleCSV}
                                  visibleSorting={this.state.visibleSorting}
                                  handleCSVOpen={()=>{this.handleCSVOpen()}}
                                  handleSortingOpen={()=>{this.handleSortingOpen()}}/>
                            </Grid>
                            <CSVLink data={this.state.csvData}
                                     filename={fileName+".csv"}
                                     target="_blank"
                                     ref={(r) => (this.downloadLink = r)}/>
                        </Grid>
                </Grid>
                {/* <button onClick={() => this.clickChild()}>Click</button> */}
                <Grid item md={12} xs={12} lg={12} sm={12} >                
                    {JSON.stringify(this.state.config) != '{}' && 
                        <MultiChoiceBarChart data={this.state.config} questionTitle={questionTitle} index={this.props.index} setClick={click => this.clickChild = click} /> 
                    } 
                </Grid> 
                 
            </Card>
        )
    }
}

export default withStyles(styles)(QuestionResponse);