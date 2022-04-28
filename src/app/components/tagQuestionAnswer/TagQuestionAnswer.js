import React, { Component } from "react";
import Card from '@material-ui/core/Card';
import { Grid, Typography,Tooltip } from "@material-ui/core";
import DownloadIcon from "../../../assets/images/videos/download.svg"
import './tagQuestionAnswer.scss'
import { Popover, Button,Input } from 'antd';
import SortIcon from "../../../assets/images/sort_icon.svg"

import {CSVLink} from "react-csv";
const Sorting = ({asc,des,def,csvExport,visibleCSV,visibleSorting,handleSortingOpen,handleCSVOpen}) =>(
  <div>
      <Popover placement="bottomRight" content={
          <div>
              <p style={{marginBottom:"10px",cursor:'pointer'}} onClick={()=>{des()}}>Descending</p>
              <p style={{marginBottom:"10px",cursor:'pointer'}} onClick={()=>{asc()}}>Ascending</p>
              <p className={"mb-0"} style={{marginBottom:"10px",cursor:'pointer'}} onClick={()=>{def()}}>Default</p>
          </div>
      } trigger="click"
      onVisibleChange={()=>{handleSortingOpen()}}
      visible={visibleSorting}>
          <img src={SortIcon} onClick={()=>{handleSortingOpen()}} className={"cursor sorting-icon"} />
      </Popover>

      <Popover placement="bottomRight" content={
          <div>
              <p className={"mb-0"}  style={{cursor:'pointer'}}  onClick={()=>{csvExport()}}>Download CSV</p>
          </div>
      } trigger="click"
      onVisibleChange={()=>{handleCSVOpen()}}
      visible={visibleCSV}>
          <img src={DownloadIcon} className={"cursor"} onClick={()=>{handleCSVOpen()}}/>
      </Popover>

  </div>
);
class TagQuestionAnswer extends Component {
    constructor(props){
        super(props);
        this.state={
            data:[],
            selectedQuestionId:'',
            totalQue:[],
            csvData:[],
            visibleCSV:false,
            visibleSorting:false
        }
        this.downloadLink= React.createRef();
    }

    componentDidMount(){
        if(this.props.data){
            this.setState({data:this.props.data})
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
        this.setState({totalQue:this.props.data},()=>{
            this.genrateCSV();
        })
    }


    componentDidUpdate(prevProps, prevState, snapshot){
        if(this.props.data !== prevProps.data) {
            if(this.props.data){
                this.setState({data:this.props.data})
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
            this.setState({totalQue:this.props.data},()=>{
                this.genrateCSV();
            })
        }
        
    }


    ascendingSort=(data)=>{
        data= data.slice().sort(function (a, b) {
            if(typeof(a) == 'number' || typeof(b) == 'number'){
                return a - b;
            }else{
                return a.localeCompare(b);
            }
            
          });
          this.setState({data:data,totalQue:data,visibleCSV:false,visibleSorting:false},()=>{
              this.genrateCSV()
          })
    }

    descendingSort=(data)=>{
        data=data.slice().sort(function (a, b) {
            if(typeof(a) == 'number' || typeof(b) == 'number'){
                return b - a;
            }else{
                return b.localeCompare(a);
            }
          });
          this.setState({data:data,visibleCSV:false,visibleSorting:false},()=>{
            this.genrateCSV()
          })
    }

    genrateCSV = ()=>{

        let question = this.props.number+" "+this.props.text

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

    render(){
        let totalCount=0;
        let questionTitle=(this.props.number ? this.props.number : '') +" "+this.props.text;
        let fileName=questionTitle.substring(0, 30)+"_"+this.formattedCSVFileDate();
        return(
            <Grid container spacing={2} style={{marginBottom: '20px'}}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Card className={"question-padd"}>
                        <Grid container>
                             <Grid item xs={12} md={11} lg={11} sm={12} className={"videotitle "}>
                             <Tooltip title={questionTitle} placement="bottom-start" style={{cursor:'default'}}>
                                <Typography className={"videotitle grid-question-title mb-20"}>
                                {this.props.number ? this.props.number : '' } {this.props.text ? this.props.text : ''}
                                </Typography>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12} md={1} lg={1} sm={12} style={{textAlign: "right",paddingRight:"25px"}}>
                            <Sorting  csvExport={()=>{this.downloadCSV()}}
                                        asc={()=>{this.ascendingSort(this.state.data)}}
                                        des={()=>{this.descendingSort(this.state.data)}}
                                        def={()=>{
                                            this.setState({selectedQuestionId:this.props.questionId,data:this.props.data,visibleSorting:false})
                                        }}
                                        visibleCSV={this.state.visibleCSV}
                                        visibleSorting={this.state.visibleSorting}
                                        handleCSVOpen={()=>{this.handleCSVOpen()}}
                                        handleSortingOpen={()=>{this.handleSortingOpen()}}/>
                                {/* </div> */}
                                <CSVLink data={this.state.csvData}
                                         filename={fileName+".csv"}
                                         target="_blank"
                                         ref={(r) => (this.downloadLink = r)}/>
                            </Grid>
                            <div className={"questionType"}>
                                <ul>
                                    {this.state.data && this.state.data.length > 0 &&
                                        this.state.data.map((item)=>{
                                            if(item.length>0){totalCount=totalCount+1}
                                            return(
                                                <>
                                                 {totalCount <= 15  && (
                                                        <li onClick={()=>{this.props.handleRedirectOpenText()}}>{item}</li>
                                                 )}
                                                </>
                                            )
                                        })
                                    }
                                    {totalCount > 15 && (
                                        <li className="showMoreDiv" onClick={()=>{this.props.handleRedirectOpenText()}}>+{totalCount-15} more</li>
                                    )} 
                                </ul>
                                <div></div>
                            </div>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>            
        )
    }
}
export default TagQuestionAnswer;