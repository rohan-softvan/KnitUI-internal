import React, { Component } from "react";
import PageWrapper from "../../PageWrapper/PageWrapper";

import {Grid, Typography} from "@material-ui/core";
import "./Projects.scss";
import ButtonComponent from "../../../components/button/Button";
import Button from "@material-ui/core/Button";
//import AddIcon from "@material-ui/core/SvgIcon/SvgIcon";
import AddIcon from '@material-ui/icons/Add';
import ProjectCard from "../../../components/projectCard/ProjectCard"
import AutoCompleteWidget from "../../../components/autoCompleteWidget/AutoCompleteWidget";
import AddNewProject from "../../../components/newProjectModal/NewProjectModal"
import Cookies from "universal-cookie";
import {onesignalops} from "../../../services/ShowReelsService";
import {checkEmailExist, refreshToken} from "../../../services/CommonService";
import { getProjectData, createNewProject, deleteProject } from "../../../services/ProjectService";
import Skeleton from '@material-ui/lab/Skeleton';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import OneSignal from 'react-onesignal'
import {ONE_SIGNAL_APP_ID} from "../../../Constants";
import { setProjectId } from '../../../redux/slice/ProjectSlice'
import { resetProjectStoreData } from '../../../redux/slice/DataSlice'
import { connect } from 'react-redux';
const cookie = new Cookies();
let timer;



function signal(){
    var OneSignal = OneSignal || [];
    OneSignal.push(["init", {
        appId: ONE_SIGNAL_APP_ID,
        // Your other init settings
    }]);
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
      this.state = {
          userID:'',
          isProjectCard: true,
          ProjectCardBox: [],
          projectCreationMessage:"",
          oneSignalPlayerId:"",
          oneSignalFlag:true
      };
  }
    componentDidMount() {
        let userId = cookie.get("user_Id")
        signal();

        if(userId){
            this.setState({userID:userId})
        }
        this.props.resetProjectStoreData()

        refreshToken().then((data) => {
                cookie.set("csrf", data.idToken.jwtToken, { httpOnly: false, path: "/" });
        });
        let email =cookie.get("user_email")
        this.checkUserMail(email)
    }


getPlayerID = async () =>{
    OneSignal.getUserId().then(value => {
          if(value){
          this.setState({oneSignalPlayerId:value},()=>{
              this.sendAppIdtooneSignal();            
          });
              clearTimeout(timer);
      }else{
          setTimeout(() => {
              this.getPlayerID()
          }, 5000);
      }

      })
}

  //get oneSignalPlayerId
  getOneSignalPlayerId =()=>{
    OneSignal.init({
        appId: ONE_SIGNAL_APP_ID,kOSSettingsKeyAutoPrompt : true
    }).then(() => {
            this.getPlayerID()
        });
    }

    //get Project Card Data
    getData = (userId,organizationId) => {
        this.setState({isProjectCard:true})
        let user_data={
            "is_projects_retrieval": true,
            "organization_id": organizationId
        }
        getProjectData(user_data).then((response) => {
            //this.setState({isProjectCard: true})
            let ProjectCardBox = [];
            if (response.data) {
                for (let i in response.data) {
                    ProjectCardBox.push({
                        projectId: response.data[i]._id.$oid,
                        title: response.data[i].project_name,
                        response: response.data[i].current_response_count,
                        type: response.data[i].project_type,
                    });
                }
            }
            this.setState({ProjectCardBox, isProjectCard: false})
        });
    };


    createProject(projectName, projectType, projectDataSource, apiToken, qualtricsProject, qualtricsProjectName) {
        this.setState({projectCreationMessage:true})
        let {userID, organization} = this.state;
        let projectData = {
            "is_project_creation": true,
            "project_name": projectName,
            "project_type": projectType,
            "knit_user_id": userID,
            "is_admin_created": false,
            "project_data_source": projectDataSource,
            "qualtrics_access_token": apiToken,
            "is_qualitative_csv_mapping": false,
            "organization_id" : organization,
            "survey_form_id" : qualtricsProject,
            "survey_form_title": qualtricsProjectName
        }

        createNewProject(projectData).then(response => {
            if (response.status_code === 200) {
                // setTimeout(() => {
                //     this.getData(userID, organization);
                // }, 5000);

            }
        })
    }
    
    sendAppIdtooneSignal = () =>{
        if(this.state.oneSignalFlag && this.state.userID && this.state.oneSignalPlayerId){
            let user_data={
                "update_onesignal_player_id": true,
                "user_id": this.state.userID,
                "onesignal_player_id": this.state.oneSignalPlayerId
            }
            onesignalops(user_data).then((response) => {
                if(response.data){
                   this.setState({oneSignalFlag:false})
                }
            })
        }
    }

    checkUserMail = (email) => {
        if (email !== "") {
            let data = {
                email: email
            };
            checkEmailExist(data).then((response) => {
                if (response.data.length > 0) {
                    let organizationId="";
                    let userId=""
                    if(response.data[0].organization_id.length > 0 && response.data[0].organization_id[0] != null ){
                        this.setState({organization: response.data[0].organization_id[0].$oid})
                        organizationId=response.data[0].organization_id[0].$oid;
                        cookie.set("organization_id", response.data[0].organization_id[0].$oid)
                    }
                   
                    userId=response.data[0]._id.$oid;
                    this.setState({ userID: response.data[0]._id.$oid,organizationId:response.data[0].organization_id[0].$oid },()=>{
                        this.getOneSignalPlayerId();
                    });
                    this.getData(userId,organizationId);
                     cookie.set("user_Id",response.data[0]._id.$oid)
                }
            });
        }

    };

    handleRedirect=(id,title,type)=>{
        localStorage.setItem("projectId",id)
        localStorage.setItem("projectType",type)
        localStorage.setItem("projectTitle",title)
        const { setProjectId } = this.props;
        setProjectId(id);
        // setTimeout(() => {
            const { history } = this.props;
            history.push({
                pathname: "/knit/projectsDetails/"+id+"/Data?view=list",
                state: {
                    projectid: id,
                    projectTitle:title
                }
            });
        // }, 1000);
       
    }

    handleDeleteProject = (id) => {        
        let outerThis = this;        
        deleteProject (id).then(response => {
            if (response.data) {
                this.getData(this.state.userID,this.state.organizationId);
            }
        })
    }

    

    renderTitle=()=>{
        return(
            <Grid container>
                <Grid item xs={6} md={5} lg={5} sm={5}>
                    <Typography variant={"h6"} component={"h6"} className={"title-class"}>
                        PROJECTS
                    </Typography>
                </Grid>
                <Grid item xs={6} md={7} lg={7} sm={7} className={"buttonDiv"}>
                    <AddNewProject
                        width={this.props.width}
                        createProject = {(projectName, projectType,
                                        projectDataSource, apiToken,
                                        qualtricsProject, qualtricsProjectName) => this.createProject(projectName, projectType,
                                        projectDataSource, apiToken,
                                        qualtricsProject, qualtricsProjectName)}
                    />
                    <AutoCompleteWidget
                    handleChange={(e)=>{this.hancleChange(e)}}>
                    </AutoCompleteWidget>
                </Grid>
            </Grid>
        )
    }

    renderProjectCard=()=>{
        return(
            <Grid container direction="row" alignItems="center" spacing={2} className={"innerLayoutSpace"}>
                {this.state.isProjectCard && (
                    <>
                        <div className={"projectcard-skeleton"}>
                            <Skeleton variant="rect" width={32} height={32} style={{marginBottom: 22}} />
                            <Skeleton variant="text" style={{marginBottom:10}} />
                            <Skeleton variant="text" style={{width:'50%'}} />
                            <Skeleton variant="text" style={{width:'90%'}} />
                        </div>
                        <div className={"projectcard-skeleton"}>
                            <Skeleton variant="rect" width={32} height={32} style={{marginBottom: 22}} />
                            <Skeleton variant="text" style={{marginBottom:10}} />
                            <Skeleton variant="text" style={{width:'50%'}} />
                            <Skeleton variant="text" style={{width:'90%'}} />
                        </div>
                        <div className={"projectcard-skeleton"}>
                            <Skeleton variant="rect" width={32} height={32} style={{marginBottom: 22}} />
                            <Skeleton variant="text" style={{marginBottom:10}} />
                            <Skeleton variant="text" style={{width:'50%'}} />
                            <Skeleton variant="text" style={{width:'90%'}} />
                        </div>
                    </>

                )}
                {!this.state.isProjectCard && (
                    this.state.ProjectCardBox.map((item, index) => {
                        return (
                            <>
                                <Grid item xs={12} lg={2} md={2} sm={2} className={"project-sub-cards"}>
                                    <ProjectCard data={item} onClick={()=>{this.handleRedirect(item.projectId,item.title,item.type)}} 
                                    onSelectedDelete={()=>{this.handleDeleteProject(item.projectId)}} />
                                </Grid>
                            </>
                        );
                    })
                )}
            </Grid>
        )
    }



    render() {
    return (
      <PageWrapper selected={1} isSidebar={false}>
          <div className={"main-class"}>
                <Snackbar open={this.state.projectCreationMessage} autoHideDuration={6000}  onClose={() => {this.getData(this.state.userID,this.state.organization);this.setState({projectCreationMessage: false})}}>
                    <Alert severity="success" onClose={() => this.setState({projectCreationMessage: false})}>
                    Your data is being retrieved from Qualtrics. Please wait till we finish importing.
                    </Alert>
                </Snackbar>
              {this.renderTitle()}
              {this.renderProjectCard()}

          </div>

      </PageWrapper>
    );
  }
}


const mapDispatchToProps = (dispatch) => ({
    setProjectId: (event) => dispatch(setProjectId(event)),
    resetProjectStoreData: (event) => dispatch(resetProjectStoreData(event))
});

export default connect(null, mapDispatchToProps)(Dashboard);
