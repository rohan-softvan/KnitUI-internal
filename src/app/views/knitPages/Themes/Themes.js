import React, {Component} from "react";
import withWidth from "@material-ui/core/withWidth";
import {Grid, Typography} from "@material-ui/core";
import "../../../css/common.scss";
import Color from "../../../config/Color";
import {TableData} from "../responseTable.js"
import AutoCompleteWidget from "../../../components/autoCompleteWidget/AutoCompleteWidget";
import ProjectCard from "../../../components/projectCard/ProjectCard";
import ThemeAnalysis from "../../../components/ThemeAnalysis/ThemeAnalysis";
import TagFrequencyDetail from "../../../components/ThemeAnalysis/TagFrequencyDetail"
import ThemeAnnotations from "../../../components/ThemeAnnotations/ThemeAnnotations";
import StatsSummaryWrapper from "../../../components/common/StatsSummaryWrapper";
import FontFamily from "../../../config/FontFamily";
import Paper from "@material-ui/core/Paper/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import { TextField } from '@material-ui/core';
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import AddIcon from '@material-ui/icons/Add';
import Treeview from '../../../components/themeTreeCard/Treeview'
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import './Themes.scss'
import DragAndDropTree from '../../../components/themeTreeCard/DragAndDropThemeTree'
import Cookies from "universal-cookie";
import Skeleton from '@material-ui/lab/Skeleton';
import {allThemeNameList,themesTagFrequencyDetail} from "../../../services/ThemeService";
import {Input, Button} from "antd";
import SubdirectoryArrowLeftIcon from "@material-ui/icons/SubdirectoryArrowLeft";
import { ThreeSixty } from "@material-ui/icons";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import Alert from "@material-ui/lab/Alert/Alert";
import {withRouter} from "react-router-dom";
import PageWrapper from "../../PageWrapper/PageWrapper";
import SideBar from "../../../components/sidebar/SideBar";
const cookie = new Cookies();
const styles={
    moreVertIcon: {
        "&:active": {
            backgroundColor: Color.lightGreyShadow
        },
        borderRadius: 6,
        cursor:'pointer'
    },
    TabsClass: {
        boxShadow: "0px 1px 0px #00000017"
    },
    TabsForTablet:{
        boxShadow: "0px 1px 0px #00000017",
        width: 473
    },
    TabsforMobile: {
        boxShadow: "0px 1px 0px #00000017",
        width: 240
    },
    TabClass: {
        color: "#001839",
        fontWeight: "400",
        fontFamily:"Rubik !important"
    },
    TabClassforMobile: {
        color: "primary",
        fontWeight: "800",
        width: 78
    },
}
const data = [
    {
        id: 'root',
        color:'#13988A',
        name: 'Theme title is here',
        children: [
            {
                id: '1',
                name: 'Subtheme title 1',
                children: [
                    {
                        id: '2',
                        name: 'Tag 1',
                    },
                ],
            },
            {
                id: '3',
                name: 'Subtheme title 2',
                children: [
                    {
                        id: '4',
                        name: 'Tag 1',
                    },
                    {
                        id: '5',
                        name: 'Tag 2',
                    },
                ],
            },
            {
                id: '6',
                name: 'Subtheme title 3',
                children: [
                    {
                        id: '2',
                        name: 'Tag 1',
                    },
                ],
            },
        ],
    },
    {  id: 'root',
        color:'#D14926',
        name: 'Theme title is here',
        children: [
            {
                id: '1',
                name: 'Subtheme title 1',
                children: [
                    {
                        id: '2',
                        name: 'Tag 1',
                    },
                ],
            },
            {
                id: '3',
                name: 'Subtheme title 2',
                children: [
                    {
                        id: '4',
                        name: 'Tag 1',
                    },
                    {
                        id: '5',
                        name: 'Tag 2',
                    },
                ],
            },
            {
                id: '6',
                name: 'Subtheme title 3',
                children: [
                    {
                        id: '2',
                        name: 'Tag 1',
                        children:[
                            {
                                id:"9",
                                name:'subTag'
                            }
                        ]
                    },
                ],
            },
        ],
    }
];

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
function applyThemeColor(index){

    let colorCode = ['#12988A','#F4A000','#001839','#D14926','#084840','#D36582','#642CA9']

    index = index +1;

    if(index < colorCode.length){
        return colorCode[index-1]
    }
    else {

        let i = index % colorCode.length
        return colorCode[i - 1]
    }

}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};
const colorCode = ['#12988A','#F4A000','#001839','#D14926','#084840','#D36582','#642CA9']
function getQueryStringValue() {
    // return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    return window.location.href.split('/')[5];
}

class Themes extends Component {
    constructor(props) {
        super(props);
        this.state={
            anchorEl:null,
            order: "asc",
            value: 0,
            TableData:TableData,
            themeData:[],
            ParentThemeTitle:'',
            themeNameList:[],
            isAddThemeActive:false,
            selectedThemeId:'',
            tagFlag:false,
            tagFrequencyData:[],
            tagSkeleton : false,
            themeTitleNullError:false,
            selectedThemeType:'',
            analysisFlag:'show2',
            allDataEmpty:false,
            clickAway:false
        }
    }

componentDidMount() {

    let projectId = getQueryStringValue()
        if(projectId){
        this.setState({projectId:projectId},()=>{
            this.loadThemeTitle()
        this.handleRouteByID();
        })
    }
    if(cookie.get("user_Id")){
        this.setState({userId:cookie.get('user_Id')})
      }
  //this.myFunction()
}

handleRouteByID = () => {
    if(window.location.href.split('=')[1] !== undefined){
        let themeType = window.location.href.split('?').pop().split('=')[0];
        let TabType = window.location.href.split('/').pop().split('?')[0];
        let themeId = window.location.href.split('=')[1];
        if(TabType === "analysis"){

            this.setState({
                value:0,
                selectedThemeId:themeId,
                selectedThemeType:themeType,
                tagFlag:true,
                analysisFlag:"show1"
            })
            this.props.history.push({
                pathname: "/knit/projectsDetails/"+this.state.projectId+"/Themes/analysis?"+themeType+"="+themeId
            })

        }else if (TabType === "annotations"){
            this.setState({
                value:1,
                selectedThemeId:themeId,
                selectedThemeType:themeType,
                //tagFlag:true,
            })
            this.props.history.push({
                pathname: "/knit/projectsDetails/"+this.state.projectId+"/Themes/annotations?"+themeType+"="+themeId
            })
        }else {
        }

    }
    else {
    }
}

    loadThemeTitle=()=>{
        this.setState({isThemeBoxSkel:true})
        let user_data = {
            "is_parent_theme": true,
            "knit_project_id": this.state.projectId,
        };
        allThemeNameList(user_data).then((response) => {

            this.setState({ themeData:response.data,isThemeBoxSkel:false, tagFlag:false,projectId:this.state.projectId});
        if(response.data.length == 0){
            this.setState({ allDataEmpty :true});
        }

        });

    }

    insertParentThemeTitle=(event)=>{
        this.setState({isAddThemeActive:true})
        let value = event.target.value
        if(value.length > 0){
            this.setState({[event.target.name]:value,themeTitleNullError:false})
        }else {
            this.setState({ themeTitleNullError:true});
        }
        if(event.key === 'Enter' && this.state.ParentThemeTitle.length > 0){
        let user_data = {
            "parent_theme":true,
            "theme_name":this.state.ParentThemeTitle,
            "knit_project_id":this.state.projectId,
            "knit_user_id":this.state.userId
        };
        allThemeNameList(user_data).then((response) => {


            this.loadThemeTitle()
            this.setState({ ParentThemeTitle:''});
        });

        }else {
            //console.log("insertParentThemeTitle....Else...ELSE...");
            //this.setState({ themeTitleNullError:true});
        }

    }
    handleOnChange=(event)=>{
        let value = event.target.value.trim()

        if(value){
            this.setState({[event.target.name]:value,themeTitleNullError:false})
        }else {
            this.setState({ themeTitleNullError:true});
        }
    }

    renderThemeTitle=()=>{
        return(
            <Grid container spacing={1}>
                <Grid item xs={12} md={4} lg={4} sm={4}>
                    <Typography variant={"h6"} component={"h6"} className={"title-class"}>
                        THEMES
                    </Typography>
                </Grid>
                <Grid item xs={12} md={8} lg={8} sm={8} className={"buttonDiv"} style={{display:'flex', justifyContent:'flex-end'}}>
                    {/*<AutoCompleteWidget*/}
                    {/*    handleChange={(e)=>{this.hancleChange(e)}}>*/}
                    {/*</AutoCompleteWidget>*/}
                </Grid>
                <Grid  item xs={12} md={12} lg={12} sm={12}>

                </Grid>
            </Grid>
        )
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };

    blurevent = (event) => {
        if(this.state.ParentThemeTitle != null || this.state.ParentThemeTitle != ""){
            this.setState({isAddThemeActive:false})
        }
    }

    getTagFreqency= async (themeId,themeType)=>{

        this.setState(({backFlag:false, analysisFlag:false,selectedThemeId:themeId,tagFlag:true,selectedThemeType:themeType}),()=>{
            this.setState({analysisFlag:"show1"})
            if(themeId && themeType){

            if(this.state.value == 1){
                this.props.history.push({
                    pathname: "/knit/projectsDetails/"+this.state.projectId+"/Themes/annotations?"+themeType+"="+themeId
                })
            }else {
                this.props.history.push({
                    pathname: "/knit/projectsDetails/"+this.state.projectId+"/Themes/analysis?"+themeType+"="+themeId
                })
            }
            }else {
            }

        })
    }

    refreshTagFrequency=()=>{
        this.setState(({analysisFlag:false,selectedThemeId:'',tagFlag:true,selectedThemeType:''}),()=>{
            this.setState({analysisFlag:"show1"})
        })
    }

    clickChild= async (themeId)=>{
        // this.setState(({tagFlag:false}))
         this.setState(({selectedThemeId:themeId,tagFlag:true}))

        // this.setState({ tagSkeleton:true})
        //
        // themesTagFrequencyDetail(this.state.projectId,themeId).then((response) => {
        //
        //     console.log("Tag Frequency Detail API Response.......",response.data);
        //     if (response.data.length >0){
        //
        //         if(response.data[1].tag_data.length >0){
        //
        //             this.setState({tagFrequencyData:response.data[1].tag_data, isThemeAnalysisSkel:false})
        //         }
        //     }
        //     this.setState({ tagSkeleton: false,tagFlag:true})
        // });

    }

    removeSelected = () =>{
        var parentdvs = document.getElementsByClassName('ant-tree-treenode-selected');
        var childdvs = document.getElementsByClassName('ant-tree-node-selected');

        for(var i = 0;i<parentdvs.length;i++){
            parentdvs[i].classList.remove('ant-tree-treenode-selected')
        }


        for(var i = 0;i<childdvs.length;i++){
            childdvs[i].classList.remove('ant-tree-node-selected')
        }
    }

    handleClickAway=()=>{
        //console.log("analysisFlag IN....handleClickAway==>")
        // var parentdvs = document.getElementsByClassName('ant-tree-treenode-selected');
        // var childdvs = document.getElementsByClassName('ant-tree-node-selected');
        //
        // for(var i = 0;i<parentdvs.length;i++){
        //     parentdvs[i].classList.remove('ant-tree-treenode-selected')
        // }
        //
        //
        // for(var i = 0;i<childdvs.length;i++){
        //     childdvs[i].classList.remove('ant-tree-node-selected')
        // }
this.removeSelected()
        this.setState({selectedThemeId:'',selectedThemeType:''},()=>{
    this.setState({analysisFlag: false}, () => {
        this.setState({
            analysisFlag: "show1"
        })
    })
})
        }

    
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({themeTitleNullError:false})
        // setOpen(false);
    };


    handleRouteChange=(value,id,questionId)=>{
        // if(id){
        //   this.handleVideoDetails(id)
        // }
        // console.log("handleChange==>")
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
                                pathname: "/knit/projectsDetails/"+this.state.projectId+"/Video?view=grid"
                            })
                            : value == 2 ?
                                this.props.history.push({
                                    pathname: "/knit/projectsDetails/"+this.state.projectId+"/Video?view=list"
                                })
                            : value == 2 ?
                                this.props.history.push({
                                    pathname: "/knit/projectsDetails/"+this.state.projectId+"/Video?view=grid/"+id
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
    handleChangeVideoDetail=(value,id)=>{
    // console.log("videoIDDDD...>>>>.....",id);
        // if(id){
        //   this.handleVideoDetails(id)
        // }
        // console.log("handleChange==>")
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
                                pathname: "/knit/projectsDetails/"+this.state.projectId+"/Video?view=grid/"+id
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

    componentWillMount() {
        this.unlisten = this.props.history.listen((location, action) => {
            if(this.state.backFlag){
                //this.setState({backFlag:false})
            if(window.location.href.split('=')[1] !== undefined){

                let themeType = window.location.href.split('?').pop().split('=')[0];
                let TabType = window.location.href.split('/').pop().split('?')[0];
                let themeId = window.location.href.split('=')[1];
                if(TabType === "analysis"){
                    this.removeSelected()
                    this.setState({
                        value:0,
                        selectedThemeId:themeId,
                        selectedThemeType:themeType,
                        tagFlag:true,
                        analysisFlag:false
                    },()=>{
                        this.setState({analysisFlag:"show1"})
                    })
                    // this.props.history.push({
                    //     pathname: "/knit/projectsDetails/"+this.state.projectId+"/Themes/analysis?"+themeType+"="+themeId
                    // })

                }else if (TabType === "annotations"){
                    this.removeSelected()
                    this.setState({
                        value:1,
                        selectedThemeId:themeId,
                        selectedThemeType:themeType,
                        analysisFlag:false
                    },()=>{
                        this.setState({analysisFlag:"show1"})
                    })
                    // this.props.history.push({
                    //     pathname: "/knit/projectsDetails/"+this.state.projectId+"/Themes/annotations?"+themeType+"="+themeId
                    // })
                }else {
                }


            }
            else {
            }
            }
            else {
                this.setState({backFlag:true})
            }
        });
    }
    componentWillUnmount() {
        this.unlisten();
    }

    handleRedirectOpenText=(questionId,numericQuestionId)=>{
        this.props.history.push({
          pathname:"/knit/projectsDetails/"+this.state.projectId+"/Data?view=list&questionId="+questionId+"&numericId="+numericQuestionId,
          state:{
            questionId:questionId,
            numericQuestionId:numericQuestionId,
            projectId:this.state.projectId
          }
        })
      
    }


    render() {
        let classes = styles;
        //console.log("this.state.ParentThemeTitlethis.state.ParentThemeTitle", this.state.ParentThemeTitle)
        return (
            <PageWrapper selected={1} selectedId={4} isSidebar={true} projectId={this.state.projectId}>
                <div style={{width: "100%" }}>
                    {/* <SideBar
                        width={this.props.width}
                        //projectTitle={this.props.location.state.projectTitle}
                        onHandleChange={(id)=>{this.handleRouteChange(id,this.state.projectId)}}
                        // onHandleChange={(id)=>{handleChange(id,this.props.location.state.projectid )}}
                        selectedId={4}></SideBar> */}
                    <div style={{width: "calc(100% - 180px)",overflow: "overlay",float: "right",background: "#FBFBFB" }}>
            <div className={"main-class"}>
                {this.renderThemeTitle()}
                <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center'  }} open={this.state.themeTitleNullError} autoHideDuration={3000} onClose={this.handleClose}>
                    <Alert onClose={this.handleClose} severity="error">
                        Please Enter Value in Textbox
                    </Alert>
                </Snackbar>
                {/*{this.renderThemeCard()}*/}

                {this.state.allDataEmpty
                    ?
                        <Grid container spacing={2} style={{ marginTop: "18px", padding: "0px" }}>


                            <Grid item md={3} xs={12} lg={3} sm={12} style={{padding:"10px"}}>


                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} lg={12} sm={12}>

                                    </Grid>
                                </Grid>

                                {/* {data.length} */}

                                {this.state.isThemeBoxSkel &&(
                                    <>
                                        <div className={'theme-card-skeleton'}>
                                            <Skeleton variant="circle" width={12} height={12} />
                                            <Skeleton variant="rect" width={12} height={12} style={{marginLeft:'10px', marginRight:'10px'}} />
                                            <Skeleton variant="text" style={{width:'50%'}} />
                                        </div>
                                        <div className={'theme-card-skeleton'}>
                                            <Skeleton variant="circle" width={12} height={12} />
                                            <Skeleton variant="rect" width={12} height={12} style={{marginLeft:'10px', marginRight:'10px'}} />
                                            <Skeleton variant="text" style={{width:'50%'}} />
                                        </div>
                                        <div className={'theme-card-skeleton'}>
                                            <Skeleton variant="circle" width={12} height={12} />
                                            <Skeleton variant="rect" width={12} height={12} style={{marginLeft:'10px', marginRight:'10px'}} />
                                            <Skeleton variant="text" style={{width:'50%'}} />
                                        </div>
                                    </>
                                )}
                                {!this.state.isThemeBoxSkel &&
                                this.state.themeData.length > 0 ?
                                    this.state.themeData.map((item,index)=>{
                                        return(
                                            <>
                                                <Card variant="outlined" style={{marginBottom:"15px"}}>

                                                    {/* {console.log("Theme IDD.......===>",item._id.$oid)} */}

                                                    <CardContent>
                                                        <DragAndDropTree data={item} refreshTagFrequency={()=>{this.refreshTagFrequency()}} color={applyThemeColor(index)} loadThemeTitle={()=> {this.loadThemeTitle()}}  tagFrequency={(id,type)=>{this.getTagFreqency(id,type)}}></DragAndDropTree>
                                                    </CardContent>
                                                </Card>
                                            </>

                                        )
                                    })



                                    :
                                    ''
                                }

                                {this.state.isThemeBoxSkel &&(
                                    <>
                                        <div className={'theme-card-skeleton'}>
                                            <Skeleton variant="circle" width={12} height={12} />
                                            <Skeleton variant="rect" width={12} height={12} style={{marginLeft:'13px', marginRight:'13px'}} />
                                            <Skeleton variant="rect" height={30} style={{width:'80%'}} />
                                        </div>
                                    </>
                                )}

                                {!this.state.isThemeBoxSkel &&(
                                    <>
                                        <StatsSummaryWrapper
                                            style={{
                                                borderRadius: "10px",
                                                //height: "43vh",
                                                //minHeight: "400px",
                                                //paddingBottom: "20px",
                                                padding:"20px",
                                                fontFamily: FontFamily("semi-bold"),
                                                //overflowY: "scroll"
                                            }}>
                                            <Grid
                                                container
                                                spacing={2}
                                            >
                                                <Grid item xs={11} md={11} lg={12} sm={11} style={{display:"flex",alignItems:"center"}}>

                                                    <FiberManualRecordIcon style={{ color: "#13988A",width: "15px",height: "28px"}} ></FiberManualRecordIcon>
                                                    {/* <AddIcon style={{opacity:'0.3', fontSize:'14px',marginRight:"11px",marginLeft:"10px",width:"15px",height:"15px"}}></AddIcon> */}

                                                    <TextField
                                                        // error={true}
                                                        id="outlined-basic"
                                                        required={true}
                                                        className={'brd-hidden active-input'}
                                                        name={'ParentThemeTitle'}
                                                        //onBlur={(event)=>{this.blurevent(event)}}
                                                        // value={this.state.ParentThemeTitle}
                                                        //onKeyPress={this.insertParentThemeTitle}
                                                        onKeyUp={this.insertParentThemeTitle}
                                                        // onChange={this.handleOnChange}
                                                        size="small"
                                                        style={{width:'calc(100% - 50px)',overflow:'hidden',borderRadius:'5px',marginLeft:'10px', marginRight:'10px'}}
                                                        placeholder={"Add a theme title and press Enter"} variant="outlined" />
                                                    {this.state.isAddThemeActive &&
                                                    <SubdirectoryArrowLeftIcon  className={"add-theme-active"} />
                                                    }
                                                </Grid>
                                                {/*<Typography variant={"h6"} style={{marginLeft:'40px'}} className={"form-label-error"}>{*/}
                                                {/*    this.state.themeTitleNullError*/}
                                                {/*        ? "Please Enter Value"*/}
                                                {/*        : false*/}
                                                {/*}</Typography>*/}
                                            </Grid>
                                        </StatsSummaryWrapper>
                                    </>
                                )}

                            </Grid>
                            {/*</ClickAwayListener>*/}
                            {/*<ClickAwayListener onClickAway={()=>{this.handleClickAway()}}>*/}
                            <Grid item md={9} xs={12} lg={9} sm={12} style={{padding:"10px"}}>


                                <Grid
                                    container
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>

                                    <div style={{
                                        flexGrow: 1,
                                        maxWidth: "fit-content",
                                        alignItems: "center"
                                    }}>

                                        {/*<Paper*/}
                                        {/*    square*/}
                                        {/*    style={{*/}
                                        {/*        flexGrow: 1,*/}
                                        {/*        maxWidth: "fit-content",*/}
                                        {/*        background: "none",*/}
                                        {/*        boxShadow: "none"*/}
                                        {/*        //boxShadow: "0px 1px 0px #00000017"*/}
                                        {/*    }}>*/}
                                        <Grid
                                            item
                                            xs={12}
                                            md={12}
                                            sm={12}
                                            lg={12}
                                            style={{ height: "48px" }}>
                                            <Tabs
                                                value={this.state.value}
                                                onChange={this.handleChange}
                                                variant="standard"
                                                indicatorColor="primary"
                                                textColor="primary"
                                                aria-label="icon label tabs example"
                                                scrollButtons="auto"
                                                className={"tabs"}
                                                style={
                                                    this.props.width == "xs"
                                                        ? classes.TabsforMobile
                                                        :this.props.width == "md"
                                                        ? classes.TabsForTablet
                                                        :classes.TabsClass
                                                }>
                                                <Tab
                                                    label="Analysis"
                                                    className={"tabs"}
                                                    {...a11yProps(0)}
                                                    style={
                                                        this.props.width == "xs"
                                                            ? classes.TabClassforMobile
                                                            : classes.TabClass
                                                    }
                                                    onClick={
                                                        this.state.selectedThemeType && this.state.selectedThemeId?
                                                            this.props.history.push({
                                                                pathname: "/knit/projectsDetails/"+this.state.projectId+"/Themes/analysis?"+this.state.selectedThemeType+"="+this.state.selectedThemeId
                                                            })
                                                            :""
                                                    }
                                                />
                                                <Tab
                                                    label="Annotations"
                                                    {...a11yProps(1)}
                                                    style={
                                                        this.props.width == "xs"
                                                            ? classes.TabClassforMobile
                                                            : classes.TabClass
                                                    }
                                                    onClick={
                                                        this.state.selectedThemeType && this.state.selectedThemeId?
                                                        this.props.history.push({
                                                            pathname: "/knit/projectsDetails/"+this.state.projectId+"/Themes/annotations?"+this.state.selectedThemeType+"="+this.state.selectedThemeId
                                                        })
                                                    :""
                                                        }


                                                />
                                            </Tabs>
                                        </Grid>
                                    </div>
                                    {/*</Paper>*/}
                                </Grid>

                                <TabPanel value={this.state.value} index={0}>


                                    {/*<ThemeAnalysis projectId={this.props.projectId} userId={this.state.userId}/>*/}


                                </TabPanel>

                                <TabPanel value={this.state.value} index={1}>
                                    <ThemeAnnotations  projectId={this.state.projectId} userId={this.state.userId} themeId = {this.state.selectedThemeId} />

                                </TabPanel>

                            </Grid>

                        </Grid>

                    :<ClickAwayListener onClickAway={()=>{this.handleClickAway()}}>
                        <Grid container spacing={2} style={{ marginTop: "18px", padding: "0px" }}>


                            <Grid item md={3} xs={12} lg={3} sm={12} style={{padding:"10px"}}>


                                <Grid container spacing={2}>
                                    <Grid item md={12} xs={12} lg={12} sm={12}>

                                    </Grid>
                                </Grid>

                                {/* {data.length} */}

                                {this.state.isThemeBoxSkel &&(
                                    <>
                                        <div className={'theme-card-skeleton'}>
                                            <Skeleton variant="circle" width={12} height={12} />
                                            <Skeleton variant="rect" width={12} height={12} style={{marginLeft:'10px', marginRight:'10px'}} />
                                            <Skeleton variant="text" style={{width:'50%'}} />
                                        </div>
                                        <div className={'theme-card-skeleton'}>
                                            <Skeleton variant="circle" width={12} height={12} />
                                            <Skeleton variant="rect" width={12} height={12} style={{marginLeft:'10px', marginRight:'10px'}} />
                                            <Skeleton variant="text" style={{width:'50%'}} />
                                        </div>
                                        <div className={'theme-card-skeleton'}>
                                            <Skeleton variant="circle" width={12} height={12} />
                                            <Skeleton variant="rect" width={12} height={12} style={{marginLeft:'10px', marginRight:'10px'}} />
                                            <Skeleton variant="text" style={{width:'50%'}} />
                                        </div>
                                    </>
                                )}
                                {!this.state.isThemeBoxSkel &&
                                this.state.themeData.length > 0 ?
                                    this.state.themeData.map((item,index)=>{
                                        return(
                                            <>
                                                <Card variant="outlined" style={{marginBottom:"15px"}}>

                                                    {/*{console.log("Theme IDD.......===>",item._id.$oid)}*/}

                                                    <CardContent>
                                                        <DragAndDropTree data={item} color={applyThemeColor(index)} refreshTagFrequency={()=>{this.refreshTagFrequency()}} loadThemeTitle={()=> {this.loadThemeTitle()}}  tagFrequency={(id,type)=>{this.getTagFreqency(id,type)}}></DragAndDropTree>
                                                    </CardContent>
                                                </Card>
                                            </>

                                        )
                                    })



                                    :
                                    ''
                                }

                                {this.state.isThemeBoxSkel &&(
                                    <>
                                        <div className={'theme-card-skeleton'}>
                                            <Skeleton variant="circle" width={12} height={12} />
                                            <Skeleton variant="rect" width={12} height={12} style={{marginLeft:'13px', marginRight:'13px'}} />
                                            <Skeleton variant="rect" height={30} style={{width:'80%'}} />
                                        </div>
                                    </>
                                )}

                                {!this.state.isThemeBoxSkel &&(
                                    <>
                                        <StatsSummaryWrapper
                                            style={{
                                                borderRadius: "10px",
                                                //height: "43vh",
                                                //minHeight: "400px",
                                                //paddingBottom: "20px",
                                                padding:"20px",
                                                fontFamily: FontFamily("semi-bold"),
                                                //overflowY: "scroll"
                                            }}>
                                            <Grid
                                                container
                                                spacing={2}
                                            >
                                                <Grid item xs={11} md={11} lg={12} sm={11} style={{display:"flex",alignItems:"center"}}>

                                                    <FiberManualRecordIcon style={{ color: "#13988A",width: "15px",height: "28px"}} ></FiberManualRecordIcon>
                                                    {/* <AddIcon style={{opacity:'0.3', fontSize:'14px',marginRight:"11px",marginLeft:"10px",width:"15px",height:"15px"}}></AddIcon> */}

                                                    <TextField
                                                        // error={true}
                                                        id="outlined-basic"
                                                        required={true}
                                                        className={'brd-hidden active-input'}
                                                        name={'ParentThemeTitle'}
                                                        //onBlur={(event)=>{this.blurevent(event)}}
                                                        // value={this.state.ParentThemeTitle}
                                                        //onKeyPress={this.insertParentThemeTitle}
                                                        onKeyUp={this.insertParentThemeTitle}
                                                        // onChange={this.handleOnChange}
                                                        size="small"
                                                        style={{width:'calc(100% - 50px)',overflow:'hidden',borderRadius:'5px',marginLeft:'10px', marginRight:'10px'}}
                                                        placeholder={"Add a theme title and press Enter"} variant="outlined" />
                                                    {this.state.isAddThemeActive &&
                                                    <SubdirectoryArrowLeftIcon  className={"add-theme-active"} />
                                                    }
                                                </Grid>
                                                {/*<Typography variant={"h6"} style={{marginLeft:'40px'}} className={"form-label-error"}>{*/}
                                                {/*    this.state.themeTitleNullError*/}
                                                {/*        ? "Please Enter Value"*/}
                                                {/*        : false*/}
                                                {/*}</Typography>*/}
                                            </Grid>
                                        </StatsSummaryWrapper>
                                    </>
                                )}

                            </Grid>
                            {/*</ClickAwayListener>*/}
                            {/*<ClickAwayListener onClickAway={()=>{this.handleClickAway()}}>*/}
                            <Grid item md={9} xs={12} lg={9} sm={12} style={{padding:"10px"}}>


                                <Grid
                                    container
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>

                                    <div style={{
                                        flexGrow: 1,
                                        maxWidth: "fit-content",
                                        alignItems: "center"
                                    }}>

                                        {/*<Paper*/}
                                        {/*    square*/}
                                        {/*    style={{*/}
                                        {/*        flexGrow: 1,*/}
                                        {/*        maxWidth: "fit-content",*/}
                                        {/*        background: "none",*/}
                                        {/*        boxShadow: "none"*/}
                                        {/*        //boxShadow: "0px 1px 0px #00000017"*/}
                                        {/*    }}>*/}
                                        <Grid
                                            item
                                            xs={12}
                                            md={12}
                                            sm={12}
                                            lg={12}
                                            style={{ height: "48px" }}>
                                            <Tabs
                                                value={this.state.value}
                                                onChange={this.handleChange}
                                                variant="standard"
                                                indicatorColor="primary"
                                                textColor="primary"
                                                aria-label="icon label tabs example"
                                                scrollButtons="auto"
                                                className={"tabs"}
                                                style={
                                                    this.props.width == "xs"
                                                        ? classes.TabsforMobile
                                                        :this.props.width == "md"
                                                        ? classes.TabsForTablet
                                                        :classes.TabsClass
                                                }>
                                                <Tab
                                                    label="Analysis"
                                                    className={"tabs"}
                                                    {...a11yProps(0)}
                                                    style={
                                                        this.props.width == "xs"
                                                            ? classes.TabClassforMobile
                                                            : classes.TabClass
                                                    }
                                                />
                                                <Tab
                                                    label="Annotations"
                                                    {...a11yProps(1)}
                                                    style={
                                                        this.props.width == "xs"
                                                            ? classes.TabClassforMobile
                                                            : classes.TabClass
                                                    }
                                                />
                                            </Tabs>
                                        </Grid>
                                    </div>
                                    {/*</Paper>*/}
                                </Grid>

                                <TabPanel value={this.state.value} index={0}>

                                    {/*<ThemeAnalysis setClick={click => this.clickChild = click} themeType={this.state.selectedThemeType} themeId={this.state.selectedThemeId} projectId={this.props.projectId} userId={this.state.userId}/>*/}

                                    {this.state.analysisFlag === "show1"
                                        ? <ThemeAnalysis setClick={click => this.clickChild = click} showAnalysis={true} handleChange={(id,videoId,questionId)=>{this.handleChangeVideoDetail(id,videoId,questionId)}} themeType={this.state.selectedThemeType} themeId={this.state.selectedThemeId} projectId={this.state.projectId} userId={this.state.userId}/>
                                        : this.state.analysisFlag === "show2" ? <ThemeAnalysis setClick={click => this.clickChild = click} handleChange={(id,videoId,questionId)=>{this.handleChangeVideoDetail(id,videoId,questionId)}} themeType={this.state.selectedThemeType} themeId={this.state.selectedThemeId} projectId={this.state.projectId} userId={this.state.userId}/>
                                            : null
                                    }



                                    {/*{this.state.tagFlag*/}
                                    {/*    // ? <ThemeAnnotations  projectId={this.state.projectId} userId={this.state.userId}/>*/}
                                    {/*? <TagFrequencyDetail isSkeleton={this.state.tagSkeleton} projectId={this.state.projectId} themeId = {this.state.selectedThemeId}/>*/}
                                    {/*: <ThemeAnalysis projectId={this.props.projectId} userId={this.state.userId} handleChange={(id,videoId,questionId)=>{this.props.handleChange(id,videoId,questionId)}}/>*/}
                                    {/*}*/}
                                    {/*<TagFrequencyDetail isSkeleton={this.state.tagSkeleton} tagData = {this.state.tagFrequencyData}/>*/}



                                    {/*<ThemeAnalysis onSelectLanguage={this.handleLanguage}  projectId={this.props.projectId} userId={this.state.userId}/>*/}
                                    <div className={'analysis-skeleton'} style={{display:'none'}}>
                                        <div className={'analysis-header'}>
                                            <Skeleton variant="text" style={{width:'200px'}} />
                                            <Skeleton variant="rect" width={14} height={14} />
                                        </div>
                                        <div className={'analysis-body'}>
                                            <div className={"parallel-question"}>
                                                <Skeleton variant="text" style={{width:'95%'}} />
                                                <Skeleton variant="rect" width={14} height={14} />
                                            </div>
                                            <div className={"process-with-response"}>
                                                <div className={"processbar-val-show"}>
                                                    <div className={"process-val"}>
                                                        <Skeleton variant="text" style={{marginBottom:10,width:'100%'}} />
                                                    </div>
                                                    <div className={"processbar-show"}>
                                                        <Skeleton variant="rect" height={5}></Skeleton>
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
                                                        <Skeleton variant="rect" height={5}></Skeleton>
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
                                        <div className={'analysis-body'}>
                                            <div className={"parallel-question"}>
                                                <Skeleton variant="text" style={{width:'95%'}} />
                                                <Skeleton variant="rect" width={14} height={14} />
                                            </div>
                                            <div className={"process-with-response"}>
                                                <div className={"processbar-val-show"}>
                                                    <div className={"process-val"}>
                                                        <Skeleton variant="text" style={{marginBottom:10,width:'100%'}} />
                                                    </div>
                                                    <div className={"processbar-show"}>
                                                        <Skeleton variant="rect" height={5}></Skeleton>
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
                                                        <Skeleton variant="rect" height={5}></Skeleton>
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
                                    </div>
                                </TabPanel>

                                <TabPanel value={this.state.value} index={1}>
                                    {/*<ThemeAnnotations  projectId={this.state.projectId} userId={this.state.userId} themeId = {this.state.selectedThemeId} />*/}
                                    {this.state.analysisFlag === "show1"
                                        ? <ThemeAnnotations 
                                        handleRedirectOpenText={(questionId,numericId)=>{this.handleRedirectOpenText(questionId,numericId)}}
                                         projectId={this.state.projectId} allTheme = {this.state.themeData} handleChange={(id,videoId,questionId)=>{this.handleChangeVideoDetail(id,videoId,questionId)}} userId={this.state.userId} themeType={this.state.selectedThemeType} themeId = {this.state.selectedThemeId} />
                                        : this.state.analysisFlag === "show2" ? 
                                        <ThemeAnnotations  
                                        handleRedirectOpenText={(questionId,numericId)=>{this.handleRedirectOpenText(questionId,numericId)}}
                                        projectId={this.state.projectId} allTheme = {this.state.themeData} userId={this.state.userId} handleChange={(id,videoId,questionId)=>{this.handleChangeVideoDetail(id,videoId,questionId)}} themeType={this.state.selectedThemeType} themeId = {this.state.selectedThemeId} />
                                            : null
                                    }
                                </TabPanel>

                            </Grid>

                        </Grid>
                    </ClickAwayListener>
                }
            </div>
                    </div>
                    {/* <Members></Members> */}
                </div>
            </PageWrapper>
        );
    }
}
export default withWidth()(withRouter(Themes));

