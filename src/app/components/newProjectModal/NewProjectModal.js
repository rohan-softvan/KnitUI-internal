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
import ButtonComponent from "../../components/button/Button";
import AddIcon from "@material-ui/icons/Add";
import { Grid, withWidth } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Color from "../../config/Color";
import AddNewProjectCard from "../newProjectCard/NewProjectCard";
import ProjectCard from "../projectCard/ProjectCard";
import "../newProjectCard/NewProjectCard.scss";
import SelectComponent from "../../components/select/Select";
// import AutoCompleteWidget from "../../components/autoCompleteWidget/AutoCompleteWidget";
import {CLOUDFRONT_URL} from "../../Constants/index"
import AuthLoader from '../../components/authLoader/Loader';
import {getSurveyFromToken} from "../../services/ProjectService";
import Qualtrics from "../../../assets/images/projects/qualtrics.png";
import Csv from "../../../assets/images/projects/csv.png";
import Other from "../../../assets/images/projects/other.png";
import ProjectTypeModel from "./components/ProjectTypeModel";
import ProjectDataSourceModel from "./components/ProjectDataSourceModel";
import ProjectAPITokenModel from "./components/ProjectAPITokenModel";
import ProjectSurveyModel from './components/ProjectSurveyModel'
import ProjectNameModel from './components/ProjectNameModel';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    borderRadius: 10,
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    color: Color.primary,
    top: 3,
  },
});
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



const errorMessage = {
  color: '#D14926',
  fontSize: '10px',
  marginTop: '5px'
}


let menu = [
    {
      title: "Favourite",
      value: "is_favourite",
      key: 1,
    },
    {
      title: "Delete",
      value: "is_deleted",
      key: 2,
    },
  ];


  let projectType=[
    {
      text:"Quantitative",
      value:"QUANTITATIVE",
    },
    {
      text:"Qualitative",
      value:"QUALITATIVE",
    },
    {
      text:"Quantitative & Qualitative",
      value:"BOTH",
    }
  ]

  let projectData=[
    {
      text:"Qualtrics",
      value:"QUALTRICS",
      link:Qualtrics
    },
    {
      text:"CSV file",
      value:"CSV",
      link:Csv
    },
    {
      text:"1000+ other apps",
      value:"Other",
      link:Other
    }
  ]
const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon className={"close-icon"} />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

class NewProjectModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      rowsPerPage: 5,
      displayContent: 1,
      buttonName: "Next",
      disabled:true,
      projectCreation:[],
      showAPITokenError: false,
      selectedqualtricsProject: null
    };
  }



  handleClickOpen = () => {
    this.setState({ open: true ,projectDataSource:"",projectType:"", menu: [],
      apiToken:"", qualtricsProject:"", projectName:"", qualtricsProjectName: '', selectedqualtricsProject: {}},()=>{
        this.checkFlag(this.state.projectType)
      });
  };

  handleClose = () => {
    // setOpen(false);
    this.setState({ open: false, displayContent: 1, buttonName: "Next" ,projectDataSource:"",projectData:'',projectType:''
    });
  };

  checkFlag=(data)=>{
    if(data){
      this.setState({disabled:false});
    }else{
      this.setState({disabled:true});
    }
  }
  handleDisplayContent = () => {

    if (this.state.displayContent == 5) {
      // last step of project creation call API
      let {projectName, projectType, projectDataSource, apiToken, 
        qualtricsProject, qualtricsProjectName} = this.state;
      if (projectName && projectType && projectDataSource && apiToken && qualtricsProject && qualtricsProjectName) {
        this.props.createProject(projectName, projectType,
            projectDataSource, apiToken,
            qualtricsProject, qualtricsProjectName);
        this.handleClose();
      }
    }

    if(this.state.displayContent == 1 ){
      // this.checkFlag(this.state.projectType)
      this.setState({ displayContent: this.state.displayContent + 1},
          () => this.checkFlag(this.state.projectDataSource));
    }else if(this.state.displayContent == 2 ){
      // this.checkFlag(this.state.projectDataSource)
      this.setState({ displayContent: this.state.displayContent + 1},
          () => this.checkFlag(this.state.apiToken));
    }else if(this.state.displayContent == 3 ){
      // this.checkFlag(this.state.apiToken)
      this.setState({ displayContent: this.state.displayContent + 1},
          () => this.checkFlag(this.state.qualtricsProject));
    }else if(this.state.displayContent == 4){
      // this.checkFlag(this.state.qualtricsProject)
      this.setState({ displayContent: this.state.displayContent + 1},
          () => this.checkFlag(this.state.projectName));
    } else if (this.state.displayContent == 5) {
        this.checkFlag(this.state.projectName)
    }
  };


  handleBack = () => {
    if(this.state.displayContent == 2 ){
      this.setState({ displayContent: this.state.displayContent -1},
          () => this.checkFlag(this.state.projectType));
    }else if(this.state.displayContent == 3 ){
      this.setState({ displayContent: this.state.displayContent - 1},
          () => this.checkFlag(this.state.projectDataSource));
    }else if(this.state.displayContent == 4){
      this.setState({ displayContent: this.state.displayContent - 1},
          () => this.checkFlag(this.state.apiToken));
    }
  }


  setProjectType=(value)=>{
    if(this.state.projectType){
      if(this.state.projectType != value){
        this.setState({disabled:false,projectType:value})
      }else{
        this.setState({disabled:true,projectType:""})
      }

    }else{
      if(value != null){
        this.setState({disabled:false,projectType:value})
      }
    }
  }

  setDataSource=(value)=>{
    if(this.state.projectDataSource){
      if(this.state.projectDataSource != value){
        this.setState({disabled:false,projectDataSource:value})
      }else{
        this.setState({disabled:true,projectDataSource:""})
      }
    }else{
      if(value != null){
        this.setState({disabled:false,projectDataSource:value})
      }
    }
  }

  handleChange=(event,name)=>{
    if(event.target.value != null){
      if(name == "apiToken"){
        this.setState({[event.target.name]:event.target.value,isLoading:true, disabled: true},()=>{
          setTimeout(this.getSurveyFromToken(), 5000)
        })
      }else{
        this.setState({[event.target.name]:event.target.value},
            () =>  this.checkFlag(this.state.projectName))
      }
    }
  }

  getSurveyFromToken=()=>{
    this.setState({showAPITokenError: false});
    let user_data={
      "is_qualtrics_survey_retrieval": true,
      "qualtrics_access_token": this.state.apiToken
    }
      getSurveyFromToken(user_data).then((response) => {
        let menuList=[];
        if(response.data){
          if(!Array.isArray(response.data) && response.data.hasOwnProperty('error')) {
            this.setState({disabled: true, showAPITokenError: true, isLoading:false})
          } else {
            for(let i in response.data){
              menuList.push({
                value:response.data[i].id,
                title:response.data[i].name
              })
            }
            this.setState({menu:menuList, disabled:false, isLoading:false, showAPITokenError: false})
          }
        }
       })
  }


  onHandleChange=(event, value)=>{
    if(value){
      this.setState({qualtricsProject:value.value, disabled: false,
                          qualtricsProjectName: value.title, selectedqualtricsProject: value})
    } else {
      this.setState({qualtricsProject:"", disabled: true,
        qualtricsProjectName: "", selectedqualtricsProject: {}})
    }
}



  render() {
    let classes = modalStyle;
    return (
      <div>
        {this.props.width === "xs" ? (
          <ButtonComponent
            icon={<AddIcon />}
            iconPosition={"left"}
            fontSize={13}
            width={"120px"}
            margin={"0px"}
            text={"New Project"}
            onClick={this.handleClickOpen}
          ></ButtonComponent>
        ) : (
          <ButtonComponent
            icon={<AddIcon />}
            iconPosition={"left"}
            margin={"0px"}
            text={"New Project"}
            width={"150px"}
            onClick={this.handleClickOpen}
          ></ButtonComponent>
        )}
        <Dialog class="projectModal" onClose={this.handleClose} open={this.state.open}>
          <DialogTitle  id="customized-dialog-title" onClose={this.handleClose}>
            <Typography style={classes.modalLabel}>
              Create A New Project
            </Typography>
          </DialogTitle>
          <DialogContent dividers className={"fix-modal-height-cr-prj"}>
            {this.state.displayContent === 1
               ? <ProjectTypeModel
                    selectedProjectType = {this.state.projectType}
                    setProjectType = {(selectedValue) => this.setProjectType(selectedValue)}
                />
              : this.state.displayContent === 2
              ? <ProjectDataSourceModel
                  selectedProjectType = {this.state.projectType}
                  selectedDataSource = {this.state.projectDataSource}
                  setDataSource = {(selectedValue)=>{this.setDataSource(selectedValue)}}
                />
              : this.state.projectDataSource == "QUALTRICS"
                ? this.state.displayContent === 3 
                  ? <ProjectAPITokenModel
                                selectedToken={this.state.apiToken}
                                handleTokenChange={(e)=>{this.handleChange(e,"apiToken")}}
                                showTokenAPIError={this.state.showAPITokenError}
                    />
                  : this.state.displayContent === 4
                  ? <ProjectSurveyModel
                                selectedQualtrics={this.state.selectedqualtricsProject}
                                handleQualtrics={(event, selectedValue) => this.onHandleChange(event, selectedValue)}
                                menu={this.state.menu}
                    />
                  : this.state.displayContent === 5
                  ? <ProjectNameModel
                                handleProjectName = {(e) => this.handleChange(e,"projectName")}
                    />
                  : null
                : ""
              // this.state.displayContent === 3
              // ? 
              // :this.state.displayContent == 4
              // ? this.renderProjectCard5() 
             ? this.state.projectDataSource == "BOTH"
              : null}

            {this.state.isLoading && <AuthLoader/>}
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
                 
                {this.state.displayContent != 1 && this.state.displayContent != 5  && 
                   <ButtonComponent
                   iconPosition={"left"}
                   // icon={<CheckIcon></CheckIcon>}
                   text={"Back"}
                   width={"auto"}
                   fontWeight={500}
                   margin={"15px 0px"}
                   bgColor={"transparent"}
                   color={Color.primary}
                   boxShadow={"none"}
                   onClick={() => {
                     this.handleBack();
                   }}
                 />
                }
               
                {this.state.displayContent == 5 ?
                   
                <ButtonComponent
                onClick={()=>{this.handleDisplayContent()}}
                text={"Done"}
                width={90}
                disabled={this.state.disabled}
              />
                :
                 
                <ButtonComponent
                  onClick={()=>{this.handleDisplayContent()}}
                  text={this.state.buttonName}
                  width={90}
                  disabled={this.state.disabled}
                />
                }
              </Grid>
            </Grid>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default withStyles(styles)(NewProjectModal);
