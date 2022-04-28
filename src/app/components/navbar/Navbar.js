import React from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import CloseIcon from "@material-ui/icons/Close";
import ListItem from "@material-ui/core/ListItem";
import Color from "../../config/Color";
import FontWeights from "../../config/FontWeights";
import { Link } from "react-router-dom";
import withWidth, { isWidthDown } from "@material-ui/core/withWidth";
import HeaderBar from "./HeaderBar";
import FontFamily from "../../config/FontFamily";
import Lable from "@material-ui/core/InputLabel";
import { removeCookie } from "../../_helpers";
import SideBar from "../sidebar/SideBar";
import FontHierarchy from "../../config/FontHierarchy";
import "./Navbar.scss";
const drawerWidth = 180;

const styles = {
  logo:{
    padding:0
  },
  itemSpacing:{
    marginBottom: 10,
    height: 40,
    borderRadius: 5,
  },
  notificationImage: {
    width: 16,
    height: 16,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    marginRight: 22,
    marginTop: 10,
    marginBottom: 10
  },
  profileImage: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    marginRight: 22,
    marginTop: 10,
    marginLeft: "-5px",
    marginBottom: 10
  },
  toolbar: {
    justifyContent: "space-between"
  },
  logoImage:{
    height:30,
    width:30,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    // marginRight: 25,
    // marginTop: 10,
    // marginBottom: 15,
    color:Color.primarySecond
  },
    drawerImage: {
    width: 15,
    height: 15,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    marginRight: 25,
    marginTop: 10,
    marginLeft: "-4px",
    marginBottom: 10,
    color:Color.primarySecond
  },
  memberImage:{
    width: 20,
    height: 15,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    marginRight: 25,
    marginTop: 10,
    marginLeft: "-6px",
    marginBottom: 10,
    color:Color.primarySecond
  },
  drawerImageLogout:{
    width: 16,
    // height: 16,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    marginRight: 26,
    marginTop: 10,
    marginBottom: 10
  },
  drawerLabel: {
    fontFamily: FontFamily("regular"),
    color: Color.primarySecond,
    fontSize: 14,
    cursor:'pointer'
  },
  mainDrawlerLabel:{
    color: Color.primarySecond,
    fontSize: 20,
    FontWeights: FontWeights.semiBold,
    fontFamily:FontFamily("regular"),
    fontWeight:FontWeights.regular,
    cursor:'pointer',
   
  }
};

const useStyles = makeStyles((theme) => ({
  root:{
    paddingBottom:14,
    paddingTop:15,
    alignItems:'center',
    display:'flex',
    justifyContent:'center'
  },
  paperAnchorDockedLeft:{
    border:'1px solid #e2e2e2'
  },
  menuDiv: {
    padding:"0px 10px",
    overflowX: "hidden"
  },
  link: {
    textDecoration: "none",
  },
  listItem: {
    borderRadius: 5,
    height: 40,
    width: 40,
    backgroundColor: `${Color.lightYellow} !important`,
    cursor:'pointer',
    paddingTop:15,
    paddingBottom:15
    // paddingLeft: 12
    // paddingLeft: 12
  },
  closeIcon: {
    backgroundColor: Color.primaryLight,
    width: 28,
    height: 28,
    marginRight: 8,
    borderRadius: 8
  },
  drawerMenu: {
    backgroundColor: Color.white,
    overflowX: "hidden",
    padding: theme.spacing(1),
    width:60
    // boxShadow: `0px 3px 6px ${Color.lightGreyShadow}`
  },
  main: {
    display: "flex"
  },
  appBar: {
    marginLeft: 100,
    paddingLeft: 50,
    background: "transparent",
    boxShadow: "0px 0px 0px 0px",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "unset",
      paddingLeft: "unset",
      background: Color.white,
      // boxShadow: `0px 3px 6px ${Color.lightGreyShadow}`
    },
    color: Color.primarySecond,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    paddingLeft: 0,
    // width: `calc(100% - ${drawerWidth}px)`,
    width:60,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "block"
    }
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    overflowX: "hidden",
    whiteSpace: "nowrap",
    // boxShadow: `0px 3px 6px ${Color.lightGreyShadow}`,
    [theme.breakpoints.down("sm")]: {
      display: "none",
      backgroundColor: Color.lightSky
    }
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    // boxShadow: "3px 0px 30px #152A7517",
    [theme.breakpoints.down("sm")]: {
      display: "block",
      backgroundColor: Color.lightSky,
      width: "100% !important"
    }
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: '60px !important',
    // boxShadow: "3px 0px 30px #152A7517",
    [theme.breakpoints.up("lg")]: {
      width: theme.spacing(8) + 2
    }
  },
  drawerPaper: {
    whiteSpace: "nowrap"
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginLeft: theme.spacing(3) + 2,
    marginRight: theme.spacing(3) + 2,
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1),
      marginLeft: 0,
      marginRight: 0
    }
  },
  contentMarger: {
    flexGrow: 1,
    padding: theme.spacing(3),
    marginLeft: theme.spacing(3) + 2,
    marginRight: theme.spacing(3) + 2,
    [theme.breakpoints.down("sm")]: {
      padding: theme.spacing(1),
      marginTop: theme.spacing(10),
      marginLeft: 0,
      marginRight: 0
    }
  },
  divider: {
    background: Color.lightGrey,
    marginBottom: 20
  }
}));

const searchInMobile = ["/campaigns", "/gallery"];

const displaySearch = (props) => {
  let location = props.location;
  if (location != undefined) {
    return searchInMobile.includes(location.pathname);
  }
  return false;
};

function MiniDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [searchDisplay, setSearchDisplay] = React.useState(false);

  const displayInput = displaySearch(props);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleClose = (event) => {
    removeCookie();
    window.location.href = "/";

  }

  const setSearchDisplayFn = (display) => setSearchDisplay(display);

  // const displayInputProp = displayInput && searchDisplay;
  const displayInputProp = searchDisplay;

  return (
    <div className={classes.main}>
      <CssBaseline />
      <HeaderBar
        displayInput={displayInputProp}
        handleDrawerOpen={handleDrawerOpen}
        setSearchDisplay={setSearchDisplayFn}
        title={props.title}
        autoCompleteFeed={props.autoCompleteFeed}
        handleSearch={props.handleSearch}
        searchFlag={props.searchFlag}
        isSidebar={props.isSidebar}
      />
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open
          })
        }}>
        <div
          className={
            isWidthDown("sm", props.width)
              ? clsx(classes.drawerMenu)
              : clsx(classes.menuDiv)
          }>
          <List style={{...styles.logo}}>
            {/* <ListItem button className={classes.root}> */}
            <div className={classes.root}>
              {isWidthDown("sm", props.width) ? (
                <CloseIcon
                  className={clsx(classes.closeIcon)}                  
                />
              ) : (
                <img
                  src={props.logoPath}
                  style={{
                    ...styles.logoImage
                  }}></img>
              )}

              <Lable
                style={{...styles.mainDrawlerLabel}}>
                {isWidthDown("sm", props.width) ? "MENU" : ""}
              </Lable>
              </div>
            {/* </ListItem> */}
          </List>
          <Divider className={classes.divider} />
          <List>
            {props.items.map((item, index) => (
              <Link key={index} className={classes.link} to={item.path}>
                <ListItem
                  disableRipple
                  classes={{
                    gutters: item.key === props.selected && classes.listItem
                  }}
                  style={{...styles.itemSpacing}}
                  button
                  key={item.text}
                  selected={item.key === props.selected}>
                    {item.key === props.selected 
                    ?
                    <img
                    src={item.activeIcon.default}
                    style={ item.key == 2 ?
                      {
                      ...styles.memberImage
                    }
                    :{
                      ...styles.drawerImage
                    }} ></img>
                  :
                  <img
                    src={item.icon.default}
                    style={item.key == 2 ?
                      {
                      ...styles.memberImage
                    }
                    :{
                      ...styles.drawerImage
                    }} ></img>
                  }
                  {/* <Lable style={{ ...styles.drawerLabel }}>{item.text}</Lable> */}
                </ListItem>
              </Link>
            ))}
            {isWidthDown("sm", props.width) && 
            <ListItem
                  disableRipple
                  classes={{
                    gutters:"Logout" === props.selected && classes.listItem
                  }}
                  button
                  key={"Logout"}
                  selected={"Logout" === props.selected}
                  onClick={()=>{
                    handleClose()
                  }}
                  >
                  <img
                    // src={item.icon}
                    alt={""}
                    style={{
                      ...styles.drawerImageLogout
                    }}></img>
                  <Lable style={{ ...styles.drawerLabel }}>Logout</Lable>
                </ListItem>
                }
          </List>
        </div>
      </Drawer>
<div>
  {props.isSidebar &&
  <SideBar
  // width={this.props.width}
  //projectTitle={this.props.location.state.projectTitle}
  // onHandleChange={(id)=>{this.handleRouteChange(id,this.state.projectId)}}
  // onHandleChange={(id)=>{handleChange(id,this.props.location.state.projectid )}}
  projectId={props.projectId}
  selectedId={props.selectedId}></SideBar>

}
</div>
    </div>
  );
}

export default withWidth()(MiniDrawer);
