import React, {Component} from "react";
import {withStyles} from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import {Grid} from "@material-ui/core";
import "./ThemeAnnotations.scss";
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper/Paper";
import PropTypes from "prop-types";
import StatsSummaryWrapper from "../common/StatsSummaryWrapper";
import FontFamily from "../../config/FontFamily";
import Divider from '@material-ui/core/Divider';
import profileIcon from "../../../assets/images/navbar/profile.png";
import exportIcon from "../../../assets/images/export.svg";
import {allThemeNameList, themesAnnotationList, themesAnnotationListByTheme,themesAnnotationListByTag} from "../../services/ThemeService";
import Skeleton from "@material-ui/lab/Skeleton";
import DragAndDropTree from "../themeTreeCard/DragAndDropThemeTree";
import {InteractiveHighlighter} from "react-interactive-highlighter";
import appThemeColor from "../../config/ThemeColorConfig";


function customClassFn1(selectedText){
    if(selectedText.length>0){
        if(selectedText[0].themeId == 0){
            return "theme-highlighted-theme0"
        }else if(selectedText[0].themeId == 1){
            return "theme-highlighted-theme1"
        }else if(selectedText[0].themeId == 2){
            return "theme-highlighted-theme2"
        } else if(selectedText[0].themeId == 3){
            return  "theme-highlighted-theme3"
        } else if(selectedText[0].themeId == 4){
            return  "theme-highlighted-theme4"
        } else if(selectedText[0].themeId== 5){
            return  "theme-highlighted-theme5"
        } else if(selectedText[0].themeId == 6){
            return "theme-highlighted-theme6"
        } else if(selectedText[0].themeId == 7){
            return "theme-highlighted-theme7"
        }
    }else{
        return "selected-text"
    }
}

function setOpacity(level){
    if(level == 1){
        return "1";
    }else if(level == 2){
      return "0.7";
    }else if(level == 3){
      return "0.4"
    }else{
      return "0.2"
    }
  }
const styles ={

}
let themeIndex = 0;
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
let selectedTheme=0
let annotationData = [];
class ThemeAnnotations extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            rowsPerPage: 5,
            anchorEl: null,
            value: 0,
            themeData:[],
            videoAnnotationData:[],
            projectId:'',
            tagHighlights:[
                { startIndex: 11, numChars: 3 },
                { startIndex: 15, numChars: 16 }
            ],
            selectedTheme:[]
        };
    }

    componentDidMount() {
        if(this.props.themeId && this.props.projectId){
            this.setState({projectId:this.props.projectId,themeId:this.props.themeId},()=>{
                if(this.props.projectId && this.props.themeId && this.props.themeType === "THEME"){
                    annotationData = [];
                this.loadThemeAnnotationDATAbyTheme(this.props.projectId,this.props.themeId)
            }else if(this.props.projectId && this.props.themeId && this.props.themeType === "TAG"){
                     annotationData = [];
                    this.loadThemeAnnotationDATAbyTag(this.props.projectId,this.props.themeId)
            }
        })
    }else if(this.props.projectId){
            this.setState({projectId:this.props.projectId},()=>{
            annotationData = [];
            let data = this.props.allTheme
                for(let i in data){
                    this.loadThemeAnnotationDATAbyTheme(this.state.projectId,data[i]._id.$oid)
                }
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
    loadThemeAnnotationDATA =  async () => {
        this.setState({isThemeBoxSkel:true})
        themesAnnotationList(this.state.projectId).then((response) => {
            if (response.data) {
                for (let i in response.data) {
                    annotationData.push({
                     videoId:response.data[i]._id.$oid,
                    questionId:response.data[i].video_feature_id,
                    videoTitle:response.data[i].video_file_name,
                    thumbnilImage:response.data[i].video_thumbnail_url,
                    timeDuration: this.secondsToHms(response.data[i].original_video_duration),
                        questionNo:response.data[i].video_feature_id,
                        questionTitle:response.data[i].video_feature_title,
                        partOfTranscript:response.data[i].video_transcription,
                        comments:response.data[i].comments_dtls,
                        transcript:this.generateTranscript(response.data[i].transcription_timestamps),
                     selectedText:this.handleTagMark(response.data[i])
                    });                }
            }
            this.setState({ videoAnnotationData:annotationData, });
            this.setState({isThemeBoxSkel:false})
        })
    }

    loadThemeAnnotationDATAbyTheme =  async (knitProjectId,knitThemeId) => {
        this.setState({isThemeBoxSkel:true})
        themesAnnotationListByTheme(knitProjectId,knitThemeId).then((response) => {
            if (response.data) {
                this.setAnnotationData(response.data);
            }
        })
    }

    loadThemeAnnotationDATAbyTag =  async (knitProjectId,knitTagId) => {
        this.setState({isThemeBoxSkel:true})
        themesAnnotationListByTag(knitProjectId,knitTagId).then((response) => {
            if (response.data) {
                this.setAnnotationData(response.data);
            }
        })
    }

    setAnnotationData = (data) => {
        if (data) {
            for (let i in data) {
               annotationData.push({
                    videoId:data[i]._id.$oid,
                    questionId:data[i].video_feature_id,
                    numericQuestionId:data[i].numeric_question_id,
                    videoTitle:data[i].video_file_name,
                    thumbnilImage:data[i].video_thumbnail_url,
                    timeDuration: this.secondsToHms(data[i].original_video_duration),
                    questionNo:data[i].video_feature_id,
                    questionTitle:data[i].video_feature_title,
                    partOfTranscript:data[i].video_transcription,
                    comments:data[i].comments_dtls,
                    tagName:data[i].knit_tag_theme + " > " + data[i].knit_tag_name,
                    tagLevel:data[i].knit_tag_level,
                    tagTheme:data[i].knit_tag_sequence,
                    transcript:this.generateTranscript(data[i].transcription_timestamps),
                    selectedText:this.handleTagMark(data[i])
                });
            }
        }

        this.setState({ videoAnnotationData:annotationData });
        this.setState({isThemeBoxSkel:false})
    }

    handleTagMark =  (data) =>{
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
    if(data.transcription_timestamps){
        for (let i in data.transcription_timestamps){
            transcript+=data.transcription_timestamps[i].value;
            // commentId=""
            transcriptDetail.push({
                ts:data.transcription_timestamps[i].ts,
                end_ts:data.transcription_timestamps[i].end_ts,
                value:data.transcription_timestamps[i].value,
                startIndex:wordCount,
                unique_element_key:data.transcription_timestamps[i].unique_element_key,
                confidence:data.transcription_timestamps[i].confidence,
                type: data.transcription_timestamps[i].type
            })
            wordCount=wordCount+data.transcription_timestamps[i].value.length;
            if(data.transcription_timestamps[i].sequence != undefined
                && data.transcription_timestamps[i].level != undefined  ){

                numChars+=data.transcription_timestamps[i].value.length;
                sequence=data.transcription_timestamps[i].sequence;
                level=data.transcription_timestamps[i].level;
                isTagCompleted=true;
                if(data.transcription_timestamps[i].comment_id != null){
                    tagValue+=data.transcription_timestamps[i].value;
                    tagId="";
                    newCommentId=data.transcription_timestamps[i].comment_id;
                }

                countCharacter=countCharacter+data.transcription_timestamps[i].value.length;
                if(Number(i)+1 == data.transcription_timestamps.length){
                    newHighlights.push({
                      id:index,
                      startIndex: startIndex,
                      numChars:numChars, 
                      tags:"",
                      selectedTagName:tagValue  ? tagValue : data.transcription_timestamps[i].value,
                      themeId:sequence,
                      selectedText:false,
                      isSelect:false,
                      name:this.state.userEmail,
                      isOpen:false,
                      // description:'ABC',
                      level:level,
                      tagId:tagId,
                      tagUsageId:tagId,
                      commentId:newCommentId
                    })
                  }
            }else{
                if(isTagCompleted){

                    newHighlights.push({
                        id:index,
                        startIndex: startIndex,
                        numChars:numChars,
                        tags:"",
                        selectedTagName:tagValue,
                        themeId:sequence,
                        //     themeId:2,
                        selectedText:false,
                        isSelect:false,
                        name:"Aditya Bhardwaj",
                        isOpen:false,
                        // description:'ABC',
                        level:level,
                        tagId:tagId,
                        commentId:newCommentId
                    })
                    isTagCompleted=false;
                    countCharacter=countCharacter+data.transcription_timestamps[i].value.length;
                    numChars=0;
                    tagValue="";
                    newCommentId='';
                    index++;

                }else{
                    newCommentId='';
                    numChars=0;
                    countCharacter=countCharacter+data.transcription_timestamps[i].value.length;
                    startIndex=countCharacter;
                }
            }
        }
    }
    return newHighlights;
}

    themesAnnotationData= async ()=>{
         if(themeIndex < this.state.themeData.length){

        let knit_project_id = this.state.projectId
        let knitThemeId=this.state.themeData[themeIndex]._id.$oid

        themesAnnotationList(knit_project_id,knitThemeId).then((response) => {

        if(response.data > 0){

            }
                themeIndex++
                this.themesAnnotationData();
        })
    }

    }

    handleClick = (event) => {
        this.setState({
            anchorEl: event.currentTarget,
            open: !this.state.open,
        });
    };

    handleClose = () => {
        // setOpen(false);
        this.setState({ open: false });
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    secondsToHms=(d)=> {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hour ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " min " : " min ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " sec " : " sec ") : "";
        return hDisplay + mDisplay + sDisplay;
    }

//     routeOnvideodetail = (id) =>{
//         const { history } = this.props;
// return(
//
//         history.push({
//             pathname: "/knit/projectsDetails/"+this.state.projectId+"/Video/"+id,
//             state: {
//                 projectid: id,
//                 //projectTitle:title
//             }
//         })
// )
//
//
//
//
//     }


    renderTagFrequencyCard=()=>{
        return(
            <>

                {this.state.isThemeBoxSkel &&(
                    <>
                        <div className={'annotations-skeleton'} style={{marginTop:'20px'}}>
                            <div className={'user-info-skeleton'}>
                                <div className={'user-details-skeleton'}>
                                    <div className={'user-img-skeleton'}>
                                        <Skeleton variant="rect" width={60} height={60} style={{borderRadius:'5px',marginRight:'5px'}} />
                                    </div>
                                    <div className={'user-question-info'}>
                                        <Skeleton variant="text" />
                                        <Skeleton variant="text" />
                                        <Skeleton variant="text" />
                                    </div>
                                </div>
                            </div>
                            <div className={'transcript-skeleton'}>
                                <Skeleton variant="text" style={{width:'50%'}} />
                                <Skeleton variant="text" style={{width:'90%'}} />
                                <Skeleton variant="text" style={{width:'90%'}} />
                                <Skeleton variant="text" style={{width:'20%'}} />
                            </div>
                            <div className={'comment-skeleton'}>
                                <Skeleton variant="text" style={{width:'50%'}} />
                                <Skeleton variant="text" style={{width:'90%'}} />
                                <Skeleton variant="text" style={{width:'90%'}} />
                                <Skeleton variant="text" style={{width:'80%'}} />
                            </div>
                            <div className={'export-skeleton'}>
                                <Skeleton variant="rect" width={15} height={15} style={{margin:'0px auto'}} />
                            </div>
                        </div>

                    </>
                )}

                {!this.state.isThemeBoxSkel &&
                this.state.videoAnnotationData.length > 0 ?
                    this.state.videoAnnotationData.map((item,index)=>{
                        selectedTheme=item.selectedText;
                        // this.setState({selectedTheme:item.selectedText})
                        return(
                            <>

                                <StatsSummaryWrapper className={'main-card-fixed'}
                                                     style={{borderRadius: "10px",//height: "25vh" ,//minHeight: "126px" ,
                                                         marginTop:"2%"
                                                     }}
                                >
                                     {item.thumbnilImage ?
                                        <Grid container style={{padding:'20px'}}>
                                        <Grid item md={4} xs={12} lg={3} sm={12}>
                                            <div className={"div-flex"} style={{    width: '100%'}}>
                                                <img src={item.thumbnilImage} onClick={()=>{this.props.handleChange(2,item.videoId,item.questionId)}} className={"video-thumbnail"} />
                                                {/*<img src={item.thumbnilImage} onClick={()=>{this.routeOnvideodetail(item.videoId)}} className={"video-thumbnail"} />*/}
                                                <div style={{paddingLeft:"10px",cursor: "default",width: 'calc(100% - 70px)'}}>
                                                    <Typography className={"video-cell video-title"}>
                                                        {item.videoTitle}
                                                    </Typography>
                                                    <Typography className={"video-cell flex"}>
                                                        <div className={"question-title"}>
                                                            {item.questionNo}: {item.questionTitle}
                                                        </div>?
                                                    </Typography>
                                                    <Typography className={"video-cell"}>
                                                        {item.timeDuration}
                                                    </Typography>
                                                </div>
                                            </div>

                                        </Grid>
                                        <Grid item md={4} xs={12} lg={5} sm={12} style={{paddingRight:"25px",paddingLeft:"25px"}}>
                                            <Typography
                                                component={"span"}
                                                style={{
                                                    fontSize: "14px",
                                                    color: "#001839",
                                                    textAlign: "left",
                                                    fontWeight:'500',
                                                    cursor: "default"
                                                }}>
                                                Part of Transcript
                                            </Typography>
                                            <Typography
                                                style={{
                                                    fontSize: "14px",
                                                    color: "#001839",
                                                    fontWeight:'400'
                                                }} className={'part-transcript'}>
                                                        <InteractiveHighlighter
                                                            text={item.transcript}
                                                            highlights={item.selectedText}
                                                            customClass={customClassFn1(item.selectedText)}
                                                        />

                                            </Typography>

                                        </Grid>
                                        <Grid item md={3} xs={12} lg={3} sm={12}>
                                            <Typography
                                                component={"span"}
                                                style={{
                                                    fontSize: "14px",
                                                    color: "#001839",
                                                    textAlign: "left",
                                                    fontWeight:'500',
                                                    cursor: "default"
                                                }}>
                                                Tag
                                            </Typography>
                                            
                                            {item.tagName ? (
                                                        <div
                                                        className={item.tagLevel >= 3 ? "tag-button-high-level" :"tag-button"}
                                                        style={{ background: appThemeColor(item.tagTheme,setOpacity(item.tagLevel))}}
                                                        >
                                                        {item.tagName}
                                                        </div>
                                                    ) : (
                                                        <div className={"divMargin"}></div>
                                                    )}
                                        </Grid>
                                        <Grid item md={1} xs={12} lg={1} sm={12} style={{textAlign:'center'}}>
                                            <Typography
                                                component={"span"}
                                                style={{
                                                    fontSize: "17px",
                                                    color: "#001839",
                                                    fontWeight:'400'
                                                }}>
                                                <img src={exportIcon} className={"icon"} style={{margin:5}}/>
                                            </Typography>
                                        </Grid>
                                        </Grid>
                                    :
                                    <Grid container style={{padding:'20px',cursor:'pointer'}} onClick={()=>{this.props.handleRedirectOpenText(item.questionId,item.numericQuestionId)}}>
                                <Grid item md={8} xs={12} lg={8} sm={12} style={{paddingRight:"25px",paddingLeft:"25px",cursor:'pointer'}}>
                                    <Typography
                                        component={"span"}
                                        style={{
                                            fontSize: "14px",
                                            color: "#001839",
                                            textAlign: "left",
                                            fontWeight:'500',
                                            cursor: "pointer"
                                        }}>
                                        Text Response
                                    </Typography>
                                    <Typography
                                        style={{
                                            fontSize: "14px",
                                            color: "#001839",
                                            fontWeight:'400',
                                            cursor:'pointer'
                                        }} className={'part-transcript'}>
                                                <InteractiveHighlighter
                                                    text={item.transcript}
                                                    highlights={item.selectedText}
                                                    customClass={customClassFn1(item.selectedText)}
                                                />

                                    </Typography>

                                </Grid>
                                <Grid item md={3} xs={12} lg={3} sm={12}>
                                    <Typography
                                        component={"span"}
                                        style={{
                                            fontSize: "14px",
                                            color: "#001839",
                                            textAlign: "left",
                                            fontWeight:'500',
                                            cursor: "default"
                                        }}>
                                        Tag
                                    </Typography>
                                   
                                    {item.tagName ? (
                                                <div
                                                className={item.tagLevel >= 3 ? "tag-button-high-level" :"tag-button"}
                                                style={{ background: appThemeColor(item.tagTheme,setOpacity(item.tagLevel))}}
                                                >
                                                {item.tagName}
                                                </div>
                                            ) : (
                                                <div className={"divMargin"}></div>
                                            )}
                                </Grid>
                                <Grid item md={1} xs={12} lg={1} sm={12} style={{textAlign:'center'}}>
                                    <Typography
                                        component={"span"}
                                        style={{
                                            fontSize: "17px",
                                            color: "#001839",
                                            fontWeight:'400'
                                        }}>
                                        <img src={exportIcon} className={"icon"} style={{margin:5}}/>
                                    </Typography>
                                </Grid>
                            </Grid>

                                    }
                                  
                                </StatsSummaryWrapper>


                            </>

                        )
                    })

                    :
                    ''
                }

            </>
            
        )
    }
    render() {
        let classes = styles;
        return (
            <div>

                {this.renderTagFrequencyCard()}

            </div>
        );
    }
}

export default withStyles(styles)(ThemeAnnotations);