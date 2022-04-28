import React, { Component } from "react";
import { Grid,Typography, Dialog, TextField, Tooltip } from "@material-ui/core";
import "../../css/common.scss";
import "./AddVideoShowreelModel.scss"
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import { withStyles } from '@material-ui/core/styles';
import ButtonComponent from "../button/Button";
import AutoCompleteWidget from "../autoCompleteWidget/AutoCompleteWidget";
import IconButton from "@material-ui/core/IconButton";
import RepositoryCard from "../repositoryCard/repositoryCard"
import AddIcon from '@material-ui/icons/Add';
import SubdirectoryArrowLeftIcon from "@material-ui/icons/SubdirectoryArrowLeft";
import filmRoll from "../../../assets/images/showreels/Showreel-icon.svg";
import CardContent from "@material-ui/core/CardContent";
import Skeleton from "@material-ui/lab/Skeleton";
import Card from "@material-ui/core/Card";

import {newShowReelTitle, updateShowReelTitle } from "../../services/ShowReelsService";
import Cookies from "universal-cookie";
const cookie = new Cookies();
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

class AddVideoShowreelModel extends Component{
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            isVideoPopupData:true,
            showReelName:true,
            enterReelName:false,
            blankReelCard:false,
            enterblackCard:true,
            videoReelTitle:null
        };
    }
    

    handleNewShowReel =() =>{
        this.setState({ 
            showReelName : false,
            enterReelName: true,                       
        });
    }


    handleTitle=(e)=> {
        this.setState({ videoReelTitle: e.target.value });
    }
    handleTitleChange = (event) => {
        let { value } = event.target;
    
        if (event.keyCode === 13) {
            this.setState({videoReelTitle: value,showReelName:true,
                enterblackCard:true,enterReelName:false},()=>{              
                this.props.getNewTitle(this.state.videoReelTitle);    
            })
        }
      }

      
   
    
      handleOutsideClick = (event) => {
        // console.log("event==>", this.box && this.box.current != null && !this.box.current.contains(event.target))
        // if (this.box && this.box.current != null && !this.box.current.contains(event.target)) {
          let titleDOM = document.getElementById('standard-helperText');
          let titleValue = titleDOM.value;
            this.setState({videoReelTitle: titleValue, activeInput: false},()=>{

                this.props.getNewTitle(this.state.videoReelTitle);
            });
        // }
      }
 


    render(event) {
        let classes = modalStyle;
        const { showReelName, enterReelName, blankReelCard, enterblackCard } = this.state;
        return (
            <Dialog
                onClose={this.props.hide}
                aria-labelledby="customized-dialog-title"
                open={this.props.open}
                fullWidth maxWidth="md"
                className={'modal-radius-box'}
            >
                <DialogTitle id="customized-dialog-title" onClose={this.props.onClose()}>
                    <Typography style={classes.modalLabel}>
                        Add video to a Showreel
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Grid container>
                        <Grid item xs={12} md={12} lg={12} sm={12} style={{'display':'flex','flex-wrap':'wrap','justify-content':'end','marginBottom':'20px'}}>
                            <AutoCompleteWidget handleChange={(event)=>{this.props.handleSearchReelData(event)}}></AutoCompleteWidget>
                        </Grid>
                    </Grid>
                    
                    <div style={{'display':'flex','flexWrap':'wrap'}}>
                    {this.props.showreelLoad && this.props.ShowReelsData.map((item,index)=>{
                        return(
                            <RepositoryCard
                        id={ item.id}
                            title={item.title}
                            subTitle={item.subTitle}
                            isVideoThumbnail={true}
                            videosThumbnails = {item.videosThumbnails}
                            height={"170px"}
                            selectedShowreeId={this.props.selectedShowReelId}
                            selection={true}
                            isOpen={item.isOpen}
                            anchorEl={this.state.anchorEl}
                            handlePopperOpen={(event)=>{
                                this.handlePopperOpen(event,item)
                            }}
                            changePage={()=>{this.props.handleChecked(item.title, false, item.id)}}
                        ></RepositoryCard>
                        )}
                    )}
                    {!this.props.showreelLoad && 
                        <Card
                    className={"repository-main-card"}>
                    <CardContent>
                      <Skeleton variant="reactangle" style={{width:40,height:40}}></Skeleton>
                      <Skeleton variant="text" className={"mt-10"}></Skeleton>
                      <Skeleton variant="text"></Skeleton>
                      <Skeleton variant="reactangle" className={"mt-10"} style={{height:34}}></Skeleton>
                    </CardContent>
                  </Card>
                    }
                    
                
                        {enterblackCard && (                    
                        <Grid container className="newShowreelData">
                            {showReelName && (
                            <Grid item xs={12} sm={12} lg={12} md={12} onClick={this.handleNewShowReel}>
                                <Typography className={"addNewReel"} > <AddIcon />New Showreel</Typography>
                            </Grid>
                            )}
                            {enterReelName && (
                                <Grid item xs={12} sm={12} lg={12} md={12} onClick={this.handleBlankCard}>
                                    <div className={"newReelFlex"}>
                                        <TextField
                                            id="standard-helperText"
                                            // value={this.state.videoReelTitle}
                                            //label="Untitled Showreel"
                                            placeholder="Untitled Showreel"
                                            variant="standard"
                                            onChange={this.handleTitle}
                                            onKeyDown={(e)=> {
                                                this.handleTitleChange(e)
                                            }}
                                            className={'NewshowReelFill'}
                                            // onBlur={()=>{this.handleOutsideClick()}}
                                        />
                                        <SubdirectoryArrowLeftIcon onClick={()=>{   this.props.getNewTitle(this.state.videoReelTitle);this.setState({showReelName:true,enterReelName:false,blankReelCard:false,enterblackCard:true})}} />
                                    </div>
                                </Grid>
                            )}
                        </Grid> 
                    )}      

                    {/* {blankReelCard && (                     
                    <CardContent className={"AddedShowReelBox"}>
                        <Grid container>
                            <Grid item xs={12} sm={12} lg={12} md={12} >
                                <img src={filmRoll} width={30}/>
                            </Grid>
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sm={12}
                            lg={12}
                            md={12}
                            className={"mt-10 c-pointer"}
                            onClick={()=>{this.props.changePage()}}
                        >
                            <Tooltip title={'Untitled Showreel'} placement="bottom-start">
                                <Typography className={"showReel-title title-short"}>
                                    {this.state.videoReelTitle}
                                </Typography>
                                </Tooltip>
                            </Grid>
                            <Grid item xs={12} sm={12} lg={12} md={12} onClick={()=>{this.props.changePage()}}>
                                <Typography className={"sub-title"}>
                                    0 videos
                                </Typography>
                            </Grid>
                    </CardContent>
                    )}             */}
                    </div>
                        
                
                        
                   
                </DialogContent>
                <DialogActions>
                    <Grid container>
                        <Grid item xs={12} md={12} lg={12} sm={12} style={classes.mainDiv}>
                            <ButtonComponent onClick={(event)=>this.props.handleSubmit(this.state.videoReelTitle)}
                                text={"Done"}
                                width={90}
                                disabled={this.props.selectedShowReelId ? false : true} />
                        </Grid>
                    </Grid>
                </DialogActions>

            </Dialog>
        )
    }


}

export default AddVideoShowreelModel;