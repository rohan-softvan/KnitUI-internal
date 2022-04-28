import React, { Component } from "react";
import withWidth, { isWidthUp, isWidthDown } from "@material-ui/core/withWidth";
import { Grid, Typography } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Popper from "@material-ui/core/Popper";
import Button from "@material-ui/core/Button";
import CloseIcon from "@material-ui/icons/Close";
import { InteractiveHighlighter } from "react-interactive-highlighter";
import Avatar from "@material-ui/core/Avatar";
import Card from "@material-ui/core/Card";
import Color from "../../config/Color";
import appThemeColor from "../../config/ThemeColorConfig";
import profileIcon from "../../../assets/images/navbar/profile.png";
import OutlinedInput from '@material-ui/core/OutlinedInput';
import SubdirectoryArrowLeftIcon from '@material-ui/icons/SubdirectoryArrowLeft';

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
class AnnotationFlipMoveCard extends React.Component {
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
    let data = this.props.data;
    return (
      <Grid container spacing={0} className={"divMargin"}>
        <Grid item xs={12} md={12} lg={12} sm={12} className={"flex-div"}>
          <Card className={data.isSelect ? "tagCard-active" : "tagCard"}>
            <Grid container>
              <Grid
                item
                xs={11}
                sm={11}
                lg={11}
                md={11}
                onClick={() => {
                  this.props.onShuffle(data);
                }}
                style={{ display: "flex" }}
              >
                <Avatar
                  alt="user"
                  // src={profileIcon}
                  src={"https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                  style={{ height: 20, width: 20 }}
                />

                <Typography
                className={"annotationTitle"}
                  // style={{
                  //   width: "90%",
                  //   marginLeft: 11,
                  //   fontWeight: 500,
                  //   fontSize: 15,
                  //   color:"#001839",
                  // }}
                >
                  {data.name}
                </Typography>
              </Grid>
              <Grid item xs={1} sm={1} lg={1} md={1}>
                <MoreVertIcon
                  className={{ ...styles.moreVertIcon }}
                  style={{ height: 20, width: 20 }}
                  onClick={(e) => {
                    this.props.handlePopperOpen(e, data);
                  }}
                />
                <Popper
                  open={data.isOpen}
                  anchorEl={this.props.anchorElTagMenu}
                  placement={"bottom-end"}
                  transition
                  style={{
                    boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.16)",
                    width: 120,
                    height: 95,
                    background: "white",
                    padding: "5px 8px",
                  }}
                >
                  {data.description && data.description != "" ?
                    <Typography className={"tagMenu"} onClick={()=>{this.handleEdit(data,'edit')}}>Edit</Typography>
                  :
                  <Typography className={"tagMenu"} onClick={()=>{this.handleEdit(data,'add')}}>Add a Comment</Typography>
                  }
                  
                  <Typography className={"tagMenu"}> Add to Report</Typography>
                  {data.tagUsageId ? 
                      <Typography className={"tagMenu"} onClick={()=>{this.props.tagAction(data.tagUsageId)}}>Delete</Typography>
                    :
                    <Typography className={"tagMenu"} onClick={()=>{this.props.handleDeleteComment(data.commentId)}}>Delete</Typography>
                    }
                
                </Popper>
              </Grid>
            </Grid>
            <div
              onClick={() => {
                this.props.onShuffle(data.id);
              }}
            >
              {data.tags ? (
                <div
                  className={data.level >= 3 ? "tag-button-high-level" :"tag-button"}
                  // style={data.level >= 3 ? {color:"#001839 !important"} :{color:"white !important"}}
                  style={{ background: appThemeColor(data.themeId,setOpacity(data.level))}}
                >
                  {data.tags}
                  {/* <CloseIcon className={"close-icon"} /> */}
                </div>
              ) : (
                <div className={"divMargin"}></div>
              )}
              {data.isEdit ?
              <>
                <OutlinedInput
                id="outlined-adornment-weight"
                value={this.props.textValue}
                onChange={(e)=>{this.props.handleCommentChange(e)}}
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                  'aria-label': 'weight',
                }}
                // onKeyDown={(event)=>{ if(event.keyCode == 13) { this.props.handleSubmit(this.props.textValue,data.commentId,data.commentAssociatedText,data.commentAssociatedTexttimeStamp,addEdit,data.tagUsageId);}}}
                onKeyDown={(event)=>{ if(event.keyCode == 13) { this.props.handleSubmit(this.props.textValue,data.commentId,data.comment_associated_text,data.comment_associated_text_timestamp,addEdit,data.tagUsageId);}}}
                labelWidth={0}
              />  
              <SubdirectoryArrowLeftIcon className={"enter-icon"}></SubdirectoryArrowLeftIcon>
             </>
             :
             <Typography className={"tag-text"}>{data.description}</Typography>
            }
              
            </div>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default AnnotationFlipMoveCard;
