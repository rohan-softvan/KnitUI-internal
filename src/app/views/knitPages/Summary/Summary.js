import React, { Component } from "react";
import withWidth, { isWidthUp, isWidthDown } from "@material-ui/core/withWidth";
import { Grid,Typography } from "@material-ui/core";
import Cookies from "universal-cookie";
import "../../../css/common.scss";
import StatsSummaryWrapper from "../../../components/common/StatsSummaryWrapper";
import Color from "../../../config/Color";

const styles={
  moreVertIcon: {
    "&:active": {
      backgroundColor: Color.lightGreyShadow
    },
    borderRadius: 6,
    cursor:'pointer'
  },
}
let id = 0;

let showstatsticsActive = [
  {
    no: 250,
    title: "Total Responses"
  },
  {
    no: 100,
    title: "Video Responses"
  },
  {
    no: 100,
    title: "Video Responses"
  },
  {
    no: 100,
    title: "Video Responses"
  },
  {
    no: 100,
    title: "Video Responses"
  },
];



const cookie = new Cookies();


class Summary extends Component {
  constructor(props) {
    super(props);
    this.state={
      anchorEl:null,
    }
  }


  renderTitle=()=>{
    return(
        <Grid container spacing={1}>
            <Grid item xs={12} md={12} lg={12} sm={12}>
                <Typography variant={"h6"} component={"h6"} className={"title-class"}>
                    PROJECT SUMMARY
                </Typography> 
            </Grid>
          
        </Grid>
    )
  }

  renderStates=()=>{
    return(
      <Grid container style={{paddingTop:30}}>
        <Grid item xs={12} md={12} sm={12} lg={12}>
        <StatsSummaryWrapper  statstics={showstatsticsActive}></StatsSummaryWrapper>
        </Grid>
      </Grid>
    )
  }
  render() {
    return (
      // <PageWrapper selected={1} isSidebar={true}>
           <div className={"main-class"}>
            {this.renderTitle()}
            {/* {this.renderStates()} */}
        </div>
      // </PageWrapper>
    );
  }
}

export default withWidth()(Summary);
