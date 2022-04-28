import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import Typography from "@material-ui/core/Typography";
import withWidth from "@material-ui/core/withWidth";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Badge from "@material-ui/core/Badge";
import Color from "../../config/Color";
import FontHierarchy from "../../config/FontHierarchy";
import FontFamily from "../../config/FontFamily";
import NotificationModal from "../notificationModal/NotoficationModal";
import { BrowserRouter as Link } from "react-router-dom";
import { removeCookie,getUserTypeCookie } from "../../_helpers";
import Cookies from "universal-cookie";
import TextField from "@material-ui/core/TextField";
import Autocomplete from '@material-ui/lab/Autocomplete';
import notificationIcon from "../../../assets/images/navbar/notification.svg";
import profileIcon from "../../../assets/images/navbar/profile.png";

const drawerWidth = 186;

const cookies = new Cookies();

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex"
  },
  paper: {
    marginRight: theme.spacing(2)
  },
  appBar: {
    minHeight: 60,
    paddingLeft: 50,
    boxShadow: "0px 0px 0px 0px",
    background: Color.secondaryWhite,
    [theme.breakpoints.down("sm")]: {
      marginLeft: "unset",
      paddingLeft: "unset",
      background: Color.white,
      boxShadow: `0px 3px 6px ${Color.lightGreyShadow}`
    },
    color: Color.primary,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appbarSmall:{
    minHeight: 60,
    paddingLeft: 240,
    zIndex:1,
    boxShadow: "0px 0px 0px 0px",
    background: Color.secondaryWhite,
    [theme.breakpoints.down("sm")]: {
      marginLeft: "unset",
      paddingLeft: "unset",
      background: Color.white,
      boxShadow: `0px 3px 6px ${Color.lightGreyShadow}`
    },
    color: Color.primary,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    paddingLeft: 0,
    width: `calc(100% - ${drawerWidth}px)`,
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
  badge: {
    backgroundColor: "#F4A000",
    height:7,
    width:7
  },
  hide: {
    display: "none"
  },
  imageIcon: {
    cursor: "pointer",
    width: 20,
    height: 20,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    // padding: 7,
  },
  imageIconActive: {
    cursor: "pointer",
    width: 20,
    height: 20,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: Color.primaryLight
  },
  profileIcon: {
    cursor: "pointer",
    width: 30,
    height: 30,
    borderRadius: "50%",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  menuList: {
    top: `${theme.spacing(4)}px !important`,
    left: `${theme.spacing(3)}px !important `,
    overflowY: "auto",
    boxShadow: `0px 3px 6px ${Color.lightGreyShadowSelect}`,
    zIndex: 1111,
    maxWidth: 240,
    maxHeight: 208
  },
  menuText: {
    display: "inline"
  },
  menuItem: {
    fontSize: FontHierarchy.pSmall,
    whiteSpace: "normal",
    // color: Color.lightGrey
  },
  menuItemBold: {
    fontSize: FontHierarchy.pSmall,
    whiteSpace: "normal",
    color: Color.lightGrey,
    // fontFamily: FontFamily("semi-bold")
  },
  relativeDiv: {
    position: "relative",
    marginRight: 20,
    borderRadius: 6,
    bottom: 0
  },

  relativeDivActive: {
    position: "relative",
    backgroundColor: `${Color.primaryLight} !important`,
    marginRight: 20,
    borderRadius: 6,
    bottom: 0
  },
  badgeStyle: {
    position: "absolute",
    top: 3,
    left: 16,
    backgroundColor: "#F4A000"
  },
  searchInput: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    justifyContent: "center",
    alignItems: "center",
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "flex"
    }
  },
  searchInputView: {
    flex: 1
  },
  space: {
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 60,
    [theme.breakpoints.down("sm")]: {
      justifyContent: "flex-between",
      alignItems: "center"
    },
    borderBottom:"1px solid #e2e2e2",
    paddingRight: 40,
    alignContent:"center"
  },
  icons: {
    display: "flex"
  },
  moreVertIcon: {
    "&:active": {
      backgroundColor: Color.lightGreyShadow
    },
    borderRadius: 6
  },
  flexRow: {
    display: "flex",
    alignItems: "center",
    margin: "10px 0px",
    [theme.breakpoints.down("sm")]: {
      alignItems: "center"
    }
  },
  hideOnMobile: {
    // marginRight: 26,
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  hideOnDesk: {
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  primaryIcon: {
    color: Color.primary
  },
  notificationModalView: {
    justifyContent: "space",
    textTransform: "uppercase",
    // fontFamily: FontFamily("semi-bold"),
    marginLeft: 24,
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0
    },
    color:Color.primary
  }
}));

const HeaderBar = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);


  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  function handleEnter(event) {
    //if(event.key === 'Enter') {
      props.handleSearch(event.target.value)
    //}
  }

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: props.open
      },{[classes.appbarSmall]: props.isSidebar})}
      >
      <Toolbar className={classes.space}>
        <div className={classes.flexRow}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: props.open
            })}>
            <MoreVertIcon className={classes.moreVertIcon} />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            className={classes.notificationModalView}>
            {props.title}
          </Typography>
        </div>
        <Typography noWrap className={classes.icons} component={"div"}>
          <div className={classes.hideOnMobile}>
            <div className={classes.flexRow}>
              <NotificationMenu />
              <ProfileMenu />
            </div>
          </div>
          {!props.displayInput && (
            <div className={classes.hideOnDesk}>
               {props.searchFlag && 
              <IconButton
              
                onClick={(_) => props.setSearchDisplay(true)}>
                 <SearchOutlined /> 
              </IconButton>
            }
            </div>
          )}
        </Typography>
      </Toolbar>
      {props.displayInput === true && (
        <div className={classes.searchInput}>
          <div className={classes.searchInputView}>
            {/* <Input m0 fullWidth isFormInput onChange={(text) => {}} /> */}
            <Autocomplete
      options={props.autoCompleteFeed}
      getOptionLabel={(option) => option.title}
      style={{ width: 300 }}
      onKeyUp={handleEnter}
      onSelect={handleEnter}
      renderInput={(params) => <TextField {...params} 
      placeholder={"Search here..."}
      />}
    /> 
                </div>
          <IconButton
            className={classes.primaryIcon}
            onClick={(_) => props.setSearchDisplay(false)}>
            <SearchOutlined />
          </IconButton>
        </div>
      )}
    </AppBar>
  );
};

const ProfileMenu = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const userType = getUserTypeCookie();

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleLogout = (event) => {
    removeCookie();
    cookies.remove("user_Id");
    cookies.remove("user_email");
    cookies.remove("is_google");
    localStorage.clear();
    // console.log(
    //   "anchorRef.current",
    //   anchorRef.current,
    //   "event.target",
    //   event.target
    // );
    // console.log(
    //   "anchorRef.current && anchorRef.current.contains(event.target)",
    //   anchorRef.current && anchorRef.current.contains(event.target)
    // );
    // if (anchorRef.current && anchorRef.current.contains(event.target)) {
    //   return;
    // }

    setOpen(false);
    window.location.href = "/";
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }
  function handleProfileComplete() {
   
      window.location.href = "/knit/account-settings";
    
    // this.setState({loading: true});
    // this.props.history.push({
    //   pathname: "/setting",
    //   state: {isEdit: true}
    // });
  }
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <React.Fragment>
      <img
        button={"true"}
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        // src={profileIcon}
        src={"https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
        className={classes.profileIcon}></img>
      <Popper
        className={classes.menuList}
        placement={"left-start"}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal>
        <Paper>
          <ClickAwayListener >
            <MenuList
              autoFocusItem={open}
              id="menu-list-grow"
              onKeyDown={handleListKeyDown}>
              {/* <MenuItem
                className={classes.menuItem}
               onClick={handleProfileComplete}>
                My account
              </MenuItem> */}
              <Link to="" style={{ textDecoration: "none" }}>
                <MenuItem className={classes.menuItem} onClick={()=>{handleLogout()}}>
                  Logout
                </MenuItem>
              </Link>
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popper>
    </React.Fragment>
  );
};

const NotificationMenu = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const opnModalNotification = () => {
    setOpen(false);
    setModal(true);
  };

  return (
    <React.Fragment>
      {modal ? (
        <NotificationModal
          closeModal={() => {
            setModal(false);
          }}
        />
      ) : null}
      <div className={!open ? classes.relativeDiv : classes.relativeDivActive}>
        {/* <Badge
         classes={{badge: classes.badge}}
        className={classes.badgeStyle}  
        variant="dot"
          ></Badge> */}
        {/* <img
          button={"true"}
          ref={anchorRef}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          src={notificationIcon}
          // className={!open ? classes.imageIcon : classes.imageIconActive}
          className={classes.imageIcon}></img> */}
      </div>
      <Popper
        open={open}
        className={classes.menuList}
        placement={"left-start"}
        anchorEl={anchorRef.current}
        role={undefined}
        transition>
        {/* {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              paddingBottom: 12,
              paddingTop: 12,
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom"
            }}
          > */}
        <Paper>
          <ClickAwayListener onClickAway={handleClose}>
            <MenuList
              autoFocusItem={open}
              id="menu-list-grow"
              onKeyDown={handleListKeyDown}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((d, index) => (
                <div key={index}>
                  <MenuItem
                    className={
                      d === 1 ? classes.menuItemBold : classes.menuItem
                    }
                    onClick={handleClose}>
                    {"Hi Username. The notification text will come here in atwo-liner format and th...".substring(
                      0,
                      60 - 3
                    ) + "..."}
                  </MenuItem>
                  <div className={classes.div} style={{ textAlign: "end" }}>
                    <Button
                      onClick={() => {
                        opnModalNotification();
                      }}
                      style={{
                        textTransform: "capitalize",
                        fontSize: FontHierarchy.pLabel,
                        color: Color.primary,
                        // fontFamily: FontFamily("light")
                      }}>
                      Read More
                    </Button>
                  </div>
                </div>
              ))}
            </MenuList>
          </ClickAwayListener>
        </Paper>
        {/* </Grow>
        )} */}
      </Popper>
    </React.Fragment>
  );
};

export default withWidth()(HeaderBar);
