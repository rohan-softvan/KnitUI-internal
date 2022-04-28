import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import withWidth from "@material-ui/core/withWidth";
import FontFamily from "../../config/FontFamily";
import Color from "../../config/Color";
const drawerWidth = 186;

const useStyles = makeStyles(theme => ({
  appBar: {
    marginLeft: 100,
    paddingLeft: 50,
    boxShadow: "0px 0px 0px 0px",
    background: Color.lightSky,
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
  closeIcon: {
    "&:active": {
      backgroundColor: Color.primaryLight
    },
    width: 28,
    height: 28,
    marginRight: 8,
    borderRadius: 8
  }
}));

const ModalHeaderBar = props => {
  const classes = useStyles();
  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: props.open
      })}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={props.handleClose}
          edge="start"
          className={clsx(classes.menuButton)}
        >
          <CloseIcon className={clsx(classes.closeIcon)} />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          style={{
            justifyContent: "space",
            // fontFamily: FontFamily("semi-bold")
          }}
        >
          {props.title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default withWidth()(ModalHeaderBar);
