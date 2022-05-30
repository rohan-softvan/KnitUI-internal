import React, {useMemo, useState} from "react";
import {CirclePicker, SketchPicker,} from "react-color";
import {Typography} from '@material-ui/core'
import {useSelector} from "react-redux";


const decimalToHex = alpha =>
    alpha === 0 ? "00" : Math.round(255 * alpha).toString(16);


function CustomColorPicker(props) {
  let graphConfig = useSelector((state) => state.chart.graphConfig);
  console.log("usedColors: ", props.usedColors)
  const selectedColor = props.component === "legend" ?
      graphConfig[props.component].itemStyle.color :
      props.component === "backgroundColor" ?
          graphConfig["chart"]["backgroundColor"] :
          props.component === "borderColor" ?
              graphConfig["chart"]["borderColor"] :
              props.component === "xAxisTextColor" ?
                  graphConfig["xAxis"]["title"].style.color :
                  props.component === "yAxisTextColor" ?
                      graphConfig["yAxis"]["title"].style.color :
                      props.component === "dataLabelsColor" ?
                          graphConfig['plotOptions']['series']['dataLabels']['color'] :
                          props.component === "xAxisGridLineColor" ?
                              graphConfig["xAxis"]["gridLineColor"] :
                              props.component === "yAxisGridLineColor" ?
                                  graphConfig["yAxis"]["gridLineColor"] :
                                  props.component === "series" ?
                                      props.selectedColor :
                                      graphConfig[props.component].style.color

  const [color, setColor] = useState(selectedColor || "#000");
  const hexColor = useMemo(() => {
    if (typeof color === "string") {
      return color;
    }
    return `${color.hex}${decimalToHex(color.rgb.a)}`;
  }, [color]);

  const handleAutoColorClick = () => {
    let color = {
      hex: "#000"
    }
    handleChangeComplete(color);
  };

  const handleChangeComplete = (color) => {
    setColor(color.hex)
    props.parentCallback(color.hex);
  };


  return (
      <div
          style={{
            height: "auto",
            overflowWrap: "break-word"
          }}
      >
        <div
            style={{
              display: "flex",
              justifyContent: "start",
              flexWrap: "wrap",
              padding: 10,
              flexDirection: "column",
              width: 180,
              boxShadow: "0px 3px 6px #80808029"
            }}
        >
          <button className={"auto-btn"} onClick={handleAutoColorClick}>
            Auto
          </button>
          <Typography className={"standard-title"}>Standard:</Typography>
          <CirclePicker
              color={hexColor}
              onChange={handleChangeComplete}
              width="185px"
              colors={["#12284c", "#12988a", "#6f7271", "#F6f3e6", "#f4a000", "#E2dccf", "#Cccac2"]}
          />
          <SketchPicker
              color={hexColor}
              onChangeComplete={handleChangeComplete}
              disableAlpha
              // width={"auto"}
              boxShadow={"none"}
              width={"200px"}
              presetColors={props.usedColors}
          />
          {/* <button onClick={() => { handlechangeColor() }}>apply</button> */}
        </div>
      </div>
  );
}


export default CustomColorPicker;
