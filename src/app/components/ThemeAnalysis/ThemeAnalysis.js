import React, {Component} from "react";
import {withStyles} from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import {Grid} from "@material-ui/core";
import "./ThemeAnalysis.scss";
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
import exportIcon from "../../../assets/images/export.svg";
import tagBelow from "../../../assets/images/themeTree/tagBelow.svg";
import {themesTagFrequencyList,
    themesTagFrequencyDetail,
    themesParallelMapping,
    themesParallelMappingBYQID,
    themesParallelMappingBYQIDAndThemeId,
    themesParallelMappingBYQIDAndTagId} from "../../services/ThemeService";
import DragAndDropTree from "../themeTreeCard/DragAndDropThemeTree";
import Skeleton from '@material-ui/lab/Skeleton';
import ResponseTable from "../responsesTable/ResponseTable";
import MultichoiceCard from "../ParallelMapping/ThemeQuestionResponse";
import PhotoCollegeDorm from "../ParallelMapping/ThemePhotoCollegeDorm";
import VideoProductCard from "../ParallelMapping/ThemeVideoProductCard";
import AccordianParagraph from "../ParallelMapping/ThemeAccordianParagraph";
import {getVideoFileTypeData} from "../../services/DataService";
import appHSLThemeConfig from "../../config/HslThemeColorConfig";
const styles ={

}

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 5,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
        backgroundColor: '#001839',
    },
}))(LinearProgress);


function LinearProgressWithLabel(props) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
};
function setOpacity(level) {
    if (level == 1) {
        return "100%";
    } else if (level == 2) {
        return "70%";
    } else if (level == 3) {
        return "40%";
    } else {
        return "20%";
    }
}
let questionCardListBox = [];
let dataLength=0;
class ThemeAnalysis extends Component {
    constructor(props) {
        super(props);
        this.getAlert = this.getAlert.bind(this);
        this.state = {
            open: false,
            rowsPerPage: 5,
            anchorEl: null,
            value: 0,
            tagFrequencyData:[],
            isThemeAnalysisSkelSkel : false,
            questionCardListBox: [],
            //isSkeleton:false,
            themeId:'',
            projectId:'',
            tagFrequencyFlag:true,
            showTagAndParallel:false,
            isParellalMapping:true
        };
    }


    componentDidMount() {

        if(this.props.projectId && this.props.themeId && this.props.themeType === "THEME"){
            this.setState({tagFrequencyFlag:true})
            this.loadTagFrequencyDetail(this.props.projectId,this.props.themeId)

        }
        else if(this.props.projectId && this.props.themeId && this.props.themeType === "TAG"){
            this.setState({tagFrequencyFlag:false})
        }else {
            this.loadThemeTagFrequency(this.props.projectId);
        }
    }


    getAlert=()=> {
        //this.loadTagFrequencyDetail(this.props.projectId,this.props.themeId)
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

    loadThemeTagFrequency= async (knitProjectId)=>{

        this.setState({ isThemeAnalysisSkel:true})

        themesTagFrequencyList(knitProjectId).then((response) => {

if (response.data.length >0){

            if(response.data[1].tag_data.length >0){

    this.setState({tagFrequencyData:response.data[1].tag_data, isThemeAnalysisSkel:false,showTagAndParallel:true})
}
}
            this.setState({ isThemeAnalysisSkel: false})
        });

    }

    loadTagFrequencyDetail= async (knitProjectId,themeId)=>{

        this.setState({ isThemeAnalysisSkel:true})

        themesTagFrequencyDetail(knitProjectId,themeId).then((response) => {

            if (response.data.length >0){

                if(response.data[1].tag_data.length >0){

                    this.setState({tagFrequencyData:response.data[1].tag_data, isThemeAnalysisSkel:false,showTagAndParallel:true})
                }
            }
            this.setState({ isThemeAnalysisSkel: false})
        });

    }

loadParallelMapping = async (knitProjectId,id,type)=>{
    dataLength = 0
    themesParallelMapping(knitProjectId).then((response) => {
        dataLength = response.data.length;
if(response.data.length > 0){
    this.setState({showTagAndParallel:true})
    let questionCardListBox = [];
    if(type === "THEME"){
        for (let i in response.data) {
            //this.setState({isSkeleton:true})
            questionCardListBox.push({
                questionId: response.data[i].question_id,
                questionType: response.data[i].question_type,
                questionName: response.data[i].question_text,
                questionNumber: response.data[i].question_name,
                numericQuestionId:response.data[i].numeric_question_id,
                isSunBurst: response.data[i].is_sunburst,
                isSkeleton: true,
              });
            this.setState({questionCardListBox},()=>{
                this.loadParallelMappingDataByQIDByThemeId(knitProjectId,id,response.data[i].question_id,response.data[i].numeric_question_id);
            })
        }
    }else if(type ==="TAG"){
        for (let i in response.data) {
            questionCardListBox.push({
                questionId: response.data[i].question_id,
                questionType: response.data[i].question_type,
                questionName: response.data[i].question_text,
                questionNumber: response.data[i].question_name,
                numericQuestionId:response.data[i].numeric_question_id,
                isSunBurst: response.data[i].is_sunburst,
                isSkeleton: true,
              });
            this.setState({questionCardListBox},()=>{
                this.loadParallelMappingDataByQIDByTagId(knitProjectId,id,response.data[i].question_id,response.data[i].numeric_question_id);
            })
            
        }
    }else{
        for (let i in response.data) {
            questionCardListBox.push({
                questionId: response.data[i].question_id,
                questionType: response.data[i].question_type,
                questionName: response.data[i].question_text,
                questionNumber: response.data[i].question_name,
                numericQuestionId:response.data[i].numeric_question_id,
                isSunBurst: response.data[i].is_sunburst,
                isSkeleton: true,
              });
            this.setState({questionCardListBox},()=>{
                this.loadParallelMappingDataByQID(knitProjectId,response.data[i].question_id,i,response.data[i].numeric_question_id);
            })
        }
    }
}
        })
}

    //load all data for ParallelMapping
    loadParallelMappingDataByQID = async (knitProjectId,QId,index,numericId)=>{
        this.setState({ isParellalMapping : true})
        themesParallelMappingBYQID(knitProjectId,QId).then((response) => {
            if(dataLength == index + 1){
            }
           if (response.data.constructor == Object) {
                this.setDynamicDATAForParallelMapping(response.data,numericId)
            }

        })

    }

    //load all data for ParallelMapping By themeId
    loadParallelMappingDataByQIDByThemeId = async (knitProjectId,themeId,QId,numericId)=>{
        this.setState({ isParellalMapping : true})
        themesParallelMappingBYQIDAndThemeId(knitProjectId,QId,themeId).then((response) => {
            // if(response.data.length>0){
                if (response.data.constructor == Object) {

                     this.setDynamicDATAForParallelMapping(response.data,numericId)
     
                //  }
            }else{
                this.setState({ isParellalMapping : false})
            }
     

        })
    }
    //load all data for ParallelMapping By tagId
    loadParallelMappingDataByQIDByTagId = async (knitProjectId,tagId,QId)=>{
        this.setState({ isParellalMapping : true})
        themesParallelMappingBYQIDAndTagId(knitProjectId,QId,tagId).then((response) => {
            if (response.data.constructor == Object) {

                this.setDynamicDATAForParallelMapping(response.data,QId)

            }

        })
    }

    setDynamicDATAForParallelMapping=(data,numericId)=>{
        let {questionCardListBox}=this.state;
       if(JSON.stringify(data) != '{}' && data!= null){
           for (let i = 0; i < questionCardListBox.length; i++) {
            if(data.numeric_question_id == questionCardListBox[i].numericQuestionId){
                questionCardListBox[i].questionText = data.question_dtl.question_text;
                questionCardListBox[i].isSkeleton=false;
              questionCardListBox[i].knitVideoResponse =  data.knit_video_response;
              questionCardListBox[i].questionChoice = data.question_choices;                                             
              questionCardListBox[i].videoResponse = data.knit_video_response;
              questionCardListBox[i].questionData = data.question_answer;
              questionCardListBox[i].questionSelector = data.question_dtl.question_selector;
                }
            }
        //    if(data.question_dtl.numeric_question_id == questionCardListBox[i].numericQuestionId){
        //     questionCardListBox.push({
        //         questionId: data.question_dtl.question_id,
        //         questionType: data.question_dtl.question_type,
        //         questionName: data.question_dtl.question_text,
        //         questionNumber: data.question_dtl.question_name,
        //         isSunBurst: data.question_dtl.is_sunburst,
        //         questionText: data.question_dtl.question_text,
        //         knitVideoResponse:data.knit_video_response,
        //         questionChoice :data.question_choices,
        //         videoResponse :data.knit_video_response,
        //         questionData: data.question_answer,
        //         questionSelector:data.question_dtl.question_selector,
        //         isSkeleton: false,
        //     });
            if(data.question_dtl.is_sunburst){
                this.videoCardData(data.question_dtl.question_id);
            }
           }else{
               for (let i = 0; i < questionCardListBox.length; i++) {
                if(numericId == questionCardListBox[i].numericQuestionId){
                    questionCardListBox[i].isSkeleton=false;
                    questionCardListBox[i].questionType="";
                    }
                }
           }
    

        
        this.setState({questionCardListBox:questionCardListBox})
    }

    generateChartData = (data) => {
        let child = [];
        if (data) {
            for (let i in data) {
                child.push({
                    name: data[i].name,
                    loc: data[i].loc,
                    color: appHSLThemeConfig(data[i].sequence, 3),
                    // "color":"hsl(270, 70%, 50%)",
                    children: this.generateChartData(data[i].children),
                });
            }
        }
        return child;
    };

    videoCardData = (id) => {
        getVideoFileTypeData(this.state.projectId, id).then((response) => {
            // let {graphData}=this.state;
            let graphData = [];
            let legendData = [];
            if (response.data && response.status_code == 200) {
                graphData.push({
                    name: "nivo",
                    color: "hsl(45, 70%, 50%)",
                    children: this.generateChartData(response.data.chart_data),
                });

                for (let i in response.data.chart_data) {
                    legendData.push({
                        label: response.data.chart_data[i].name,
                        color: appHSLThemeConfig(
                            response.data.chart_data[i].sequence,
                            setOpacity(response.data.chart_data[i].level)
                        ),

                    });
                }

                for (let i = 0; i < this.state.questionCardListBox.length; i++) {
                    if (this.state.questionCardListBox[i].questionId == id) {
                        this.state.questionCardListBox[i].chartData = graphData[0];
                        this.state.questionCardListBox[i].legendData = legendData;
                        // this.state.questionCardListBox[i].chartData=data;
                    }
                }

                //  graphData.push({name:"nivo",
                //  color:"hsl(45, 70%, 50%)",
                //  children:response.data.chart_data})

            }
            //  this.setState({graphData:graphData[0]})
        });
    };

    renderTagFrequencyCard=()=>{
        return(

            <StatsSummaryWrapper className={'main-card-fixed'}
                                 style={{
                                     borderRadius: "10px",
                                     // height: "43vh" ,
                                     // minHeight: "400px" ,
                                     marginTop:'2%'
                                 }}
            >

                <Grid container>
                    <Grid item xs={12} md={12}>
                            <Grid style={{padding:'20px'}}>

                                <Grid style={{float: "left"}}>
                                    <Typography
                                        component={"span"}
                                        style={{
                                            fontSize: "14px",
                                            color: "#001839",
                                            textAlign: "left",
                                            fontWeight:'500'
                                        }}>
                                        Tag Frequency
                                    </Typography></Grid>
                                <Grid style={{textAlign: "right"}}>
                                    <Typography
                                        component={"span"}
                                        style={{
                                            fontSize: "14px",
                                            color: "#001839",
                                        }}>
                                        <img src={exportIcon} className={"icon"} style={{margin:5}}/>

                                    </Typography></Grid>

                            </Grid>

                            <Divider style={{marginBottom:'20px'}}/>

                        {this.state.isThemeAnalysisSkel && (
                            <div className={'analysis-body'}>
                                <div className={"process-with-response"}>
                                    <div className={"processbar-val-show"}>
                                        <div className={"process-val"}>
                                            <Skeleton variant="text" style={{marginBottom:10,width:'100%'}} />
                                        </div>
                                        <div className={"processbar-show"}>
                                            <Skeleton variant="rect" height={13}></Skeleton>
                                        </div>
                                    </div>
                                    <div className={"like-responce-blank"}>
                                        <div className={"blank-box"}></div>
                                        <div className={"like-responce"}>
                                            <div className={"likebox"}>
                                                <Skeleton variant="text" style={{width:'150px'}} />
                                            </div>
                                            <div className={"responcebox"}>
                                                <Skeleton variant="text" style={{width:'30px'}} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={"process-with-response"}>
                                    <div className={"processbar-val-show"}>
                                        <div className={"process-val"}>
                                            <Skeleton variant="text" style={{marginBottom:10,width:'100%'}} />
                                        </div>
                                        <div className={"processbar-show"}>
                                            <Skeleton variant="rect" height={13}></Skeleton>
                                        </div>
                                    </div>
                                    <div className={"like-responce-blank"}>
                                        <div className={"blank-box"}></div>
                                        <div className={"like-responce"}>
                                            <div className={"likebox"}>
                                                <Skeleton variant="text" style={{width:'150px'}} />
                                            </div>
                                            <div className={"responcebox"}>
                                                <Skeleton variant="text" style={{width:'30px'}} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {!this.state.isThemeAnalysisSkel &&(
                            this.state.tagFrequencyData.length > 0 ?

                                this.state.tagFrequencyData.map((item, index) => {
                                    return (

                                        <Grid container style={{ padding: '0px 20px 20px 20px', marginBottom: '0px' }}>

                                            <Grid item md={12} xs={12} lg={12} sm={12}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>

                                                    <Typography
                                                        component={"span"}
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#001839",
                                                            width: "60px"
                                                        }}>
                                                        {item.tag_usage_frequency}%
                                                    </Typography>
                                                    <BorderLinearProgress variant="determinate" value={item.tag_usage_frequency} valueBuffer={item.tag_usage_frequency} style={{ width: '95%' }} />
                                                </div>
                                                <div style={{ display: 'flex' }}>
                                                    <div style={{ width: '90%', paddingLeft: '60px' }}>
                                                        <Typography
                                                            component={"span"}
                                                            style={{
                                                                fontSize: "14px",
                                                                color: "#001839",
                                                                // textAlign: "left"
                                                            }}>
                                                            {item.tag_name}
                                                        </Typography>
                                                    </div>

                                                    <Typography
                                                        component={"span"}
                                                        style={{
                                                            fontSize: "14px",
                                                            color: "#001839",
                                                            width: "10%",
                                                            textAlign: "end"
                                                        }}>
                                                        {item.tag_usage_count}
                                                    </Typography>


                                                </div>
                                            </Grid>

                                        </Grid>


                                    )
                                })
                                :''

                        )}
                    </Grid>
                </Grid>
            </StatsSummaryWrapper>
        )
    }

    render() {
        let classes = styles;
        return (
            <div>
                {/*<Card className={'card-height-width'}>*/}
                {/*    <CardContent>*/}
                {/*        <Grid container>*/}
                {/*            <Grid item xs={12} style={{ }}>*/}
                {/*                                                    <BorderLinearProgress variant="determinate" value={60} valueBuffer={60} />*/}
                {/*            </Grid>*/}
                {/*        </Grid>*/}
                {/*    </CardContent>*/}
                {/*</Card>*/}
                {this.state.tagFrequencyFlag && this.state.showTagAndParallel
                    ?this.renderTagFrequencyCard()
                    :''
                }
                {/*{this.state.tagFrequencyFlag && this.state.showTagAndParallel*/}
                {/*    ?this.renderParallelMappingDataCard()*/}
                {/*    :''*/}
                {/*}*/}
                {/*{this.renderParallelMappingCard()}*/}
                {/*{this.renderParallelMappingDataCard()}*/}
            </div>
        );
    }
}

export default withStyles(styles)(ThemeAnalysis);
