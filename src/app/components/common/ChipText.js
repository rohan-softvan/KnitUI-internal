import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Color from  "../../config/Color";
import { Switch, withStyles, Typography} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
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
    minWidth: "fit-content",
    height: "25px",
    // background:"#00000029 0% 0% no-repeat padding-box",
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 10,
    // opacity: 0.2,
   },
  // label:{
  //   fontSize: 14,
  //   textAlign: "center",
  //   padding: 4,
  //   color:Color.primary
  // },
    label: {
        fontSize: 14,
        textAlign: "center",
        padding: "5px 10px",
        color:Color.primary,
        background: "rgba(0,0,0,0.16)",
        borderRadius: "5px",
        alignItems: "center",
        display: "flex"
    }
}

class ChipText extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

 render() {
      const { classes } =this.props;
    return (
        <div style={{...styles.mainDiv}}>
            <Typography style={{...styles.label}}>
                {this.props.text ? this.props.text : "Chip Text"}
                {this.props.onClose ?
                <CloseIcon className={"close-btn-icon c-pointer"} onClick={()=>{this.props.onClose()}}></CloseIcon>:
                <CloseIcon className={"close-btn-icon c-pointer"} ></CloseIcon>  
              }
                
            </Typography>

        </div>
        
    );
  }
}

export default  withStyles(useStyles)(ChipText);
