import React, { Component } from "react";
import { Grid, Typography, Card, TextField } from "@material-ui/core";
import "../../../css/common.scss";
import BackArrow from "../../../../assets/images/project-details/BackArrow.svg";
import ShowReelPlaylist from "../../../components/showreelPlaylist/ShowreelPlaylist"
import ShowReelSnippets from "../../../components/ShowReelSnippets/ShowReelSnippets";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import "./ShowreelsDetails.scss"
import ReelEditor from "./ReelEditor";
import ReelSetting from "./ReelSetting";
import ReelPreviewExport from "./ReelPreviewExport";
import profileIcon from "../../../../assets/images/navbar/profile.png"
import {
  allReels, newShowReels, checkShowreelStatus,
  newShowReelTitle, updateShowReelTitle,
  showReelsDetails, ShowCheckedShowReel, subtitleConfigUpdation,
  UpdateShowReel, exportShowReel,highlightsConcatenation
} from "../../../services/ShowReelsService";
import * as events from "events";
import { refreshToken } from "../../../services/CommonService";
import Cookies from "universal-cookie";
import { getProjectData } from "../../../services/ProjectService";
import { ifError } from "assert";
import { Skeleton } from "@material-ui/lab";
import Fonts from "../../../config/FontConfig";
import { S3_UPLOAD } from "../../../Constants/index"
import { useHistory } from "react-router-dom";


function TabPanel(props) {
  const { children, value, index, postByFriends, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}>
      {value === index && (
        <Box >
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`
  };
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function goBack() {
  window.history.back()
}
function getQueryStringValue() {
  // return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
  return window.location.href.split('/')[5];
}
function getQueryStringValueId() {
  // return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
  return window.location.href.split('/')[7];
}
const cookie = new Cookies();
let highlightArray = [];
let timer;

class ShowreelsDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: 0,
      showReelData: [],
      videoReelTitle: "",
      editableVideoReelTitle: "",
      activeInput: true,
      selectedShowReelId: null,
      showReelPlaylistData: [],
      allVideoIds: [],
      videoHighlightLink: [],
      totalUntitleReels: 0,
      selectedShowReelDetails: null,
      videoDetailsList: [],
      selectedVideoList: [],
      showreelModalOpen: false,
      selectedText: "",
      isPlaylistLoad: false,
      snippetDetails: [],
      isHighlightGenerate: false,
      subTitleConfig: true,
      background: null,
      selectedFontName: '',
      selectedFontType: '',
      selectedFontSize: null,
      align: 'center',
      position: 'bottom',
      videoPlayListHighlight: [],
      highlightLink: '',
      HighlightReadyFlag:false,
      exportShowReelApiCall: false,
      editedVideoHighlight:[]
    }
    this.box = React.createRef();
    this.showTitlebox = React.createRef();
  }


  componentDidMount() {
    let userId = cookie.get("user_Id")
    localStorage.setItem("highlightsConcatenationFlag",true);
    let NewSelectedVideoList = localStorage.getItem("selectedVideoList")
    if (this.props.highlightVideoLink) {
      this.setState({ highlightLink: this.props.highlightVideoLink })
    }
    this.setState({ userId: userId })
    if (this.props.title) {
      this.setState({ videoReelTitle: this.props.title, activeInput: false })
    } else {
      this.setState({ videoReelTitle: localStorage.getItem("ShowReelTitle"), activeInput: false })
    }
    if (this.props.totalUntitleReels != null) {
      this.setState({ totalUntitleReels: this.props.totalUntitleReels })
    }
    let showreelId = getQueryStringValueId();
    if (this.props.showReelId) {
      this.setState({ selectedShowReelId: this.props.showReelId }, () => {
        this.getShowReelsDetails();
      })
    } else if (showreelId) {
      this.setState({ selectedShowReelId: showreelId }, () => {
        this.getShowReelsDetails();
      })
    }
    else {
      this.setState({ isPlaylistLoad: true })
    }
    refreshToken().then((data) => {
      cookie.set("csrf", data.idToken.jwtToken, { httpOnly: false, path: "/" });
    });
     let projectId = getQueryStringValue()

    if (this.props.projectId) {
      this.setState({ projectId: this.props.projectId })
    } else {
      this.setState({ projectId: projectId })
    }
  }

  getShowReelsDetails = () => {
    this.setState({ isPlaylistLoad: false })
    let requestBody = {
      "is_showreel_retrieval": true,
      "knit_project_showreels_id": this.state.selectedShowReelId,
    }
    showReelsDetails(requestBody).then(response => {
      if (response.data && response.data.length > 0) {
        let allVideoIds = [];
        let videoHighlightLink = [];
        let showReelPlaylistData = [];
        for (let i in response.data) {
          showReelPlaylistData.push({
            "id": response.data[i]._id.$oid,
            "title": response.data[i].video_file_name,
            "question": response.data[i].video_feature_title,
            "questionnumber": response.data[i].video_feature_id,
            "duration": response.data[i].original_video_duration,
            "imageLink": response.data[i].video_thumbnail_url,
            "videoLink": response.data[i].video_file_link,
            "videoHighlightLink": response.data[i].video_highlights_link,
            "knitVideoId": response.data[i].knit_video_responses_id.$oid
          })
          this.getVideoDetailsFromId(response.data[i]._id.$oid, response.data[i].video_highlights_link, response.data[i].video_file_link)

        }
        if (this.state.selectedShowReelDetails == undefined && this.state.selectedShowReelDetails == null) {
          this.setState({ selectedShowReelDetails: response.data[0]._id.$oid, videoHighlights: response.data[0].video_highlights_link })
        }
        this.setState({ showReelPlaylistData: showReelPlaylistData, allVideoIds, videoHighlightLink })
      }
      this.setState({ isPlaylistLoad: true })
    })


  }


  handleOutsideClick = (event) => {
    let titleDOM = document.getElementById('standard-helperText');
    let titleValue = titleDOM.value;
    if (titleValue != null && titleValue != "") {
      this.setState({ videoReelTitle: titleValue, activeInput: false }, () => {
        if (this.state.selectedShowReelId) {
          this.updateTitle();
        } else {
          this.getNewTitle();
        }

      });
    }
  }


  getVideoData = (data) => {
    let videoRequestData = {
      "is_exlcuded_videos": true,
      "knit_project_id": this.state.projectId
    }
    if (this.state.selectedShowReelId && this.state.selectedShowReelId !== "") {
      videoRequestData["knit_project_showreels_id"] = this.state.selectedShowReelId;
    }

    if (data != null && data != undefined) {
      videoRequestData["search_by"] = data;
    }


    newShowReels(videoRequestData).then((response) => {
      let videoPopupData = [];
      if (response.data) {
        this.setState({
          videoPopupData: response.data
        })
      }
    })
  }


  setSelectedListFromId = (id) => {
    let videoDetailsList = [];
    let showreelList = localStorage.getItem(this.state.selectedShowReelId);
    let newHighlightList=[]
    if (showreelList) {
      videoDetailsList = JSON.parse(showreelList)
      let newHighlightList=[]
      for(let i in videoDetailsList){
        for(let j in videoDetailsList[i].highlights){
          newHighlightList.push({
            details:videoDetailsList[i].highlights[j].details,
            id:videoDetailsList[i].highlights[j].id,
            numChars:videoDetailsList[i].highlights[j].numChars,
            selectedTagName:videoDetailsList[i].highlights[j].selectedTagName,
            startIndex:videoDetailsList[i].highlights[j].startIndex,
            videoId:videoDetailsList[i].videoId
          })
        }
      }
      this.setState({ videoDetailsList ,videoPlayListHighlight: newHighlightList})
    } else {
      videoDetailsList = this.state.videoDetailsList
    }
    this.setState({ value: 0 })
    let selectedVideoList = [];
    if (Array.isArray(videoDetailsList) && videoDetailsList.length > 0) {
      videoDetailsList && videoDetailsList.map(item => {
        if (item.videoId == this.state.selectedShowReelDetails) {
          selectedVideoList.push({
            transcript: item.transcript,
            videoId: item.videoId,
            highlights: item.highlights,
            details: item.details,
            videoLink: item.videoLink,
            highlightsLink: item.highlightsLink
          })
        }
      })
    }
    this.setState({ selectedVideoList: selectedVideoList })
  }

  getVideoDetailsFromId = (id, HighlightLink, videoLink) => {
    let { videoDetailsList, videoPlayListHighlight } = this.state;
    let user_data = {
      "is_showreel_mapping_retrieval": true,
      "showreel_video_id": id
    }
    newShowReels(user_data).then((response) => {
      if (response.data) {
        let transcript = ""
        let { snippetDetails } = this.state;
        let snippets = [];
        let newHighlights = []
        let tagId = "";
        let tagValue = "";
        let startIndex = 0;
        let numChars = 0;
        let sequence = 0;
        let level = 0;
        let isTagCompleted = false;
        let countCharacter = 0;
        let index = 1;
        let transcriptDetail = [];
        let wordCount = 0;
        let endIndex = 0;
        let newCommentId = '';
        for (let i in response.data) {
          transcript += response.data[i].value
          endIndex += response.data[i].value.length
          snippets.push({
            confidence: response.data[i].confidence,
            end_ts: response.data[i].end_ts,
            is_summary_marked: response.data[i].is_summary_marked,
            startIndex: wordCount,
            endIndex: endIndex,
            ts: response.data[i].ts,
            type: response.data[i].type,
            unique_element_key: response.data[i].unique_element_key,
            value: response.data[i].value,
          })

          wordCount = wordCount + response.data[i].value.length;
          if (response.data[i].is_summary_marked == true) {
            tagValue += response.data[i].value;
            transcriptDetail.push(response.data[i])
            numChars += response.data[i].value.length;
            isTagCompleted = true;
            countCharacter = countCharacter + response.data[i].value.length;
          } else {
            if (isTagCompleted) {
              newHighlights.push({
                id: index,
                startIndex: startIndex,
                numChars: numChars,
                selectedTagName: tagValue,
                details: transcriptDetail
              })
              videoPlayListHighlight.push({
                id: index,
                startIndex: startIndex,
                numChars: numChars,
                selectedTagName: tagValue,
                details: transcriptDetail,
                videoId: id
              })

              isTagCompleted = false;
              countCharacter = countCharacter + response.data[i].value.length;
              numChars = 0;
              tagValue = "";
              newCommentId = '';
              index++;
              transcriptDetail = [];
            } else {
              newCommentId = '';
              numChars = 0;
              countCharacter = countCharacter + response.data[i].value.length;
              startIndex = countCharacter;
              transcriptDetail = [];
            }
          }
        }
        snippetDetails.push({
          transcript: snippets,
          videoId: id
        })
        this.setState({ snippetDetails })
        videoDetailsList.push({ "transcript": transcript, "videoId": id, "highlights": newHighlights, "highlightsLink": HighlightLink, videoLink: videoLink })
        this.setSelectedListFromId()
      }
    })
  }

  handleTitleChange = (event) => {
    let { value } = event.target;

    if (event.keyCode === 13) {
      this.setState({ videoReelTitle: value })
      if (value && value.trim()) {
        this.setState({ videoReelTitle: value, activeInput: false }, () => {
          if (this.state.selectedShowReelId) {
            this.updateTitle();
          } else {
            this.getNewTitle();
          }

        })
      }
    }
  }

  updateTitle = () => {
    let updateShowReelId = this.props.showReelId;
    let update_user_data = {
      "is_showreel_name_updation": true,
      "showreel_id": this.state.selectedShowReelId,
      "showreel_name": this.state.videoReelTitle
    }
    updateShowReelTitle(update_user_data).then((response) => {

    })
  }

  getNewTitle = () => {
    let user_data = {
      "is_blank_showreel_creation": true,
      "knit_project_id": this.state.projectId,
      "knit_user_id": this.state.userId,
      "showreel_name": this.state.videoReelTitle
    }
    newShowReelTitle(user_data).then((response) => {
      if (response.success == true && response.status_code == 200) {
        if (response.data) {
          this.setState({ selectedShowReelId: response.data[0]._id.$oid }, () => {
            localStorage.setItem("newShowreelId", this.state.selectedShowReelId)
          })
        }
      }
    })

  }
  handleShowTitle = () => {
    let { videoReelTitle } = this.state;
    this.setState({ activeInput: true }, () => {
      document.getElementById('standard-helperText').value = videoReelTitle;
    });
  }

  handleTitle = (e) => {
    let { value } = e.target;
    if (e.keyCode === 13) {
      this.setState({ videoReelTitle: value, activeInput: false });
    }
  }

  renderTitle = () => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} md={6} lg={6} sm={6} className={"header-showreel-div"}>
          <img src={BackArrow} className={"back-showreel-arrow"} onClick={() => { goBack(); this.props.handleBack() }} />
          {this.state.videoReelTitle && !this.state.activeInput
            ? <Typography variant={"h6"} component={"h6"} className={"title"} onClick={this.handleShowTitle}>
              {this.state.videoReelTitle}
            </Typography>
            : <TextField
              id="standard-helperText"
              placeholder="Untitled Showreel"
              variant="standard"
              onChange={(e) => { this.handleTitle(e) }}
              onKeyDown={(e) => {
                this.handleTitleChange(e)
              }}
              className={'showReelFill'}
              onBlur={() => { this.handleOutsideClick() }}
            />}
        </Grid>
      </Grid>
    );
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };
  getShowReelData = (showReelData) => {
    this.setState({ showReelData: showReelData })
  }

  handleFontNameChange = (value) => {
    localStorage.removeItem(this.state.selectedShowReelDetails + "-isHighlightGenerate")
    this.setState({ selectedFontName: value })
  }

  handleFontTypeChange = (value) => {
    localStorage.removeItem(this.state.selectedShowReelDetails + "-isHighlightGenerate")
    this.setState({ selectedFontType: value })
  }

  handleFontSizeChange = (value) => {
    localStorage.removeItem(this.state.selectedShowReelDetails + "-isHighlightGenerate")
    this.setState({ selectedFontSize: value })
  }
  handleChecked = (data) => {
    let { allVideoIds } = this.state;
    let { videoHighlightLink } = this.state;
    data.isChecked = !data.isChecked;
    if (data.isChecked) {
      allVideoIds.push(data._id.$oid);
      videoHighlightLink.push(data.video_highlights_link)
    } else {
      allVideoIds = allVideoIds.filter(el => el != data._id.$oid);
      videoHighlightLink = videoHighlightLink.filter(el => el != data.video_highlights_link)
    }
    this.setState({ allVideoIds, videoHighlightLink })
  }

  insertNewVideo = () => {
    if (!this.state.selectedShowReelId) {
      let reelName = "";
      if (this.state.videoReelTitle) {
        reelName = this.state.videoReelTitle
      } else {
        reelName = "Untitled Showreel " + this.state.totalUntitleReels
      }
      let NewReelVideoData = {
        "knit_project_id": this.state.projectId,
        "knit_user_id": this.state.userId,
        "showreel_name": reelName,
        "video_id_list": this.state.allVideoIds,
        "is_update": false,
        "showreel_highlights_link": this.state.videoHighlightLink
      }

      ShowCheckedShowReel(NewReelVideoData).then((response) => {
        if (response.data) {
          this.setState({ selectedShowReelId: response.data.knit_project_showreels_mst_id.$oid, videoReelTitle: reelName, activeInput: false }, () => {
            this.getShowReelsDetails()
          })
        }
      })
    } else {
      let updateReelVideoData = {
        "project_showreels_id": this.state.selectedShowReelId,
        "video_id_list": this.state.allVideoIds,
        "showreel_highlights_link": this.state.videoHighlightLink,
        "is_update": true,
      }
      UpdateShowReel(updateReelVideoData).then((response) => {
        if (response.data) {
          this.getShowReelsDetails()
        }
      })
    }

  }

  dragShowReelPlayList = (videoId, destinationIndex) => {
    let UpdateShowReelList = {
      "is_heirarchy_update": true,
      "showreel_video_id": videoId,
      "new_sequence_number": destinationIndex
    }
    UpdateShowReel(UpdateShowReelList).then((response) => {
      if (response.data) {
        this.getShowReelsDetails()
      }
    })
  }

  //setUpdated Shoreel snippetin local storage
  setUpdatedSnippetStorage = () => {
    let keys = Object.keys(localStorage)
    if (keys.includes(this.state.selectedShowReelId)) {
      localStorage.removeItem(this.state.selectedShowReelId)
    }
    localStorage.setItem(this.state.selectedShowReelId, JSON.stringify(this.state.videoDetailsList));
  }

  selectionHandler = (selected, startIndex, numChars, showreelClicked,selectedvideoId) => {
    if (selected != null) {
      let newList = []
      newList = this.state.selectedVideoList[0].highlights.filter((el) => el.startIndex == startIndex);
      this.setState({ newList: newList })
    }
    this.setState({ selectedText: selected, startIndex: startIndex, numChars: numChars })
    if (showreelClicked) {
      localStorage.removeItem(this.state.selectedShowReelDetails + "-isHighlightGenerate")
      if (Array.isArray(this.state.newList) && this.state.newList.length == 0) {
        let myArr = this.state.selectedText.split(/(\s+)/);
        let newArrayList = myArr.filter(el => el != "")
        var dash = [];

        let selectedArrayLength = newArrayList.length;
        let speicalChar = [",", ".", "?", "!", ":"]
        newArrayList.map((item) => {
          if (item.length > 1 && item[item.length - 1] != undefined && speicalChar.includes(item[item.length - 1])) {
            selectedArrayLength += 1;
          }
        })
        startIndex = this.state.startIndex;
        numChars = this.state.numChars
        let totalwords = startIndex + numChars;
        let selectedVideoSnippet = this.state.snippetDetails.filter(el => el.videoId == this.state.selectedShowReelDetails)
         let videoId = selectedVideoSnippet[0].videoId
        let newSelectedList = [];
        let count = 0;
        let transcriptEndIndexflag
        for (let i = 0; i < selectedVideoSnippet[0].transcript.length; i++) {
          if (startIndex >= selectedVideoSnippet[0].transcript[i].startIndex && startIndex < selectedVideoSnippet[0].transcript[i].endIndex) {
            transcriptEndIndexflag = true
          }
          if (transcriptEndIndexflag === true) {
            newSelectedList.push({
              confidence: selectedVideoSnippet[0].transcript[i].confidence,
              end_ts: selectedVideoSnippet[0].transcript[i].end_ts,
              ts: selectedVideoSnippet[0].transcript[i].ts,
              type: selectedVideoSnippet[0].transcript[i].type,
              unique_element_key: selectedVideoSnippet[0].transcript[i].unique_element_key,
              value: selectedVideoSnippet[0].transcript[i].value,
              "is_summary_marked": true
            });

          }
          if (selectedVideoSnippet[0].transcript[i].endIndex >= totalwords) {
            transcriptEndIndexflag = false
          }
        }

        this.state.selectedVideoList[0].highlights.push({
          id: this.state.selectedVideoList[0].highlights.length + 1,
          startIndex: this.state.startIndex,
          numChars: this.state.numChars,
          selectedTagName: this.state.selectedText,
          details: newSelectedList
        })
        this.state.videoPlayListHighlight.push({
          id: this.state.videoPlayListHighlight.length + 1,
          startIndex: this.state.startIndex,
          numChars: this.state.numChars,
          selectedTagName: this.state.selectedText,
          details: newSelectedList,
          videoId: videoId
        })

        // this.state.editedVideoHighlight=[];
        let newList=this.state.editedVideoHighlight.filter(el=> el.videoId === selectedvideoId)
        if(Array.isArray(newList) && newList.length > 0){
          this.state.editedVideoHighlight=this.state.editedVideoHighlight.filter(el=> el.videoId !== selectedvideoId)
        }
        for(let i in this.state.videoPlayListHighlight){
          if(this.state.videoPlayListHighlight[i].videoId == selectedvideoId){
            this.state.editedVideoHighlight.push({
              id: this.state.editedVideoHighlight.length + 1,
              startIndex: this.state.videoPlayListHighlight[i].startIndex,
              numChars: this.state.videoPlayListHighlight[i].numChars,
              selectedTagName: this.state.videoPlayListHighlight[i].selectedTagName,
              details: this.state.videoPlayListHighlight[i].details,
              videoId: this.state.videoPlayListHighlight[i].videoId
            })
          }
        }
    

        //for only edited Texts

        // this.state.editedVideoHighlight.push({
        //   id: this.state.editedVideoHighlight.length + 1,
        //   startIndex: this.state.startIndex,
        //   numChars: this.state.numChars,
        //   selectedTagName: this.state.selectedText,
        //   details: newSelectedList,
        //   videoId: videoId
        // })
        for (let i in this.state.videoDetailsList) {
          if (this.state.selectedShowReelDetails == this.state.videoDetailsList[i].videoId) {
            this.state.videoDetailsList[i].highlights = this.state.selectedVideoList[0].highlights
          }
        }
        this.setUpdatedSnippetStorage();
      }
    }
  }
  handleShowReel = () => {
    this.setState({ showreelClicked: true })
  }

  handleChangeComplete = (color) => {
    localStorage.removeItem(this.state.selectedShowReelDetails + "-isHighlightGenerate")
    this.setState({ background: color.hex });
  };


  handleChecktext = (data) => {
    for (let i in data) {
      if (data[i].end_ts) {
        return data[i];
      }
    }
  }

  getLastSelectedText = (data) => {
    for (let i = data.length - 1; i >= 0; i--) {
      if (data[i].end_ts != undefined) {
        return data[i];
        break;
      }
    }
  }


  handleVideoPlayListHighlight = (data) => {
    let highlightList = [];
    if (data) {
      for (let i in data) {
        highlightList.push(this.handleChecktext(data[i]))
        highlightList.push(this.getLastSelectedText(data[i]))
      }
    }

    highlightList.sort(function (a, b) {
      return a.ts - b.ts;
    });


    return highlightList;
  }

  handleVideoViseHighlights = (data) => {
    let videoHighlights = [];
    for (let i in this.state.showReelPlaylistData) {

      let test = [];
      for (let j in data) {
        if (this.state.showReelPlaylistData[i].id == data[j].videoId) {
          test.push(data[j].details)
        }
      }
      let  video_timestamp = this.handleVideoPlayListHighlight(test);
    if(video_timestamp.length > 0){
      videoHighlights.push({ showreel_video_id: this.state.showReelPlaylistData[i].id, video_timestamp })
    }

    }
    return videoHighlights;
  }

  handleHighlightsConcatenation = () => {
    localStorage.setItem("showreelHighlightGeneration" + this.state.selectedShowReelId, true);
    let { selectedFontType, selectedFontName, subTitleConfig, selectedFontSize } = this.state;
    let fontName = "Helvetica";
    if (selectedFontName && selectedFontType) {
      Fonts.mainFontConfig && Fonts.mainFontConfig.map((item, index) => {
        if (item.name == selectedFontName && item.type == selectedFontType) {
          fontName = item.value
        }
      })
    }
    let data = {
      "align": this.state.align,
      "position": [
        "center",
        this.state.position
      ]
    };
    if (fontName) {
      data['font'] = fontName
    }
    data['fontsize'] = selectedFontSize ? selectedFontSize : 10;
    data['color'] = this.state.background ? this.state.background : '#fff'
    if (subTitleConfig) {
      this.handleSubtitleConfigUpdation(data);
    }
    let user_data = {
      "update_master_showreel_highlight": true,
      "knit_showreel_id": this.state.selectedShowReelId,
      "knit_organization_id": cookie.get("organization_id"),
      "knit_user_id": this.state.userId,
      "knit_project_id": this.state.projectId,
    }

    highlightsConcatenation(user_data).then((response) => {
      if (response.data) {
      }
    })
  }


  //check duplicate Data
   handleCheckDuplicateData=(timeStamp)=>{
    let duplcationFlag=false;
    let newVideoTimeStamp=[];
    let exist_ts = [];
    timeStamp.filter((f)=>f && Object.keys(f).includes("ts") && Object.keys(f).includes("end_ts")).map((x)=>{
      {
        if(!exist_ts.includes(x.ts.toString()+"-"+x.end_ts.toString())) {
          exist_ts.push(x.ts.toString() + "-" + x.end_ts.toString())
          newVideoTimeStamp.push(x)
        }
      }
    })
    if(Array.isArray(timeStamp) && Array.isArray(newVideoTimeStamp)){
      if(timeStamp.length > newVideoTimeStamp.length){
        duplcationFlag = true
      }
    }
    // return duplcationFlag;
    return newVideoTimeStamp
  }


  //export showreel function
  handleExportShowReel = () => {
    localStorage.setItem("showreelHighlightGeneration" + this.state.selectedShowReelId, true);
    let { selectedFontType, selectedFontName, subTitleConfig, selectedFontSize } = this.state;
    let fontName = "Helvetica";
    if (selectedFontName && selectedFontType) {
      Fonts.mainFontConfig && Fonts.mainFontConfig.map((item, index) => {
        if (item.name == selectedFontName && item.type == selectedFontType) {
          fontName = item.value
        }
      })
    }
    let newHighlightGeneration = [];

    if (this.state.selectedVideoList[0].highlights) {
      for (let i in this.state.selectedVideoList[0].highlights) {
        newHighlightGeneration.push(this.handleChecktext(this.state.selectedVideoList[0].highlights[i].details))
        newHighlightGeneration.push(this.getLastSelectedText(this.state.selectedVideoList[0].highlights[i].details))
      }
    }
    newHighlightGeneration.sort(function (a, b) {
      return a.ts - b.ts;
    });

    // const  handleVideoViseHighlights = this.handleVideoViseHighlights(this.state.videoPlayListHighlight)
    const  handleVideoViseHighlights = this.handleVideoViseHighlights(this.state.editedVideoHighlight )

    let validationFlag=false;
    for(let i in handleVideoViseHighlights){
      handleVideoViseHighlights[i].video_timestamp= this.handleCheckDuplicateData(handleVideoViseHighlights[i].video_timestamp)
      // if(flag){
      //   validationFlag = true;
      // }
    }
      // handleVideoViseHighlights[i].video_timestamp= this.handleCheckDuplicateData(handleVideoViseHighlights[i].video_timestamp)
      let user_data = {
        "is_highlights_generation": true,
        "knit_organization_id": cookie.get("organization_id"),
        "new_summary_timestamp": handleVideoViseHighlights,
        "knit_showreel_id": this.state.selectedShowReelId,
        "knit_user_id": this.state.userId,
        "knit_project_id": this.state.projectId,
      }
      let data = {
        "align": this.state.align,
        "position": [
          "center",
          this.state.position
        ]
      };
      if (fontName) {
        data['font'] = fontName
      }
      data['fontsize'] = selectedFontSize ? selectedFontSize : 10;
      data['color'] = this.state.background ? this.state.background : '#fff'
    if (subTitleConfig) {
        this.handleSubtitleConfigUpdation(data);
      }
    if(!validationFlag  ){
      exportShowReel(user_data).then((response) => {
      })

    }
    else{
      let videoDetailsList = [];
      let showreelList = localStorage.getItem(this.state.selectedShowReelId);
      let newHighlightList=[]
      if (showreelList) {
        videoDetailsList = JSON.parse(showreelList)
        let newHighlightList=[]
        for(let i in videoDetailsList){
          for(let j in videoDetailsList[i].highlights){
            newHighlightList.push({
              details:videoDetailsList[i].highlights[j].details,
              id:videoDetailsList[i].highlights[j].id,
              numChars:videoDetailsList[i].highlights[j].numChars,
              selectedTagName:videoDetailsList[i].highlights[j].selectedTagName,
              startIndex:videoDetailsList[i].highlights[j].startIndex,
              videoId:videoDetailsList[i].videoId
            })
          }
        }
        this.setState({ videoDetailsList ,videoPlayListHighlight: newHighlightList})
      }
    }



  }

  handleSubtitleConfigUpdation = (data) => {

    let user_data = {
      "update_subtitle_config": true,
      "showreel_mst_id": this.state.selectedShowReelId,
      "subtitle_config": data
    }
    subtitleConfigUpdation(user_data).then((response) => {
      if (response.data) {
      }
    })



  }

  checkShowReelStatus = () => {
    let user_data = {
      "get_showreel_merge_status": true,
      "showreel_id": this.state.selectedShowReelId
    }
    checkShowreelStatus(user_data).then((response) => {
      if (response.data) {
        if (response.data.is_merged_highlight_processing) {
          timer = setTimeout(() => {
            this.checkShowReelStatus()
          }, 5000);
        } else {
          if (response.data) {
            if (response.data.is_merged_highlight_processing == false && response.data.showreel_merged_highlights_link) {
let highlightReadyFlag = localStorage.getItem("highlightReadyFlag" + this.state.selectedShowReelId)
              if(highlightReadyFlag){
localStorage.removeItem("highlightReadyFlag" + this.state.selectedShowReelId)


  localStorage.setItem("showreelHighlightReadyFlag" + this.state.selectedShowReelId, true);
  //this.setState({isHighlightGenerateFlag: true})
}

              localStorage.setItem("showreelHighlightGeneration" + this.state.selectedShowReelId, false);
              localStorage.setItem("showreelHighlightVideoLink" + this.state.selectedShowReelId, response.data.showreel_merged_highlights_link);
              localStorage.setItem("modifiedDate", response.data.modified_on);
              localStorage.removeItem(this.state.selectedShowReelId)
              this.setState({ isHighlightGenerateFlag: false },()=>{
                this.setState({isHighlightGenerateFlag: true})
              })
            }
          }
        }
      }
    })

  }

  onBeginExport = () => {

    let flag = localStorage.getItem("highlightsConcatenationFlag");
    if(flag == 'true'){
      this.handleHighlightsConcatenation()
    }else if(flag == 'false') {
      this.handleExportShowReel();

    }else {
    }



    setTimeout(() => {
      this.checkShowReelStatus()
    }, 10000);

    localStorage.setItem("highlightReadyFlag" + this.state.selectedShowReelId, true);


  }

  handleRemoveSnippet = (data,selectedvideoId) => {
    localStorage.removeItem(this.state.selectedShowReelDetails + "-isHighlightGenerate")
    let newList = this.state.selectedVideoList[0].highlights.filter((el) => el.selectedTagName != data);
    this.state.selectedVideoList[0].highlights = newList;
    this.setState({ selectedVideoList: this.state.selectedVideoList })
    for (let i in this.state.videoDetailsList) {
      if (this.state.selectedShowReelDetails == this.state.videoDetailsList[i].videoId) {
        let newList = this.state.videoDetailsList[i].highlights.filter((el) => el.selectedTagName != data);
        this.state.videoDetailsList[i].highlights = newList;
      }
    }
    // For global variable remove selceted Tag
    let newList1 = this.state.videoPlayListHighlight.filter((el) => el.selectedTagName != data);
    this.state.videoPlayListHighlight = newList1;
    this.setState({ videoPlayListHighlight: this.state.videoPlayListHighlight })
    
    let newEditedList = this.state.editedVideoHighlight.filter((el) => el.videoId == selectedvideoId);
    // For edited variable remove selceted Tag
    for (let i in this.state.videoPlayListHighlight){
      if(newEditedList.length > 0){
        this.state.editedVideoHighlight=this.state.editedVideoHighlight.filter((el) => el.selectedTagName != data);
      }else{
        if(this.state.videoPlayListHighlight[i].videoId == selectedvideoId){
          this.state.editedVideoHighlight.push({
            id: this.state.editedVideoHighlight.length + 1,
            startIndex: this.state.videoPlayListHighlight[i].startIndex,
            numChars: this.state.videoPlayListHighlight[i].numChars,
            selectedTagName: this.state.videoPlayListHighlight[i].selectedTagName,
            details: this.state.videoPlayListHighlight[i].details,
            videoId: this.state.videoPlayListHighlight[i].videoId
          })
        }
      }
    }
    this.setUpdatedSnippetStorage();
  }

  handleSelectAlign = (value) => {
    localStorage.removeItem(this.state.selectedShowReelDetails + "-isHighlightGenerate")
    this.setState({ align: value })
  }

  handleSelectPosition = (value) => {
    localStorage.removeItem(this.state.selectedShowReelDetails + "-isHighlightGenerate")
    this.setState({ position: value })
  }

  componentWillUnmount() {
    clearTimeout(timer);
    localStorage.setItem("showreelStatusCheck" + this.state.selectedShowReelId, true);
  }



  render() {

    return (
      <div>
        {this.renderTitle()}
        <Grid container>
          <div style={{ width: "29%", height: 594, marginRight: "1%" }} className={"mt-20"}>
            <ShowReelPlaylist
              showreelplaylistData={this.state.showReelPlaylistData}
              projectId={this.props.projectId}
              getVideoData={(data) => {
                this.getVideoData(data)
              }}
              selectedShowReelId={this.state.selectedShowReelId}
              isPlaylistLoad={this.state.isPlaylistLoad}
              handleChecked={(data) => { this.handleChecked(data) }}
              videoPopupData={this.state.videoPopupData}
              // getShowReelData={(showReelData) => this.getShowReelData(showReelData)}
              insertNewVideo={() => this.insertNewVideo()}
              selectedShowReelDetails={this.state.selectedShowReelDetails}
              setSelectedListFromId={(id) => { this.setState({ selectedShowReelDetails: id, selectedVideoList: [] }, () => { this.setSelectedListFromId() }) }}
              handleOnChange={(videoId, index) => {
                this.dragShowReelPlayList(videoId, index)
              }}
              showReelId={this.props.showReelId}>

            </ShowReelPlaylist>
          </div>
          {this.state.selectedShowReelDetails && this.state.selectedVideoList && this.state.selectedVideoList.length > 0
            ? <><div style={{ width: "49%", height: 658, marginRight: "1%" }} className={"mt-20"}>
              <Grid container spacing={0} >
                <Grid item xs={12} sm={6} md={6} lg={12}>
                  <Card style={{ height: 658, overflow: 'auto' }} className={"showreelSettingCard"}>
                    <Tabs
                      value={this.state.value}
                      onChange={this.handleChange}
                      variant="standard"
                      indicatorColor="primary"
                      textColor="primary"
                      aria-label="icon label tabs example"
                      scrollButtons="auto"
                      style={{ borderBottom: "1px solid #00000029" }}
                    >
                      <Tab
                        label="Reel Editor"
                        className={"tabText"}
                        {...a11yProps(0)}
                      />
                      <Tab
                        label="Settings"
                        className={"tabText"}
                        {...a11yProps(1)}
                      />
                      <Tab
                        label="Preview & Export"
                        className={"tabText"}
                        {...a11yProps(2)}
                      />
                    </Tabs>
                    <TabPanel value={this.state.value} index={0} style={{ padding: "20px 12px" }}>
                      <ReelEditor data={this.state.selectedVideoList[0].transcript}
                        showreelModalOpen={this.state.showreelModalOpen}
                        handleShowReel={this.handleShowReel}
                        selectionHandler={this.selectionHandler}
                        handleRemoveSnippet={(data,id) => { this.handleRemoveSnippet(data,id) }}
                        videoHighlights={this.state.selectedVideoList[0].videoLink}
                        highlights={this.state.selectedVideoList[0].highlights}
                        selectedText={this.state.selectedText} selectedvideoId={this.state.selectedVideoList[0].videoId}></ReelEditor>
                    </TabPanel>
                    <TabPanel value={this.state.value} index={1} style={{ padding: "20px 12px" }}>
                      <ReelSetting
                        onFontSizeChange={(e) => { this.handleFontSizeChange(e) }}
                        onFontSelect={(e) => { this.handleFontNameChange(e) }}
                        handleSelectAlign={(value) => { this.handleSelectAlign(value) }}
                        onFontTypeChange={(e) => { this.handleFontTypeChange(e) }}
                        handleSelectPosition={(e) => { this.handleSelectPosition(e) }}
                        subTitleConfig={this.state.subTitleConfig}
                        align={this.state.align}
                        selectedFontName={this.state.selectedFontName}
                        selectedFontType={this.state.selectedFontType}
                        selectedFontSize={this.state.selectedFontSize}
                        background={this.state.background}
                        position={this.state.position}
                        handleSubTitleConfig={() => {
                          this.setState({ subTitleConfig: !this.state.subTitleConfig });
                          localStorage.removeItem(this.state.selectedShowReelDetails + "-isHighlightGenerate")
                        }}
                        handleChangeComplete={(event) => { this.handleChangeComplete(event) }}
                        videoHighlights={this.state.selectedVideoList[0].highlightsLink}
                      ></ReelSetting>
                    </TabPanel>
                    <TabPanel value={this.state.value} index={2} style={{ padding: "20px 12px" }}>
                      <ReelPreviewExport handleExport={() => { this.onBeginExport(); }}
                        highlights={this.state.selectedVideoList[0].highlights}
                        videoHighlights={this.state.highlightLink ? this.state.highlightLink : this.state.selectedVideoList[0].highlightsLink}
                        selectedShowReelDetails={this.state.selectedShowReelDetails}
                        isHighlightGenerate={this.state.isHighlightGenerate}
                        videoidValue={this.state.selectedShowReelDetails}
                        isHighlightGenerateFlag={this.state.isHighlightGenerateFlag}
                        showReelStatus={() => { this.checkShowReelStatus(); }}
                      ></ReelPreviewExport>
                    </TabPanel>
                  </Card>
                </Grid>
              </Grid>
            </div>
            </>
            : <>{this.state.selectedShowReelId && Array.isArray(this.state.showReelPlaylistData) && this.state.showReelPlaylistData.length > 0 &&
              <div style={{ width: "49%", height: 658, marginRight: "1%" }} className={"mt-20"}>
                <Grid container spacing={0} >
                  <Grid item xs={12} sm={6} md={6} lg={12}>
                    <Card style={{ height: 658, overflow: 'auto' }} className={"showreelSettingCard"}>
                      <Tabs
                        value={this.state.value}
                        onChange={this.handleChange}
                        variant="standard"
                        indicatorColor="primary"
                        textColor="primary"
                        aria-label="icon label tabs example"
                        scrollButtons="auto"
                        style={{ borderBottom: "1px solid #00000029" }}
                      >
                        <Tab
                          label="Reel Editor"
                          className={"tabText"}
                          {...a11yProps(0)}
                        />
                        <Tab
                          label="Setting"
                          className={"tabText"}
                          {...a11yProps(1)}
                        />
                        <Tab
                          label="Preview & Export"
                          className={"tabText"}
                          {...a11yProps(2)}
                        />
                      </Tabs>
                      <TabPanel style={{ padding: "20px 12px" }}>
                        <div className={"padd-20"}>
                          <Skeleton variant="rectangular" width={'100%'} height={180} style={{ "margin-bottom": "10px", "border-radius": "10px" }} />
                          <Skeleton variant="text" />
                          <Skeleton variant="text" />
                          <Skeleton variant="text" />
                        </div>
                      </TabPanel>
                    </Card>
                  </Grid>
                </Grid>
              </div>
            }

            </>}
        </Grid>
      </div>
    );
  }
}

export default ShowreelsDetails;
