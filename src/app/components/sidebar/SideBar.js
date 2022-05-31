import React, {Component} from "react";
import {Grid, withStyles, Typography, Icons, Tooltip} from "@material-ui/core";
import "./SideBar.scss";
import Cookies from "universal-cookie";
import ListItem from "@material-ui/core/ListItem";
import Color from "../../config/Color";
import FontWeights from "../../config/FontWeights";
import {Link} from "react-router-dom";
import Lable from "@material-ui/core/InputLabel";

let projectId;

const cookie = new Cookies();

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectTitle: '',
      menuList: []
    };
  }

  componentDidMount() {
    if (localStorage.getItem("projectTitle")) {
      this.setState({projectTitle: localStorage.getItem("projectTitle")})
    }
    // projectId=;
    this.renderMenuList(this.props.projectId);
  }

  renderMenuList = (projectId) => {
    this.state.menuList = [
      // {
      //   name: "Summary",
      //   key: 1,
      //   imgLink: require("../../../assets/images/sidebar/align.svg"),
      // },
      {
        name: "Data",
        key: 1,
        imgLink: require("../../../assets/images/sidebar/feather-database.svg"),
        path: "/knit/projectsDetails/" + projectId + "/Data?view=list"
      },
      {
        name: "Videos",
        key: 2,
        imgLink: require("../../../assets/images/sidebar/playButton.svg"),
        path: "/knit/projectsDetails/" + projectId + "/Video?view=grid"
      },
      {
        name: "Showreels",
        key: 3,
        imgLink: require("../../../assets/images/sidebar/film-roll.svg"),
        path: "/knit/projectsDetails/" + projectId + "/ShowReels"
      },
      {
        name: "Themes",
        key: 4,
        imgLink: require("../../../assets/images/sidebar/flow.svg"),
        path: "/knit/projectsDetails/" + projectId + "/Themes"
      },
      // {
      //   name: "Reports",
      //   key: 5,
      //   imgLink: require("../../../assets/images/sidebar/analytics.svg"),
      // },
      {
        name: "Graphs",
        key: 5,
        imgLink: require("../../../assets/images/sidebar/align.svg"),
        path: "/knit/projectsDetails/" + projectId + "/Graphs"
      },
    ];
    this.setState({menuList: this.state.menuList})
  }

  render() {
    return this.props.width !== "xs" ? (
        <div className={"main-div"}>
          <Grid container>
            <Grid
                item
                xs={12}
                md={12}
                sm={12}
                lg={12}
                className={"sidebar-ttl"}
            >
              <Tooltip title={this.state.projectTitle} placement="bottom-start">
                <Typography className={
                  this.props.selectedId != undefined && this.props.selectedId == 0
                      ? "head-title-active"
                      : "head-title"
                }
                    // onClick={() => {
                    //   this.props.onHandleChange(0);
                    // }}
                >
                  {this.state.projectTitle}
                </Typography>
              </Tooltip>

            </Grid>
            <Grid
                item
                xs={12}
                md={12}
                sm={12}
                lg={12}
                className={"padd-lr-10"}
            >

              {this.state.menuList.map((tile, index) => (
                  //   <Typography
                  //   className={
                  //     this.props.selectedId && this.props.selectedId == tile.key
                  //       ? "menu-title-active"
                  //       : "menu-title"
                  //   }
                  //   onClick={() => {
                  //     this.props.onHandleChange(tile.key);
                  //   }}
                  // >
                  //   <img src={tile.imgLink.default} className={"icons"}></img>
                  //  <span className={"title"}>{tile.name}</span>
                  // </Typography>
                  <Link key={index} to={tile.path} className={
                    this.props.selectedId && this.props.selectedId == tile.key
                        ? "menu-title-active"
                        : "menu-title"
                  }>
                    <ListItem
                        key={tile.name}
                        className={"sidebar-title"}
                    >
                      <img src={tile.imgLink.default} className={"icons"}></img>
                      <span className={"title"}>{tile.name}</span>
                    </ListItem>
                  </Link>
              ))}
            </Grid>
          </Grid>
        </div>
    ) : null;
  }
}

export default withStyles()(SideBar);
