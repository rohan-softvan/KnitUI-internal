import React, { Component } from "react";
import { Grid,Typography,Tooltip } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import "./AccordianParagraph.scss";
import "../../css/common.scss";

import { withStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
// import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {Popover} from "antd";
import DownloadIcon from "../../../assets/images/videos/download.svg";
import SortIcon from "../../../assets/images/sort_icon.svg";
import {CSVLink} from "react-csv";

const useStyles = theme => ({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  });

const Sorting = ({asc,des,def,csvExport,visibleCSV,visibleSorting,handleSortingOpen,handleCSVOpen}) =>(
    <>
        <Popover placement="bottomRight" content={
            <div>
                <p style={{marginBottom:"10px", cursor:'pointer'}} onClick={()=>{des()}}>Descending</p>
                <p style={{marginBottom:"10px",  cursor:'pointer'}} onClick={()=>{asc()}}>Ascending</p>
                <p className={"mb-0"} style={{marginBottom:"10px",cursor:'pointer'}} onClick={()=>{def()}}>Default</p>
            </div>
        } trigger="click"
        onVisibleChange={()=>{handleSortingOpen()}}
        visible={visibleSorting}>
            <img src={SortIcon}  onClick={()=>{handleSortingOpen()}} className={"cursor sorting-icon"} />
        </Popover>

        <Popover placement="bottomRight" content={
            <div>
                <p style={{marginBottom:"10px" ,cursor:'pointer'}}className={"mb-0"} onClick={()=>{csvExport()}}>Download CSV</p>
                {/*<p>Download Chart</p>*/}
            </div>
        } trigger="click"
        visible={visibleCSV}>
            <img src={DownloadIcon} onClick={()=>{handleCSVOpen()}}   className={"cursor"} />
        </Popover>

    </>
);
class AccordianParagraph extends Component {
    constructor(props){
        super(props);
        this.state={
            data:[],
            selectedQuestionId:'',
            totalQue:[],
            csvData:[],
            visibleSorting:false,
            visibleCSV:false
        }
        this.downloadLink= React.createRef();
    }
    
    componentDidMount(){
        if(this.props.data.questionData){
            this.setState({data:this.props.data.questionData})
        }
        document.addEventListener('get_updated_list',
        e =>{
            if(Array.isArray(e.detail.questionCardListBox) && e.detail.questionCardListBox.length > 0){
                let newList=e.detail.questionCardListBox.filter(el=>el.questionId == this.state.selectedQuestionId);
                if(Array.isArray(newList) && newList.length > 0){
                    this.setState({data:newList[0].questionData,visibleCSV:false,visibleSorting:false},()=>{
                        this.genrateCSV();
                    })
                }
                }
            }
    );

        this.setState({totalQue:this.props.data.questionData},()=>{
            this.genrateCSV();
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if(this.props.data.questionData !== prevProps.data.questionData) {
        if(this.props.data.questionData){
            this.setState({data:this.props.data.questionData})
        }
        document.addEventListener('get_updated_list',
        e =>{
            if(Array.isArray(e.detail.questionCardListBox) && e.detail.questionCardListBox.length > 0){
                let newList=e.detail.questionCardListBox.filter(el=>el.questionId == this.state.selectedQuestionId);
                if(Array.isArray(newList) && newList.length > 0){
                    this.setState({data:newList[0].questionData,visibleCSV:false,visibleSorting:false},()=>{
                        this.genrateCSV();
                    })
                }
                }
            }
    );

        this.setState({totalQue:this.props.data.questionData},()=>{
            this.genrateCSV();
        })
    }
    }

    ascendingSort=(data)=>{
        data= data.slice().sort(function (a, b) {
            return a.trim().localeCompare(b.trim());
          });
          this.setState({data:data,visibleCSV:false,visibleSorting:false},()=>{
            this.genrateCSV()
          })
    }

    descendingSort=(data)=>{
        data= data.slice().sort(function (a, b) {
            return b.trim().localeCompare(a.trim());
          });
          this.setState({data:data,visibleCSV:false,visibleSorting:false},()=>{
            this.genrateCSV()
          })
    }

    genrateCSV = ()=>{
        let question = this.props.data.questionNumber+" "+this.props.data.questionName
        let csvData= [[question],];

        for (let i in this.state.data){
            let arr = []
            arr.push(this.state.data[i])
            csvData.push(arr)
        }
        this.setState({csvData:csvData})

    }

    downloadCSV=()=>{
        this.setState({visibleCSV:false,visibleSorting:false})
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

      handleCSVOpen=()=>{
        this.setState({visibleCSV:!this.state.visibleCSV})
    }

    handleSortingOpen=()=>{
        this.setState({visibleSorting:!this.state.visibleSorting})
    }


    render() {
        let totalCount = 0;
        const { classes } = this.props;
        let questionTitle=this.props.data.questionNumber+" "+this.props.data.questionName;
        let fileName=questionTitle.substring(0, 30)+"_"+this.formattedCSVFileDate();
        return(
            <Grid container spacing={2} className={"mt-15 mb-20"}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Card className={" video-grid-card"}>
                        <Grid container>
                            <Grid item xs={12} md={10} lg={10} sm={12} className={"videotitle "}>
                            <Tooltip title={questionTitle} placement="bottom-start" >
                                <Typography className={"videotitle grid-question-title mb-15"} style={{padding:"20px 0px 0px 20px",cursor:'default'}}>
                                {this.props.data.questionNumber && this.props.data.questionNumber} {this.props.data.questionName && this.props.data.questionName}
                                </Typography>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12} md={2} lg={2} sm={12} style={{textAlign: "right",paddingRight:"25px",paddingTop:20}}>
                            <Sorting 
                                    csvExport={()=>{this.downloadCSV()}}
                                    asc={()=>{this.ascendingSort(this.state.data)}}
                                    des={()=>{this.descendingSort(this.state.data)}}
                                    def={()=>{
                                        this.setState({selectedQuestionId:this.props.data.questionId,data:this.props.data.questionData,visibleSorting:false})
                                        // this.props.getByQuestionId(this.props.data.questionId,
                                        //     this.props.data.questionName,
                                        //     this.props.data.questionNumber,
                                        //     this.props.data.numericQuestionId,
                                        //     true)
                                        }}
                                        visibleSorting={this.state.visibleSorting}
                                        visibleCSV={this.state.visibleCSV}
                                        handleCSVOpen={()=>{this.handleCSVOpen()}}
                                        handleSortingOpen={()=>{this.handleSortingOpen()}}
                                    />
                            </Grid>
                            <CSVLink data={this.state.csvData}
                                          filename={fileName+".csv"}
                                         target="_blank"
                                         ref={(r) => (this.downloadLink = r)}/>
                        </Grid>
                        <div className={classes.root}>
                            {this.state.data && this.state.data.map((item,index)=>{
                                 if (item.length > 0) { totalCount = totalCount + 1 }
                                return(
                                    <>
                                    {totalCount <= 10 && item.length > 0 && (
                                        <Accordion>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header" className={"accordTitle"}>
                                            <Typography className={classes.heading}>{item}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails >
                                            <Typography style={{color: "#001839"}} className={"c-pointer"} onClick={()=>{this.props.handleRedirectOpenText()}}>
                                            {item}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                    )}
                                    </>
                                )
                            })}
                        </div>
                    </Card>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(useStyles, { withTheme: true }) (AccordianParagraph);