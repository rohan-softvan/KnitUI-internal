import React from "react";
import {Grid,Typography} from "@material-ui/core";
import AutoCompleteWidget from "../../../components/autoCompleteWidget/AutoCompleteWidget";
import RepositoryCard from "../../../components/repositoryCard/repositoryCard";
import ShowreelsDetails from "../ShowreelsDetails/ShowreelsDetails";
import { allReels, searchReels,deleteShowReels } from "../../../services/ShowReelsService";
import ButtonComponent from "../../../components/button/Button";
import AddIcon from "@material-ui/icons/Add";
import {withRouter} from "react-router-dom";
import withWidth from "@material-ui/core/withWidth/withWidth";
import PageWrapper from "../../PageWrapper/PageWrapper";
import SideBar from "../../../components/sidebar/SideBar";
import AuthLoader from "../../../components/authLoader/Loader";
const showreelsList=[
  {
    id:1,
    title:"Demo Video Reel",
    subTitle:"6 videos",
    isOpen:false
  },
]
function getQueryStringValue() {
    // return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    return window.location.href.split('/')[5];
}

class ShowReels extends React.Component{
    constructor(props){
        super(props)
        this.state={
            showreelsList:[],
            isShowReelPage:true,
            isShowReelDetailsPage:false,
            openedShowReelId: null,
            selectedShowReelId: null,
            totalUntitleReels:1,
            highlightLink:'',
            projectId:'',
            
        }
    }

    handlePopperOpen = (event,data) => {
      // console.log("event==>",data)
        data.isOpen = !data.isOpen;

        for(let i in this.state.showreelsList){
            if(this.state.showreelsList[i].id != data.id){
                this.state.showreelsList[i].isOpen=false;
            }
        }
        this.setState({
            anchorEl:event.currentTarget,
            showreelsList:this.state.showreelsList
        })
    };

    makeShowReelList = (showReelData) => {
        let showreelsList = [];
        let totalUntitleReels=0;
        Array.isArray(showReelData) &&
        showReelData.length > 0 &&
        showReelData.forEach(responseData => {
            let showReelObj = {};
            showReelObj['id'] = responseData._id.$oid;
            showReelObj['title'] = responseData.showreel_name;
            showReelObj['subTitle'] = responseData.videos_thumbnails.length + " videos";
            showReelObj['videosThumbnails'] = responseData.videos_thumbnails;
            showReelObj['highlightLink'] = responseData.showreel_merged_highlights_link;
            showReelObj['modifiedDate'] = responseData.modified_on;
            showReelObj['isOpen'] = false;
            if(responseData.showreel_name.includes("Untitled Showreel")){
                totalUntitleReels+=1;
            }
            showreelsList.push(showReelObj);
        });
        this.setState({showreelsList,totalUntitleReels})
    }

    getAllShowReels = () => {
        let outerThis = this;
        allReels (this.state.projectId).then(response => {
            if (response.data) {
                outerThis.makeShowReelList(response.data);
            }
        })
    }

    searchVideoReel = (searchValue) => {
        let outerThis = this;
        let searchBody = {
            "is_showreel_search": true,
            "showreels_search_by": searchValue,
            "knit_project_id": this.state.projectId
        }
        searchReels(searchBody).then(response => {
            if (response.data) {
                outerThis.makeShowReelList(response.data);
            }
        })
    }

    handleReelSearch = (event) => {
        //console.log("event...Search...",event.key);
  
        let outerThis = this;
        let { value } = event.target;
        //console.log("ON Enter KEY...Search...",value.length);
        if(event.key === 'Enter' && value && value.trim()){
//console.log("ON Enter KEY...Search...");
        this.searchVideoReel(value);
}else if(event.key === 'Enter' && value.length == 0){
    this.getAllShowReels();
  } 
        
        // if (value && value.trim()) {
        //         setTimeout(() => {
        //             outerThis.searchVideoReel(value);
        //         }, 3000);
        //     } else {
        //         this.getAllShowReels();
        //     }
    }

    componentDidMount() {
        let projectId = getQueryStringValue()

        if(projectId){
            this.setState({ projectId: projectId },()=>{
                this.getAllShowReels();

            })
        }

        if (window.location.href.split('/')[7] != undefined){
            this.setState({
                isShowReelDetailsPage: true,
                isShowReelPage:false,
            })
        }

    //this.myFunction()
    }
    myFunction=()=> {
        //this.props.history.push("/knit/projects-details?tab=2");
        const { history } = this.props;
        history.push({
            pathname: "/knit/projects-details",
            hash: 'Showreels',
            state: {
                projectId: this.props.projectId,
            }
        });
    }
    changePage = () => {
        this.setState({isShowReelPage:!this.state.isShowReelPage, isShowReelDetailsPage:!this.state.isShowReelDetailsPage},()=>{
            this.getAllShowReels();
        });
    }

    handleNewShowreel = (isNewShowReel)=>{
        this.setState({selectedShowReelTitle: '',isNewShowReel:isNewShowReel})
        this.setState({isShowReelPage:!this.state.isShowReelPage, isShowReelDetailsPage:!this.state.isShowReelDetailsPage});        
    }
    handleRedirect=(title,isNewShowReel, showReelId,highlightLink,modifiedDate)=>{
    // console.log("title......",title);
        if(showReelId){
            localStorage.setItem("highlightsConcatenationFlag",true);
        }
    if(highlightLink){
        localStorage.setItem("showreelHighlightVideoLink"+showReelId,highlightLink);
    }
    if(modifiedDate){
        localStorage.setItem("modifiedDate",modifiedDate);
    }

    if(title){
localStorage.setItem("ShowReelTitle",title)
    }else{
        localStorage.removeItem("ShowReelTitle")
    }
        this.setState({selectedShowReelTitle: title,isNewShowReel:isNewShowReel, selectedShowReelId: showReelId,highlightLink:highlightLink})
        this.setState({isShowReelPage:!this.state.isShowReelPage, isShowReelDetailsPage:!this.state.isShowReelDetailsPage});
    this.handleChangeShowReelsDetail(3,showReelId)
    }

    handleDeleteProject = (id) => {
        // let outerThis = this;
        // console.log("iddddddddddd",id)
        deleteShowReels(id).then(response => {
            if (response.data) {
                this.getAllShowReels()
            }
        })
    }


    // handleClickOpenModel = () => {
    //     console.log("handleClickOpenModel")
    //     this.setState({
    //         deleteModalOpen: true,
    //     });
    // };

    // deleteModalClose = () => {
    //     this.setState({
    //         deleteModalOpen: false,
    //         open:false
    //     });
    // }
  renderTitle=()=>{
    return(
        <Grid container spacing={1}>
          <Grid item xs={12} md={12} lg={4} sm={4}>
              <Typography variant={"h6"} component={"h6"} className={"title-class"}>
                  SHOWREELS
              </Typography>
          </Grid>
          <Grid item xs={12} md={12} lg={8} sm={8} className={"buttonDiv sub-div-header"}>
                <ButtonComponent
                    icon={<AddIcon />}
                    iconPosition={"left"}
                    fontSize={13}
                    width={"156px"}
                    margin={"0px"}
                    text={"New Showreel"}
                    onClick={()=>{this.handleRedirect("",true, "")}}
                    //onClick={()=>{this.handleNewShowreel(true)}}
                ></ButtonComponent>
                <AutoCompleteWidget
                    handleChange={(event)=>{this.handleReelSearch(event)}}></AutoCompleteWidget>
          </Grid>
            <Grid  item xs={12} md={12} lg={12} sm={12} style={{marginTop: 30}}>
                <div style={{display:"flex",flexWrap:'wrap'}}>
                    {this.state.showreelsList.map((item,index)=>{
                        return(
                            <>
                                {/* {console.log("showreelsListshowreelsList",item)} */}
                                <RepositoryCard
                                    title={item.title}
                                    subTitle={item.subTitle}
                                    isVideoThumbnail={true}
                                    videosThumbnails = {item.videosThumbnails}
                                    height={"170px"}
                                    isOpen={item.isOpen}
                                    anchorEl={this.state.anchorEl}
                                    handlePopperOpen={(event)=>{
                                        this.handlePopperOpen(event,item)
                                    }}

                                    // handleClickOpenModel={()=> {
                                    //     this.handleClickOpenModel()
                                    // }}
                                    // deleteModalClose={()=> {
                                    //     this.deleteModalClose()
                                    // }}
                                    deleteModalOpen={this.state.deleteModalOpen}
                                    changePage={()=>{this.handleRedirect(item.title, false, item.id,item.highlightLink,item.modifiedDate)}}
                                    onSelectedDelete={()=>{this.handleDeleteProject(item.id)}}
                                ></RepositoryCard>
                            </>

                        )
                    })}
                    {/* <RepositoryCard
                title={"Report Name Here"}
                subTitle={"1 Jan 2021"}
                isStatus={true}
                status={"Draft"}
                height={"142px"}
                ></RepositoryCard> */}
                </div>
            </Grid>
        </Grid>
    )
  }

    handleChangeShowReelsDetail=(value,id)=>{
    // console.log("In route function...",value,id);

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
                                    : value == 3 ?
                                        this.props.history.push({
                                            pathname: "/knit/projectsDetails/"+this.state.projectId+"/ShowReels/"+id
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

    handleChange=(value,id,questionId)=>{
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
                    : value == 2 ?
                        this.props.history.push({
                            pathname: "/knit/projectsDetails/"+this.state.projectId+"/Video"
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
                    isShowReelDetailsPage: false,
                    isShowReelPage:true
                })
                //this.showVideoPage();
            }
            else {
                this.setState({
                    isShowReelDetailsPage: "",
                    isShowReelPage:"",
                    videoId:""
                },()=>{
                    this.setState({
                        isShowReelDetailsPage: true,
                        isShowReelPage:false,
                        videoId:window.location.href.split('/')[7]
                    })
                })



            }
        });
    }
    componentWillUnmount() {
        this.unlisten();
    }


    render(){
        return(

            <PageWrapper selected={1} selectedId={3} isSidebar={true} projectId={this.state.projectId}>
                <div style={{width: "100%" }}>
                    {/*<SideBar*/}
                    {/*    width={this.props.width}*/}
                    {/*    //projectTitle={this.props.location.state.projectTitle}*/}
                    {/*    onHandleChange={(id)=>{this.handleChange(id,this.state.projectId)}}*/}
                    {/*    // onHandleChange={(id)=>{handleChange(id,this.props.location.state.projectid )}}*/}
                    {/*    selectedId={this.state.activePage}></SideBar>*/}
                    <div style={{width: "calc(100% - 180px)",overflow: "overlay",float: "right",background: "#FBFBFB" }}>
                        <div className={"main-class"}>
                            {this.state.isShowReelPage &&
                            this.renderTitle()
                            }
                            {this.state.isShowReelDetailsPage &&
                            <ShowreelsDetails title={this.state.selectedShowReelTitle}
                                              showReelId={this.state.selectedShowReelId}
                                              projectId={this.state.projectId}
                                              highlightVideoLink={this.state.highlightLink}
                                              totalUntitleReels={this.state.totalUntitleReels}
                                              openedShowReelId={this.state.openedShowReelId}
                                              isNewShowReel={this.state.isNewShowReel} 
                                              handleBack={()=>{this.changePage()}}
                                              routingShowReelsDetail={(id)=>{this.handleChangeShowReelsDetail(3,id)}}>
                                              </ShowreelsDetails>
                            }
                        </div>
                    </div>
                    {/* <Members></Members> */}
                </div>
            </PageWrapper>

        )
    }
}

//export default ShowReels;
export default (withRouter(ShowReels));
