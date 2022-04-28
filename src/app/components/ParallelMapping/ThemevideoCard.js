import React, { Component } from "react";
import { Grid, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import UncheckedBox from "../../../assets/images/videos/unchecked-white.svg";
import CheckedBox from "../../../assets/images/videos/checked-white.svg";
import "./ThemePhotoCollegeDorm.scss";
import "../../css/common.scss";
import Download from "../../../assets/images/videos/download-white.svg";
import { CardMedia,CardContent } from "@material-ui/core";
const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug","Sep","Oct", "Nov","Dec"];


function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hour ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " min " : " min ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " sec " : " sec ") : "";
  return hDisplay + mDisplay + sDisplay; 
}


class themevideoCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: false,
    };
  }
  //convert Epoch date to date/ set in the formate
  epochDate = (epochTime) => {
    let utcSeconds = new Date(epochTime * 1000);
    let formatted = `${this.formatDDMMYYYY(utcSeconds)}`;
    return formatted;
  };
   //set date in from Date-month-year
   formatDDMMYYYY = (postDate) => {
    let monthIndex = postDate.getMonth();
    let monthName = months[monthIndex];
    let year = postDate.getFullYear(); // 2019
    let date = postDate.getDate();
    date = date < 10 ? "0" + date : date;
    let strDate = date + " " + monthName + " " + year;
    return strDate;
  };


  render() {
    let data=this.props.data;
    return (

                        <Card className={"video-card border-tlr-none no-border-radius"}>
                             {this.state.content || data.isChecked ? 
                             <>
                             <div className={"VideoCheckbox"} onMouseEnter={()=>{this.setState({content:true})}} onMouseLeave={()=>{this.setState({content:false})}} >
                                        {data.isChecked ? (
                                          <img
                                            src={CheckedBox}
                                            onClick={(e) => {
                                              this.props.checked(data);
                                            }}
                                            className={"cursor"}
                                          />
                                        ) : (
                                          <img
                                            src={UncheckedBox}
                                            onClick={(e) => {
                                              this.props.checked(data);
                                            }}
                                            className={"cursor"}
                                          />
                                        )}
                                      </div>
                                       <div className="VideoDownload" onMouseEnter={()=>{this.setState({content:true})}} onMouseLeave={()=>{this.setState({content:false})}}>
                                        <img
                                          src={Download}
                                          className={"cursor"}
                                        />
                                      </div>
                                      </>
                             :null}
                             {this.props.isVideoDetails ?
                             <CardMedia className={"image"} image={data.video_thumbnail_url || data.question_file_link} onClick={()=>{this.props.showVideoPage()}}  onMouseEnter={()=>{this.setState({content:true})}} onMouseLeave={()=>{this.setState({content:false})}}>
                            
                             {this.state.content || data.isChecked ? (
                               <div className={"mainContainer"} >
                                 <div className={"subContainer"}>
                                   <div className={"baseContainer"}>
                                      
                                      
                                     </div>
                                   </div>
                               </div>
                             ) : null}
 
                           </CardMedia>
                            :
                            <CardMedia className={"image"} image={data.video_thumbnail_url || data.question_file_link}  onMouseEnter={()=>{this.setState({content:true})}} onMouseLeave={()=>{this.setState({content:false})}}>
                            
                            {this.state.content || data.isChecked ? (
                              <div className={"mainContainer"} >
                                <div className={"subContainer"}>
                                  <div className={"baseContainer"}>
                                     
                                     
                                    </div>
                                  </div>
                              </div>
                            ) : null}

                          </CardMedia>
                            }
                          
                                
        
                           {this.props.isVideoDetails && 
                                <div  style={{cursor:'pointer',paddingTop: 20}} onClick={()=>{this.props.showVideoPage()}}>
                                    <Typography className={"videoTitle"}> 
                                        {data.video_file_name ? data.video_file_name : ""}
                                    </Typography>
                                    <Typography className={"videoDate"}>                        
                                        {data.created_on ? this.epochDate(data.created_on) : ""}
                                    </Typography>
                                    <Typography className={"videoMin"}>                        
                                        {data.original_video_duration ? secondsToHms(data.original_video_duration) : ""}
                                    </Typography>
                                </div>
                                } 
                        </Card>
                 
    );
  }
}

export default themevideoCard;
