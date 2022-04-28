import React, { Component } from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import Color from "../../config/Color";
import FontFamily from "../../config/FontFamily";
import FontWeights from "../../config/FontWeights";
import { isWidthDown } from "@material-ui/core/withWidth";
import { Typography } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import "./Select.scss";
const styles = (theme) => ({
  select: {
    "&:before": {
      borderColor: Color.primary,
    },
    "&:after": {
      borderColor: Color.primary,
    },
  },
  icon: {
    fill: Color.primary,
  },
  mainHeight:{
    height:30
  },
  
});

const menu = [
  {
    title: "Bulk Actions",
    key: 1,
  },
  {
    title: "Bulk Actions1",
    key: 2,
  },
  {
    title: "Bulk Actions2",
    key: 3,
  },
];
class FontTypeSelectComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: "",
      selectedStyle: "",
      selectedSize:''
    };
  }

  componentDidMount() {
    const { value = "" } = this.props;
    this.setState({ selectedValue: value });
  }
  render() {
    const { classes, items } = this.props;
    let listMenu=this.props.menu ? this.props.menu : menu; 
    return (
      <FormControl
        variant="outlined"
        style={{ width: "133px", marginRight: 20 ,height:30,background: "white"}}
      >
        <Select
          IconComponent = {ExpandMoreIcon}
          className={classes.select}
          inputProps={{
            classes: {
              icon: classes.icon,
            },
          }}
          value={this.props.menuValue ? this.props.menuValue : 0}
          onChange={this.props.handleChange}
        >
          <MenuItem
                style={{
                  fontSize: 14,
                  color: Color.primary,
                  fontWeight: 300,
                }}
                value="0"
                disabled
              >
                <Typography
                  style={{
                    fontSize: 14,
                    color: Color.primary,
                    fontWeight: 300,
                    paddingLeft:'0px',
                  }}
                >
                  {this.props.placeHolder ? this.props.placeHolder : "Select Action"}
                </Typography>
              </MenuItem>
          {listMenu &&
            listMenu.map((item, index) => {
              return(
                this.props.selectedFontType && !this.props.selectedFontType.includes(item.value) ?
                 <MenuItem
                 key={item.key}
                 style={{
                   fontSize: 14,
                   color: Color.primary,
                   fontWeight: 300,
                 }}
                 value={item.value }
                 disabled
               >
                 <Typography
                   style={{
                     fontSize: 14,
                     color: Color.primary,
                     fontWeight: 300,
                     paddingLeft:'0px',
                   }}
                 >
                   {item.title}
                 </Typography>
               </MenuItem>
              :
              <MenuItem
              key={item.key}
              style={{
                fontSize: 14,
                color: Color.primary,
                fontWeight: 300,
              }}
              value={item.value }
            >
              <Typography
                style={{
                  fontSize: 14,
                  color: Color.primary,
                  fontWeight: 300,
                  paddingLeft:'0px',
                }}
              >
                {item.title}
              </Typography>
            </MenuItem>
             
            )}
            )}
        </Select>
      </FormControl>
    );
  }
}

export default withStyles(styles, { withTheme: true })(FontTypeSelectComponent);
