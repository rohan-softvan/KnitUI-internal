import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Checkbox from '@material-ui/core/Checkbox';
import ButtonComponent from "../../components/button/Button";
import AddIcon from "@material-ui/icons/Add";
import { Grid, withWidth } from "@material-ui/core";
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from "../../../assets/images/search/search.svg";
import LongRightArrowIcon from "../../../assets/images/showreels/right-arrow.png";
import "../newProjectCard/NewProjectCard.scss";
// import AutoCompleteWidget from "../../components/autoCompleteWidget/AutoCompleteWidget";
import AuthLoader from '../../components/authLoader/Loader';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import InfoIcon from '@material-ui/icons/Info';
import Popper from "@material-ui/core/Popper/Popper";
import Popover from "@material-ui/core/Popover/Popover";
import "./BulkAnnotationModal.scss";
import { Tree, Input } from 'antd';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import VideoThumb from "../../../assets/images/navbar/userprofilelarge.png"
import subSelected from "../../../assets/images/search/subSelected.png";
import {allThemeNameList} from "../../services/ThemeService";
import {InteractiveHighlighter} from "react-interactive-highlighter";
import {
  DownOutlined,
  FrownOutlined,
  RightOutlined
} from '@ant-design/icons';
import {getbulkAnnotationSearchData,applyTagForBulkAnnotation,getSeeMoreVideo} from "../../services/VideoService";
import "../../css/common.scss";

const modalStyle = {
  modalLabel: {
    color: "#001839",
    fontSize: 14,
    fontWeight: "500",
  },
  memberInput: {
    marginTop: "10px",
  },
  mainDiv: {
    display: "flex",
    justifyContent: "flex-end",
  },
};

const styles = []

const errorMessage = {
  color: '#D14926',
  fontSize: '10px',
  marginTop: '5px'
}

let data = [
  {
    questionName: 'This is a question that is collapsed. If the question is long it should be truncated and the full question...',
    questionNumber: 'Q2.',
    questionAnswer: ["This is a question that is collapsed. If the question is long it should be truncated and the full question...",
      "This is a question that is collapsed. If the question is long it should be truncated and the full question..."]
  },
  {
    questionName: 'This is a question that is collapsed. If the question is long it should be truncated and the full question...',
    questionNumber: 'Q2.',
    questionAnswer: ["This is a question that is collapsed. If the question is long it should be truncated and the full question...",
      "This is a question that is collapsed. If the question is long it should be truncated and the full question..."]
  }
];
const DialogTitle = withStyles(theme => ({
    root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: theme.spacing.unit,
        color: theme.palette.grey[500],
    },
}))(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon className={"close-icon"} />
                </IconButton>
            ) : null} 
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    width: "100%"
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);


const x = 3;
const y = 2;
const z = 1;
const gData = [];



const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key == key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
let chechkText;

const getSelectedTagObject = (key, tree) => {
  let selectedTagList=[];
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if(node.children){
      selectedTagList=node.children.filter(el => el.key == key)
      if(Array.isArray(selectedTagList) && selectedTagList.length > 0){
        return selectedTagList;
      }else{
        getSelectedTagObject(node.children,key)
      }
    }
  }
  // return selectedTagList;
};
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
function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hour ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " min " : " min ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " sec " : " sec ") : "";
    return hDisplay + mDisplay + sDisplay;
}

const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug","Sep","Oct", "Nov","Dec"];

function customClassFn1(selectedText){
  if(selectedText.length>0){
      if(selectedText[0].themeId == 0){
          return "theme-highlighted-theme0"
      }else if(selectedText[0].themeId == 1){
          return "theme-highlighted-theme1"
      }else if(selectedText[0].themeId == 2){
          return "theme-highlighted-theme2"
      } else if(selectedText[0].themeId == 3){
          // return "highlighted-theme3";
          return  "theme-highlighted-theme3"
      } else if(selectedText[0].themeId == 4){
          // return "highlighted-theme4";
          return  "theme-highlighted-theme4"
      } else if(selectedText[0].themeId== 5){
          // return "highlighted-theme5";
          return  "theme-highlighted-theme5"
      } else if(selectedText[0].themeId == 6){
          // return "highlighted-theme6";
          return "theme-highlighted-theme6"
      } else if(selectedText[0].themeId == 7){
          // return "highlighted-theme7";
          return "theme-highlighted-theme7"
      }

  }else{
      return "selected-text"
  }
  // return "selected-text"
}

class BulkAnnotationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      open: false,
      anchorEl: null,
      displayContent: 1,
      buttonName: "Next",
      disabled: true,
      projectCreation: [],
      showAPITokenError: false,
      selectedqualtricsProject: null,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
        searchText:'',
      gData:[],
      dataList:[],
        VideoTableData: [],
      selectedTagList:[],
      selectedTagId:'',
      searchTextFlag:false,
      applyButtonDisabled:true,
      selectedTagName:"",
      tagFlag:false,
      selectedVideos:[],
      allTagList:[],
      allSelect:false,
      existingData:[]
    };
  }

  componentDidMount(){
    this.loadParentThemeData()
  }

  loadParentThemeData=()=>{
    let user_data = {
      "is_parent_theme": true,
      "knit_project_id": this.props.projectId,
  };
  allThemeNameList(user_data).then((response) => {
      for(let i in response.data){
        this.loadThemeData(response.data[i]._id.$oid,i)
      }
    this.setState({mainThemeData:response.data})

  })
  }

    //convert Epoch date to date/ set in the formate
    epochDate = (epochTime) => {
        let utcSeconds = new Date(epochTime * 1000);
        let formatted = `${this.formatDDMMYYYY(utcSeconds)}`;
        return formatted;
    };
    //set date in from Date-month-year
    formatDDMMYYYY = (postDate) => {
        let monthIndex = postDate.getMonth();
        let monthName = months[monthIndex];
        let year = postDate.getFullYear(); // 2019
        let date = postDate.getDate();
        date = date < 10 ? "0" + date : date;
        let strDate = date + " " + monthName + " " + year;
        return strDate;
    };

  generateChild=(themeList,key)=>{
    let {dataList}=this.state;
    let childList=[];
    for(let i in themeList){
      childList.push({
        _id:themeList[i]._id,
        key:key+"-"+i,
        type:themeList[i].type,
        title:themeList[i].title,
        children:this.generateChild(themeList[i].children,key+"-"+i)
      })
      dataList.push({ key:key+"-"+i , title: themeList[i].title });
    }
    return childList;
  }
  loadThemeData=(parentId,index)=>{
    let {gData,dataList}=this.state;
    let user_data = {
      "knit_theme_id": true,
      "knit_project_id": this.props.projectId,
      "parent_theme_id": parentId
  };
  allThemeNameList(user_data).then((response) => {
    if(response.data){
      gData.push({
        _id:response.data[0]._id,
        key:"0-"+index,
        title:response.data[0].title,
        type:response.data[0].type,
        children:this.generateChild(response.data[0].children,"0-"+index)
      })
      dataList.push({ key:"0-"+index , title: response.data[0].title });
      // gData.push(response.data[0]);
    }
    // gData.push(response.data[0])
    this.setState({gData:gData,dataList:dataList})

  })
  }
  checkFlag = (data) => {
    if (data) {
      this.setState({ disabled: false });
    } else {
      this.setState({ disabled: true });
    }
  }


  onHandleChange = (event, value) => {
    if (value) {
      this.setState({
        qualtricsProject: value.value, disabled: false,
        qualtricsProjectName: value.title, selectedqualtricsProject: value
      })
    } else {
      this.setState({
        qualtricsProject: "", disabled: true,
        qualtricsProjectName: "", selectedqualtricsProject: {}
      })
    }
  }

  generateTranscript=(data)=>{
    let transcript="";
    for(let i in data){
        transcript+=data[i].value
    }
    return transcript;
}

handleTagMark = (data) =>{
  let tagId="";
  let tagValue="";
  let startIndex=0;
  let numChars=0;
  let sequence=0;
  let level=0;
  let isTagCompleted=false;
  let transcript=""
  let countCharacter=0;
  let index=1;
  let newHighlights=[]
  let transcriptDetail=[];
  let wordCount=0;
  let newCommentId='';
  if(data.video_transcription_timestamps){
      for (let i in data.video_transcription_timestamps){
          transcript+=data.video_transcription_timestamps[i].value;
          // commentId=""
        
          wordCount=wordCount+data.video_transcription_timestamps[i].value.length;
          if(data.video_transcription_timestamps[i].is_mark == true){
              tagValue+=data.video_transcription_timestamps[i].value;
              transcriptDetail.push({
                ts:data.video_transcription_timestamps[i].ts,
                end_ts:data.video_transcription_timestamps[i].end_ts,
                value:data.video_transcription_timestamps[i].value,
                // startIndex:wordCount,
                unique_element_key:data.video_transcription_timestamps[i].unique_element_key,
                confidence:data.video_transcription_timestamps[i].confidence,
                type: data.video_transcription_timestamps[i].type
            })
              numChars+=data.video_transcription_timestamps[i].value.length;
              isTagCompleted=true;
              countCharacter=countCharacter+data.video_transcription_timestamps[i].value.length;
          }else{
              if(isTagCompleted){

                  newHighlights.push({
                      id:index,
                      startIndex: startIndex,
                      numChars:numChars,
                      tags:"",
                      selectedTagName:tagValue,
                      themeId:sequence,
                      selectedText:false,
                      tagId:tagId,
                      commentId:newCommentId,
                      transcriptDetail:transcriptDetail
                  })
                  isTagCompleted=false;
                  countCharacter=countCharacter+data.video_transcription_timestamps[i].value.length;
                  startIndex=countCharacter;
                  numChars=0;
                  tagValue="";
                  newCommentId='';
                  index++;

              }else{
                  newCommentId='';
                  numChars=0;
                  countCharacter=countCharacter+data.video_transcription_timestamps[i].value.length;
                  startIndex=countCharacter;
              }
          }
      }
  }

  return newHighlights;
}

generateQuestionData=(data)=>{
  let questionData=[];
  let  {existingData}=this.state;
  for(let i in data.data){
    questionData.push({
      video_thumbnail_url:data.data[i].video_thumbnail_url,
      video_feature_title:data.data[i].video_feature_title,
      created_on:data.data[i].created_on,
      video_file_name:data.data[i].video_file_name,
      transcript:this.generateTranscript(data.data[i].video_transcription_timestamps),
      original_video_duration:data.data[i].original_video_duration,
      video_transcription:data.data[i].video_transcription,
      _id:data.data[i]._id,
      selectedText:this.handleTagMark(data.data[i]),
      video_transcription_timestamps:data.data[i].video_transcription_timestamps
    })
    existingData.push(data.data[i]._id.$oid)
  }
  this.setState({existingData})
 return questionData;
}

getHighlightedText=(data)=>{
  let newJson={}
  for(let i in data.data){
    let selectedText=''
    for (let j in data.data[i].video_transcription_timestamps){
      if(data.data[i].video_transcription_timestamps[j].is_mark == true){
        // newList.push(data.data[i].video_transcription_timestamps[j].value)
        selectedText+= data.data[i].video_transcription_timestamps[j].value
      }
      newJson[data.data[i]._id.$oid]= selectedText
    }
  }
  return newJson;
}

    getSearchData = (e) => {

        if (e.key === 'Enter') {
          this.setState({loading:true}) 

        if (this.props.projectId && this.state.searchText && chechkText != this.state.searchText && this.state.VideoTableData) {
            chechkText = this.state.searchText
            let user_data = {
                "knit_project_id": this.props.projectId,
                "search_by": this.state.searchText
            }
            getbulkAnnotationSearchData(user_data).then((response) => {
                let VideoTableData = [];
                let count = 0;
                let existingData=[]
                let questionIdVideoList={}
                // response.data=[];
                if (response.data && response.data.length > 0) {
                    for (let i in response.data) {
                        VideoTableData.push({
                            questionName: response.data[i]._id.video_feature_title,
                            questionId: response.data[i]._id.video_feature_id,
                            questionNumber: response.data[i]._id.video_feature_name,
                            questionData: this.generateQuestionData(response.data[i]),
                            questionDataCount: response.data[i].count
                        });
                        // existingData.push(response.data[i]._id.video_feature_id)

                        questionIdVideoList[response.data[i]._id.video_feature_id] = this.getHighlightedText(response.data[i])
                        count = count + response.data[i].count;
                    }
                }
              this.setState({VideoTableData:VideoTableData,searchTextFlag:true,loading:false,questionIdVideoList})
              // console.log('questionIdVideoList--->',questionIdVideoList)
            });
        }
        else if(this.state.searchText === this.state.searchText){
          this.setState({loading:false})
        }
    }
    };


  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      open: !this.state.open,
    });
  };


  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };
    handleChange=(e)=>{
      // console.log('searchText-->',e.target.value)
      if(e.target.value != null && e.target.value != ''){
        this.setState({searchText:e.target.value},()=>{
          this.checkValidation()
            // setTimeout(() => {
            //     this.getSearchData();
            // }, 3000)

        })
    }else{
      chechkText=''
      this.setState({searchTextFlag:false,searchText:null,selectedVideos:[],allSelect:false,allTagList:[]})
    }

    }
    //e.target.value

  onChange = e => {
    let {gData,dataList}=this.state;
    const { value } = e.target;
    const expandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, gData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) == i);

    if(value != undefined && value != " " && value != "" && value != null){
      this.setState({
        // gData:this.state.gData,
        expandedKeys,
        searchValue: value,
        autoExpandParent: true,
      });
    }else{
      this.setState({
        // gData:this.state.gData,
        expandedKeys:[],
        searchValue: value,
        // autoExpandParent: false,
      });

    }
  };


 getSelectedTagObject = (key, tree) => {
   let {selectedTheme}=this.state;
  let selectedTagList=[]; 
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if(node.children){
      selectedTagList=node.children.filter(el => el.key == key)
      if(Array.isArray(selectedTagList) && selectedTagList.length > 0){
        this.setState({selectedTagList:selectedTheme})
        if(Array.isArray(selectedTagList) && selectedTagList.length > 0){
          if(selectedTagList[0].type == "THEME"){
            this.setState({tagFlag:true})
          }else{
            this.setState({tagFlag:false})
          }
          this.setState({selectedTagId:selectedTagList[0]._id,searchValue:selectedTagList[0].title})
        }
        // return selectedTagList;
      }else{
        this.getSelectedTagObject(key,node.children)
      }
    }
  }
};



  handleonSelect = info => {
    this.getSelectedTagObject(info,this.state.gData);
    this.setState({open:false},()=>{
      this.checkValidation()
    })
  };

  handleApplyTag=()=>{
    let {selectedTagList,selectedTagId,selectedVideos,allTagList}=this.state;
    let {projectId,videoId,userResponseId}=this.props;
    let requestJson={
      "tag_comment": true,
      "is_tag": true,
    }
    let bulkList=[]
    for(let i in allTagList){
      bulkList.push({
        "knit_tag_id": selectedTagId,
      "knit_project_id": projectId,
      "knit_project_response_id": userResponseId,
      "knit_video_response_id": allTagList[i].id,
      "tag_associated_text": allTagList[i].tagName,
      "tag_associated_text_timestamp": allTagList[i].tags
      })
    }
    requestJson["is_bulk"]=bulkList;
      applyTagForBulkAnnotation(requestJson).then((response)=>{
        if(response.data){
          chechkText="";
          this.setState({searchText:null})
          this.props.onHandleClose(true);
          // this.props.getTagDetails(this.state.selectedVideos[0])
        }
      })

  }


  checkValidation=()=>{
   
    let {searchText,searchValue,tagFlag,selectedTagName,selectedVideos}=this.state;
      if(searchText && (searchValue || selectedTagName) && !tagFlag && (Array.isArray(selectedVideos) && selectedVideos.length > 0)){
        this.setState({applyButtonDisabled:false})
      }else{
        this.setState({applyButtonDisabled:true})
      }
  }

  onChecked=(event,data,questionId)=>{
    let {selectedVideos,allTagList}=this.state;
    if(event.target.checked){
      selectedVideos.push(data._id.$oid)
      allTagList.push({
        "tags":data.selectedText[0].transcriptDetail,
        "id":data._id.$oid,
        "tagName":data.selectedText[0].selectedTagName,
        "questionId":questionId
      })
    }else{
      selectedVideos = selectedVideos.filter(el => el != data._id.$oid)
      allTagList= allTagList.filter(el => el.id != data._id.$oid)
    }
    this.setState({selectedVideos,allTagList},()=>{
      this.checkValidation()
    })
  }

//To selecte All question From the Modal
  handleAllSelect=(checked,questionId)=>{
    // let {selectedVideos,allTagList}=this.state;
    let {allTagList,selectedVideos}=this.state;
    if(!this.state.allSelect){
      allTagList=[];
      selectedVideos=[]
    }
    // let allTagList=[];
    // let selectedVideos=[];
    if(checked){
      let newList=this.state.VideoTableData.filter(el => el.questionId == questionId);
      for(let i in newList[0].questionData){
        selectedVideos.push(newList[0].questionData[i]._id.$oid)
        allTagList.push({
          "tags":newList[0].questionData[i].selectedText[0].transcriptDetail,
          "id":newList[0].questionData[i]._id.$oid,
          "tagName":newList[0].questionData[i].selectedText[0].selectedTagName,
          "questionId":questionId
        })
      }
      this.setState({allSelect:true})
    }else{
      // selectedVideos = selectedVideos.filter(el => el != data._id.$oid)
      allTagList= allTagList.filter(el => el.questionId != questionId)
      selectedVideos=[];
      for(let i in allTagList){
        selectedVideos.push(allTagList[i].id)
      }
      if(allTagList.length <= 0){
        this.setState({allSelect:false})
      }
    }

    this.setState({allTagList,selectedVideos},()=>{
      this.checkValidation()
    });
  }

  getDataFromSearch=()=>{
      for(let i in this.state.VideoTableData){
        this.getSeeMoreVideoApi(this.state.VideoTableData[i].questionId)
      }
  }


  getSeeMoreVideoApi=(questionId)=>{  
    let transcriptList=[]
    let selctedVideoTranscript=[]
        for (const [key, value] of Object.entries(this.state.questionIdVideoList)) {      
            for (const [keys, values] of Object.entries(value)) {      
              if(this.state.selectedVideos.includes(keys)){
            transcriptList.push(values)
          }
        }
      }

  selctedVideoTranscript.push({
    question_id: questionId,
    annotate_text_list: transcriptList
  })
    let user_data =  {
      "knit_project_id": this.props.projectId,
      "search_by": this.state.searchText,
      "question_details_dict":selctedVideoTranscript[0],
      "existing_video_id_list": this.state.existingData
      }    
      let {VideoTableData,existingData} = this.state
      let count = 0;  
      getSeeMoreVideo(user_data).then((response) => {
        if (response.data && response.data.data.length > 0) {
          let newList=this.state.VideoTableData.filter(el=> el.questionId == questionId)
          for (let i in response.data.data) {
            newList[0].questionData.push({ 
              video_thumbnail_url:response.data.data[i].video_thumbnail_url,
              video_feature_title:response.data.data[i].video_feature_title,
              created_on:response.data.data[i].created_on,
              video_file_name:response.data.data[i].video_file_name,
              transcript:this.generateTranscript(response.data.data[i].video_transcription_timestamps),
              original_video_duration:response.data.data[i].original_video_duration,
              video_transcription:response.data.data[i].video_transcription,
              _id:response.data.data[i]._id,
              selectedText:this.handleTagMark(response.data.data[i]),
              video_transcription_timestamps:response.data.data[i].video_transcription_timestamps})      
              existingData.push(response.data.data[i]._id.$oid)
              }
              newList[0].questionDataCount =  newList[0].questionDataCount + response.data.count;                
            }
            this.setState({VideoTableData:VideoTableData,searchTextFlag:true,loading:false,existingData})
    })
  }

  getValueAccrodingselectedVideoId=()=>{
    for (const [key, value] of Object.entries(this.state.questionIdVideoList)) {      
        for (const [keys, values] of Object.entries(value)) {             
          if(this.state.selectedVideos.includes(keys)){
            return true;
          }
        }
    }
    return false;
  }

  render() {
    const { searchValue, expandedKeys, autoExpandParent } = this.state;

    let classes = modalStyle;
    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });
      let flag;
    return (
      <div>
        <Dialog fullWidth={true} maxWidth={"lg"} 
          onClose={()=>{ chechkText="";this.setState({searchText:null});this.props.onHandleClose()}} 
          open={this.props.open} 
          className="bulk-annotation-modal"
          // style={{ height: 592 }}
        >
          <DialogTitle id="customized-dialog-title" onClose={()=>{ chechkText="";this.setState({searchText:null});this.props.onHandleClose()}}>
            <Typography style={classes.modalLabel}>
              Bulk Annotate
            </Typography>
          </DialogTitle>
          <DialogContent dividers className={"fix-modal-height-bulk-annot-modal"}>
            <div style={{ display: "flex" }}>
              <FormControl style={{ width: "50%" }} >
                <OutlinedInput
                  id="outlined-adornment-weight"
                  onChange={(e) => { this.handleChange(e) }}
                  placeHolder={"Select a tag to apply"}
                  startAdornment={<InputAdornment position="start"> <img src={SearchIcon} /></InputAdornment>}
                  aria-describedby="outlined-weight-helper-text"
                  labelWidth={0}
                  onKeyDown={this.getSearchData}
                />
              </FormControl>
              <div style={{ padding: '0px 15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img src={LongRightArrowIcon} />
              </div>
    
              <TextField className={"popper-width main-height remove-seach-icon"} size={"small"}
                variant="outlined" placeholder={"Select a tag to apply"}
                value={this.state.searchText}
                onChange={this.onChange}
                onClick={(e) => { this.handleClick(e); }}
                value={this.state.searchValue}
                style={{ background: " white", width: "190px" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end" className={"cursor"}>
                      {this.state.open ? <ExpandLessIcon></ExpandLessIcon> :
                        <ExpandMoreIcon></ExpandMoreIcon>}
                    </InputAdornment>
                  )
                }}
              />
              <Popper class="tree-annotation" open={this.state.open} anchorEl={this.state.anchorEl}
                placement={"bottom-end"} transition style={{ zIndex: 10000, top: 15, left: 25 }}>
                <div class="mainCard">
                  <div class="MuiGrid-root popper-width MuiGrid-container">
                    <div class="MuiGrid-root borderStyle cursor padd-5  bulkAnnotation-tree-card MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-sm-12 MuiGrid-grid-md-12 MuiGrid-grid-lg-12">
                        <Tree
                        onExpand={this.onExpand}
                        expandedKeys={expandedKeys}
                        selectable
                        switcherIcon={<DownOutlined style={{color:'#001839',fontSize:"12px"}} />}
                        autoExpandParent={autoExpandParent}
                        onSelect={this.handleonSelect}
                        treeData={loop(this.state.gData)}
                      />
                    </div>
                  </div>
                </div>
               
              </Popper>
            </div>
            {this.state.tagFlag && 
                    <div>
                    <Typography className={"search-text-error"}>Please select a tag to annotate the selected videos</Typography>
                  </div>
                }
            <div style={{ marginTop: 30 }}>
              {!this.state.searchTextFlag &&
              <div className={"search-teg-text"}><InfoIcon />Search for a phrase and choose a tag that you want to apply for it.</div>
              }
              {this.state.searchTextFlag && this.state.VideoTableData && this.state.VideoTableData.length>0 ? this.state.VideoTableData.map((item,index) => {
                let totalCount=0;
                totalCount = this.state.allTagList.filter((value) => value.questionId == item.questionId).length;
                return (
                  <Accordion className={"mainAccordionCard"}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header" className={"BulkAccordion"}>
                     {totalCount && totalCount > 0
                     ?<img src={subSelected}  onClick={(e)=>{this.handleAllSelect(false,item.questionId)}} style={{height:18,paddingRight: 5,marginTop:1}}/>
                    :  <Checkbox color="primary" className = {"accordion-card"} onClick={(e)=>{this.handleAllSelect(e.target.checked,item.questionId)}}/>}
                      <Typography className={"questionTitle"}>{"  "+item.questionNumber} {item.questionName}</Typography>
                      <Typography className={"selectionTitle"}>{totalCount +" of "+item.questionDataCount+ " Selected"}</Typography>
                    </AccordionSummary>
                    {/* {console.log("item.questionData: ",item.questionData)} */}
                    {item.questionData && item.questionData.map((data) => {                   
                      flag=true;
                      if(this.state.selectedVideos.includes(data._id.$oid)){
                        flag=true;
                      }                         
                      return (
                        <AccordionDetails style={{padding:"0px"}}>
                          <div className={this.state.selectedVideos.includes(data._id.$oid) ? "video-list-card-active" :"video-list-card"}>
                            <div className={"checkbox"}>                
                              <Grid item xs={12} md={12} lg={1} sm={12}>
                                <Checkbox checked={this.state.selectedVideos.includes(data._id.$oid)} onClick={(e)=>{this.onChecked(e,data,item.questionId)}} className={"bulk-checkbox"} />
                              </Grid>
                            </div>
                            
                              <div className={"bulk-annoted-video-card"}>
                                <img src={data.video_thumbnail_url} className={"video-playlist-thumbnail"} />
                                <div className={"inside-space"}>
                                  <Typography className={"playlist-video-title"}>
                                      {data.video_file_name}
                                  </Typography>
                                  <Typography className={"playlist-video-question"}>
                                      {data.created_on ? this.epochDate(data.created_on) : ""}
                                  </Typography>
                                  <Typography className={"playlist-video-duration"}>
                                      {data.original_video_duration ? secondsToHms(data.original_video_duration) : ""}
                                  </Typography>
                                </div>
                              </div>
                              <div className={"video_annot_desc"}>
                              <InteractiveHighlighter
                                  text={data.transcript}
                                  highlights={data.selectedText}
                                  customClass={customClassFn1(data.selectedText)}
                                />
                              </div>
                          </div>
                        </AccordionDetails>
                      )                
                    })}
                  </Accordion>
                )
              }): this.state.searchTextFlag &&
              <div className={"search-teg-text"}><InfoIcon />No Results appropriate for this search</div>}
            {this.state.loading && <AuthLoader />}
            </div>
          </DialogContent>
          <DialogActions>
            <Grid container>
             
              <Grid
                item
                xs={12}
                md={12}
                lg={12}
                sm={12}
                style={classes.mainDiv}
              > 
                {this.state.selectedVideos.length > 0 &&
                  <div>
                    <ButtonComponent
                        onClick={this.getDataFromSearch}
                        text={"Load More"}                              
                        width={95}
                        className={"loadMore"}
                    />
                    {/* } */}
                  </div>
                }              
                <ButtonComponent
                    onClick={()=>{this.handleApplyTag()}}
                  text={"Apply"}
                  disabled={this.state.applyButtonDisabled}
                  width={90}
                />
                
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(BulkAnnotationModal);
