import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Color from "../../config/Color";
import FontHierarchy from "../../config/FontHierarchy";
import FontWeights from "../../config/FontWeights";
import FontFamily from "../../config/FontFamily";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: 24,
    // boxShadow: `0px 3px 6px ${Color.lightGreyShadowSelect}`,
    // marginLeft: 5,
    marginRight: 2,
    "&:hover":{
      boxShadow:"none !important"
    }
  },
  title: {
    fontSize: FontHierarchy.H3,
    fontWeight: FontWeights.semiBold,
    color: Color.lightGray,
    fontFamily: FontFamily("semi-bold")
  },
  leftTitle: {
    fontSize: FontHierarchy.H4,
    fontWeight: 400,
    color: Color.primary,
    fontFamily: FontFamily("semi-bold"),
    textAlign: "left"
  },
  titleView: {
    borderBottom: `1px solid ${Color.lighterGrey}`,
    padding: theme.spacing(2)
  },
  leftTitleView: {
    paddingTop: 15,
    paddingLeft: 20
  },
  statView: {
    padding: theme.spacing(1) + 4,
    justifyContent: "space-between",
    margin: 0
  },
  inactiveStatView: {
    padding: theme.spacing(1) + 4,
    justifyContent: "space-between",
    backgroundColor: Color.primaryLight,
    margin: 0
  },
  centerStatView: {
    padding: theme.spacing(1) + 4,
    display: "flex",
    justifyContent: "center",
    backgroundColor: Color.primaryLight,
    margin: 0
  },
  statTitle: {
    fontSize: FontHierarchy.H2,
    fontWeight:400,
    color: Color.primary,
    fontFamily: FontFamily("semi-bold")
  },
  statSubTitle: {
    fontSize: 14,
    color: Color.primary,
    wordBreak: "break-all",
    fontWeight:300
  },
  disabledGrid: {
    backgroundColor: Color.primaryLight
  }
}));

const renderTitle = (title, classes) => {
  return (
    <Grid className={classes.titleView} variant="h1" item xs={12} >
      <Typography className={classes.title} align="center">
        {title}
      </Typography>
    </Grid>
    //
  );
};

const renderStatBox = (statstics, classes, inactive, center) => {
  return (
    <Grid
      item
      xs={12}
      className={
        inactive
          ? classes.inactiveStatView
          : center
          ? classes.centerStatView
          : classes.statView
      }
      container
      spacing={3}
      >
      {statstics.map((statstic, index) => (
        <Grid
          key={index}
          className={classes.statstic}
          item
          justify="center"
          alignItems="center">
          <Typography className={classes.statTitle} align="center">
            {statstic.no}
          </Typography>
          <Typography className={classes.statSubTitle} align="center">
            {statstic.title}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
};

const renderTitleLeft = (title, classes) => {
  return (
    <Grid className={classes.leftTitleView} xs={12}>
      <Typography className={classes.leftTitle} align="center">
        {title}
      </Typography>
    </Grid>
  );
};
const StatsSummaryWrapper = ({
  title,
  statstics,
  inactive = false,
  children,
  style = {},
  center = false,
  titleLeft
}) => {
  const classes = useStyles();
  return (
    <Card className={classes.root} style={style}>
      {title != undefined && renderTitle(title, classes)}
      {titleLeft != undefined && renderTitleLeft(titleLeft, classes)}

      {Array.isArray(statstics) &&
        renderStatBox(statstics, classes, inactive, center)}
      {children}
    </Card>
  );
};

export default StatsSummaryWrapper;
