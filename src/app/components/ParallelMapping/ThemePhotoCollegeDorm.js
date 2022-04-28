import React, { Component } from "react";
import { Grid, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import UncheckedBox from "../../../assets/images/videos/unchecked-white.svg";
import CheckedBox from "../../../assets/images/videos/checked-white.svg";
import "./ThemePhotoCollegeDorm.scss";
import "../../css/common.scss";
import Download from "../../../assets/images/videos/download-white.svg";
import DownloadIcon from "../../../assets/images/videos/download.svg"
import { CardMedia,CardContent } from "@material-ui/core";
import VideoCard from "./ThemevideoCard.js"
import Skeleton from "@material-ui/lab/Skeleton"
class ThemePhotoCollegeDorm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: false,
    };
  }
  render() {
    return (
      <>
      {this.props.isSkeleton ?
        <div className={"image-card-skeleton"}>
        <Skeleton
          variant="text"
          width={"100%"}
          style={{ marginBottom: 20 }}
        />
        <div style={{ display: "flex" }}>
          <div style={{ marginRight: 10 }}>
            <Skeleton
              variant="react"
              width={120}
              height={120}
              style={{ borderRadius: 5 }}
            />
            </div>
            </div>
            </div>
      :
      <Grid container>
      <Grid item xs={12} sm={6} md={6} lg={12}>
        <Card className={"div-padd video-grid-card no-border-radius border-tlr-none"}>
          <Grid item xs={12} sm={6} md={6} lg={12} className={"mb-20"}>
                          <div style={{float: "left"}} className={"videotitle "}>
                              <Typography 
                                  component={"span"}
                                  style={{
                                      fontSize: "14px",
                                      color: "#001839",
                                      textAlign: "left",
                                      fontWeight:'500'
                                  }}>
                                {this.props.data.questionNumber ? this.props.data.questionNumber : ""} {this.props.data.questionName ? this.props.data.questionName : ""}
                              </Typography>
                          </div>
                          <div  style={{textAlign: "right",paddingRight:"10px"}}>
                              <Typography
                                  component={"span"}
                                  style={{
                                      fontSize: "14px",
                                      color: "#001839",
                                  }}>
                                  <img src={DownloadIcon} className={"cursor"} />
                              </Typography>
                          </div>
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={12} style={{display:'flex',flexWrap:"wrap"}}>
            {/* <div className={"photoCollagedorm"}> */}
              {this.props.data.questionData &&
                this.props.data.questionData.map((item, index) => {
                  return (
                    <>
                    {this.props.isVideo ?
                    <VideoCard data={item} isVideoDetails={true} checked={this.props.checked} showVideoPage={()=>{this.props.showVideoPage(item._id.$oid)}}></VideoCard>  
                  :
                  <VideoCard data={item} isVideoDetails={false} checked={this.props.checked}></VideoCard>
                  }
                  
                  </>
                  );
                })}
              {/* <img src={profileIconLarge}></img> */}
            {/* </div> */}
          </Grid>
        </Card>
      </Grid>
    </Grid>
   
      }
      </>
    );
  }
}

export default ThemePhotoCollegeDorm;
