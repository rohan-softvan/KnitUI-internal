import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import Color from "../../config/Color";
import { Grid, withWidth, Tooltip } from "@material-ui/core";
import img from "../../../assets/images/navbar/dashboard.svg";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Popper from "@material-ui/core/Popper/Popper";
import Paper from "@material-ui/core/Paper/Paper";
import TableCell from "@material-ui/core/TableCell/TableCell";
import "./ProjectCard.scss";
import DeleteModel from "../deleteModal/DeleteModel";
import { ClickAwayListener } from "@material-ui/core";
const styles = (theme) => ({
  root: {
    minWidth: 275,
  },
});

let id = 0;


class ProjectCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      rowsPerPage: 5,
      anchorEl: null,
      deleteModalOpen:false,
      deleteModalClose:false,
      deleteDescription:'Are you sure you want to delete the project? Once you delete a project, you will lose any data associated with the project, including your responses, analysis and showreels. This action cannot be undone.'
    };
  }
  componentDidMount() {
  }
  handleClick = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      open: !this.state.open,
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleClickOpenModel = () => {
    this.setState({
        deleteModalOpen: true,
    });
  };
  
  deleteModalClose = () => {
    this.setState({
      deleteModalOpen: false,
      open:false
  });
  }

  render() {

    return (
      <>
        <Grid item xs={12} sm={6} md={6} lg={6} className={"dot-icon"}>
          {/* <MoreVertIcon
            className={"moreVertIcon"}
            onClick={(e) => {
              this.handleClick(e);
            }}
          />
          <Popper
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            placement={"bottom-end"}
            transition
          >
            <div className={"popper-main deletedot"}>
              <Typography className={"popper-label"} 
                onClick={() => {
                  this.handleClickOpenModel();
                }} >Delete
                </Typography>
            </div>
          </Popper> */}
          <MoreVertIcon
            // className={"moreVertIcon"}
            onClick={(e) => {
              this.handleClick(e);
            }}
          />
           <Popper
            open={this.state.open}
            anchorEl={this.state.anchorEl}
            placement={"bottom-end"}
            transition
          >
          <ClickAwayListener onClickAway={this.handleClose}>
      <div>
     
        {this.state.open ? (
          <div className={"popper-main deletedot"}>

          <Typography className={"popper-label"} 
            onClick={() => {
              this.handleClickOpenModel();
            }} >Delete
            </Typography>
        </div>
        ) : null}
      </div>
    </ClickAwayListener>
    </Popper>
        </Grid>
        <Card
          className={"card-main card-fixed-width"}
          onClick={() => {
            this.props.onClick();
          }}
        >
          <CardContent>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <img src={img} width={30} />
              </Grid>
              <Grid item xs={12} className={"mt-15 c-pointer"}>
                <Tooltip title={this.props.data.title} placement="bottom-start">
                  <Typography className={"project-ttl-name"}>
                    {this.props.data.title ? this.props.data.title : ""}
                  </Typography>
                </Tooltip>
              </Grid>
              <Grid item xs={12} className={"mt-10"}>
                <Typography className={"sub-ttl-desc"}>
                  {this.props.data.response ? this.props.data.response : "0"}{" "}
                  Responses
                  <br />
                  {this.props.data.type
                    ? this.props.data.type == "BOTH"
                      ? "Qualitative & Quantitative"
                      : this.props.data.type == "QUANTITATIVE"
                       ? "Quantitative" 
                      : this.props.data.type  == "QUALITATIVE" 
                      ?  "Qualitative"
                      : ""
                    :""}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        {this.state.deleteModalOpen &&
          <DeleteModel open={this.state.deleteModalOpen} onHandleClose={()=>{this.deleteModalClose()}} description={this.state.deleteDescription}
           onHandleRemove={()=>{this.props.onSelectedDelete()}}></DeleteModel>
        }
      </>
    );
  }
}

export default withStyles(styles)(ProjectCard);
