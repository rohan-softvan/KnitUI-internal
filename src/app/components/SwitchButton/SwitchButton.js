import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Color from  "../../config/Color";
import { Switch, withStyles, Typography} from '@material-ui/core';
import fontFamily from "../../config/FontFamily";
const useStyles = theme => ({

  root: {
    width: 45,
    height: 25,
    padding: 0,
    margin: theme.spacing(1),
    borderRadius:"60px",
  },
  switchBase: {
    padding: 2,
    "&$checked ": {
      color: Color.white,
    },
  },
  checked: {},
  track: {
    opacity: 1,
    backgroundColor: Color.primary,
    "$checked$checked + &": {
      opacity: 1,
      backgroundColor: Color.primary
    }
  },

 })

const styles={
   mainDiv:{
       display:"flex"
   },
   switch:{
    margin:" -9px",
   },
   lableActiveDiv:{
    fontSize: 14,
    fontWeight: "bold",
    fontFamily:fontFamily("regular"),
    paddingRight: 8,
    // paddingLeft:8,
    paddingTop: 10,
    width:50
   },
   lableInActiveDiv:{
    fontSize: 14,
    fontFamily:fontFamily("regular"),
    paddingRight: 8,
    // paddingLeft:8,
    paddingTop: 10,
    width:50
   },
}

class SwitchButton extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

 render() {
      const { classes } =this.props;
    return (
        <div style={{...styles.mainDiv}}>
            <Typography style={{
                ...(this.props.checked === false)
                ? styles.lableActiveDiv
                : styles.lableInActiveDiv
            }}>
              {this.props.offText ? this.props.offText : ""}
            </Typography>
            <Switch 
            checked={this.props.checked} 
            onChange={this.props.handleChange}
            classes={{
              root: classes.root,
              switchBase: classes.switchBase,
              thumb: classes.thumb,
              track: classes.track,
              checked: classes.checked,
            }}
            />
            <Typography style={{
                ...(this.props.checked === true)
                ? styles.lableActiveDiv
                : styles.lableInActiveDiv
            }}>
              {this.props.onText ? this.props.onText : ""}
            </Typography>
        
        </div>
        
    );
  }
}

export default  withStyles(useStyles)(SwitchButton);
