import React, { Component } from "react";
import { Grid,Typography } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import "../../css/common.scss";
import AddIcon from '@material-ui/icons/Add';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import profileIcon from "../../../assets/images/navbar/profile.png"
import Capture from "../../../assets/images/showreels/Capture.png"
import "./ShowReelSnippet.scss"
import CloseIcon from "@material-ui/icons/Close";
import { Skeleton } from "@material-ui/lab";

let showreelplaylistData = [
    {
      title:"Video title is here....",
      duration:"00:10 - 00:23",
      imageLink:Capture
    },
    {
        title:"Video title is h...",
        duration:"00:10 - 00:23",
        imageLink:Capture
      },
      {
        title:"Video title is h...",
        duration:"00:10 - 00:23",
        imageLink:Capture
      },
      {
        title:"Video title is h...",
        duration:"00:10 - 00:23",
        imageLink:Capture
      },
      {
        title:"Video title is h...",
        duration:"00:10 - 00:23",
        imageLink:Capture
      },
      {
        title:"Video title is h...",
        duration:"00:10 - 00:23",
        imageLink:Capture
      },
      {
        title:"Video title is h...",
        duration:"00:10 - 00:23",
        imageLink:Capture
      },

  
  ];
  class ShowReelSnippets extends Component {
    render() {
        return(
            <Grid container spacing={0} >
                <Grid item xs={12} sm={6} md={6} lg={12}>                    
                    <Card className={"showreelSnippet"}>
                        <Grid container spacing={0} className={"padd-20 showreelTTL"}>
                            <Grid item xs={12} sm={12} md={12} lg={12}>
                                <Typography className={"showreelTitle"}>Selected Snippets</Typography>
                            </Grid>
                        </Grid> 
                        <Grid container spacing={0}>
                            <Grid item xs={12} md={12} lg={12} sm={12} className={"show-list-div"}>
                                {showreelplaylistData.map((item,index)=>{
                                return(
                                    <>
                                    {/*<div style={{"padding":"15px"}}>*/}
                                    {/*    <Skeleton variant="rectangular" width={'100%'} height={180} style={{"margin-bottom":"10px","border-radius":"10px"}} />*/}
                                    {/*    <Skeleton />*/}
                                    {/*</div>*/}
                                    <div className={"showreel-snippet-list"} key={index}>
                                        <img src={item.imageLink} className={"showreel-snippet-thumbnail"} />
                                        <div className={"inside-space-snippets"}>
                                            <Typography className={"showreel-video-title"}>
                                            {item.title}
                                            </Typography>
                                          <div style={{display:'flex'}} >
                                          <Typography className={"snippets-video-duration"}>
                                            {item.duration}
                                            </Typography>
                                            <CloseIcon  style={{width: 20,height: 20,color:"#001839"}}></CloseIcon>
                                          </div>
                                            
                                        </div>
                                    </div>
                                    </>
                                )
                                })} 
                            </Grid>
                        </Grid>
                    </Card>                        
                </Grid>                               
            </Grid>
        )
    }
}
export default ShowReelSnippets