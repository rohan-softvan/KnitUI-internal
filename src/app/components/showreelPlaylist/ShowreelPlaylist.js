import React, { Component } from "react";
import { Grid,Typography } from "@material-ui/core";
import Card from '@material-ui/core/Card';
import "../../css/common.scss";
import "./ShowreelPlaylist.scss";
import AddIcon from '@material-ui/icons/Add';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import AddVideo from "../../../assets/images/showreels/add-video.png"
import ShowReelVideoModal from "../showReelModal/ShowReelVideoModal";
import {newShowReels} from "../../services/ShowReelsService";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Skeleton } from "@material-ui/lab";

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



// let showreelplaylistData = [];
class ShowReelPlaylist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showReelData: [],
            open: false,
            videoPopupData: []
        }
        // this.onDragEnd = this.onDragEnd.bind(this);
    }
    handleClickOpen = () => {
        this.setState({
            open: true,
        });
        this.props.getVideoData();
    };
    handleClose = () => {
        this.setState({ open: false },()=>{
            this.props.insertNewVideo()
        });
    };

    setShowReelPlayList = (showReelData) => {
        let showreelplaylistData= [];
        showReelData.forEach(data => {
            let dataObj = {};
            dataObj['id'] = data._id.$oid;
            dataObj['title'] = data.video_file_name
            dataObj['question'] = data.video_feature_title
            dataObj['questionnumber'] = data.video_feature_id
            dataObj['duration'] = data.original_video_duration ?
                secondsToHms(data.original_video_duration): ""
            dataObj['imageLink'] = data.video_thumbnail_url
            showreelplaylistData.push(dataObj)
        });
        this.setState({showreelplaylistData: showreelplaylistData})
    }


    onDragEnd=(result)=>{
        if (!result.destination) return;
        const items = Array.from(this.props.showreelplaylistData);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        this.setState({showreelplaylistData: items},()=>{
            this.props.handleOnChange(result.draggableId,result.destination.index);
        })
    }


    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps.showreelplaylistData) {
            this.setState({showreelplaylistData: nextProps.showreelplaylistData})
        }
    }



    componentDidMount() {}


    render() {
        return(
            <>
                <Grid container spacing={0}>
                    <Grid item xs={12} sm={6} md={6} lg={12}>
                        <Card className={"showreelPlayList add-videos"}>
                            <Grid container spacing={0} className={"padd-20 showreelTTL"}>
                                <Grid item xs={12} sm={6} md={6} lg={10}>
                                    <Typography className={"showreelTitle"}>Showreel Playlist</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6} md={6} lg={2} className={"flex-add-icon"}>
                                    <div className={"addPlaylist"}>
                                        <AddIcon onClick={this.handleClickOpen}></AddIcon>
                                    </div>
                                </Grid>
                            </Grid>
                            <Grid container spacing={0}>
                                {this.props.isPlaylistLoad ?
                                 this.props.selectedShowReelId && this.props.showreelplaylistData && this.props.showreelplaylistData.length > 0
                                            ?
                                            <Grid item xs={12} md={12} lg={12} sm={12} className={"show-list-div"}>
                                                <DragDropContext onDragEnd={this.onDragEnd} >
                                                    <Droppable droppableId="showreelplaylistData">
                                                        {(provided) => (
                                                            <ul className="showreelplaylistData" {...provided.droppableProps} ref={provided.innerRef}>
                                                                {this.props.showreelplaylistData && this.props.showreelplaylistData.map((item, index) => {
                                                                    return (
                                                                        <div className={item.id == this.props.selectedShowReelDetails && "showreel-playList-active"} onClick={()=>{this.props.setSelectedListFromId(item.id)}}>
                                                                            <Draggable key={item.id} draggableId={item.id} index={index}>
                                                                                {(provided) => (
                                                                                    <div className={"showreel-list"} key={index}
                                                                                         ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                                                        <DragIndicatorIcon className={"dragList"}></DragIndicatorIcon>
                                                                                        <img src={item.imageLink} className={"showreel-video-thumbnail"} />
                                                                                        <div className={"inside-space-playlist"}>
                                                                                            <Typography className={"showreel-video-title"}>
                                                                                                {item.title}
                                                                                            </Typography>
                                                                                            <Typography className={"showreel-video-question"}>
                                                                                                {item.questionnumber}: {item.question}
                                                                                            </Typography>
                                                                                            <Typography className={"showreel-video-duration"}>
                                                                                                {item.duration ? secondsToHms(item.duration) : ""}
                                                                                            </Typography>
                                                                                        </div>
                                                                                    </div>
                                                                                )}
                                                                            </Draggable>
                                                                        </div>
                                                                    );
                                                                })}
                                                                {provided.placeholder}
                                                            </ul>
                                                        )}
                                                    </Droppable>
                                                </DragDropContext>
                                            </Grid>
                                            :
                                            <Grid item xs={12} md={12} lg={12} sm={12} className={"add-showreel-video"}>
                                                <div className={'add-video-img-text'}>
                                                    <img src={AddVideo} width={40} height={40} />
                                                    <Typography>Add videos to get started</Typography>
                                                </div>
                                            </Grid>

                                :
                                    <>
                                     <div className={"showreel-list"} style={{"width":"100%"}}>
                                            <div className={"dragList"}>
                                                <Skeleton variant="rectangular" width={24} height={30} />
                                            </div>
                                            <Skeleton variant="rectangular" width={60} height={60} style={{"border-radius":"10px"}} />
                                            <div className={"inside-space-playlist"}>
                                                <Skeleton height={15} style={{"width":"120px","padding-top":"20px"}}  />
                                                <Skeleton height={15} style={{"width":"120px","padding-top":"20px"}}  />
                                                <Skeleton height={15} style={{"width":"120px","padding-top":"20px"}}  />
                                            </div>
                                        </div>
                                        <div className={"showreel-list"} style={{"width":"100%"}}>
                                            <div className={"dragList"}>
                                                <Skeleton variant="rectangular" width={24} height={30} />
                                            </div>
                                            <Skeleton variant="rectangular" width={60} height={60} style={{"border-radius":"10px"}} />
                                            <div className={"inside-space-playlist"}>
                                                <Skeleton height={15} style={{"width":"120px","padding-top":"20px"}}  />
                                                <Skeleton height={15} style={{"width":"120px","padding-top":"20px"}}  />
                                                <Skeleton height={15} style={{"width":"120px","padding-top":"20px"}}  />
                                            </div>
                                        </div>
                                        <div className={"showreel-list"} style={{"width":"100%"}}>
                                            <div className={"dragList"}>
                                                <Skeleton variant="rectangular" width={24} height={30} />
                                            </div>
                                            <Skeleton variant="rectangular" width={60} height={60} style={{"border-radius":"10px"}} />
                                            <div className={"inside-space-playlist"}>
                                                <Skeleton height={15} style={{"width":"120px","padding-top":"20px"}}  />
                                                <Skeleton height={15} style={{"width":"120px","padding-top":"20px"}}  />
                                                <Skeleton height={15} style={{"width":"120px","padding-top":"20px"}}  />
                                            </div>
                                        </div>
                                        <div className={"showreel-list"} style={{"width":"100%"}}>
                                            <div className={"dragList"}>
                                                <Skeleton variant="rectangular" width={24} height={30} />
                                            </div>
                                            <Skeleton variant="rectangular" width={60} height={60} style={{"border-radius":"10px"}} />
                                            <div className={"inside-space-playlist"}>
                                                <Skeleton height={15} style={{"width":"120px","padding-top":"20px"}}  />
                                                <Skeleton height={15} style={{"width":"120px","padding-top":"20px"}}  />
                                                <Skeleton height={15} style={{"width":"120px","padding-top":"20px"}}  />
                                            </div>
                                        </div>
                                        <div className={"showreel-list"} style={{"width":"100%"}}>
                                            <div className={"dragList"}>
                                                <Skeleton variant="rectangular" width={24} height={30} />
                                            </div>
                                            <Skeleton variant="rectangular" width={60} height={60} style={{"border-radius":"10px"}} />
                                            <div className={"inside-space-playlist"}>
                                                <Skeleton height={15} style={{"width":"120px","padding-top":"20px"}}  />
                                                <Skeleton height={15} style={{"width":"120px","padding-top":"20px"}}  />
                                                <Skeleton height={15} style={{"width":"120px","padding-top":"20px"}}  />
                                            </div>
                                        </div>
                                        <div className={"showreel-list"} style={{"width":"100%"}}>
                                            <div className={"dragList"}>
                                                <Skeleton variant="rectangular" width={24} height={30} />
                                            </div>
                                            <Skeleton variant="rectangular" width={60} height={60} style={{"border-radius":"10px"}} />
                                            <div className={"inside-space-playlist"}>
                                                <Skeleton height={15} style={{"width":"120px","padding-top":"20px"}}  />
                                                <Skeleton height={15} style={{"width":"120px","padding-top":"20px"}}  />
                                                <Skeleton height={15} style={{"width":"120px","padding-top":"20px"}}  />
                                            </div>
                                        </div>
                                    </>
                                }



                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
                <ShowReelVideoModal handleChecked={(data)=>{
                    this.props.handleChecked(data)
                }} open={this.state.open} onClose={this.handleClose}
                                    OnChange={(data)=> {
                                        this.props.getVideoData(data)
                                    }}
                                    videoPopupData={this.props.videoPopupData}/>
            </>
        )
    }
}
export default ShowReelPlaylist