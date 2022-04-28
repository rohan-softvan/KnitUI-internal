import React, { Component } from "react";
import withWidth from "@material-ui/core/withWidth";
import { Grid, Typography } from "@material-ui/core";
import "../../../css/common.scss";
import SearchComponent from "../../../components/searchFilter/SearchFilter";
import Color from "../../../config/Color";
import videogridviewfill from "../../../../assets/images/videos/GridViewSelected.svg";
import videogridview from "../../../../assets/images/videos/GridViewUnselected.svg";
import videolistview from "../../../../assets/images/videos/ListViewUnselected.svg";
import videolistviewfill from "../../../../assets/images/videos/ListViewSelected.svg";
import SelectComponent from "../../../components/select/Select";
import PhotoCollegeDorm from "../../../components/photoCollegeDorm/PhotoCollegeDorm";
import "./Videos.scss";
import VideoDetails from "../VideoDetails/VideoDetails";
import VideoTable from "../VideoTable/VideoTable";
import ButtonComponent from "../../../components/button/Button";
import CheckIcon from "@material-ui/icons/Check";
import { getGridViewVideoData,actionDropdown,applySearchFilterForVideo } from "../../../services/VideoService";
import Skeleton from "@material-ui/lab/Skeleton";
import ChipText from "../../../components/common/ChipText";
import {CSVLink} from "react-csv/lib";
import AuthLoader from "../../../components/authLoader/Loader";
import {withRouter} from "react-router-dom";
import PageWrapper from "../../PageWrapper/PageWrapper";
import "../../../css/common.scss";
import DeleteModel from "../../../components/deleteModal/DeleteModel"

let menu=[
  {
    title: "Delete",
    value:"is_deleted",
    key: 1,
  },
  {
    title: "Export as CSV",
    value: "export_csv",
    key: 2,
  }
]


const styles = {
  moreVertIcon: {
    "&:active": {
      backgroundColor: Color.lightGreyShadow,
    },
    borderRadius: 6,
    cursor: "pointer",
  },
};
let id = 0;

function epochToDate(epoch) {
  let date;
  if (epoch.toString().length > 10) {
      date = new Date(epoch);
  } else {
      date = new Date(epoch * 1000);
  }
   return date.getUTCFullYear() + "/" + addZero(date.getUTCMonth() + 1) + "/" + addZero(date.getUTCDate())
}


function addZero(data) {
  if (data < 10) {
      data = "0" + data
  }
  return data;
}


const formattedCSVFileDate = () => {
  let dateObj= new Date();
  let month = addZero(dateObj.getMonth() + 1);
  let date = addZero(dateObj.getDate());
  let hours = addZero(dateObj.getHours());
  let minutes = addZero(dateObj.getMinutes());
  return month + "-" + date + "-" + hours + minutes;
}


const getFormattedCSVFileName = (projectTitle) => {
  let formattedProjectTitle = projectTitle ? projectTitle.split(' ').join('_'): "";
  let formattedDate = formattedCSVFileDate();
  return formattedProjectTitle + "_" + formattedDate
}


function getQueryStringValue() {
  // return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
  return window.location.href.split('/')[5];
}
function getListStringValue() {

// return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));


  return window.location.href.split('=')[1];

}
//const { path } = this.props.match;
class Videos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isGridView: true,
      isListView: false,
      isVideoPage: true,
      isVideoDetailPage: false,
      totalChecked: 0,
      VideoTableData: [],
      isSelectAll: false,
      isDeselectAll: false,
      isVideoCardLoad: false,
      selectedList:[],
      count:0,
      filteredData:[],
      totalAppliedFilter:0,
      videoCSVData: [],
      loading: false,
      deleteModalOpen:false,
      description:"",
      projectTitle:"",
      videoFileName: "",
    };
    this.responseLink = React.createRef();
  }

  componentDidMount() {
//redirect on the video detail page.
    if(localStorage.getItem("projectTitle")){
      this.setState({projectTitle:localStorage.getItem("projectTitle")})
    }
    let viewName = getListStringValue();
    if(viewName == 'list'){

      this.setState({isListView:true, videopageView:"list"})
      this.setState({isGridView:false})
    }else{
      this.setState({isGridView:true, videopageView:"grid"})
      this.setState({isListView:false})
    }

    if (window.location.href.split('/')[7] != undefined){
      this.setState({
        isVideoDetailPage: true,
        isVideoPage:false
      })
      //this.showVideoPage();
    }

    let projectId = getQueryStringValue()
    if(projectId){
        this.setState({projectId:projectId},()=>{
          if(this.props.videoId){
            this.getData(this.props.questionId,this.props.videoId)
      
            this.showVideoPage(this.props.videoId)
          }else{
            this.getData();
            this.getTotalChecked();
          }
      
        })
    }

    // let projectTitle;
    // projectTitle = 'projectTitle' in this.props ? this.props.projectTitle : ""
    // this.setState({ projectTitle : projectTitle});





  //this.getDataBySearchFilter("data");
 //this.myFunction()
  }
  myFunction=()=> {
    //this.props.history.push("/knit/projects-details?tab=2");
    const { history } = this.props;
    history.push({
      pathname: "/knit/projects-details",
      hash: 'Videos',
      state: {
        projectId: this.state.projectId,
      }
    });
  }
  //get List View Video Data
  getData = (questionId,videoId) => {
    this.setState({ isVideoCardLoad: true });
    // let user_data = {
      // is_gallery: true,
      // knit_project_id: "6100fa772b9e8d00018bc931",
    //   knit_project_id:"6108e828e6e53c0001835169"
    // };

    // let knitProjectId="60d99ded5b3c976f913201ee"
    // let knitProjectId="6108e828e6e53c0001835169"
    let knitProjectId=this.state.projectId;

    let user_data={
      "knit_project_id":this.state.projectId
    }
    getGridViewVideoData(user_data).then((response) => {
      let videoCSVData = [];
      let VideoTableData = [];
      let count=0;
      if (response.data) {
        for (let i in response.data) {
          VideoTableData.push({
            questionName: response.data[i]._id.video_feature_title,
            questionId: response.data[i]._id.video_feature_id,
            questionNumber: response.data[i]._id.video_feature_name,
            questionData: response.data[i].data,
          });
          count=count+response.data[i].count;
        }
      }
      this.setState({ VideoTableData: VideoTableData, isVideoCardLoad: false ,count:count,
        videoCSVData: videoCSVData},()=>{
        if(videoId && questionId){
          this.getVideoData(questionId,videoId);
        }
      });
    });
  };

  //get List View Video Data by search filter
  getDataBySearchFilter = (data,searchText,subThemeName,tagListName,themeNameList) => {
    this.setState({subThemeName:subThemeName,tagListName:tagListName,themeNameList:themeNameList})
    this.setState({filteredData:data,isVideoCardLoad: true,totalAppliedFilter:data.length });
    let search_data={};
    let flag=false;

    if(searchText){
      flag=true;
      search_data = {
        "knit_project_id": this.state.projectId,
        "search_by": searchText,
        "is_filter": true,
        "is_video": true,
        //"question_id": "QID17",
        "filter": data
      }

    }
    if(data.length>0){
      flag=true;
      search_data = {
        "knit_project_id": this.state.projectId,
        "is_filter": true,
        "is_video": true,
        //"question_id": "QID17",
        "filter": data
      }
    }
    if (searchText && data.length>0){
      flag=true;
      search_data = {
        "knit_project_id": this.state.projectId,
        "search_by": searchText,
        "is_filter": true,
        "is_video": true,
        //"question_id": "QID17",
        "filter": data
      }
    }


    if(flag){
      applySearchFilterForVideo(search_data).then((response) => {

        if (response.data) {
        }
  
        let VideoTableData = [];
        let count=0;
        if (response.data) {
          for (let i in response.data) {
            VideoTableData.push({
              questionName: response.data[i]._id.video_feature_title,
              questionId: response.data[i]._id.video_feature_id,
              questionNumber: response.data[i]._id.video_feature_name,
              questionData: response.data[i].data,
            });
            count=count+response.data[i].count;
          }
        }
  
        this.setState({ VideoTableData: VideoTableData, isVideoCardLoad: false ,count:count},()=>{
  
  
        });
      });
    }else{
      this.getData()
    }
   
  };


  //to get particular Video response from the question Id
  getVideoData = (id, videoId) => {
    let videoQuestionData = this.state.VideoTableData.filter(
      (el) => el.questionId == id
    );
    for (let i in videoQuestionData[0].questionData) {  
      if (videoQuestionData[0].questionData[i]._id.$oid == videoId) {
        this.setState({
          videoLink: videoQuestionData[0].questionData[i].video_file_link,
          videoFileName:videoQuestionData[0].questionData[i].video_file_name
        });
      }
    }
    this.setState({ videoQuestionData: videoQuestionData });
  };

  handleAction=(e)=>{
    if (e.target.value === 'export_csv') {
      this.responseLink.link.click();
    }
    else if(e.target.value){
      this.setState({deleteModalOpen:true})

    }

    this.setState({menuValue:e.target.value}, () => {
      if (e.target.value === 'export_csv') {
        let VideoTableData = this.state.VideoTableData;
        VideoTableData = VideoTableData.length > 0 ? VideoTableData.map(videoDetails => {
          Array.isArray(videoDetails.questionData) &&
          videoDetails.questionData.length > 0 &&
          videoDetails.questionData.forEach(video => {
            if ('isChecked' in video) {
              delete video['isChecked'];
            }
          })
          return videoDetails;
        }) : VideoTableData
        this.setState({ menuValue: 0, selectedList: [], totalChecked: 0, VideoTableData: VideoTableData });
      }
    })
  }
  

  handleDeleteVideos=()=>{
    this.setState({deleteModalOpen:false})
    let user_data = {
      "knit_video_resp_id_list":this.state.selectedList,
      "is_deleted": true
    };

    actionDropdown(user_data).then((response) => {
      if(response.status_code == 200 && response.success == true){
        this.setState({menuValue:0,selectedList: [], totalChecked: 0,})
        this.getData()
      }
    })
  }
  showGridView = () => {
    this.setState({
      isGridView: false,
      isListView: true,
      videopageView:"list"
    },()=>{
      this.props.history.push({

        pathname: "/knit/projectsDetails/"+this.state.projectId+"/Video?view=list"

      })
    });
  };

  showTableView = () => {
    this.setState({
      isGridView: true,
      isListView: false,
      videopageView:"grid"
    },()=>{
      this.props.history.push({

        pathname: "/knit/projectsDetails/"+this.state.projectId+"/Video?view=grid"

      })
    });
  };

  showVideoPage = (videoId) => {

    if(videoId){
      this.setState({
        isVideoPage: !this.state.isVideoPage,
        isVideoDetailPage: !this.state.isVideoDetailPage,
        videoId: videoId,
      },()=>{
        this.handleChangeVideoDetail(2,videoId)
      });
//       const { history } = this.props;
//       history.push({
//         pathname: "/knit/projectsDetails/"+this.state.projectId+"/Video/"+videoId,
//         state: {
//           projectId:this.state.projectId,
//           videoLink:this.state.videoLink,
//           videoData:this.state.videoQuestionData,
//           videoId:this.state.videoId,
//           videoFileName:this.state.videoFileName
//         }
//       });
    }else{

      this.setState({
        isVideoPage: !this.state.isVideoPage,
        isVideoDetailPage: !this.state.isVideoDetailPage,
        videoId: "",
      });
  
    }




      };

  handleChecked = (data) => {
    let {selectedList}=this.state;
    data.isChecked = !data.isChecked;
    if(data.isChecked){
      selectedList.push(data._id.$oid)
    }else{
      selectedList = selectedList.filter(el => el != data._id.$oid)
    }
    this.setState({ VideoTableData: this.state.VideoTableData,selectedList }, () => {
      this.getTotalChecked();
      let videoCSVData = [];
      this.state.VideoTableData.forEach(videoQuestionData => {
        let question = [videoQuestionData.questionNumber + ' ' + videoQuestionData.questionName];
        let difference = videoQuestionData.questionData.filter(x => this.state.selectedList.includes(x._id.$oid));
        if (difference.length > 0) {
          videoCSVData.push(question);
        }
        let videoData = [];
        videoQuestionData.questionData.forEach(video => {
          if (this.state.selectedList.includes(video._id.$oid)) {
            // videoData.push(video.video_file_link);
            videoCSVData.push([video.video_file_link]);
          }
        });
        // videoCSVData.push(videoData);
        videoCSVData.push([]);
      });
      this.setState({ videoCSVData: videoCSVData })
    });
  };

  getTotalChecked = () => {
    let total = 0;
    for(let i in this.state.VideoTableData){
      for(let j in this.state.VideoTableData[i].questionData){
          if(this.state.VideoTableData[i].questionData[j].isChecked){
            total+=1;
          }

      }
      }
      this.setState({ totalChecked: total });
    
  };

  videoCSVDownloadBtn = (videoPropsData) => {
    let videoCSVData = [];
    let question = [videoPropsData.questionNumber + ' ' + videoPropsData.questionName];
    videoCSVData.push(question);
    videoPropsData.questionData.forEach(video => {
        videoCSVData.push([video.video_file_link]);
    });
    videoCSVData.push([]);
    let outetThis = this;
    this.setState({loading: true})
    this.setState({ videoCSVData }, () => setTimeout(() => {
      outetThis.responseLink.link.click()
    this.setState({loading: false})}, 3000))
    };

  selectAll = () => {
    let selectedList=[]
    let { VideoTableData } = this.state;
    for(let i in this.state.VideoTableData){
      for(let j in this.state.VideoTableData[i].questionData){
      if (!this.state.isSelectAll) {
        this.state.VideoTableData[i].questionData[j].isChecked = true;
        selectedList.push( this.state.VideoTableData[i].questionData[j]._id.$oid)
      } else {
        this.state.VideoTableData[i].questionData[j].isChecked = false;
      }
    }
  }
    this.setState(
      { VideoTableData: VideoTableData, isSelectAll: !this.state.isSelectAll,selectedList },
      () => {
        this.getTotalChecked();
        // let videoCSVData = [];
        // this.state.VideoTableData.forEach(videoQuestionData => {
        //   let question = [videoQuestionData.questionNumber + ' ' + videoQuestionData.questionName];
        //   videoCSVData.push(question);
        //   let videoData = [];
        //   videoQuestionData.questionData.forEach(video => {
        //     if (this.state.selectedList.includes(video._id.$oid)) {
        //       videoData.push(video.video_file_link);
        //     }
        //   });
        //   videoCSVData.push(videoData);
        //   videoCSVData.push([]);
        // });
        // this.setState({ videoCSVData })
        let videoCSVData = [];
        this.state.VideoTableData.forEach(videoQuestionData => {
          let question = [videoQuestionData.questionNumber + ' ' + videoQuestionData.questionName];
          let difference = videoQuestionData.questionData.filter(x => this.state.selectedList.includes(x._id.$oid));
          if (difference.length > 0) {
            videoCSVData.push(question);
          }
          let videoData = [];
          videoQuestionData.questionData.forEach(video => {
            if (this.state.selectedList.includes(video._id.$oid)) {
              // videoData.push(video.video_file_link);
              videoCSVData.push([video.video_file_link]);
            }
          });
          // videoCSVData.push(videoData);
          videoCSVData.push([]);
        });
        this.setState({ videoCSVData: videoCSVData })
      }
    );
  };


  renderTitle = () => {
    return (
      <Grid container spacing={1} style={{marginBottom:30}}>
        <Grid item xs={12} md={12} lg={2} sm={2}>
          <Typography variant={"h6"} component={"h6"} className={"title-class"}>
            VIDEOS
          </Typography>
          <Typography className={"subTitle"}>
            Showing {this.state.count} Videos
          </Typography>
        </Grid>
        <Grid item xs={12} md={12} lg={10} sm={10} className={"buttonDiv sub-div-header"}>
          {this.state.totalChecked > 0 && (
            <>
              <ButtonComponent
                iconPosition={"left"}
                icon={<CheckIcon></CheckIcon>}
                text={"Select All"}
                width={"auto"}
                fontWeight={500}
                margin={"0px 20px 0px 0px"}
                bgColor={"transparent"}
                color={Color.primary}
                boxShadow={"none"}
                onClick={() => {
                  this.selectAll();
                }}
              />
              <SelectComponent menu={menu} handleChange={(e)=>{this.handleAction(e)}} menuValue={this.state.menuValue}></SelectComponent>
            </>
          )}

          <SearchComponent projectId={this.state.projectId}
            totalCount={this.state.totalAppliedFilter}
            filteredData={this.state.filteredData}
            removedData={this.state.removedDataState}
          onSearch={(data,searchText,subThemeName,tagListName,themeNameList)=>{this.getDataBySearchFilter(data,searchText,subThemeName,tagListName,themeNameList);}} 
          onClear={()=>{this.setState({totalAppliedFilter:0});this.getData()}}></SearchComponent>
          {this.state.videoCSVData &&
          Array.isArray(this.state.videoCSVData) &&
          this.state.videoCSVData.length > 0 &&
          <CSVLink
              style={{ textDecoration: "none"}}
              data={this.state.videoCSVData}
              filename={`${getFormattedCSVFileName(this.state.projectTitle)}.csv`}
              target="_blank"
              ref={(r) => (this.responseLink = r)}></CSVLink> }
          <div style={{ marginLeft: 20, height: 30 }}>
            {this.state.isGridView ? (
              <img
                src={videogridviewfill}
                className={"icon cursor"}
                style={{ margin: 5 }}
                onClick={() => {
                  this.showTableView();
                }}
              ></img>
            ) : (
              <img
                src={videogridview}
                className={"icon cursor"}
                style={{ margin: 5 }}
                onClick={() => {
                  this.showTableView();
                }}
              ></img>
            )}
            {this.state.isListView ? (
              <img
                src={videolistviewfill}
                className={"icon cursor"}
                style={{ margin: 5 }}
                onClick={() => {
                  this.showGridView();
                }}
              ></img>
            ) : (
              <img
                src={videolistview}
                className={"icon cursor"}
                style={{ margin: 5 }}
                onClick={() => {
                  this.showGridView();
                }}
              ></img>
            )}
          </div>
        </Grid>
        <Grid item xs={12} md={12} lg={12} sm={12}></Grid>
      </Grid>
    );
  };

  renderVideo = () => {
    return (
      <Grid container>
        <Grid item xs={12} md={12} sm={12} lg={12}>
          {this.state.isGridView && (
            <>
              {this.state.isVideoCardLoad && (
                <>
                  <div className={"videocard-skeleton"}>
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
                        <Skeleton variant="text" width={120} className={"mt-20"} />
                        <Skeleton variant="text" width={120} />
                        <Skeleton variant="text" width={120} />
                      </div>
                      <div style={{ marginRight: 10 }}>
                        <Skeleton
                          variant="react"
                          width={120}
                          height={120}
                          style={{ borderRadius: 5 }}
                        />
                        <Skeleton variant="text" width={120}  className={"mt-20"}/>
                        <Skeleton variant="text" width={120} />
                        <Skeleton variant="text" width={120} />
                      </div>
                    </div>
                  </div>
                  <div className={"videocard-skeleton"}>
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
                        <Skeleton variant="text" width={120}  className={"mt-20"}/>
                        <Skeleton variant="text" width={120} />
                        <Skeleton variant="text" width={120} />
                      </div>
                      <div style={{ marginRight: 10 }}>
                        <Skeleton
                          variant="react"
                          width={120}
                          height={120}
                          style={{ borderRadius: 5 }}
                        />
                        <Skeleton variant="text" width={120}  className={"mt-20"}/>
                        <Skeleton variant="text" width={120} />
                        <Skeleton variant="text" width={120} />
                      </div>
                    </div>
                  </div>
                </>
              )}
              {this.state.VideoTableData &&
                this.state.VideoTableData.map((item, index) => {
                  return (
                    <PhotoCollegeDorm
                      videoCSVDownloadBtn = {this.videoCSVDownloadBtn}
                      data={item}
                      isVideoDetails={true}
                      isVideo={true}
                      checked={this.handleChecked}
                      showVideoPage={(id) => {
                        this.showVideoPage(id);
                        this.getVideoData(item.questionId, id);
                      }}
                    ></PhotoCollegeDorm>
                  );
                })}
            </>
          )}
          {this.state.isListView && (
            <>
              {this.state.isVideoCardLoad && (
                <>
                  <div className={"videocard-list-skeleton"}>
                    <Skeleton
                      variant="text"
                      width={"100%"}
                      style={{ marginBottom: 20 }}
                    />
                    
                      <div style={{ marginRight: 10,display:"flex",marginTop:40 }}>
                        <div>
                        <Skeleton
                          variant="react"
                          width={60}
                          height={60}
                          style={{ borderRadius: 5 }}
                        />
                        </div>
                        <div style={{marginLeft:20}}>
                              <Skeleton variant="text" width={120} height={20}/>
                              <Skeleton variant="text" width={120} height={20}/>
                              <Skeleton variant="text" width={120} height={20}/>
                        </div>
                        <div style={{marginLeft:20,width:"100%"}}>
                          <Skeleton variant={"text"} width={"100%"}></Skeleton>
                          <Skeleton variant={"text"} width={"100%"}></Skeleton>
                          <Skeleton variant={"text"} width={"100%"}></Skeleton>
                        </div>
                      </div>
                      
                    </div>
                    <div className={"videocard-list-skeleton"}>
                    <Skeleton
                      variant="text"
                      width={"100%"}
                      style={{ marginBottom: 20 }}
                    />
                    
                      <div style={{ marginRight: 10,display:"flex",marginTop:40  }}>
                        <div>
                        <Skeleton
                          variant="react"
                          width={60}
                          height={60}
                          style={{ borderRadius: 5 }}
                        />
                        </div>
                        <div style={{marginLeft:20}}>
                              <Skeleton variant="text" width={120} height={20}/>
                              <Skeleton variant="text" width={120} height={20}/>
                              <Skeleton variant="text" width={120} height={20}/>
                        </div>
                        <div style={{marginLeft:20,width:"100%"}}>
                          <Skeleton variant={"text"} width={"100%"}></Skeleton>
                          <Skeleton variant={"text"} width={"100%"}></Skeleton>
                          <Skeleton variant={"text"} width={"100%"}></Skeleton>
                        </div>
                      </div>
                      
                    </div>
                    
                </>
              )}
              {this.state.VideoTableData &&
                this.state.VideoTableData.map((item, index) => {
                  return (
                    <VideoTable
                      Tabledata={item}
                      isVideoDetails={true}
                      checked={this.handleChecked}
                      projectTitle = {this.state.projectTitle}
                      showVideoPage={(id) => {
                        this.showVideoPage(id);
                        this.getVideoData(item.questionId, id);
                      }}
                    ></VideoTable>
                  );
                })}
            </>
          )}
        </Grid>
      </Grid>
    );
  };

  renderFilterApplied=()=>{
    let mainDataList=[]
    if(this.state.filteredData){
      mainDataList=this.state.filteredData
    }
    return(
      <Grid container>
        <Grid item xs={12} md={12} sm={12} lg={12} className={"flex"} style={{alignItems:'center',paddingBottom: 30}}>
          <div>
            {this.state.filteredData && this.state.filteredData.length>0 && <Typography className={"subTitle"} style={{paddingRight: 10}}>Filters applied:</Typography>}
            </div>
            <div style={{width: "calc(100% - 100px)",display: "flex",flexWrap: "wrap"}} >
            {this.state.filteredData && this.state.filteredData.map((item,index)=>{
              let mainFilterName="";
              if(item.is_video_duration){
                  if(item.start_range == 0 && item.end_range){
                    mainFilterName= "Duration : null" +"-"+ (item.end_range ? item.end_range + "" :null);
                  } 
                  if(item.start_range && item.end_range == 0){
                    mainFilterName= "Duration : " + (item.start_range ? item.start_range + " - max" :null);
                  }
                  if(item.start_range && item.end_range){
                    mainFilterName= "Duration : "+item.start_range+"-"+ item.end_range+ ""
                  }
                }
                if(item.is_response_datetime){  
                    mainFilterName= "Date :" + (item.start_date ? epochToDate(item.start_date) :null) +"-"+ (item.end_date ? epochToDate(item.end_date) :null);
                }
                if(item.hasOwnProperty("is_favourite")){
                  item.is_favourite == true ? 
                  mainFilterName= "Starred"
                  :
                  mainFilterName= "Not Starred" 
                }
                if(typeof item.filter_request == 'string'){
                  mainFilterName=  item.filter_request
                }
                if(this.state.themeNameList && item.type == "THEMES"){
                  let newThemeName=[];
                  newThemeName=this.state.themeNameList.filter(el => el.id == item.filter_request);
                  if(newThemeName.length <= 0){
                    newThemeName=this.state.subThemeName.filter(el => el.id == item.filter_request);
                  }
                  mainFilterName=newThemeName[0].name
                }
                if(item.type == "TAGS"){
                  let newThemeName=[];
                  newThemeName=this.state.tagListName.filter(el => el.id == item.filter_request);
                  mainFilterName=newThemeName[0].name
                }
              //  if(item.generic){
              //   mainFilterName=item.filter_request
              //  }
               
               return(
                 <>
                {/* !item.is_video_themes  ?  */}
                {
                Array.isArray(item.filter_request) ?
                item.filter_request && item.filter_request.map((data,index)=>{
                  return(
                    <ChipText text={data} key={index} height={25} onClose={()=>{this.handleRemove(data,item)}} >
                        </ChipText>
                      )})
                      : item.generic_data_type == "INTEGER" ?
                          <ChipText text={item.filter_request ? item.filter_request.start_range+"-"+item.filter_request.end_range : ""} height={25} onClose={()=>{this.handleRemove(item)}}>
                          </ChipText>
                      :
                      <ChipText text={mainFilterName ? mainFilterName : "-"} height={25} onClose={()=>{this.handleRemove(item)}}>
                  </ChipText>
                }
                </>
            );
          }) 
        }
         </div>
        </Grid>
      </Grid>
    )
  }

  handleRemove=(data,type)=>{
    let removedDataState = this.state.removedDataState || [];
    removedDataState.push(data);
    this.setState({removedDataState},()=>{
      document.dispatchEvent(new CustomEvent("create_remove_delete", {
        detail: { removedDataState }
      }))

    })
    
    let newObject=this.state.filteredData
    this.setState({removedDataState: removedDataState,filteredData:[]})
    if(type){
        
        
        for(let i in this.state.filteredData){
            if(JSON.stringify(this.state.filteredData[i]) != JSON.stringify(data)){
              let newList=type.filter_request.filter(el => el != data);
              type.filter_request=newList;
              // if(Array.isArray(type.filter_request) && type.filter_request.length>0){
              //   newObject.push(type)
              // }
            }
          }

      //   let newList=type.filter_request.filter(el => el != data);
      //   type.filter_request=newList;
      //   if(type.is_sentiment){
      //     newObject= this.state.filteredData.filter(el => el.numeric_question_id != type.numeric_question_id && el.is_sentiment == type.is_sentiment);
      //   }
      //   if(type.is_transcript){
      //     newObject= this.state.filteredData.filter(el => el.numeric_question_id != type.numeric_question_id && el.is_transcript == type.is_transcript);
      //   }
        
      // if(Array.isArray(type.filter_request) && type.filter_request.length>0){
      //   newObject.push(type)
      // }

      }else{
        // for(let i in this.state.filteredData){
          newObject=this.state.filteredData.filter(el => JSON.stringify(el) != JSON.stringify(data));
          //   if(JSON.stringify(this.state.filteredData[i]) != JSON.stringify(data)){
          //     newObject.push(this.state.filteredData[i])
          // }
          // }
      }
      let mainFilterList=[];
      for(let i in newObject){
        if(Array.isArray(newObject[i].filter_request)){
          if(newObject[i].filter_request.length > 0){
            mainFilterList.push(newObject[i])
          }
        }else if(newObject[i].filter_request != null){
          mainFilterList.push(newObject[i])
        }else if(!newObject[i].hasOwnProperty("filter_request")){
          mainFilterList.push(newObject[i])
        }
        
      }
    this.setState({filteredData:mainFilterList,totalAppliedFilter:mainFilterList.length},()=>{
            this.getDataBySearchFilter(this.state.filteredData,this.state.searchText,this.state.subThemeName,this.state.tagListName,this.state.themeNameList)
    })

  }
  handleChangeVideoDetail=(value,id)=>{
    // if(id){
    //   this.handleVideoDetails(id)
    // }
    // localStorage.setItem("videoId", id);
    // this.setState({
    //     activePage:value,
    //     videoId:id,
    //     questionId:questionId
    // })
    return(
        <div>
          {value == 1 ?
              this.props.history.push({
                pathname: "/knit/projectsDetails/"+this.state.projectId+"/Data?view=list"
              })
              : value == 1 ?
                  this.props.history.push({
                      pathname: "/knit/projectsDetails/"+this.props.location.state.projectid+"/Data?view=grid"
                  })
              : value == 2 ?
                  this.props.history.push({
                    pathname: "/knit/projectsDetails/"+this.state.projectId+"/Video?view="+this.state.videopageView+"/"+id
                  })
                      : value == 2 ?
                          this.props.history.push({
                            pathname: "/knit/projectsDetails/"+this.state.projectId+"/Video?view=grid"
                          })
                          : value == 2 ?
                              this.props.history.push({
                                pathname: "/knit/projectsDetails/"+this.state.projectId+"/Video?view=list"
                              })
                  : value == 3 ?
                      this.props.history.push({
                        pathname: "/knit/projectsDetails/"+this.state.projectId+"/ShowReels"
                      })
                      : value == 4 ?
                          this.props.history.push({
                            pathname: "/knit/projectsDetails/"+this.state.projectId+"/Themes"
                          })
                          :<></>
          }

        </div>
    )

  }

  handleRouteChange=(value,id,questionId)=>{
    // if(id){
    //   this.handleVideoDetails(id)
    // }
    // localStorage.setItem("videoId", id);
    // this.setState({
    //     activePage:value,
    //     videoId:id,
    //     questionId:questionId
    // })
    return(
        <div>
          {value == 1 ?
              this.props.history.push({
                pathname: "/knit/projectsDetails/"+this.state.projectId+"/Data?view=list"
              })
              : value == 1 ?
                  this.props.history.push({
                      pathname: "/knit/projectsDetails/"+this.props.location.state.projectid+"/Data?view=grid"
                  })
                  : value == 2 ?
                      this.props.history.push({
                        pathname: "/knit/projectsDetails/"+this.state.projectId+"/Video?view=list"
                      })
                      : value == 2 ?
                          this.props.history.push({
                            pathname: "/knit/projectsDetails/"+this.state.projectId+"/Video?view=grid"
                          })
                      : value == 2 ?
                          this.props.history.push({
                              pathname: "/knit/projectsDetails/"+id+"/Video/:id"
                          })
                  : value == 3 ?
                      this.props.history.push({
                        pathname: "/knit/projectsDetails/"+this.state.projectId+"/ShowReels"
                      })
                      : value == 4 ?
                          this.props.history.push({
                            pathname: "/knit/projectsDetails/"+this.state.projectId+"/Themes"
                          })
                          :<></>
          }

        </div>
    )

  }

  componentWillMount() {
    this.unlisten = this.props.history.listen((location, action) => {
        if (window.location.href.split('/')[7] === undefined){
            this.setState({
                isVideoDetailPage: false,
              isVideoPage:true
            })
          //this.showVideoPage();
        }
        else {
          this.setState({
            isVideoDetailPage: "",
            isVideoPage:"",
            videoId:""
          },()=>{
            this.setState({
              isVideoDetailPage: true,
              isVideoPage:false,
              videoId:window.location.href.split('/')[7]
            })
          })



        }
    });
  }
  componentWillUnmount() {
    this.unlisten();
  }

    urlFunction =()=>{
        if (window.location.href.split('/')[7] === undefined){
                  this.setState({
                    isVideoDetailPage: false
                  })
        }
    }

    
  deleteModalClose = () => {
    this.setState({
      menuValue:0,
      deleteModalOpen: false,
  });
  }


  render() {
    const { path } = this.props.match;
    let description="";
    if(this.state.selectedList.length > 1){
        description="Are you sure you want to delete the "+this.state.selectedList.length+" videos you selected" +
      "? Once you delete a videos, any tags or analysis associated with the videos will be deleted too. This action cannot be undone."
    }else{
        description="Are you sure you want to delete the video you selected" +
      "? Once you delete a video, any tags or analysis associated with the video will be deleted too. This action cannot be undone."
    }
    return (
        <PageWrapper selected={1} selectedId={2} isSidebar={true} projectId={this.state.projectId}>
          <div style={{width: "100%" }}>
            {/* <SideBar
                width={this.props.width}
                // projectTitle={this.props.location.state.projectTitle}
                 onHandleChange={(id)=>{this.handleRouteChange(id,this.state.projectId)}}
                // onHandleChange={(id)=>{handleChange(id,this.props.location.state.projectid )}}
                selectedId={2}></SideBar> */}
            <div style={{width: "calc(100% - 180px)",overflow: "overlay",float: "right",background: "#FBFBFB" }}>
      <div className={"main-class"}>
        {this.state.isVideoPage && (
          <>
            {this.renderTitle()}
            {this.state.totalAppliedFilter != 0 && 
                this.renderFilterApplied()
              }
            {this.renderVideo()}
          </>
        )}
        {this.state.isVideoDetailPage && (
          <VideoDetails
            handleBack={() => {
              this.showVideoPage();
            }}
            //onHandleChange={(id)=>{this.handleChangeVideoDetail(id,this.state.projectId)}}
            projectId={this.state.projectId}
            videoLink={this.state.videoLink}
            videoData={this.state.videoQuestionData}
            videoId={this.state.videoId}
            videoFileName={this.state.videoFileName}
          ></VideoDetails>
        )}
           {this.state.deleteModalOpen &&
          <DeleteModel open={this.state.deleteModalOpen}
           onHandleClose={()=>{this.deleteModalClose()}}
           onHandleRemove={()=>{this.handleDeleteVideos()}} description={description}></DeleteModel>
        }
        <div className={ this.state.loading ? 'fullPageLoader blur-background' : ''}>
          {this.state.loading && <AuthLoader />}
        </div>
      </div>
            </div>
            {/* <Members></Members> */}
          </div>
        </PageWrapper>
    );
  }
}
export default withWidth()(withRouter(Videos));