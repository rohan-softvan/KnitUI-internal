import React, {Component} from "react";
import withWidth, {isWidthUp, isWidthDown} from "@material-ui/core/withWidth";
import PageWrapper from "../../PageWrapper/PageWrapper";
import Cookies from "universal-cookie";
import "../../../css/common.scss";
import Color from "../../../config/Color";
import SideBar from "../../../components/sidebar/SideBar";
import Projects from "../Projects/Projects";
import Summary from "../Summary/Summary";
import Data from "../Data/Data";
// import DataAnnotation from "../Data/DataAnnotation";
import Videos from "../Videos/Videos";
import Themes from "../Themes/Themes"
import ShowReels from "../ShowReels/ShowReels"
import {Redirect, Switch, Route, Link} from "react-router-dom";
import ShowreelsDetails from "../ShowreelsDetails/ShowreelsDetails"

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

const cookie = new Cookies();
let projectId = "";
let projectTitle = "";

function getQueryStringValue() {
    // return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
    return window.location.href.split('#')[1];
}

class ProjectDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            activePage: 1,
        };
    }

    componentDidMount() {
        projectId = this.props.location.state.projectid
        projectTitle = this.props.location.state.projectTitle
        //this.myFunction()
    }

    myFunction = () => {
        //this.props.history.push("/knit/projects-details?tab=2");
        const {history} = this.props;
        history.push({
            pathname: "/knit/projects-details",
            hash: 'tab2',
            state: {
                projectid: projectId,
                projectTitle: projectTitle
            }
        });
    }
    handleChange = (value, id, questionId) => {
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
        return (
            <div>
                {value == 1 ?
                    this.props.history.push({
                        pathname: "/knit/projectDetails/" + this.props.location.state.projectid + "/Data?view=list",
                        state: {
                            change: this.handleChange()
                        }
                    })
                    : value == 2 ?
                        this.props.history.push({
                            pathname: "/knit/projectDetails/" + this.props.location.state.projectid + "/Video",
                            state: {
                                handleChange: this.handleChange(value)
                            }
                        })
                        : <></>
                }

            </div>
        )

    }

    handleVideoDetails = (id) => {
        this.setState({videoId: id}, () => {
        })
    }

  renderActive = () => {
    return (
      this.props.location.state.projectid &&
      this.state.activePage == 0
      ? <Summary projectId={this.props.location.state.projectid}></Summary>
      : this.state.activePage == 1 ?
      <>
      {/* <DataAnnotation></DataAnnotation> */}
      <Data projectId={this.props.location.state.projectid} projectTitle={this.props.location.state.projectTitle} handleChange={(value,id,questionId)=>{this.handleChange(value,id,questionId)}} changeVideoDetails={(videoId)=>{this.handleVideoDetails(videoId)}}></Data>
      </>
      : this.state.activePage == 2 ?
<Videos projectId={this.props.location.state.projectid} projectTitle={this.props.location.state.projectTitle} videoId={this.state.videoId} questionId={this.state.questionId}></Videos>
      // : this.state.activePage == 3 ?
      // <ShowReels projectId={projectId}></ShowReels>
      : this.state.activePage == 4?
      <Themes projectId={this.props.location.state.projectid} handleChange={(value,id,questionId)=>{this.handleChange(value,id,questionId)}}></Themes>
      :null
      )
  };


    render() {
        return (
            <div>
                {/*<PageWrapper selected={1} isSidebar={true}>
        <div style={{width: "100%" }}>
          <SideBar
          width={this.props.width}
          projectTitle={this.props.location.state.projectTitle}
          onHandleChange={(id)=>{this.handleChange(id)}}
          // onHandleChange={(id)=>{handleChange(id,this.props.location.state.projectid )}}
          selectedId={this.state.activePage}></SideBar>
          <div style={{width: "calc(100% - 180px)",overflow: "overlay",float: "right",background: "#FBFBFB" }}>*/}
                <Switch>
                    {/*  <Route exact path="/knit/projectDetails/:id/Data" component={<Data projectId={this.props.location.state.projectid} projectTitle={this.props.location.state.projectTitle}*/}
                    {/*      handleTabChange={(value,id,questionId)=>{this.handleChange(value,id,questionId)}} changeVideoDetails={(videoId)=>{this.handleVideoDetails(videoId)}}></Data>}></Route>*/}
                    {/*  <Route exact path={"/knit/projectDetails/:id/Video"} component={<Videos projectId={this.props.location.state.projectid} projectTitle={this.props.location.state.projectTitle} videoId={this.state.videoId} questionId={this.state.questionId}></Videos>}></Route>*/}
                </Switch>
            </div>
            /*</div>
          </PageWrapper>*/
        );
    }
}

// function handleChange(id,projectId){
//   // console.log("props===>",props)
//   return(
//
//   )
// }
export default withWidth()(ProjectDetails);
