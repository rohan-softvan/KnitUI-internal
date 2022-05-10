import {createSlice} from '@reduxjs/toolkit'

export const ColorPickerSlice = createSlice({
  name: 'ColorPickerSlice',
  initialState: {
    title: [],
    subtitle: [],
    series: [],
    legend: [],
    backgroundColor: [],
    borderColor: [],
    xAxisTextColor: [],
    xAxisGridLineColor: [],
    yAxisTextColor: [],
    yAxisGridLineColor: [],
    dataLabelsColor: [],
  },
  reducers: {
    setRecentColorsForColorPicker: (state, {payload}) => {
      console.log('setRecentColorsForColorPicker=> payload: ', payload)
      console.log("state[payload.type] ", JSON.stringify(state))
      //if color dose not exists in the array then only push it to recently used colors
      if (!state[payload.type].includes(payload.color)) {
        state[payload.type].push(payload.color)
      }
    },
  },
})


// Action creators are generated for each case reducer function
export const {setRecentColorsForColorPicker} = ColorPickerSlice.actions
export default ColorPickerSlice.reducer
