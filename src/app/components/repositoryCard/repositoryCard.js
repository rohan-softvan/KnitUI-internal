import React, { Component } from "react";
import { Grid, Typography, Tooltip } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Card from "@material-ui/core/Card";
import Popper from "@material-ui/core/Popper/Popper";
import CardContent from "@material-ui/core/CardContent";
import img from "../../../assets/images/navbar/dashboard.svg";
import "./repositoryCard.scss";
import filmRoll from "../../../assets/images/showreels/Showreel-icon.svg";
import showReels from "../../../assets/images/showreels/showreels.png";
import Skeleton from "@material-ui/lab/Skeleton";
import DeleteModel from "../deleteModal/DeleteModel";
import { ClickAwayListener } from "@material-ui/core";

class RepositoryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open:false,
      deleteModalOpen:false,
      deleteModalClose:false,
      deleteDescription:'Are you sure you want to delete the showreel you selected? Once you delete a showreel, all selections and settings you made in it will be deleted. The videos in your showreel playlist will not be removed from your data. This action cannot be undone.',
    };
  }

  componentDidMount() {}


  handleClick=(e)=>{
    this.setState({open:!this.state.open, anchorEl: e.currentTarget})
  }

  handleClickOpenModel = () => {
    this.setState({
      deleteModalOpen: true,
    });
  };
  //
  deleteModalClose = () => {
    this.setState({
      deleteModalOpen: false,
      open:false,
    });
  }

  render() {
    return (
      <div>
        <Card
          className={"repository-main-card"}
          style={this.props.selection && this.props.selectedShowreeId == this.props.id ? { height: this.props.height , borderColor:'#001839'}:{ height: this.props.height}}
          onClick={()=>{
            this.props.selection && 
            this.props.changePage()}
          }
          
           >
          <CardContent>
            <Grid container>
              <Grid item xs={12} sm={6} lg={6} md={6}  onClick={()=>{this.props.changePage()}}>
                <img src={filmRoll} width={30}/>
              </Grid>
              {!this.props.selection  && 
                  <Grid item xs={12} sm={6} lg={6} md={6} className={"dot-main"}>
                  <MoreVertIcon
                    className={"moreVertIcon"}
                    onClick={(e) => {
                    this.props.handlePopperOpen(e);
                    }}
                  />
                    <Popper
                      open={this.props.isOpen}
                      anchorEl={this.props.anchorEl}
                      placement={"bottom-end"}
                      transition >
                      <ClickAwayListener onClickAway={()=> {
                        this.deleteModalClose()
                      }}>
                        <div>

                          {this.props.isOpen ? (
                              <div className={"popper-showreels"}>
                                {/*<CloseIcon className={"close-icon"} />*/}
                                <Typography className={"popper-label"}
                                            onClick={() => {
                                              this.handleClickOpenModel();
                                            }}
                                >Delete</Typography>
                              </div>

                          ) : null}
                        </div>
                      </ClickAwayListener>
                    </Popper>
                </Grid>
              }
              
              <Grid
                item
                xs={12}
                sm={12}
                lg={12}
                md={12}
                className={"mt-10 c-pointer"}
                onClick={()=>{this.props.changePage()}}
              >
                <Tooltip title={this.props.title} placement="bottom-start">
                  <Typography className={"showReel-title title-short"}>
                    {this.props.title}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={12} sm={12} lg={12} md={12} onClick={()=>{this.props.changePage()}}>
                <Typography className={"sub-title"}>
                  {this.props.subTitle}
                </Typography>
              </Grid>
              {/*{this.props.isVideoThumbnail && (*/}
              {/*  <Grid item xs={12} sm={12} lg={12} md={12} className={"mt-10"}*/}
              {/*        onClick={()=>{this.props.changePage()}}>*/}
              {/*    <div style={{ position: " relative", left: 0 }}>*/}
              {/*      <img src={showReels} className={"showReels"} />*/}
              {/*      <img src={"https://d3mer4pbzhq4ts.cloudfront.net/public/knit_highlights/6108e98b71b7080001b20191/F_1ginEDwpDHQs0Pp_thumbnail.jpg"} className={"showReels1"} />*/}
              {/*      <img src={"https://d3mer4pbzhq4ts.cloudfront.net/public/knit_highlights/6108e8e471b7080001b2017f/F_1gqfa32LIju9O7K_thumbnail.jpg"} className={"showReels2"} />*/}
              {/*      <img src={"https://d3mer4pbzhq4ts.cloudfront.net/public/knit_highlights/6108e8e471b7080001b2017f/F_2ZKxrneUREwC54a_thumbnail.jpg"} className={"showReels3"} />*/}
              {/*      <div className={"showReels4"}>*/}
              {/*        <div className={"showReels4-inside-div"}>+4</div>*/}
              {/*      </div>*/}
              {/*      /!* <img src={showReels} className={"showReels"}/> *!/*/}
              {/*    </div>*/}
              {/*  </Grid>*/}
              {/*)}*/}
              {this.props.isVideoThumbnail &&
              Array.isArray(this.props.videosThumbnails) &&
              this.props.videosThumbnails.length > 0 ? (
                  <Grid item xs={12} sm={12} lg={12} md={12} className={"mt-10"}
                        onClick={()=>{this.props.changePage()}}>
                    <div style={{ position: " relative", left: 0 }}>
                      {
                        this.props.videosThumbnails.map((thumbnail, index) => {
                          if (index <= 3) {
                            return (
                                <img src={thumbnail} className={"showReels"+index} />
                            )
                          }
                        })
                      }
                      {
                        this.props.videosThumbnails.length > 4 && (
                            <div className={"showReels4"}>
                              <div className={"showReels4-inside-div"}>
                                +{this.props.videosThumbnails.length - 4}
                              </div>
                            </div>
                        )
                      }
                      {/* <img src={showReels} className={"showReels"}/> */}
                    </div>
                  </Grid>
              ) :
              <Grid item xs={12} sm={12} lg={12} md={12} className={"mt-10"}
              onClick={()=>{this.props.changePage()}}>

                </Grid>}
              {this.props.isStatus && (
                <Grid item xs={12} sm={12} lg={12} md={12}>
                  <Typography className={"sub-title"}>
                    {this.props.status}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
        {this.state.deleteModalOpen &&
        <DeleteModel open={this.state.deleteModalOpen} onHandleClose={()=>{this.deleteModalClose()}} description={this.state.deleteDescription}
                     onHandleRemove={()=>{this.props.onSelectedDelete()}}></DeleteModel>
        }
      </div>
    );
  }
}

export default RepositoryCard;
