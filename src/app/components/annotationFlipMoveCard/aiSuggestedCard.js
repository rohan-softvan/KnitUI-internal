import React, { Component } from "react";
import withWidth, { isWidthUp, isWidthDown } from "@material-ui/core/withWidth";
import { Grid, Typography , Tooltip} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Popper from "@material-ui/core/Popper";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from '@material-ui/icons/Check';
import { InteractiveHighlighter } from "react-interactive-highlighter";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import Color from "../../config/Color";
import appThemeColor from "../../config/ThemeColorConfig";
import profileIcon from "../../../assets/images/navbar/profile.png";
import OutlinedInput from '@material-ui/core/OutlinedInput';
import SubdirectoryArrowLeftIcon from '@material-ui/icons/SubdirectoryArrowLeft';
import Close from "@material-ui/icons/Close";
import suggestedIcon from '../../../assets/images/suggestedIcon.svg';
const divStyle = {
  border: "2px solid red",
  width: "50%",
  margin: "10px",
  padding: "5px",
};

const styles = {
  moreVertIcon: {
    "&:active": {
      backgroundColor: Color.lightGreyShadow,
    },
    borderRadius: 6,
  },
};

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
let addEdit='';
class AISuggestedCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addEdit: "",
    }
  }

  handleEdit=(data,type)=>{
    this.props.changeEdit(data);
    this.setState({addEdit:type})
    addEdit=type;
  }

  render() {
    let data = this.props.data
    return (
      <Grid container spacing={0} className={"divMargin"}>
        <Grid item xs={12} md={12} lg={12} sm={12} className={"flex-div"}>
          <Card className={this.props.isSelect ? "tagCard-active" : "tagCard"} >
            <Grid container>
              <Grid
                item
                xs={11}
                sm={11}
                lg={11}
                md={11}
                style={{ display: "flex" }}
              >
                <Avatar
                  alt="user"
                  src={suggestedIcon}
                  style={{ height: 20, width: 20 }}
                />

                <Typography
                // className={"annotationTitle"}
                  style={{
                    width: "90%",
                    marginLeft: 11,
                    fontWeight: 500,
                    fontSize: 14,
                    color: '#a3a3a3'
                  }}
                >
                  {"Suggested by Knit AI"}
                </Typography>
                <div  style={{display:'flex',width:'10%'}}>
                <Tooltip title={"Accept Suggestion"} placement="top" style={{ background: '#001839'}} >
                  <CheckIcon style={{width:"20px",marginRight: 5}} onClick={()=>{this.props.tagOperation(this.props.data.tag_id.$oid,'is_accepted',this.props.data._id.$oid)}}></CheckIcon>
                  </Tooltip>
                  <Tooltip title={"Reject Suggestion"} placement="top" style={{ background: '#001839'}} >
                  <CloseIcon style={{width:"20px",marginLeft: 5}} onClick={()=>{this.props.tagOperation(this.props.data.tag_id.$oid,'is_rejected',this.props.data._id.$oid)}}></CloseIcon>
                  </Tooltip>
                </div>
              </Grid>
       
            </Grid>
            <div onClick={()=>{ 
                this.props.onShuffle(this.props.data._id.$oid)
              }}>
                <div
                  className={"tag-button"}
                  // style={data.level >= 3 ? {color:"#001839 !important"} :{color:"white !important"}}
                  style={{ background: appThemeColor(this.props.data.sequence,setOpacity(this.props.data.level)),display: 'flex !important'}}
                  // style={{ background:'#001839'}}
                >
                  {this.props.data.tag_name}
                  <CloseIcon className={"close-icon"} style={{color:'#fff'}} onClick={()=>{this.props.tagOperation(this.props.data.tag_id.$oid,'is_rejected',this.props.data._id.$oid)}}></CloseIcon>
                </div>
              
            </div>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default AISuggestedCard;
