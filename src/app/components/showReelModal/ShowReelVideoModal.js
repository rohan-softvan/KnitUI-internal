import React, { Component } from "react";
import { Grid,Typography, Dialog } from "@material-ui/core";
import "../../css/common.scss";
import "./ShowReelVideoModal.scss";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import ButtonComponent from "../button/Button";
import AutoCompleteWidget from "../autoCompleteWidget/AutoCompleteWidget";
import IconButton from "@material-ui/core/IconButton";
import PhotoCollegeDorm from "../photoCollegeDorm/PhotoCollegeDorm";
import VideoCard from "../photoCollegeDorm/videoCard";
import { Skeleton } from "@material-ui/lab";

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


//convert Epoch date to date/ set in the formate
const epochDate = (epochTime) => {
    let utcSeconds = new Date(epochTime * 1000);
    let formatted = `${formatDDMMYYYY(utcSeconds)}`;
    return formatted;
};
//set date in from Date-month-year
const formatDDMMYYYY = (postDate) => {
    let monthIndex = postDate.getMonth();
    let monthName = months[monthIndex];
    let year = postDate.getFullYear(); // 2019
    let date = postDate.getDate();
    date = date < 10 ? "0" + date : date;
    let strDate = date + " " + monthName + " " + year;
    return strDate;
};

function addZero(data) {
    if (data < 10) {
        data = "0" + data
    }
    return data;
}





const DialogTitle = withStyles(theme => ({
    root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: theme.spacing.unit,
        color: theme.palette.grey[500],
    },
}))(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {/* {onClose ? ( */}
                <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon className={"close-icon"} />
                </IconButton>
            {/* ) : null} */}
        </MuiDialogTitle>
    );
});
const DialogContent = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
    root: {
        borderTop: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit,
    },
}))(MuiDialogActions);

const modalStyle={
    modalLabel:{
        color:"#001839",
        fontSize: 14,
        fontWeight: "bold"
    },
    memberInput:{
        marginTop:"10px"
    },
    mainDiv:{
        display:"flex",
        justifyContent:"flex-end"
    }
}

class ShowReelVideoModal extends Component{
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            isVideoPopupData:true
        };
    }
//getVideoData


    handleSearchReel = (event) => {
        let { value } = event.target;
        if (value && value.trim()) {
            setTimeout(() => {
                this.props.OnChange(value);
            }, 3000);
        } else {
            this.props.OnChange();
        }
    }


    render() {
        let classes = modalStyle;
        return (
            <Dialog
                onClose={this.props.hide}
                aria-labelledby="customized-dialog-title"
                open={this.props.open}
                fullWidth maxWidth="md"
                className={'modal-radius-box'}
            >
                <DialogTitle id="customized-dialog-title" onClose={this.props.onClose}>
                    <Typography style={classes.modalLabel}>
                        Insert a Video
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12} md={12} lg={12} sm={12} style={{'display':'flex','flex-wrap':'wrap','justify-content':'end','marginBottom':'20px'}}>
                            <AutoCompleteWidget handleChange={(event)=>{this.handleSearchReel(event)}}></AutoCompleteWidget>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} md={12} lg={12} sm={12} style={{'display':'flex','flex-wrap':'wrap'}}>


                            {this.props.videoPopupData &&
                            Array.isArray(this.props.videoPopupData) &&
                            this.props.videoPopupData.length > 0 &&
                            this.props.videoPopupData.map(popupData => {
                                return (
                                    // <div className={'video-card-showreel'}>
                                    //     <div className={'VideoImage'}
                                    //          style={{'background-image':`url(${popupData.video_thumbnail_url})`}}></div>
                                    //     <div style={{'cursor':'pointer','paddingTop':'20px'}}>
                                    //         <Typography className={'videoTitle'}>{popupData.video_file_name}</Typography>
                                    //         <Typography className={'videoDate'}>{popupData.created_on ? epochDate(popupData.created_on) : ""}</Typography>
                                    //         <Typography className={'videomin'}>{popupData.original_video_duration ? secondsToHms(popupData.original_video_duration): ""}</Typography>
                                    //     </div>
                                    // </div>
                                    <>
                                    <VideoCard data={popupData} isVideoDetails={true}
                                               // cz={this.props.checked}
                                               showVideoPage={()=>{}}
                                               checked={(data)=> {
                                                   this.props.handleChecked(data)}}></VideoCard>
                                    </>
                                )
                            })}
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Grid container>
                        <Grid item xs={12} md={12} lg={12} sm={12} style={classes.mainDiv}>
                            <ButtonComponent onClick={this.props.onClose}
                                text={"Done"}
                                width={90} />
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
        )
    }
}
export default ShowReelVideoModal;