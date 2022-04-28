import React, { Component } from "react";
import { Grid,Typography } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import UncheckedBox from "../../../../assets/images/videos/uncheckedBox-lightBlue.svg";
import CheckedBox from "../../../../assets/images/videos/checkBox-lightBlue.svg";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import "../../../css/common.scss";
import {withStyles} from "@material-ui/core";
import Download from "../../../../assets/images/videos/download.svg"
import "./VideoTable.scss";
import {CSVLink} from "react-csv/lib";
import AuthLoader from "../../../components/authLoader/Loader";
const months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug","Sep","Oct", "Nov","Dec"];

const useStyles = (theme) => ({
    selected: {
      backgroundColor: "#F6F3E6 !important",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
    },
  });


function addZero(data) {
    if (data < 10) {
        data = "0" + data
    }
    return data;
}

const formattedCSVFileDate = () => {
    let dateObj= new Date();
    let month = addZero(dateObj.getMonth() + 1);
    let date = addZero(dateObj.getDate());
    let hours = addZero(dateObj.getHours());
    let minutes = addZero(dateObj.getMinutes());
    return month + "-" + date + "-" + hours + minutes;
}


const getFormattedCSVFileName = (projectTitle) => {
    let formattedProjectTitle = projectTitle ? projectTitle.split(' ').join('_'): "";
    let formattedDate = formattedCSVFileDate();
    return formattedProjectTitle + "_" + formattedDate
}

function secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
  
    var hDisplay = h > 0 ? h + (h === 1 ? " hour " : " hour ") : "";
    var mDisplay = m > 0 ? m + (m === 1 ? " min " : " min ") : "";
    var sDisplay = s > 0 ? s + (s === 1 ? " sec " : " sec ") : "";
    return hDisplay + mDisplay + sDisplay; 
  }

  
class VideoTable extends Component{
    constructor(props) {
        super(props);
        this.state = {
            rowsPerPage: 5,
            page: 0,
            videoCSVData: [],
            loading: false
        };
        this.responseLink = React.createRef();
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

    downloadCSVVideos = (videoPropsData) => {
        let videoCSVData = [];
        let question = [videoPropsData.questionNumber + ' ' + videoPropsData.questionName];
        videoCSVData.push(question);
        videoPropsData.questionData.forEach(video => {
            videoCSVData.push([video.video_file_link]);
        });
        videoCSVData.push([]);
        let outetThis = this;
        this.setState({loading: true})
        this.setState({ videoCSVData }, () => setTimeout(() => {
            outetThis.responseLink.link.click()
            this.setState({loading: false})}, 3000))
    }

    makedownloadableVideo = (blob, filename) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // the filename you want
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.setState({loading: false})
    }

    downloadVideo = (url, fileName) => {
        this.setState({loading: true})
        fetch(url)
            .then(response => response.blob()
                .then(blob => this.makedownloadableVideo(blob, fileName)))
    }


    renderVideoTable= () =>{
        const { classes } = this.props;
        return(
            <>
            <Grid container style={{marginBottom:20}}>
                <Grid item lg={12}>
                    <Card className={"video-main-card"}>
                        <Grid item xs={12} sm={6} md={6} lg={12}>   
                            <div style={{float: "left"}} className={"videotitle padd-20"}>
                                <Typography 
                                    component={"span"}
                                    style={{
                                        fontSize: "14px",
                                        color: "#001839",
                                        textAlign: "left",
                                        fontWeight:'500'
                                    }}>
                                        {this.props.Tabledata.questionName}
                                </Typography>
                            </div>
                            <div className={"padd-20"} style={{textAlign: "right",paddingRight:"25px"}}>
                                <Typography
                                    component={"span"}
                                    style={{
                                        fontSize: "14px",
                                        color: "#001839",
                                    }}>
                                    <img src={Download} className={"cursor"}
                                         onClick={() => this.downloadCSVVideos(this.props.Tabledata)}/>
                                    {Array.isArray(this.state.videoCSVData)
                                    && this.state.videoCSVData.length > 0 &&
                                    <CSVLink
                                        style={{ textDecoration: "none"}}
                                        data={this.state.videoCSVData}
                                        filename={`${getFormattedCSVFileName(this.props.projectTitle)}.csv`}
                                        target="_blank"
                                        ref={(r) => (this.responseLink = r)}></CSVLink>}
                                </Typography>
                            </div>

                        </Grid>

                        <Grid item xs={12} sm={6} md={6} lg={12}> 
                            <TableContainer className={"tableContainer videoListTable"}>
                                <Table className={"table videotable"}>
                                    <TableBody>
                                    {this.props.Tabledata.questionData && this.props.Tabledata.questionData.map((item,index)=>{
                                         return(
                                            <>
                                                <TableRow selected={item.isChecked} classes={{ selected: classes.selected }} style={{height: 101}}>
                                                    <TableCell align="left" size="small" className={"v-align-top-td checkBox"}>
                                                        {item.isChecked ? (
                                                            <img src={CheckedBox} onClick={(e) => { this.props.checked(item); }} className={"cursor"}/>
                                                        ) : (
                                                            <img src={UncheckedBox} onClick={(e) => { this.props.checked(item);}} className={"cursor"}/>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className={"v-align-top-td"} onClick={()=>{this.props.showVideoPage(item._id.$oid)}} >
                                                        <div className={"imgThumbData"}>
                                                            <div className={"imgThumbVideo cursor"}>
                                                                <img src={item.video_thumbnail_url} />
                                                            </div>
                                                            <div className={"videoData cursor"}>
                                                                <div className={"video-details"}>
                                                                <Typography className={"videoTitle"}> 
                                                                        {item.video_file_name ? item.video_file_name : ""}
                                                                    </Typography>
                                                                    <Typography className={"videoDate"}>                        
                                                                        {item.created_on ? this.epochDate(item.created_on) : ""}
                                                                    </Typography>
                                                                    <Typography className={"videoMin"}>                        
                                                                        {item.original_video_duration ? secondsToHms(item.original_video_duration) : ""}
                                                                    </Typography>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                    </TableCell>
                                                    <TableCell className={"v-align-top-td"} onClick={()=>{this.props.showVideoPage(item._id.$oid)}} style={{width:"100%"}}>
                                                        <Typography className={"summaryTitle cursor"}>Summary</Typography>
                                                        <Typography className={"summaryDesc cursor"}>{item.video_summary ? item.video_summary : ""}</Typography>
                                                    </TableCell>
                                                    <TableCell align="left" size="small" className={"v-align-middle"}  >
                                                        <img src={Download}
                                                             className={"cursor"}
                                                             onClick={() => this.downloadVideo(item.video_file_link,
                                                                 item.video_file_name)}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            </>
                                            )
                                        })}                                     

                                        
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid> 
                    </Card>
                </Grid>
            </Grid>
                <div className={ this.state.loading ? 'fullPageLoader blur-background' : ''}>
                    {this.state.loading && <AuthLoader />}
                </div>
            </>
        )
    }



    render(){
        return <>{this.renderVideoTable()}</>;
    }
}

export default withStyles(useStyles)(VideoTable)