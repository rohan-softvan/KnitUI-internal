import React, { Component } from "react";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import { Switch, withStyles, Typography,makeStyles } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import "./accordion.scss";

class accordion extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { classes } = this.props;
    let typeArray;
    let fileType;
    if (
      this.props.answer != null &&
      this.props.answer != ""
    ) {
      fileType = this.props.answer.question_file_type;
    }
  

  if (fileType != undefined) {
    typeArray = fileType.split("/");
  }
    return (
        <Accordion className={"accordionCard"} expanded={this.props.expand} style={{...(this.props.width != undefined ? {width:this.props.width} : {width:500})}} onClick={()=>{this.props.handleChange()}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={"accordQuestion"}>{this.props.text ? this.props.text : ""}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            {this.props.type && this.props.type == "FileUpload" ?
             
             this.props.answer.question_file_type &&
             Array.isArray(typeArray) && typeArray.length > 0 && typeArray[0] == "image" ?
             this.props.answer.question_file_link ? 
             <img src={this.props.answer.question_file_link} height={"100px"} width={"100px"}/>
             :"-"
             : Array.isArray(typeArray) && typeArray.length > 0 && typeArray[0] == "video" ?
             <video width="100px" height="100px" controls style={{background:"#000",objectFit: "fill",borderRadius: 5,border: "1px solid #E2E2E2"}}>
                    <source src={this.props.answer.question_file_link} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                :null
                : this.props.type == 'TE' ? 
                <div className={"c-pointer"} onClick={()=>{this.props.handleRedirectOpenText()}}>{this.props.answer ? this.props.answer : "-"}</div>
                :
                <div>{ this.props.answer ? this.props.answer : "-"}</div>
              }
            {/* {this.props.content ? this.props.content : ""} */}
          </Typography>
        </AccordionDetails>
      </Accordion>
    );
  }
}

export default withStyles()(accordion);
