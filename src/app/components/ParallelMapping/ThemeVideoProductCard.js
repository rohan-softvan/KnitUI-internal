import React, { Component } from "react";
import { Grid, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import profileIcon from "../../../assets/images/navbar/profile.png";
import "./ThemeVideoProductCard.scss";
import "../../css/common.scss";
import MyResponsiveSunburst from "../subBurst/MyResponsiveSunburst";
import data from "./data.json";
import exportIcon from "../../../assets/images/export.svg";

class ThemeVideoProductCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: false,
    };
  }

  render() {
    let totalCount=0;
    // {console.log("this.props.data.knitVideoResponse.........",this.props.data.knitVideoResponse)}
    return (

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6} lg={12}>
          <Card className={"padd-20 no-border-radius border-tlr-none"}>
            <Grid container>
              <Grid item xs={12} sm={6} md={6} lg={12}>

                {/*<Typography className={"videotitle mb-15"}>*/}
                {/*  {this.props.data.questionNumber*/}
                {/*    ? this.props.data.questionNumber*/}
                {/*    : ""}{" "}*/}
                {/*  {this.props.data.questionText*/}
                {/*    ? this.props.data.questionText*/}
                {/*    : ""}*/}
                {/*</Typography>*/}


                <Grid className={"videotitle mb-15"}>

                  <Grid style={{float: "left"}}>
                    <Typography
                        component={"span"}
                        style={{
                          fontSize: "14px",
                          color: "#001839",
                          textAlign: "left",
                          fontWeight:'500'
                        }}>
                      {this.props.data.questionNumber
                          ? this.props.data.questionNumber
                          : ""}{" "}
                      {this.props.data.questionText
                          ? this.props.data.questionText
                          : ""}
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



              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={5}>
                <div className={"imagelist"}>
                  {this.props.data.knitVideoResponse &&
                    this.props.data.knitVideoResponse
                      // .slice(0, 27)
                      .map((item, index) => {
                        if(item.length>0){totalCount=totalCount+1}
                        return (
                          <>
                            {/*{console.log("item111==>",item)}*/}

                            {totalCount <= 27 && item.length > 0 && (
                                <div className={"img-thumb"} style={{cursor:"pointer"}} onClick={()=>{this.props.handleChange(2,item[0]._id.$oid)}}>
                                <img
                                  src={
                                      item.length > 0
                                      ? item[0].video_thumbnail_url
                                      : ""
                                    }
                                    />

                              </div>
                            )}
                          </>
                        );
                      })}
                  {totalCount > 27 && (
                    <div className={"addMoreThumb"}  style={{cursor:'pointer'}} onClick={()=>{this.props.handleChange(2)}}>
                      <div className={"moreData"} >+{totalCount-27} more</div>
                    </div>
                  )} 
                </div>
              </Grid>
              {this.props.data.chartData && (
              <Grid item xs={12} sm={6} md={6} lg={7} className={"graph"}>
             
                  <MyResponsiveSunburst
                    data={this.props.data.chartData}
                    legends={this.props.data.legendData}
                  />
              </Grid>
                )}
          
            </Grid>
          </Card>
        </Grid>
      </Grid>
    );
  }
}
export default ThemeVideoProductCard;
