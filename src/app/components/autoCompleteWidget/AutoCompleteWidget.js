import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Color from  "../../config/Color";
import { Switch, withStyles, Typography} from '@material-ui/core';
import Autocomplete from "@material-ui/lab/Autocomplete";
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from "../../../assets/images/search/search.svg";
import "./AutoCompleteWidget.scss";


class AutoCompleteWidget extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

 render() {
      const { classes } =this.props;
    return (
        <FormControl className={"root"} >
       <OutlinedInput
            id="outlined-adornment-weight"
            //onChange={(e)=>{this.props.handleChange(e)}}
            onKeyUp={(e)=>{this.props.handleChange(e)}}
            startAdornment={<InputAdornment position="start"> <img src={SearchIcon} /></InputAdornment>}
            aria-describedby="outlined-weight-helper-text"
            labelWidth={0}
          />
      </FormControl>
        
    );
  }
}

export default  withStyles()(AutoCompleteWidget);
