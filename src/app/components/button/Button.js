import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Color from "../../config/Color";
import fontFamily from "../../config/FontFamily";
const styles = {
  button: {
    margin: "15px",
    borderRadius: "5px",
    height: "30px",
    background: Color.primary,
    color:Color.white,
    fontFamily: fontFamily("regular"),
    letterSpacing: 0.5,
    textTransform: "none",
    fontWeight: 400
  },
  filterButtonActive: {
    background: Color.primary,
    borderRadius: 6,
    color: Color.white,
    margin: 6,
    boxShadow: `0px 3px 6px ${Color.lightGreyShadowSelect}`,
    "&:hover": {
      boxShadow: `3px 3px 3px 3px ${Color.lightGreyShadowSelectHover}`
    },
    // marginRight: 12,
    width: 48
  },
  filterButtonInActive: {
    background: Color.white,
    borderRadius: 6,
    color: Color.primary,
    margin: 6,
    boxShadow: `0px 3px 6px ${Color.lightGreyShadowSelect}`,
    "&:hover": {
      boxShadow: `3px 3px 3px 3px ${Color.lightGreyShadowSelectHover}`
    },
    // marginRight: 12,
    width: 48
  },
  buttonPrimary: {
    background: Color.primary
  },
  buttonFilter: {
    background: Color.filterColor,
    color: Color.primary
  },
  buttonSecondary: {
    background: Color.secondary,
    color: Color.primary,
    boxShadow: `0px 3px 6px ${Color.lightGreyShadowSelect}`,
    "&:hover": {
      boxShadow: `3px 3px 3px 3px ${Color.lightGreyShadowSelectHover}`
    }
  },
  buttonDanger: {
    background: Color.danger
  },
  buttonWarning: {
    background: Color.warning,
    color: Color.primary
  },
  disabled: {
    background: Color.disabled
  },
  square: {
    color: "white",
    backgroundColor: "red"
  }
};

class ButtonComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let RootComponent = this.props.text != "" ? Button : IconButton;
    return (
      <React.Fragment>
        <RootComponent
          fullWidth={this.props.fullWidth}
          endIcon={this.props.iconPosition === "right" ? this.props.icon : null}
          startIcon={
            this.props.iconPosition !== "right" ? this.props.icon : null
          }
          onClick={this.props.onClick}
          disabled={this.props.disabled ? true : false}
          className={this.props.className || ""}
          style={{
            ...styles.button,
            ...styles.disabled,
            ...(this.props.disabled === true
              ? styles.disabled
              : this.props.type === "primary"
              ? styles.buttonPrimary
              : this.props.type === "secondary"
              ? styles.buttonSecondary
              : this.props.type === "danger"
              ? styles.buttonDanger
              : this.props.type === "warning"
              ? styles.buttonWarning
              : this.props.type === "filter"
              ? styles.buttonFilter
              : this.props.type === "filterButtonActive"
              ? styles.filterButtonActive
              : this.props.type === "filterButtonInActive"
              ? styles.filterButtonInActive
              : styles.buttonPrimary),
            ...(this.props.bgColor != undefined
              ? {
                  backgroundColor: this.props.bgColor,
                  boxShadow: this.props.shadowNone
                    ? null
                    : `0px 3px 6px ${Color.lightGreyShadowSelect}`
                }
              : {}),
            ...(this.props.width != undefined 
              ? {width:this.props.width}
              : {width:"185px"}),
              ...(this.props.fontWeight != undefined 
                ? {fontWeight:this.props.fontWeight}
                : {}),
            ...(this.props.margin != undefined 
                ? {margin:this.props.margin}
                : {margin:"15px"}),
            ...(this.props.fontSize != undefined
              ? { fontSize: this.props.fontSize }
              : {}),
            ...(this.props.color != undefined
              ? { color: this.props.color }
              : {}),
            ...(this.props.boxShadow != undefined
              ? { boxShadow: this.props.boxShadow }
              : {}),
            ...(this.props.sm === true
              ? { padding: "12px", margin: "6px", alignItems: "end" }
              : {}),
            ...(this.props.searchButton === "active"
              ? {
                  margin: "6px",
                  alignItems: "end",
                  boxShadow: `6px 0px 6px 1px ${Color.lightGreyShadowSelect}`,
                  "&:hover": {
                    boxShadow: `6px 0px 6px 1px ${Color.lightGreyShadowSelectHover}`
                  }
                }
              : this.props.searchButton === "notActive"
              ? {
                  margin: "6px",
                  alignItems: "end",
                  boxShadow: `0px 3px 6px ${Color.lightGreyShadowSelect}`,
                  "&:hover": {
                    boxShadow: `3px 3px 3px 3px ${Color.lightGreyShadowSelectHover}`
                  }
                }
              : {}),

            ...(this.props.xs === true
              ? {
                  padding: "7px",
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  margin: "8px",
                  fontSize: 14
                }
              : {}),
            ...(this.props.filterButton === true
              ? {
                  background: Color.primary,
                  borderRadius: 6,
                  color: Color.white,
                  margin: 6,
                  alignItems: "center",
                  height: 41,
                  width: 41
                }
              : {}),

            ...(this.props.noHrPad === true
              ? {
                  padding: "8px 0px",
                  alignItems: "center",
                  boxShadow: "0px 0px 0px 0px"
                }
              : {}),
            ...(this.props.noHrMargin === true ? { margin: "8px 0px" } : {})
          }}>
          {this.props.text != "" ? this.props.text : this.props.icon}
        </RootComponent>
      </React.Fragment>
    );
  }
}

export default ButtonComponent;
