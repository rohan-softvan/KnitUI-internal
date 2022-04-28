import React, { Component } from "react";
import { Grid, Typography ,Tooltip } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import UncheckedBox from "../../../assets/images/videos/unchecked-white.svg";
import CheckedBox from "../../../assets/images/videos/checked-white.svg";
import "./PhotoCollegeDorm.scss";
import "../../css/common.scss";
import Download from "../../../assets/images/videos/download-white.svg";
import DownloadIcon from "../../../assets/images/videos/download.svg"
import { CardMedia,CardContent } from "@material-ui/core";
import VideoCard from "./videoCard.js"
import Skeleton from "@material-ui/lab/Skeleton"
import AuthLoader from "../authLoader/Loader";
import {Popover} from "antd";
import { CSVLink } from "react-csv";
const Sorting = ({csvExport,visibleCSV,openPopover}) =>(
    <>
      <Popover placement="bottomRight" content={
        <div>
          <p className={"mb-0"}  style={{cursor:"pointer"}} onClick={()=>{csvExport()}}>Download CSV</p>
        </div>
      } trigger="click"
        onVisibleChange={()=>{openPopover()}}
        visible={visibleCSV}>
        <img src={DownloadIcon} className={"cursor"} onClick={()=>{openPopover()}}/>
      </Popover>

    </>
);
class PhotoCollegeDorm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: false,
      loading: false,
      allData:[],
      csvData:[],
      visibleCSV:false
    };
    this.downloadImageLink= React.createRef();
  }

  componentDidMount(){
    this.setState({allData:this.props.data},()=>{
        this.genrateCSV();
    })
  }

    genrateCSV = ()=>{
      if(this.props.isVideo === false){
          let csvData= [['Question','Image Link']];
          for (let i in this.state.allData.questionData){
              let questionTitle=this.state.allData.questionNumber+". "+this.state.allData.questionText;
              let imageLink= JSON.stringify(this.state.allData.questionData[i]) != '{}'
                  ? this.state.allData.questionData[i].question_file_link :
                  "-";

              let arr = []
              arr.push(questionTitle,imageLink)
              csvData.push(arr)
          }
          this.setState({csvData:csvData})

      }
      else{
          let csvData= [['Question','Video Link']];
          for (let i in this.state.allData.questionData){
              let questionTitle=this.state.allData.questionData[i].video_feature_name+". "+this.state.allData.questionData[i].video_feature_title;

              let imageLink= JSON.stringify(this.state.allData.questionData[i]) != '{}'
                  ? this.state.allData.questionData[i].video_file_link :
                  "-";

              let arr = []
              arr.push(questionTitle,imageLink)
              csvData.push(arr)
          }
          this.setState({csvData:csvData})

      }
}


    downloadCSV = () => {
      this.setState({visibleCSV:false})
      setTimeout(() => {
        this.downloadImageLink.link.click();
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


  checkLoader = (loadingState) => {
    this.setState({loading: loadingState})
  }
  
  openPopover=()=>{
    this.setState({visibleCSV:!this.state.visibleCSV})
  }


  render() {
    let questionTitle=this.props.data.questionNumber+" "+this.props.data.questionName;
    let fileName=questionTitle.substring(0, 30)+"_"+this.formattedCSVFileDate();
    return (
      <>
      {this.props.isSkeleton ?
        <div className={"image-card-skeleton"}>
        <Skeleton
          variant="text"
          width={"100%"}
          style={{ marginBottom: 20 }}
        />
        <div style={{ display: "flex" }}>
          <div style={{ marginRight: 10 }}>
            <Skeleton
              variant="react"
              width={120}
              height={120}
              style={{ borderRadius: 5 }}
            />
            </div>
            </div>
            </div>
      :
      <Grid container style={{marginBottom:20}}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Card className={"div-padd video-grid-card"}>
          <Grid container>
            <Grid item xs={12} md={11} lg={11} sm={12} className={"videotitle "}>
                <Tooltip title={questionTitle} placement="bottom-start" style={{cursor:'default'}}>
                    <Typography className={"videotitle grid-question-title mb-15"}>
                        {this.props.data.questionNumber ? this.props.data.questionNumber : ""} {this.props.data.questionName ? this.props.data.questionName : ""}
                    </Typography>
                  </Tooltip>
            </Grid>
            <Grid item xs={12} md={1} lg={1} sm={12} style={{textAlign: "right",paddingRight:"25px"}}>
              <Sorting
                openPopover={()=>{this.openPopover()}}
                visibleCSV={this.state.visibleCSV}
                csvExport={()=>{this.downloadCSV()}}
              />
            </Grid>
            <CSVLink data={this.state.csvData}
                filename={fileName + ".csv"}
                target="_blank"
                ref={(r) => (this.downloadImageLink = r)}/>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} style={{display:'flex',flexWrap:"wrap"}}>
            {/* <div className={"photoCollagedorm"}> */}
              {this.props.data.questionData &&
                this.props.data.questionData.map((item, index) => {
                  return (
                    <>
                    {this.props.isVideo ?
                    <VideoCard data={item} checkLoader={(loadingState)=> this.checkLoader(loadingState)} isVideoDetails={true} checked={this.props.checked} showVideoPage={()=>{this.props.showVideoPage(item._id.$oid)}}></VideoCard>
                  :
                  <VideoCard data={item} isVideoDetails={false} checked={this.props.checked}></VideoCard>
                  }
                  
                  </>
                  );
                })}
              {/* <img src={profileIconLarge}></img> */}
            {/* </div> */}
          </Grid>
        </Card>
      </Grid>
    </Grid>
   
      }
        <div className={ this.state.loading ? 'fullPageLoader blur-background' : ''}>
          {this.state.loading && <AuthLoader />}
        </div>
      </>
    );
  }
}

export default PhotoCollegeDorm;