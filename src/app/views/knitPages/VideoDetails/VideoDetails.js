import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import withWidth, { isWidthUp, isWidthDown } from "@material-ui/core/withWidth";
import { Grid, Typography } from "@material-ui/core";
import Cookies from "universal-cookie";
import "../../../css/common.scss";
import StatsSummaryWrapper from "../../../components/common/StatsSummaryWrapper";
import Color from "../../../config/Color";
import BackArrow from "../../../../assets/images/project-details/BackArrow.svg";
import Button from "@material-ui/core/Button";
import ButtonComponent from "../../../components/button/Button";
import ShowReels from "../../../../assets/images/sidebar/filmRollWhite.svg";
import ShowReelsIcon from "../../../../assets/images/showreels/film.svg";
import Flash from "../../../../assets/images/showreels/flash.png";
import Download from "../../../../assets/images/project-details/download.svg";
import Card from "@material-ui/core/Card";
import "./VideoDetails.scss";
import TagFrequency from "../../../components/tagFrequency/TagFrequency";
import Accordion from "../../../components/accordionComponent/accordion";
import ProgressBar from "../../../components/progressBar/ProgressBar"
import ThemeColor, {getCombineThemeColor} from "../../../config/ThemeColorConfig";
import { InteractiveHighlighter } from 'react-interactive-highlighter';
import AnnotationFlipMoveCard from "../../../components/annotationFlipMoveCard/annotationFlipMoveCard";
import FlipMove from "react-flip-move";
import {
    getVideoDetailsFromId, getVideoTagDetails,
    tagCardOperation, tagCardEditOperation,
    tagUsageDeleteAction, getThemeDetails,
    insertThemes, insertTag,
    updateTranscript, getGridViewVideoData,
    suggestedTagAction
} from "../../../services/VideoService"
import { newShowReelTitle, updateShowReelTitle } from "../../../services/ShowReelsService";
import Skeleton from '@material-ui/lab/Skeleton';
import AuthLoader from "../../../components/authLoader/Loader";
import BulkAnnotationModal from "../../../components/bulkAnnotationModal/BulkAnnotationModal";
import AddVideoShowreelModel from "../../../components/addVideoShowreelModal/AddVideoShowreelModel"
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import { allReels, searchReels, UpdateShowReel, getAllReelsFromVideoId } from "../../../services/ShowReelsService";
import DeleteModel from "../../../components/deleteModal/DeleteModel";
import AnnotationCardMenu from "../../../components/annotationCardMenu/AnnotationFunctional";
import appThemeColor from "../../../config/ThemeColorConfig";
import '../../../components/annotationMenu/AnnotationMenu.scss'
import AiSuggestedtag from "../../../components/annotationFlipMoveCard/aiSuggestedCard"


const cookie = new Cookies();
const styles = {
    moreVertIcon: {
        "&:active": {
            backgroundColor: Color.lightGreyShadow
        },
        borderRadius: 6,
        cursor: 'pointer'
    },
    annotationAlert: {
        backgroundColor: "#001839",
        color: "white"
    }
}
function setOpacity(level) {
    if (level == 1) {
        return "1";
    } else if (level == 2) {
        return "0.7";
    } else if (level == 3) {
        return "0.4"
    } else {
        return "0.2"
    }
}

function getQueryStringValue() {
    return window.location.href.split('/')[5];
}

function getQueryStringValueVideoId() {
    return window.location.href.split('/')[7];
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

//const history = useHistory();
let responseId;

function getListStringValue() {
    return window.location.href.split('=').pop().split('/')[0];
}

class VideoDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            questionList: [],
            isAllExpand: false,
            themeList: [],
            // tagCard:TagCard,
            anchorElTagMenu: null,
            tagMenuOpen: false,
            isThemeButton: false,
            transcript: "",
            tagName: false,
            isTagAnnotationCard: false,
            isTranscriptLoad: false,
            isSentimentsLoad: false,
            isSummaryLoad: false,
            isRelatedDataLoad: false,
            userEmail: "",
            highlights: [],
            userResponseId: '',
            loading: false,
            bulkModalOpen: false,
            open: false,
            showreelsList: [],
            selectedShowReelId: '',
            successAnnotationMessage: false,
            deleteCommentFlag: false,
            TagDescription: 'Are you sure you want to delete the tag you selected? Once you delete a tag, it will be removed from all videos and responses that it has been used. This action cannot be undone.',
            newTagList: [],
            oldText: '',
            videoTitle: '',
            disableSaveButton: false,
            videoPlayList: [],
            selectedCharacter: [],
            showAnnotationCard: false,
            mainThemeList: {},
            parentKeys: [],
            isEditTranscriptFlag: false,
            knitThemeId: null,
            themeTreeData: {},
            // expandedItemsList: {},
        };
        this.box = React.createRef();
        this.transcript = React.createRef();
    }

    componentDidMount = () => {
        document.addEventListener('click', this.handleOutsideClick);
        window.addEventListener('scroll', this.handleScroll);
        window.scrollTo(0, 0);
        if (cookie.get("user_Id")) {
            this.setState({ userId: cookie.get('user_Id') })
        }
        if (cookie.get("user_email")) {
            this.setState({ userEmail: cookie.get('user_email') })
        }

        if (this.props.videoData) {
            this.setState({ videoPlayList: this.props.videoData[0].questionData })
        }

        let projectId = getQueryStringValue();
        let videoId = getQueryStringValueVideoId()
        if (this.props.videoId) {
            this.setState({ videoId: this.props.videoId }, () => {
                this.getVideoDetails(this.state.videoId)
                this.getTagDetails()
            })
            // this.setState({videoId:"6104f4df7d11a1000195a33d"})
        } else if (videoId) {
            this.setState({ videoId: videoId }, () => {
                this.getVideoDetails(this.state.videoId)
                this.getTagDetails()
            })
        } else {
        }

        if (this.props.projectId) {
            this.setState({ projectId: this.props.projectId }, () => {
                this.getThemeDetails()
            })
        } else if (projectId) {
            this.setState({ projectId: this.props.projectId }, () => {
                this.getThemeDetails()
            })
        } else {
        }

    }
    handleCheckedReel = (title, status, showReelId) => {
        this.setState({
            selectedShowReelId: showReelId,
        })
    }

    handleRedirectOpenText=(questionId,numericQuestionId)=>{
        let {history}=this.props;
       
          history.push({
            pathname:"/knit/projectsDetails/"+this.state.projectId+"/Data?view=grid&questionId="+questionId+"&numericId="+numericQuestionId,
            state:{
              questionId:questionId,
              numericQuestionId:numericQuestionId,
              projectId:this.state.projectId
            }
          })
      }



    //API to Add VideoInto the showreel
    handleAddToShowreel = () => {
        let highlightLink = [];
        let videoId = [];
        videoId.push(this.state.videoId)
        highlightLink.push(this.state.videoHighLightLink)
        let updateReelVideoData = {
            "project_showreels_id": this.state.selectedShowReelId,
            "video_id_list": videoId,
            "showreel_highlights_link": highlightLink,
            "is_update": true,
        }
        UpdateShowReel(updateReelVideoData).then((response) => {
            if (response.data) {
                // this.getShowReelsDetails()
                this.setState({ showreelModalOpen: false, selectedShowReelId: '' }, () => {
                    this.getAllShowReels()
                })
            }
        })
    }

    //Create Showreel List
    makeShowReelList = (showReelData) => {
        let showreelsList = [];
        let totalUntitleReels = 0;
        Array.isArray(showReelData) &&
            showReelData.length > 0 &&
            showReelData.forEach(responseData => {
                let showReelObj = {};
                showReelObj['id'] = responseData._id.$oid;
                showReelObj['title'] = responseData.showreel_name;
                showReelObj['subTitle'] = responseData.videos_thumbnails.length + " videos";
                showReelObj['videosThumbnails'] = responseData.videos_thumbnails;
                showReelObj['isOpen'] = false;
                if (responseData.showreel_name.includes("Untitled Showreel")) {
                    totalUntitleReels += 1;
                }
                showreelsList.push(showReelObj);
            });
        this.setState({ showreelsList, totalUntitleReels, showreelLoad: true })
    }
    //APi TO get all showreel
    getAllShowReels = () => {
        let outerThis = this;
        outerThis.setState({ showreelLoad: false })
        getAllReelsFromVideoId(this.props.projectId, this.state.videoId).then(response => {
            if (response.data) {
                outerThis.makeShowReelList(response.data);
            }
        })
    }

    //APi For Create Showreel
    getNewTitle = (title) => {
        this.setState({ showreelLoad: false })
        let videoTitle = "";
        if (title) {
            videoTitle = title
        } else {
            videoTitle = "Untitled Showreel " + this.state.totalUntitleReels
        }
        let user_data = {
            "is_blank_showreel_creation": true,
            "knit_project_id": this.props.projectId,
            "knit_user_id": cookie.get("user_Id"),
            "showreel_name": videoTitle,
        }
        newShowReelTitle(user_data).then((response) => {
            if (response.success == true && response.status_code == 200) {
                if (response.data) {
                    // this.setState({selectedShowReelId:response.data[0]._id.$oid},()=>{
                    this.getAllShowReels()
                    // })
                }
            }
        })

    }

    //API For Search showreel from the modal
    searchVideoReel = (searchValue) => {
        let outerThis = this;
        let searchBody = {
            "is_showreel_search": true,
            "showreels_search_by": searchValue,
            "knit_project_id": this.props.projectId
        }
        searchReels(searchBody).then(response => {
            if (response.data) {
                outerThis.makeShowReelList(response.data);
            }
        })
    }
    //function for the showreel Search
    handleReelSearch = (event) => {
        let outerThis = this;
        let { value } = event.target;
        if (event.key === 'Enter' && value && value.trim()) {
            this.searchVideoReel(value);
        } else if (event.key === 'Enter' && value.length == 0) {
            this.getAllShowReels();
        }
    }

    handleRedirect = (title, isNewShowReel, showReelId) => {
        this.setState({ selectedShowReelTitle: title, isNewShowReel: isNewShowReel, selectedShowReelId: showReelId })
        this.setState({
            isShowReelPage: !this.state.isShowReelPage,
            isShowReelDetailsPage: !this.state.isShowReelDetailsPage
        });
    }

    handleClickOpenModel = () => {
        this.getAllShowReels();
        this.setState({
            showreelModalOpen: true,
        });
    };
    handleCloseModel = () => {
        this.setState({
            showreelModalOpen: false,
            selectedShowReelId: ''
        });
    };

    handleCloseBulkModel = (applyTag) => {
        if (applyTag) {
            this.setState({ successAnnotationMessage: true })
        }
        this.setState({
            bulkModalOpen: false,
        });
    };

    //change the URL accroding to playlist
    videoPlaylistRouting = (value, id) => {
        let viewName = getListStringValue();
        return (
            <div>
                {value == 1 ?
                    this.props.history.push({
                        pathname: "/knit/projectsDetails/" + this.state.projectId + "/Data?view=list"
                    })
                    : value == 1 ?
                        this.props.history.push({
                            pathname: "/knit/projectsDetails/" + this.props.location.state.projectid + "/Data?view=grid"
                        })
                        : value == 2 ?
                            this.props.history.push({
                                pathname: "/knit/projectsDetails/" + this.state.projectId + "/Video?view=" + viewName + "/" + id
                            })
                            : value == 2 ?
                                this.props.history.push({
                                    pathname: "/knit/projectsDetails/" + this.state.projectId + "/Video?view=grid"
                                })
                                : value == 2 ?
                                    this.props.history.push({
                                        pathname: "/knit/projectsDetails/" + this.state.projectId + "/Video?view=list"
                                    })
                                    : value == 3 ?
                                        this.props.history.push({
                                            pathname: "/knit/projectsDetails/" + this.state.projectId + "/ShowReels"
                                        })
                                        : value == 4 ?
                                            this.props.history.push({
                                                pathname: "/knit/projectsDetails/" + this.state.projectId + "/Themes"
                                            })
                                            : <></>
                }

            </div>
        )
    }

    //get All details from the particular Id.
    getVideoDetails = (id) => {
        let videoResponseId = "";
        if (id != null && id != undefined) {
            videoResponseId = id
        } else if (this.state.videoId) {
            videoResponseId = this.state.videoId
        }
        this.setState({ videoId: id, videoLink: "" })
        this.setState({ isSentimentsLoad: true, isSummaryLoad: true, isRelatedDataLoad: true })
        let user_data = {
            knit_video_response_id: videoResponseId,
        }
        getVideoDetailsFromId(user_data).then((response) => {
            if (response.data) {
                let transcriptSentiments = []
                if (response.data.transcript_sentiments) {
                    Object.entries(response.data.transcript_sentiments).map(([key, value]) => {
                        transcriptSentiments.push({
                            text: key,
                            percentage: value
                        })
                    })
                }
                this.setState({ isSentimentsLoad: false, transcriptSentiments: transcriptSentiments })
                if (response.data.video_summary) {
                    this.setState({ summary: response.data.video_summary })
                }
                if (response.data.user_response_id && response.data.user_response_id.toString() != '{}') {
                    responseId = response.data.user_response_id.$oid;
                    this.setState({ userResponseId: response.data.user_response_id.$oid }, () => {
                    })
                }
                if (response.data.video_file_link) {
                    this.setState({ videoLink: response.data.video_file_link }, () => {
                    })
                }
                if (response.data.video_feature_title) {
                    this.setState({ videoTitle: response.data.video_feature_title }, () => {
                        this.getVideoPlaylist(response.data.video_feature_title);
                    })
                }

                if (response.data.video_file_name) {
                    this.setState({ videoName: response.data.video_file_name })
                }

                if (response.data.video_highlights_link) {
                    this.setState({ videoHighLightLink: response.data.video_highlights_link }, () => {
                    })
                }
                let questionList = []
                if (response.data.knit_qaultrics_responses) {
                    for (let i in response.data.knit_qaultrics_responses) {
                        if (response.data.knit_qaultrics_responses[i].question_type.type != "HeatMap" && response.data.knit_qaultrics_responses[i].question_type.type != "Draw") {
                            questionList.push({
                                questionId:response.data.knit_qaultrics_responses[i].question_id,
                                numericId:response.data.knit_qaultrics_responses[i].numeric_question_id,
                                questionText: response.data.knit_qaultrics_responses[i].question_text,
                                questionName: response.data.knit_qaultrics_responses[i].question_name,
                                questionType: response.data.knit_qaultrics_responses[i].question_type.type,
                                questionSelector: response.data.knit_qaultrics_responses[i].question_type.selector,
                                questionAnswer: response.data.knit_qaultrics_responses[i].question_answer,
                                expand: false
                            })
                        }
                    }
                    this.setState({ allQuestionList: questionList, isRelatedDataLoad: false })
                }

            }
        })
    }

    //get video playlist if we don't get video playlist
    getVideoPlaylist = (question) => {
        let user_data = {
            "knit_project_id": this.state.projectId
        }
        getGridViewVideoData(user_data).then((response) => {
            let videoCSVData = [];
            let VideoTableData = [];
            let count = 0;
            if (response.data) {

                for (let i in response.data) {
                    if (response.data[i]._id.video_feature_title === question) {
                        this.setState({ videoPlayList: response.data[i].data })
                    }
                }
            }
        });
    }

    generateUpdatedTranscript = (data) => {       
        let tagValue = "";
        let startIndex = 0;
        let numChars = 1;
        let isTagComplete = true;
        let transcript = ""
        let transcriptDetail = [];
        let wordCount = 0;
        let endIndex = 0;
        let highlightGenerationList={}
        let highlights=[];
        let suggestedName = []
        if (data) {
            if(data.video_transcription_timestamps){
                for (let i in data.video_transcription_timestamps) {
                    transcript += data.video_transcription_timestamps[i].value;
                    endIndex += data.video_transcription_timestamps[i].value.length
                    transcriptDetail.push({
                        ts: data.video_transcription_timestamps[i].ts,
                        end_ts: data.video_transcription_timestamps[i].end_ts,
                        value: data.video_transcription_timestamps[i].value,
                        startIndex: wordCount,
                        endIndex: endIndex,
                        unique_element_key: data.video_transcription_timestamps[i].unique_element_key,
                        confidence: data.video_transcription_timestamps[i].confidence,
                        type: data.video_transcription_timestamps[i].type,
                        highlight_dtls: data.video_transcription_timestamps[i].highlight_dtls
                    })

                    if(data.video_transcription_timestamps[i].highlight_dtls){
                        for(let j in data.video_transcription_timestamps[i].highlight_dtls){
                            let tagId=data.video_transcription_timestamps[i].highlight_dtls[j].tag_id;
                            let tagUsageId=data.video_transcription_timestamps[i].highlight_dtls[j].tag_usage_id;
                            let suggestedTagUsageId = data.video_transcription_timestamps[i].highlight_dtls[j].suggested_tag_id
                            // if(!data.video_transcription_timestamps[i].highlight_dtls[j].is_suggested){
                                if((tagUsageId && Object.keys(highlightGenerationList).includes(tagUsageId)) ||
                                     (suggestedTagUsageId && Object.keys(highlightGenerationList).includes(suggestedTagUsageId)) ){
                           
                                    if(suggestedTagUsageId){
                                         startIndex=wordCount;
                                         numChars += data.video_transcription_timestamps[i].value.length
                                         highlightGenerationList[suggestedTagUsageId].isSelect=false
                                        highlightGenerationList[suggestedTagUsageId].suggestedTagUsageId=data.video_transcription_timestamps[i].highlight_dtls[j].suggested_tag_id
                                        highlightGenerationList[suggestedTagUsageId].tagUsageId=data.video_transcription_timestamps[i].highlight_dtls[j].suggested_tag_id
                                        // highlightGenerationList[tagUsageId].selectedTagName=data.video_transcription_timestamps[i].highlight_dtls[j].tag_name

                                        // highlightGenerationList[suggestedTagUsageId].suggestedTagUsageId=data.video_transcription_timestamps[i].highlight_dtls[j].suggestedTagUsageId
                                        highlightGenerationList[suggestedTagUsageId].themeId=data.video_transcription_timestamps[i].highlight_dtls[j].sequence
                                        highlightGenerationList[suggestedTagUsageId].level=data.video_transcription_timestamps[i].highlight_dtls[j].level
                                        highlightGenerationList[suggestedTagUsageId].isSuggested=true
                                    }else{
                                        isTagComplete=false
                                        startIndex=wordCount;
                                        numChars += data.video_transcription_timestamps[i].value.length
                                        highlightGenerationList[tagUsageId].themeId=data.video_transcription_timestamps[i].highlight_dtls[j].sequence
                                        highlightGenerationList[tagUsageId].level=data.video_transcription_timestamps[i].highlight_dtls[j].level
                                        highlightGenerationList[tagUsageId].selectedText=false
                                        highlightGenerationList[tagUsageId].name= this.state.userEmail
                                        highlightGenerationList[tagUsageId].tagUsageId=data.video_transcription_timestamps[i].highlight_dtls[j].tag_usage_id
                                        highlightGenerationList[tagUsageId].isSelect=false
                                        highlightGenerationList[tagUsageId].description=''
                                        highlightGenerationList[tagUsageId].selectedTagName=highlightGenerationList[tagUsageId].selectedTagName+ data.video_transcription_timestamps[i].value
                                        tagValue+=data.video_transcription_timestamps[i].value
                                        highlightGenerationList[tagUsageId].numChars=highlightGenerationList[tagUsageId].selectedTagName.length
                                        
                                    }
                                }else{
                                 tagValue=''
                                 tagValue=data.video_transcription_timestamps[i].value
                                numChars=data.video_transcription_timestamps[i].value.length
                                
                                if(suggestedTagUsageId){
                                    highlightGenerationList[suggestedTagUsageId]={
                                        startIndex:wordCount,
                                        numChars: data.video_transcription_timestamps[i].value.length,
                                        // tagId : tagId,
                                        themeId: data.video_transcription_timestamps[i].highlight_dtls[j].sequence,
                                        level: data.video_transcription_timestamps[i].highlight_dtls[j].level,
                                        selectedText:false,
                                        isSuggested:true,
                                        // name: this.state.userEmail,
                                        tagUsageId: data.video_transcription_timestamps[i].highlight_dtls[j].suggested_tag_id,
                                        suggestedTagUsageId: data.video_transcription_timestamps[i].highlight_dtls[j].suggested_tag_id,
                                        isSelect: false,
                                        description:'',
                                        // selectedTagName: data.video_transcription_timestamps[i].highlight_dtls[j].tag_name,
                                    }
                                
                                }else{
                                    highlightGenerationList[tagUsageId]={
                                        startIndex:wordCount,
                                        numChars: data.video_transcription_timestamps[i].value.length,
                                        tagId : tagId,
                                        themeId: data.video_transcription_timestamps[i].highlight_dtls[j].sequence,
                                        level: data.video_transcription_timestamps[i].highlight_dtls[j].level,
                                        selectedText:false,
                                        name: this.state.userEmail,
                                        tagUsageId: data.video_transcription_timestamps[i].highlight_dtls[j].tag_usage_id,
                                        isSelect: false,
                                        description:'',
                                        selectedTagName: data.video_transcription_timestamps[i].value
                                    }
                                }
                            }
                            // }
                          
                    }
                    //is_suggested Ai_tag name start
                    for(let k in  data.video_transcription_timestamps[i].highlight_dtls){
                        if(data.video_transcription_timestamps[i].highlight_dtls[k].is_suggested === true){
                            suggestedName.push(data.video_transcription_timestamps[i].highlight_dtls[k].tag_name)
                        }
                    }
                   //is_suggested Ai_tag name end
                    }else{
                      tagValue=""
                      isTagComplete=true
                    }
                    wordCount = wordCount + data.video_transcription_timestamps[i].value.length;
                }
                Object.entries(highlightGenerationList).map(([key, value]) => {
                    highlights.push(value)
                })                
            }
            let suggestedTagDetails=[]
            for(let i in data.suggested_tag_dtls){
                suggestedTagDetails.push(data.suggested_tag_dtls[i])
                for(let j in highlights){
                    if(highlights[j].suggestedTagUsageId == data.suggested_tag_dtls[i]._id.$oid){
                        highlights[j].selectedTagName = data.suggested_tag_dtls[i].tag_suggested_text
                        highlights[j].numChars = data.suggested_tag_dtls[i].tag_suggested_text.length
                        highlights[j].suggestedTagDetails=data.suggested_tag_dtls[i]
                    }
                }
            }


            for(let i in data.tag_dtls){
                for(let j in highlights){
                    if(data.tag_dtls[i].tag_id && JSON.stringify(data.tag_dtls[i].tag_usage_id) != '{}'){
                        if(highlights[j].tagUsageId == data.tag_dtls[i].tag_usage_id.$oid){
                            highlights[j].tags=data.tag_dtls[i].tag_name
                            highlights[j].id=Number(j)
                            highlights[j].description=data.tag_dtls[i].comment
                            highlights[j].comment_associated_text=data.tag_dtls[i].comment_associated_text
                            highlights[j].comment_associated_text_timestamp=data.tag_dtls[i].comment_associated_text_timestamp
                            if(data.tag_dtls[i].comment_id && JSON.stringify(data.tag_dtls[i].comment_id) != '{}' )
                            {
                              highlights[j].commentId=data.tag_dtls[i].comment_id.$oid
                            }
                          }    
                    }
                }
                
            }
            this.setState({
                transcript: transcript,
                highlights: highlights,
                isSummaryLoad: false,
                isTranscriptLoad: false,
                transcriptDetail,
                suggestedTagDetails:suggestedTagDetails
        })
        }
    }

    //get transscript and annotation details
    getTagDetails = (id) => {
        let videoResponseId = ""
        this.setState({highlights:[]})
        if (id != null) {
            videoResponseId = id
        } else if (this.state.videoId) {
            videoResponseId = this.state.videoId
            this.setState({ isTranscriptLoad: true })
        }
        getVideoTagDetails(videoResponseId).then((response) => {
            this.generateUpdatedTranscript(response.data)
        })
    }

    // Return true if theme has subTheme otherwise it retuns false
    checkThemeChild = (data) => {
        if (Array.isArray(data.children) && data.children.length > 0) {
            return true;
        }
        return false;
    }

    // Return true if theme has Tag otherwise it retuns false
    checkThemeTag = (data) => {
        if (Array.isArray(data.tags) && data.tags.length > 0) {
            return true;
        }
        return false;
    }



    generateMainThemeList = (childList, rootThemeList) => {
        // let {mainThemeList}= this.state;
        rootThemeList['root'] = {
            index: 'root',
            hasChildren: true,
            children: this.state.parentKeys,
            data: 'Root item',
            type: "theme",
        }

    }

    setDataForTheme = (data) => {
        let { mainThemeList } = this.state;
        mainThemeList.push(data);
    }

    //Generate tags Child Node
    generateChildTags = (childList, path, parentId) => {
        let { mainThemeList, parentKeys } = this.state;
        let newChidList = {};
        let mainNewList = {}
        // let new/PathName='';
        // childList=this.getTagNameFromSubTheme(childLis)
        if (childList.tags) {
            for (let i in childList.tags) {
                let newPathName = path
                let keyName = childList.tags[i]._id

                newChidList = {
                    index: childList.tags[i]._id,
                    hasChildren: false,
                    canMove: true,
                    level: childList.tags[i].level,
                    sequence: childList.sequence,
                    data: childList.tags[i].title,
                    color: appThemeColor(childList.sequence + 1, childList.tags[i].level),
                    type: "TAG",
                    isPopper: false,
                    path: path ,
                    parentId: parentId,
                    id: childList.tags[i]._id
                }
                mainThemeList[keyName] = newChidList
            }
        } else {
            this.generateChildTags(childList.children, path, parentId)
        }
    }

    //Generate Sub Theme Child Node
    generateChildSubTheme = (childList, path, parentId) => {
        let { mainThemeList, parentKeys } = this.state;
        let newPath;
        if (path != '') {
            newPath = path + childList.title + ' > '
        } else {
            newPath = childList.title + ' > '
        }
        let newChidList = {};
        let mainNewList = {}
        if (Array.isArray(childList.children) && childList.children.length > 0) {
            for (let i in childList.children) {

                let keyName = childList._id

                newChidList = {
                    index: childList._id,
                    hasChildren: this.checkThemeChild(childList) || this.checkThemeTag(childList),
                    children: this.getTagNameFromSubTheme(childList),
                    level: childList.level,
                    sequence: childList.sequence,
                    data: childList.title,
                    canMove: true,
                    color: appThemeColor(childList.sequence + 1, childList.level),
                    type: childList.type,
                    isPopper: false,
                    path: newPath,
                    parentId: parentId,
                    id: childList._id
                }
                if (Array.isArray(childList.tags) && childList.tags.length > 0) {
                    this.generateChildTags(childList, newPath, childList._id);
                }
                mainThemeList[keyName] = newChidList
                this.generateChild(childList.children[i], newPath, childList._id)

            }
        } else {
            newChidList = {
                index: childList._id,
                hasChildren: this.checkThemeChild(childList) || this.checkThemeTag(childList),
                level: childList.level,
                sequence: childList.sequence,
                children: this.getTagNameFromSubTheme(childList),
                data: childList.title,
                type: childList.type,
                canMove: true,
                color: appThemeColor(childList.sequence + 1, childList.level),
                isPopper: false,
                path: newPath,
                parentId: parentId,
                id: childList._id
            }
            mainThemeList[childList._id] = newChidList
            if (Array.isArray(childList.tags) && childList.tags.length > 0) {
                this.generateChildTags(childList, newPath, childList._id);
            }
        }
    }


    //generate multiple level Child Nodes
    generateChild = (childList, path, parentId) => {
        this.generateChildSubTheme(childList, path, parentId)
    }

    //get All Tag Name
    getTagNameFromSubTheme = (childList) => {
        let childTagList = [];
        if (childList.tags) {
            for (let i in childList.tags) {
                childTagList.push(childList.tags[i]._id)
            }
        }
        if (childList.children) {
            for (let i in childList.children) {
                childTagList.push(childList.children[i]._id)
            }
        }
        return childTagList;
    }



    // expandedItemsList = (item)=>{
    // this.setexpandedItemsList={
    //     expandedItemsList : item
    // }
    // }




    //get All Theme Details
    getThemeDetails = () => {
        this.setState({
            mainThemeList: {},
            parentKeys: []
        })
        getThemeDetails(this.state.projectId).then((response) => {
            if (response.data && response.data.length > 0) {
                let { mainThemeList, parentKeys } = this.state;
                let themeTreeData = {}
                let child = [];
                for (let i in response.data) {
                    if (this.checkThemeChild(response.data[i])) {
                        parentKeys.push(response.data[i]._id)
                        this.generateChild(response.data[i], '', response.data[i]._id)
                    } else {
                        let childList = []
                        if (this.checkThemeTag(response.data[i])) {
                            childList = this.getTagNameFromSubTheme(response.data[i])
                            this.generateChildTags(response.data[i], response.data[i].title + ' > ', response.data[i]._id)
                        }
                        let themeList = {
                            index: response.data[i]._id,
                            hasChildren: this.checkThemeChild(response.data[i]) || this.checkThemeTag(response.data[i]),
                            level: response.data[i].level,
                            children: childList,
                            canMove: true,
                            sequence: response.data[i].sequence,
                            data: response.data[i].title,
                            type: response.data[i].type,
                            id: response.data[i]._id,
                            parentId: response.data[i]._id,
                            isPopper: false,
                            color: appThemeColor(response.data[i].sequence + 1, response.data[i].level),
                            path: response.data[i].title + "  >  "
                        }
                        var keyName = response.data[i]._id;
                        mainThemeList[keyName] = themeList;
                        parentKeys.push(keyName)
                    }
                }
                this.generateMainThemeList(parentKeys, mainThemeList)
                themeTreeData = mainThemeList;
                this.setState({ themeTreeData })
            }
        })
    }

    //delete Annotation card for the Annotation Card/tag card
    tagUsageDeleteAction = (id) => {
        let commentId = id;
        tagUsageDeleteAction(commentId).then((response) => {
            this.setState({ deleteCommentFlag: false })
            this.getTagDetails(this.state.videoId)
        })
    }

    //Delete Annotation card for the standalone comment
    tagCardOperation = (id) => {
        let user_data = {
            "comment_id": id,
            "is_deleted": true
        }
        tagCardOperation(user_data).then((response) => {
            if (response.data && response.status_code == 200) {
                let { highlights } = this.state;
                // this.getTagDetails()

                for (let i in highlights) {
                    if (response.data._id.$oid == highlights[i].commentId) {
                        highlights[i].description = "";
                        highlights[i].isEdit = false;
                    }
                }
                this.setState({ highlights: this.state.highlights, deleteCommentFlag: false }, () => {
                    this.getTagDetails(this.state.videoId)
                })

            }
        })
    }

    handleScroll = () => {
        this.setState({ x: this.state.x, y: this.state.y })
    }

    handleOutsideClick = (event) => {
        if (this.box && this.box.current != null && !this.box.current.contains(event.target) && this.transcript && !this.transcript.current.contains(event.target)) {
            this.state.highlights.map((item, index) => {
                item.isOpen = false;
                item.isSelect = false;
                // item.isEdit=false
            })
            this.setState({ highights: this.state.highlights })
        }
    }


    makeDownloadableVideo = (blob, filename) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // the filename you want
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.setState({ loading: false })
    }

    downloadVideo = () => {
        let videoFilename = this.props.videoFileName ? this.props.videoFileName : this.state.videoName ? this.state.videoName : ""
        this.setState({ loading: true })
        fetch(this.state.videoLink)
            .then(response => response.blob()
                .then(blob => this.makeDownloadableVideo(blob, videoFilename)))
    }

    handleBulkModal = () => {
        this.setState({ bulkModalOpen: true })
    }

    /*Outside Click Annotaiton Hide Start*/
    hiddleOutSideAnnotation = () => {
        this.setState({
            showAnnotationCard: false,
            selectedText:'',
        })
        this.removeSelectedText()
    }
    /*Outside Click Annotaiton Hide End*/

  

    renderTitle = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} md={6} lg={6} sm={6} className={"header-div"}>
                    <img src={BackArrow} className={"back-arrow"} onClick={() => {
                        this.props.handleBack()
                    }} />
                    <Typography variant={"h6"} component={"h6"} className={"title"}>
                        {this.props.videoFileName
                            ? this.props.videoFileName
                            : this.state.videoName
                                ? this.state.videoName
                                : ""}
                    </Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={6} className={"flex-div"}>
                    <Button className={"download-text"}
                        onClick={this.downloadVideo}>
                        <img src={Download} className={"iconImage download-icon"}></img>
                        Download
                    </Button>
                    <Button
                        className={"download-text"}
                        onClick={this.handleClickOpenModel}>
                        <img src={ShowReelsIcon} className={"iconImage reelIcon"} />
                        Add To Showreel


                    </Button>
                    <ButtonComponent
                        iconPosition={"left"}
                        className={"showreelBtn"}
                        icon={<img src={Flash} className={"iconImage"} />}
                        text={"Bulk Annotate"}
                        width={"auto"}
                        fontWeight={500}
                        onClick={() => {
                            this.handleBulkModal()
                        }}
                        margin={"10px 0px 10px 10px"}
                    />

                    {
                        this.state.bulkModalOpen &&
                        <BulkAnnotationModal
                            userResponseId={this.state.userResponseId}
                            videoId={this.state.videoId}
                            projectId={this.props.projectId} open={this.state.bulkModalOpen}
                            onHandleClose={(applyTag) => { this.handleCloseBulkModel(applyTag); this.getTagDetails(this.state.videoId) }}
                            getTagDetails={() => {this.getTagDetails()}}
                        ></BulkAnnotationModal>
                    }
                </Grid>
            </Grid>
        );
    };

    renderStates = () => {
        return (
            <>
                <Grid container className={"divMargin"}>
                    <Grid item xs={12} md={12} sm={12} lg={12}>
                        <Typography className={"questionText"}>
                            {this.props.videoData
                                ? this.props.videoData[0].questionName
                                : this.state.videoTitle
                                    ? this.state.videoTitle
                                    : ""
                            }
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid
                        item
                        xs={12}
                        md={12}
                        sm={12}
                        lg={12}
                        style={{ height: 350 }}
                    >
                        {this.renderPlayList()}
                    </Grid>
                </Grid>
            </>
        );
    };

    renderPlayList = () => {
        return (
            <Grid container spacing={0}>
                <div className={"video-div"}>
                    {this.state.videoLink &&
                        <video width="100%" height="350px" controls style={{ borderRadius: "10px", background: "#000" }}>
                            <source src={this.state.videoLink} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    }
                    {!this.state.videoLink &&
                        <Skeleton variant={"react"} style={{ height: 350, borderRadius: 10 }}></Skeleton>
                    }
                </div>
                <div className={"main-playList-card"}>
                    <Card className={"playlistCard"}>
                        <Grid container>
                            <Grid item xs={12} md={12} lg={12} sm={12} className={"playlistDiv"}>
                                <Typography className={"playListText"}>
                                    Playlist
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={12} lg={12} sm={12} className={"list-div"}>
                                {this.state.videoId && this.state.videoPlayList && this.state.videoPlayList.length > 0 && this.state.videoPlayList.map((item, index) => {
                                    return (
                                        <div
                                            className={item._id.$oid == this.state.videoId ? "div-list-active" : "div-list"}
                                            key={index}
                                            onClick={() => {
                                                this.getThemeDetails();
                                                this.getTagDetails(item._id.$oid);
                                                this.getVideoDetails(item._id.$oid);
                                                this.videoPlaylistRouting(2, item._id.$oid)
                                            }}>
                                            <img src={item.video_thumbnail_url} className={"video-playlist-thumbnail"} />
                                            <div className={"inside-space"}>
                                                <Typography className={"playlist-video-title"}>
                                                    {item.video_file_name ? item.video_file_name : ""}
                                                </Typography>
                                                <Typography className={"playlist-video-question"}>
                                                    {this.state.videoTitle && this.state.videoTitle}
                                                </Typography>
                                                <Typography className={"playlist-video-duration"}>
                                                    {item.original_video_duration ? secondsToHms(item.original_video_duration) : ""}
                                                </Typography>
                                            </div>
                                        </div>
                                    )
                                })}
                            </Grid>
                        </Grid>
                    </Card>
                </div>
                {/* </Grid> */}
            </Grid>
        )
    }

    getCompareString = (tag) => {
        let newJson = [];
        newJson = this.state.highlights.filter(el => el.selectedTagName.includes(tag.toString().trim()))
        if (newJson.length > 0) {
            if(newJson.length>1){
                // let suggestedList=newJson.filter(el => el.isSuggested == )
                let min = Math.min(...newJson.map(item => item.numChars))
                newJson = newJson.filter(item => item.numChars === min)            
            }
            // if(newJson[0].isSuggested){
            //     this.handleShuffle(newJson[0].suggestedTagUsageId)    
            // }else{
                this.handleShuffle(newJson[0].tagUsageId)
            // }
        }

    }
    onMouseSelect = (e) => {
        let tanscriptWidth = document.getElementById("transcriptCard").offsetTop - 15;
        this.setState({
            isAddTheme: false,
            isCommentCard: false,
            showAnnotationCard:false,
            isThemeButton: false,
            tanscriptWidth: tanscriptWidth,
        })
        this.getCompareString(e.target.innerText)
        this.setState({
            x: e.pageX, y: e.pageY
        }, () => {
            this.handleClick(e)
        });
    };

    handleClick = (event) => {
        if (this.state.selectedText != " " && this.state.selectedText != null && this.state.selectedText != "") {            
            this.setState({ anchorEl: event.currentTarget, open: true, isAddTheme: true ,showAnnotationCard: true});            
        }
    };

    removeSelectedText = () => {
        let { highlights } = this.state;
        highlights = highlights.filter(el => el.selectedText == false)
        this.setState({ highlights: highlights })
    }
    handleClose = () => {
        this.removeSelectedText()
        this.setState({ anchorEl: null, open: false, themeOpen: false, selectedText: "" },
            () => { });
    };


    insertTag = (newValue, themeFlag) => {
        insertTag(newValue).then((response) => {
            if (response.status_code == 200 && response.data) {
                this.setState({ showAnnotationCard: false,selectedText:'' })
                this.getThemeDetails()
                
                if (!themeFlag) {
                    this.getTagDetails(this.state.videoId)
                    //this.getVideoDetails(this.state.videoId)
                }
            }
        })
    }
    handleTextChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }

    
    customClassFn = (e) => {

        let size = this.state.highlights.length - 1;
        if (e.length > 0) {
            let className = ""
            let themeColors=[]
            e.map((defaultLength) =>{
                if (defaultLength <= size) {
                    if (this.state.highlights[defaultLength].themeId == 0) {
                        className += this.state.highlights[defaultLength].isSelect ? "highlighted-theme0-active" : "highlighted-theme0"
                        className += " "
                        themeColors.push(0)
                    } else if (this.state.highlights[defaultLength].themeId == 1) {
                        className += this.state.highlights[defaultLength].isSelect ? "highlighted-theme1-active" : "highlighted-theme1"
                        className += " "
                        themeColors.push(1)
                    } else if (this.state.highlights[defaultLength].themeId == 2) {
                        className += this.state.highlights[defaultLength].isSelect ? "highlighted-theme2-active" : "highlighted-theme2"
                        className += " "
                        themeColors.push(2)
                    } else if (this.state.highlights[defaultLength].themeId == 3) {
                        className += this.state.highlights[defaultLength].isSelect ? "highlighted-theme3-active" : "highlighted-theme3"
                        className += " "
                        themeColors.push(3)
                    } else if (this.state.highlights[defaultLength].themeId == 4) {
                        className += this.state.highlights[defaultLength].isSelect ? "highlighted-theme4-active" : "highlighted-theme4"
                        className += " "
                        themeColors.push(4)
                    } else if (this.state.highlights[defaultLength].themeId == 5) {
                        className += this.state.highlights[defaultLength].isSelect ? "highlighted-theme5-active" : "highlighted-theme5"
                        className += " "
                        themeColors.push(5)
                    } else if (this.state.highlights[defaultLength].themeId == 6) {
                        className += this.state.highlights[defaultLength].isSelect ? "highlighted-theme6-active" : "highlighted-theme6"
                        className += " "
                        themeColors.push(6)
                    } else if (this.state.highlights[defaultLength].themeId == 7) {
                        className += this.state.highlights[defaultLength].isSelect ? "highlighted-theme7-active" : "highlighted-theme7"
                        className += " "
                        themeColors.push(7)
                    }
                    
                } else {
                    className += "selected-text"
                    className += " "
                }
                if (e.length > 1 && !className.includes('active') && !className.includes('selected-text')){
                    let mixedColor=''
                    for(let i=0;i<themeColors.length;i++){
                        let firstTheme=themeColors[i] == 0 ? 'rgba(108, 108, 108 , 0.2)' : themeColors[i];
                        let secondTheme=themeColors[i+1] == 0 ? 'rgba(108, 108, 108 , 0.2)' : themeColors[i+1];
                        if(mixedColor == ''){
                            let color1=appThemeColor(firstTheme,0.2);
                            let color2=appThemeColor(secondTheme,0.2)
                            mixedColor=getCombineThemeColor(color1,color2)
                       }else{
                            if(themeColors.length>2)
                            mixedColor=getCombineThemeColor(mixedColor,appThemeColor(secondTheme,0.2))
                        }
                    }
                    
                    let count= Math.round(Math.random() * 1000);
                    var style = document.createElement('style');
                    style.type = 'text/css';
                    style.innerHTML = '.mergeTheme'+count+'{ background-color:'+ mixedColor +' }';
                    document.getElementsByTagName('head')[0].appendChild(style);
    
                    className += 'mix-color '
                    className += 'mergeTheme'+count + ' '
                }

            })
            return className
        }
    }

    selectionHandler = (selected, startIndex, numChars) => {
        if (selected != null) {
            let newList = this.state.highlights.filter((el) => el.selectedTagName == selected);
            if (newList.length == 0) {
                let totalwords = startIndex + numChars;
                let newSelectedList = [];
                let count = 0;
                let transcriptEndIndexflag
                for (let i = 0; i < this.state.transcriptDetail.length; i++) {
                    if (startIndex >= this.state.transcriptDetail[i].startIndex && startIndex < this.state.transcriptDetail[i].endIndex) {
                        transcriptEndIndexflag = true
                    }
                    if (transcriptEndIndexflag === true) {
                        newSelectedList.push({
                            confidence: this.state.transcriptDetail[i].confidence,
                            end_ts: this.state.transcriptDetail[i].end_ts,
                            ts: this.state.transcriptDetail[i].ts,
                            type: this.state.transcriptDetail[i].type,
                            unique_element_key: this.state.transcriptDetail[i].unique_element_key,
                            value: this.state.transcriptDetail[i].value
                        });

                    }
                    if (this.state.transcriptDetail[i].endIndex >= totalwords) {
                        transcriptEndIndexflag = false
                    }
                }
                this.setState({
                    text: this.state.text,
                    highights: this.state.highlights.push({
                        id: this.state.highlights.length + 1,
                        startIndex: startIndex,
                        numChars: numChars,
                        tags: selected,
                        selectedText: true,
                        themeId: 0,
                        name: this.state.userEmail,
                        isSelect: false,
                        isOpen: false,
                        selectedTagName: selected
                    }),
                    selectedText: selected,
                    newSelectedList
                })
            }
        }
    }

    handleAnnotationMessageClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ successAnnotationMessage: false })
        // setOpen(false);
    };

    handleChangeTextbox = () => {
        this.setState({ transcriptTextbox: true })
    }

    handleTranscriptChange = (event) => {
        if (event.target.value.length > 0) {
            this.setState({ transcript: event.target.value, disableSaveButton: false })
        } else {
            this.setState({ transcript: event.target.value, disableSaveButton: true })
        }
    }

    handleTextBoxClick = (ctl, newTagList) => {
        // for(let i=ctl.selectionStart;i<ctl.selectionEnd;i++){
        for (let i = ctl.selectionEnd - 1; i >= ctl.selectionStart; i--) {
            newTagList.push({
                '_id': i,
                'value': this.state.transcript[i],
                'type': "delete"
            })

        }
        return newTagList;
    }

    handleKeyUp = (event) => {
        let value = "";
        var ctl = document.getElementById('filter');
        let { newTagList, selectedCharacter } = this.state;

        // this.setState{oldText}
        value = event.target.value;
        if ((event.ctrlKey && event.key === 'z') || (event.ctrlKey && event.key === 'v') || event.keyCode == 13) {
            event.preventDefault();
            return false;
        }

        if (event.keyCode == 8 || event.keyCode == 46) {
            if (ctl.selectionStart != ctl.selectionEnd) {
                newTagList = this.handleTextBoxClick(ctl, newTagList);
            } else {
                let selectedIndex = ctl.selectionStart - 1;
                if (event.keyCode == 46) {
                    selectedIndex = ctl.selectionStart
                }
                newTagList.push({
                    '_id': selectedIndex,
                    'value': this.state.transcript[selectedIndex],
                    'type': "delete"
                })
            }
        } else {
            // if((event.key.match(letters) || event.key.match(regex)) && !keyNames.includes(event.key)){
            var charCode = event.keyCode;
            if ((charCode >= 65 && charCode <= 90) || (charCode >= 96 && charCode <= 111) ||
                (charCode >= 48 && charCode <= 57) || (charCode >= 186 && charCode <= 192) ||
                (charCode >= 219 && charCode <= 222) || charCode == 32) {
                newTagList = this.handleTextBoxClick(ctl, newTagList)
                newTagList.push({
                    '_id': ctl.selectionStart,
                    'value': event.key,
                    "type": "append"
                })
            } else {
                if (charCode <= 37 && charCode >= 40) {
                    event.preventDefault();
                    return false;
                }
            }
        }
        this.setState({ newTagList: newTagList, transcript: event.target.value })
    }


    renderTranscript = () => {
        return (
            <Grid container spacing={0}>
                <Grid item xs={12} md={6} lg={6} sm={6}>
                    <Typography className={"mainLabel mb-0 pd-bottom"} id={"transcriptCard"}>Transcript</Typography>
                </Grid>
                <Grid item xs={12} md={6} lg={6} sm={6} className={"edit-transcript-button"}>
                    {!this.state.transcriptTextbox &&
                        <Button className={"mainLabel mb-0 download-text pd-bottom"}
                            onClick={() => {
                                this.handleChangeTextbox()
                            }}>
                            Edit
                        </Button>
                    }
                </Grid>
                <div ref={this.transcript} style={{ width: "100%" }}>
                    <Grid item xs={12} md={12} lg={12} sm={12}>
                        {this.state.isTranscriptLoad &&
                            <div className={"main-transcript-card"}>
                                <Skeleton variant="text" width={"100%"} />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                            </div>
                        }
                        {!this.state.isTranscriptLoad &&
                            <Card
                                className={this.state.transcriptTextbox ? "transcriptCard-textbox-active" : "transcriptCard"}
                                id={'mainTranscript'}
                            >   <span onMouseUp={(e) => {
                                        this.onMouseSelect(e);
                                    }}>

                            
                                {this.state.transcriptTextbox ?
                                    <>
                                        <textarea type="text" value={this.state.transcript} id="filter"
                                            onChange={(event) => {
                                                this.handleTranscriptChange(event)
                                            }}
                                            onKeyDown={(event) => {
                                                this.handleKeyUp(event)
                                            }} className={"renderTranscriptTextbox"}
                                            onPaste={(e) => {
                                                e.preventDefault()
                                            }} />
                                        <div>
                                            <ButtonComponent
                                                iconPosition={"left"}
                                                className={"showreelBtn"}
                                                text={"Save"}
                                                width={"auto"}
                                                fontWeight={500}
                                                disabled={this.state.disableSaveButton}
                                                onClick={() => {
                                                    this.updateTranscript()
                                                }}
                                                margin={"0px"}
                                            />
                                            <Button className={"download-text"}
                                                onClick={() => {
                                                    this.setState({
                                                        transcript: this.state.oldText,
                                                        transcriptTextbox: false,
                                                        newTagList: [],
                                                        selectedCharacter: []
                                                    })
                                                }}
                                                disabled={this.state.disableSaveButton}>
                                                Cancel
                                            </Button>
                                        </div>

                                    </>
                                    :
                                    <InteractiveHighlighter
                                        text={this.state.transcript}
                                        highlights={this.state.highlights}
                                        // customClass={"highlighted-theme1"}
                                        customClassFn={this.customClassFn}

                                        selectionHandler={this.selectionHandler}
                                    />
                                }
                                <div class="mainTranscriptDiv">
                                    {this.state.isEditTranscriptFlag && <AuthLoader />}
                                </div>
                                </span>
                            </Card>
                        }
                    </Grid>


                </div>
            </Grid>
        );
    };

    handleSkip = (data, index, level, id) => {
        if (data) {
            if (index != null) {
                this.setState({
                    isAddTheme: false,
                    tagName: data,
                    tagThemeIndex: index,
                    tagLevel: level,
                    tagId: id
                }, () => {
                    this.handleAddComment(true)
                })
            } else {
                this.setState({ isCommentCard: true, isAddTheme: false, isTagAnnotationCard: true, tagName: data })
            }
        } else {
            this.setState({ isCommentCard: true, isAddTheme: false, isTagAnnotationCard: false })
        }
    }

    handleChange = (item) => {
        item.expand = !item.expand;
        this.setState({ questionList: this.state.questionList });
    }

    handleAllExpand = () => {
        let { allQuestionList } = this.state;
        allQuestionList.map((item, index) => {
            item.expand = !this.state.isAllExpand;
        })
        this.setState({ allQuestionList: this.state.allQuestionList, isAllExpand: !this.state.isAllExpand });
    }

    renderRelatedData = () => {
        return (
            <Grid container>
                <Grid item xs={12} md={8} lg={8} sm={12}>
                    <Typography className={"mainLabel"}>Related Data</Typography>
                </Grid>
                <Grid item xs={12} md={4} lg={4} sm={12}>
                    <Typography className={"expandText flex-div"} style={{ color: "#001839" }} onClick={() => {
                        this.handleAllExpand()
                    }}>Expand All</Typography>
                </Grid>
                <Grid item xs={12} md={12} lg={12} sm={12}>
                    {this.state.isRelatedDataLoad ?
                        <>
                            <div style={{
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                                height: 30,
                                border: "1px solid #e2e2e2",
                                padding: 15
                            }}>
                                <Skeleton variant={"text"} />
                            </div>
                            <div style={{ height: 50, border: "1px solid #e2e2e2", padding: 15 }}>
                                <Skeleton variant={"text"} />
                            </div>
                            <div style={{ height: 50, border: "1px solid #e2e2e2", padding: 15 }}>
                                <Skeleton variant={"text"} />
                            </div>
                            <div style={{
                                borderBottomLeftRadius: 10,
                                borderBottomRightRadius: 10,
                                height: 50,
                                border: "1px solid #e2e2e2",
                                padding: 15
                            }}>
                                <Skeleton variant={"text"} />
                            </div>
                        </>
                        :
                        !this.state.isRelatedDataLoad &&
                        this.state.allQuestionList && this.state.allQuestionList.map((item, index) => {
                            let questionTitle = item.questionName + " " + item.questionText
                            let questionAnswer;
                            if (Array.isArray(item.questionAnswer)) {
                                questionAnswer = item.questionAnswer.join(", ");
                            } else {
                                questionAnswer = item.questionAnswer;
                            }

                            return (
                                <Accordion key={index} text={questionTitle} width={"100%"} selector={item.questionSelector}
                                    answer={questionAnswer} type={item.questionType} expand={item.expand}
                                    handleChange={() => this.handleChange(item)} handleRedirectOpenText={()=>{this.handleRedirectOpenText(item.questionId,item.numericId)}}></Accordion>
                            )
                        })
                    }
                </Grid>
            </Grid>
        )
    }

    renderAnalysis = () => {
        return (
            <Grid container>
                <Grid item xs={12} md={12} sm={12} lg={12}>
                    <Typography className={"mainLabel"}>Analysis</Typography>
                </Grid>
                <Grid item xs={12} md={12} lg={12} sm={12}>
                    <Card className={"analysisCard"}>
                        <div className={"transcriptText"}>
                            <Typography className={"questionText summary-lable"}>Summary</Typography>
                            {this.state.isSummaryLoad &&
                                <>
                                    <Skeleton variant={"text"}></Skeleton>
                                    <Skeleton variant={"text"}></Skeleton>
                                </>}
                            {!this.state.isSummaryLoad &&
                                <Typography className={"transcriptText"}>
                                    {this.state.summary}
                                </Typography>
                            }

                            {this.renderSentimentBreakDown()}
                            {/* {this.renderTagFrequency()} */}
                        </div>
                    </Card>
                </Grid>
            </Grid>
        );
    };

    renderTagFrequency = () => {
        return (
            <>
                <Typography className={"divMargin tagFrequencyLabel"}>Tag Frequency</Typography>
                <div className={"f-div"}>
                    <TagFrequency className={"tagFrequency"} height={51} width={51} fontSize={12}></TagFrequency>
                    <TagFrequency className={"tagFrequency"} height={60} width={60} fontSize={12}></TagFrequency>
                    <TagFrequency className={"tagFrequency"} height={71} width={71} fontSize={12}></TagFrequency>
                    <TagFrequency className={"tagFrequency"} height={86} width={86} fontSize={16}></TagFrequency>
                    <TagFrequency className={"tagFrequency"} height={96} width={96} fontSize={16}></TagFrequency>
                    <TagFrequency className={"tagFrequency"} height={113} width={113} fontSize={20}></TagFrequency>
                    <TagFrequency className={"tagFrequency"} height={123} width={123} fontSize={20}></TagFrequency>
                </div>
            </>
        )
    }

    renderSentimentBreakDown = () => {
        return (
            <>
                <Typography className={"sentiment-lable questionText"}>Sentiment Breakdown</Typography>
                {this.state.isSentimentsLoad &&
                    <>
                        <Skeleton variant={"text"} />
                        <Skeleton variant={"text"} />
                        <Skeleton variant={"text"} />
                    </>}
                {!this.state.isSentimentsLoad &&
                    this.state.transcriptSentiments && this.state.transcriptSentiments.map((item, index) => {
                        // sentiments.map((item,index)=>{
                        return (
                            <div className={"f-div mb-10"}>
                                <Typography className={"sentiments-text"}>{item.text}</Typography>
                                <Typography className={"percentage-text"}>{Math.floor(item.percentage)}%</Typography>
                                <ProgressBar value={Math.floor(item.percentage)} class={"bars" + index}></ProgressBar>
                            </div>
                        )
                    })
                }
            </>
        )
    }

    handlePopperOpen = (event, data) => {
        data.isOpen = !data.isOpen;
        for (let i in this.state.highlights) {
            if (this.state.highlights[i].id != data.id) {
                this.state.highlights[i].isOpen = false;
            }
        }
        this.setState({
            anchorElTagMenu: event.currentTarget,
            highights: this.state.highlights

        })
    };


    selectTag = (data) => {
        data.isSelect = !data.isSelect;
        for (let i in this.state.highlights) {
            if (this.state.highlights[i].key != data.key) {
                this.state.highlights[i].isSelect = false;
            }
        }
        this.setState({ highights: this.state.highlights })
    }


    handleShuffle = (key) => {
        let newList = []
        newList = this.state.highlights.filter((el) => el.tagUsageId == key);
        newList[0].isSelect = !newList[0].isSelect;
        newList[0].isOpen = false;
        let newObject = [];
        newObject.push(newList[0]);

        let remainingList = this.state.highlights.filter((el) => el.tagUsageId != key);
        remainingList.map((item, index) => {
            item.isSelect = false;
            item.isOpen = false;
            newObject.push(item);
        });

        this.setState({
            highlights: newObject
        });
    };

    changeEdit = (data) => {
        data.isEdit = !data.isEdit;
        if (data.description) {
            this.setState({ highights: this.state.highlights, textValue: data.description })
        } else {
            this.setState({ highights: this.state.highlights })
        }

    }

    handleCommentChange = (event) => {
        this.setState({ textValue: event.target.value })
    }

    // handleSubmit = (comment, id, associatedText, associatedTimeStamp, addEditText, tagUsageId) => {
      handleSubmit = (textValue,commentId,associatedText, associatedTimeStamp,addEditText, tagUsageId) => {
        if (textValue != "") {
            let user_data;
            if (addEditText == "edit") {
                user_data = {
                    "comment_id": commentId,
                    "comment": textValue,
                    "comment_associated_text": associatedText,
                    "comment_associated_text_timestamp": associatedTimeStamp
                }
            }
            else if (addEditText == "add") {
                user_data = {
                    "tag_usage_id": tagUsageId,
                    "comment": textValue,
                    "knit_user_id": this.state.userId
                }
            }
            tagCardEditOperation(user_data).then((response) => {
                let { highlights } = this.state;
                if (response.data) {
                    for (let i in highlights) {
                        if (response.data[0]._id.$oid == highlights[i].commentId) {
                            highlights[i].description = response.data[0].comment;
                            highlights[i].isEdit = false;
                        }
                    }
                    this.setState({ highlights: this.state.highlights, showreelModalOpen: false, textValue: '' }, () => {
                        this.getTagDetails(this.state.videoId)
                    })
                }
            })
        } else {
            this.tagCardOperation(commentId)
        }
    }

    deleteModalClose = () => {
        this.setState({
            deleteCommentFlag: false,
        });
    }

    // API to update transcript in the backend
    updateTranscript = () => {
        this.setState({ isEditTranscriptFlag: true, disableSaveButton: true })
        let request_data = {
            "knit_video_id": this.state.videoId,
            "updated_video_transcription": this.state.transcript,
            "user_journey": this.state.newTagList
        }
        updateTranscript(request_data).then((response) => {
            this.generateUpdatedTranscript(response.data)
            this.setState({
                transcriptTextbox: false, newTagList: [], selectedCharacter: [], summary: response.data.video_summary
                , isEditTranscriptFlag: false, disableSaveButton: false
            })
        })
    }

    tagClickEvent= (tagId)=>{
        let user_data= {
                "tag_comment": true,
                    "is_tag": true,
                    "knit_project_id": this.state.projectId,
                    "knit_user_id": this.state.userId,
                    "knit_tag_id": tagId,
                    "knit_project_response_id": responseId,
                    "knit_video_response_id": this.state.videoId,
                    "tag_associated_text": this.state.selectedText,
                    "tag_associated_text_timestamp": this.state.newSelectedList
        }
             this.insertTag(user_data,false);
        }

        reload=()=>{
            document.getElementsByClassName('tree-container')[0].click();
        }

        // annotation 
        suggestedTagOperation=(tagId,status,id)=>{
            let user_data= {
                "is_tag_status": true,
                "ai_tag_id":id,
                // "is_seen/is_accepted/is_rejected" : true
          }
          if(status == 'is_accepted'){
            user_data['is_accepted']= true
          }
          if(status == 'is_rejected'){
            user_data['is_rejected']= true
          }
          let newList=this.state.suggestedTagDetails.filter(el=> el._id.$oid == id)   
                let user_request={
                   "tag_comment": true,
                   "is_tag": true,
                   "knit_project_id": this.state.projectId,
                   "knit_user_id": this.state.userId,
                   "knit_tag_id": tagId,
                   "knit_project_response_id": responseId,
                   "knit_video_response_id": this.state.videoId,
                   "tag_associated_text": newList[0].tag_suggested_text,
                   "tag_associated_text_timestamp": newList[0].tag_suggested_text_timestamps
                }
                if(status == 'is_accepted'){
                    this.insertTag(user_request,true);
                }
          suggestedTagAction(user_data).then((response) => {
                this.getTagDetails(this.state.videoId)
        })
        }

    render() {
        return (
            <>
                <div id="main">
                    <Snackbar anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}
                        open={this.state.successAnnotationMessage} className={"alert-annotation"} autoHideDuration={5000} onClose={this.handleAnnotationMessageClose}>
                        <Alert onClose={this.handleAnnotationMessageClose} variant="filled" className={styles.annotationAlert} >
                            Annotations applied successfully !
                        </Alert>
                    </Snackbar>
                    {this.renderTitle()}
                    {this.renderStates()}
                    <Grid container spacing={0} className={"divMargin"}>
                        <div className={"video-div"}>
                            {this.renderTranscript()}
                            {this.renderRelatedData()}
                            {this.renderAnalysis()}
                        </div>
                        <div className={"annotation-card-div"}>
                            <div ref={this.box} style={{ display: 'contents', width: 'fit-content', justifyContent: 'end' }}>
                                <FlipMove duration={250} delay={0} easing="ease-in-out" staggerDurationBy={50} staggerDelayBy={0}>
                                    {this.state.isTranscriptLoad &&
                                        <Card className={"tagCard"} style={{ marginTop: 16 }}>
                                            <div style={{ display: 'flex' }}>
                                                <Skeleton variant={"circle"} className={"annotation-profile"}></Skeleton>
                                                <Skeleton variant={"text"} style={{ width: "100%" }}></Skeleton>
                                            </div>
                                            <Skeleton variant={"react"} width={"100%"} height={"30px"} style={{ borderRadius: 5 }} className={"mt-10"}></Skeleton>
                                            <div className={"mt-10"}>
                                                <Skeleton variant={"text"} width={"100%"}></Skeleton>
                                                <Skeleton variant={"text"} width={"100%"}></Skeleton>
                                            </div>
                                        </Card>
                                    }
                                    {this.state.highlights &&
                                    this.state.highlights.map((item,index)=>{
                                        return(
                                            item.isSuggested &&
                                            <AiSuggestedtag
                                            data={item.suggestedTagDetails}
                                            isSelect={item.isSelect}
                                            onShuffle={(id) => {
                                                this.handleShuffle(id);
                                            }}
                                            tagOperation={(tagId,status,id)=>{
                                                this.suggestedTagOperation(tagId,status,id)
                                            }}></AiSuggestedtag>
                                        )
                                    })}

                                    {!this.state.isTranscriptLoad &&
                                        this.state.highlights && this.state.highlights.map((item, index) => {
                                            return (
                                                item.selectedText == false && !item.isSuggested &&
                                                <AnnotationFlipMoveCard
                                                    key={item.id}
                                                    data={item}
                                                    anchorElTagMenu={this.state.anchorElTagMenu}
                                                    onShuffle={(id) => {
                                                        this.handleShuffle(item.tagUsageId);
                                                    }}
                                                    handlePopperOpen={(e, data) => {
                                                        this.handlePopperOpen(e, data)
                                                    }}
                                                    tagAction={(id) => {
                                                        this.setState({ deleteCommentFlag: true, selectedTagUsageId: id })
                                                        // this.tagUsageDeleteAction(id)
                                                    }}
                                                    changeEdit={(isEdit) => {
                                                        this.changeEdit(isEdit)
                                                    }}
                                                    handleCommentChange={(e) => {
                                                        this.handleCommentChange(e)
                                                    }}
                                                    handleDeleteComment={(id) => {
                                                        this.setState({ deleteCommentFlag: true, selectedTagId: id })
                                                        // this.tagCardOperation(id)
                                                    }}
                                                    textValue={this.state.textValue}
                                                    handleSubmit={(comment, id, associatedText, associatedTimeStamp, editText, tagUsageId) => {
                                                        this.handleSubmit(comment, id, associatedText, associatedTimeStamp, editText, tagUsageId)
                                                    }}
                                                // cardPopper={this.cardPopper}
                                                ></AnnotationFlipMoveCard>
                                            )
                                        })}
                                </FlipMove>
                            </div>
                        </div>
                    </Grid>
                    <div className={this.state.loading ? 'fullPageLoader blur-background' : ''}>
                        {this.state.loading && <AuthLoader />}
                    </div>
                </div>

                {this.state.showAnnotationCard &&
                    <AnnotationCardMenu id={"annotateCard"}
                        onreload={()=>{ this.reload()}}
                        userId={this.state.userId}
                        projectId={this.state.projectId}
                        themeData={this.state.themeTreeData}
                        moveCard={this.state.showAnnotationCard}
                        tanscriptWidth={this.state.tanscriptWidth}
                        outside={() => {
                            this.hiddleOutSideAnnotation()
                        }}
                        getThemeDetails={() => this.getThemeDetails()}
                        getTagDetails={() => this.getTagDetails(this.state.videoId)}
                        knitThemeId={this.state.knitThemeId}
                        tagClickEvent={this.tagClickEvent}
                        expandedItemsList={this.expandedItemsList}
                    />
                }

                <AddVideoShowreelModel
                    handleChecked={(title, status, id) => {
                        this.handleCheckedReel(title, status, id)
                    }}
                    selectedShowReelId={this.state.selectedShowReelId}
                    ShowReelsData={this.state.showreelsList}
                    open={this.state.showreelModalOpen}
                    onClose={() => this.handleCloseModel}
                    handleRedirect={(data) =>
                        this.handleRedirect()
                    }
                    handleSubmit={() => {
                        this.handleAddToShowreel()
                    }}
                    handleSearchReelData={(event) =>
                        this.handleReelSearch(event)
                    }
                    handleTitle={(event) =>
                        this.handleTitle(event)
                    }
                    showreelLoad={this.state.showreelLoad}
                    getNewTitle={(title) => { this.getNewTitle(title) }}
                    projectId={this.state.projectId}
                />
                {this.state.deleteCommentFlag &&
                    <DeleteModel open={this.state.deleteCommentFlag}
                        onHandleClose={() => { this.deleteModalClose() }}
                        onHandleRemove={() => { this.state.selectedTagUsageId ? this.tagUsageDeleteAction(this.state.selectedTagUsageId) : this.tagCardOperation(this.state.selectedTagId) }} description={this.state.TagDescription}></DeleteModel>
                }
            </>
        );
    }
}

export default withWidth()(withRouter(VideoDetails));
