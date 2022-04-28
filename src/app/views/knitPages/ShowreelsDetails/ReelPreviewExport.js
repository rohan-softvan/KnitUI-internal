import React, { Component } from "react";
import { Grid, Typography, Card } from "@material-ui/core";
import "../../../css/common.scss";
import "./ShowreelsDetails.scss";
import "./previewExport.scss"
import ButtonComponent from "../../../components/button/Button";
import Download from "../../../../assets/images/videos/download-white.svg";
import Link from "../../../../assets/images/showreels/link.svg"
import Share from "../../../../assets/images/showreels/share.png"
import CircularProgress from '@material-ui/core/CircularProgress'
import LinkImage from "../../../../assets/images/showreels/link.png"
import { props } from "react-csv/lib/metaProps";
import ShowReelsIcon from "../../../../assets/images/showreels/showreel.svg";
import { ENVIRONMENT } from "../../../Constants";
function getQueryStringValueId() {
    return window.location.href.split('/')[7];
}

function epochToDate(epoch) {
    let date;
    if (epoch.toString().length > 10) {
        date = new Date(epoch);
    } else {
        date = new Date(epoch * 1000);
    }
    let str = date.toLocaleString();
    let dateString = str.split(",");
    return addZero(date.getUTCDate()) + "/" + addZero(date.getUTCMonth() + 1) + "/" + date.getUTCFullYear() + " " + dateString[1]
}

function addZero(data) {
    if (data < 10) {
        data = "0" + data
    }
    return data;
}
let flag = true;
class ReelPreviewExport extends Component {
    constructor() {
        super(props);
        this.state = {
            showLoaderLabel: false,
            ShowLinkDownload: false,
            showBeginExpert: true,
            showReExpert: false,
            showVideo: false,
            showText: true,
            videoLink: '',
            showreelId: '',
            videoHighlightFlag: false,
            modifiedDate: '',
            downloadVideoLink: ''
        };
    }

    componentDidMount() {
        let showreelIdURL = getQueryStringValueId();
        if (showreelIdURL) {
            this.setState({ showreelId: showreelIdURL }, () => {
                this.checkProcessShowreel();
            })
        } else {
            showreelIdURL = localStorage.getItem("newShowreelId");
            this.setState({ showreelId: showreelIdURL }, () => {
                this.checkProcessShowreel();
            })

        }

        let videoLink = this.props.videoidValue;

    }
    handleS3Link = (link) => {
        let pathname = new URL(link).pathname;
        let s3Link = "https://s3.amazonaws.com/com.knit." + ENVIRONMENT
        this.setState({ downloadVideoLink: s3Link + pathname })
    }
    checkProcessShowreel = () => {

        let videoURL;
        let highlightFlag;

        let date = localStorage.getItem("modifiedDate");
        if (date) {
            let dateTime = epochToDate(date);
            this.setState({ modifiedDate: dateTime })
        }
        let testLink = localStorage.getItem("showreelHighlightVideoLink" + this.state.showreelId)
        if (testLink) {
            videoURL = testLink;
            this.handleS3Link(testLink);
        }
        let testHighlightStatus = localStorage.getItem("showreelHighlightGeneration" + this.state.showreelId);
        let statusCheck = localStorage.getItem("showreelStatusCheck" + this.state.showreelId)
        if (testHighlightStatus) {
            highlightFlag = testHighlightStatus;
            if (statusCheck) {
                this.props.showReelStatus();
            }

        } else {
            highlightFlag = 'false';
        }

        if (videoURL || highlightFlag) {
            if (videoURL && highlightFlag == 'false') {
                this.setState({
                    showBeginExpert: false,
                    showLoaderLabel: false,
                    ShowLinkDownload: true,
                    showReExpert: true,
                    showVideo: true,
                    showText: false,
                });
            } else if (videoURL && highlightFlag == 'true') {
                this.setState({
                    showBeginExpert: false,
                    showLoaderLabel: true,
                    ShowLinkDownload: true,
                    showReExpert: true,
                    showVideo: true,
                    showText: false,
                });
            } else if (highlightFlag == 'true') {
                this.setState({
                    showBeginExpert: false,
                    showLoaderLabel: true,
                    ShowLinkDownload: false,
                    showReExpert: true,
                    showVideo: false,
                    showText: true,
                });
            } else {
                this.setState({
                    showBeginExpert: true,
                    showLoaderLabel: false,
                    ShowLinkDownload: false,
                    showReExpert: false,
                    showVideo: false,
                    showText: true,
                });
            }
        } else {
            this.setState({
                showBeginExpert: true,
                showLoaderLabel: false,
                ShowLinkDownload: false,
                showReExpert: false,
                showVideo: false,
                showText: true,
            });
        }

    }
    componentDidUpdate(prevProps) {
        if (this.props.isHighlightGenerate !== prevProps.isHighlightGenerate) {
            this.checkProcessShowreel();
        }
    }


    showProgressbar = () => {
        this.props.handleExport();
        this.setState({
            showBeginExpert: false,
            showLoaderLabel: true,
            showReExpert: true
        });
    }


    downloadVideo = (url, fileName) => {
        fetch(url)
            .then(response => response.blob()
                .then(blob => this.makedownloadableVideo(blob, fileName)))
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
    }

    handleVideoHighlightFlag = (flag) => {

        this.setState({ videoHighlightFlag: flag }, () => {

            if (this.state.videoHighlightFlag) {
                this.setState({ videoHighlightFlag: false }, () => {
                    this.checkProcessShowreel();
                })
            }
        })

    }

    render() {
        const { showBeginExpert, showLoaderLabel, ShowLinkDownload, showVideo, showText, showReExpert } = this.state;

        let readyFlag = localStorage.getItem("showreelHighlightReadyFlag" + this.state.showreelId)
        if (this.props.isHighlightGenerateFlag && readyFlag) {
            flag = false
            localStorage.removeItem("showreelHighlightReadyFlag" + this.state.showreelId)
            this.handleVideoHighlightFlag(this.props.isHighlightGenerateFlag);
        }




        return (
            <div className={"padd-20"}>
                {(showText &&


                    <div width="100%" height="250px" controls style={{ borderRadius: "10px", background: "#0018391a", minHeight: '250px', textAlign: 'center' }}>
                        <img src={ShowReelsIcon} style={{ height: '60px', width: '60px', marginTop: '50px' }}></img>

                        <h5 style={{ marginTop: '25px' }}>Your showreel isn't rendered yet.</h5>
                        <h6 style={{ marginTop: '20px' }}>Press "Begin Export" to start rendering and </h6>
                        <h6>we'll let you know when it's done.</h6>
                    </div>
                )}
                {(showVideo &&
                    <video width="100%" height="250px" controls style={{ borderRadius: "10px", background: "#000" }}>
                        <source
                            src={this.state.downloadVideoLink}
                            type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )}


                {showBeginExpert && (
                    <div className={"div-marginTop-40 d-block-center"}>
                        <ButtonComponent
                            className={"showreelBtn center-btn"}
                            text={"Begin Export"}
                            fontWeight={500}
                            icon={<img src={Share} className={"icon-showreel-image"} />}
                            width={"153px"}
                            onClick={() => this.showProgressbar()}
                            disabled={Array.isArray(this.props.highlights) && this.props.highlights.length > 0 ? false : true}
                        />
                    </div>
                )}

                {ShowLinkDownload && (

                    <div className={"mt-20 d-block-center"}>
                        {this.state.modifiedDate && (
                            <h5>Showreel processed - {this.state.modifiedDate}</h5>
                        )}

                        <ButtonComponent
                            iconPosition={"left"}
                            className={"copylink"}
                            icon={<img src={LinkImage} className={"icon-showreel-image"} />}
                            text={"Copy Link"}
                            width={"121px"}
                            fontWeight={500}
                            onClick={() => { navigator.clipboard.writeText(this.state.downloadVideoLink) }}
                            margin={"10px 10px 10px 10px"}
                        />
                        <ButtonComponent
                            iconPosition={"left"}
                            className={"showreelBtn"}
                            icon={<img src={Download} className={"iconImage"} />}
                            onClick={() => { this.downloadVideo(this.state.downloadVideoLink, this.state.downloadVideoLink) }}
                            text={"Download"}
                            width={"127px"}
                            fontWeight={500}
                            margin={"0px"}
                        />
                        <hr style={{ marginTop: '30px' }}></hr>
                    </div>

                )}

                {/* {showLoaderLabel && !this.props.isHighlightGenerate && ( */}
                {showLoaderLabel && (
                    <div className={"mt-20 d-block-center"}>

                        <Grid container spacing={2}>
                            <Grid item xs={6} md={3}></Grid>
                            <Grid item xs={6} md={2} style={{ textAlign: "right" }}>
                                <CircularProgress style={{ height: '55px', width: '55px' }} />
                            </Grid>
                            <Grid item xs={6} md={4} style={{ textAlign: "left" }}>
                                <Typography> Your Showreel is processing. <br /> We'll let you know when it's ready!</Typography>
                            </Grid>
                            <Grid item xs={6} md={3}></Grid>
                        </Grid>




                        <hr style={{ marginTop: '40px' }}></hr>
                    </div>
                )}

                {showReExpert && (
                    <div className={"div-marginTop-40 d-block-center"}>

                        <Typography style={{ marginBottom: '20px' }}>Made any changes?</Typography>

                        <ButtonComponent
                            className={"showreelBtn center-btn"}
                            text={"Re-export"}
                            fontWeight={500}
                            icon={<img src={Share} className={"icon-showreel-image"} />}
                            width={"153px"}
                            onClick={() => this.showProgressbar()}
                            disabled={Array.isArray(this.props.highlights) && this.props.highlights.length > 0 ? false : true}
                        />
                    </div>
                )}

                {/* {ShowLinkDownload || this.props.isHighlightGenerate && ( */}
                {/* {ShowLinkDownload && (
                    <div className={"mt-20 d-block-center"}>
                        <Typography>Showreel processed - 01/02/2022 6:45pm</Typography>
                        <ButtonComponent
                            iconPosition={"left"}
                            className={"copylink"}
                            icon={<img src={LinkImage} className={"icon-showreel-image"} />}
                            text={"Copy Link"}
                            width={"121px"}
                            fontWeight={500}
                            onClick={() => {navigator.clipboard.writeText(this.props.videoHighlights)}}
                            margin={"10px 10px 10px 10px"}
                        />
                        <ButtonComponent
                            iconPosition={"left"}
                            className={"showreelBtn"}
                            icon={<img src={Download} className={"iconImage"} />}
                            onClick={()=>{this.downloadVideo(this.props.videoHighlights,this.props.videoHighlights)}}
                            text={"Download"}
                            width={"127px"}
                            fontWeight={500}
                            margin={"0px"}
                        />
                    </div>
                )} */}


            </div>
        )
    }
}
export default ReelPreviewExport; 
