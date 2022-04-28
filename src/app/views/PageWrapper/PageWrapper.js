import { makeStyles } from "@material-ui/core/styles";
import withWidth from "@material-ui/core/withWidth";
import React from "react";
import Navbar from "../../components/navbar/Navbar";
import { roleEnum } from "../../enums";
import { getUserTypeCookie } from "../../_helpers";
import { knit } from "../Navbar/Navbar.js";
import LogoImage from "./../../../assets/images/knit-logo.svg";

const useStyles = makeStyles((theme) => ({
  children: {
    marginTop: 60,
    marginLeft: 60,
    // marginRight: 50,
    [theme.breakpoints.down("sm")]: {
      marginTop: 70,
      marginLeft: 20,
      marginRight: 20
    }
  },
  noMarginchildren: {
    marginTop: 80,
    marginLeft: 110,
    marginRight: 50,
    [theme.breakpoints.down("sm")]: {
      marginTop: 70,
      marginLeft: 0,
      marginRight: 0
    }
  }
}));

const PageWrapper = (props) => {
  const classes = useStyles();
  // let userType = getUserTypeCookie();
  let userType = "KNIT";
  let menu = knit;
    // if (userType && userType === roleEnum.KNIT) {
    //   menu = knit;
    // }

  return props.null ? (
    props.children
  ) : (
    <div className={"purpic-wrapper-class"}>
      <Navbar
        {...props}
        title={props.title}
        items={menu}
        selectedId={props.selectedId}
        selected={props.selected}
        logoPath={LogoImage}
        handleSearch={props.handleSearch}
        autoCompleteFeed={props.autoCompleteFeed}
        searchFlag={props.searchFlag}
        isSidebar={props.isSidebar}
        projectId={props.projectId}
      />
      <div className={props.nmHo ? classes.noMarginchildren : classes.children}>
        {props.children}
      </div>
    </div>
  );
};

export default withWidth()(PageWrapper);
