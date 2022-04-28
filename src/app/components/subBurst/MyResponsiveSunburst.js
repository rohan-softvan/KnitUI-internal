import React, { Component } from "react";
import { ResponsiveSunburst } from "@nivo/sunburst";
import { Grid, Typography } from "@material-ui/core";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import "./MyResponsiveSunburst.scss";
const checkChildren = (data) => {
  let paletteColors = [];
  if(data){
    if (Array.isArray(data.children) && data.children.length > 0) {
      data.children.forEach(child => {
        paletteColors.push(child.color)
      })
    }
  }
  return paletteColors
}

const MyResponsiveSunburst = ({ data }) => {
  const customPalette = checkChildren(data)
  return(<ResponsiveSunburst
    data={data}
    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
    id="name"
    value="loc"
    cornerRadius={20}
    borderWidth={5}
    borderColor="#fff"
    // colorBy={function(e){console.log("color==>",e.color,"e==>",e); return e.children.color}}
    // colors={{scheme: 'purple_orange'}}
    // childColor="inherit"
    colors={customPalette}
    // childColor={{ from: 'color', modifiers: [ [ 'brighter', 0.1 ] ] }}
    childColor={(parent, child) => {
      return child.data.color
    }}
    arcLabelsSkipAngle={10}
    arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 1.4]] }}
  />)
  };

class MyResponsiveSunburstExample extends React.Component {
  render() {
    return (
      <div style={{ width: 650, height: 370, display: 'flex' }}>
        <div className={"multichart main-chart-div"} >
          <Grid item xs={12} sm={12} md={8} lg={8} >
            <MyResponsiveSunburst data={this.props.data} />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} className={"main-legend-div"}>
            <div className="legend-inner-div">
              <div className={"legends-title-div"}>
                {/* <FiberManualRecordIcon /> */}
                {this.props.legends && this.props.legends.length > 0 && <span className={"legend-title"}>Legend</span>}
              </div>
              {this.props.legends && this.props.legends.map((item, index) => {
                return (
                  <div className={"legends-title-div"}>
                    <FiberManualRecordIcon style={{ color: item.color, width: "20px" }} />
                    <Typography className={"legend-lable"}>
                      {item.label}
                    </Typography>
                  </div>
                )
              })}
            </div>
          </Grid>
        </div>
      </div>

    )
  }
}



export default MyResponsiveSunburstExample;

