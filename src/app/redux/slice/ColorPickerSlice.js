import {createSlice} from '@reduxjs/toolkit'

export const ColorPickerSlice = createSlice({
  name: 'ColorPickerSlice',
  initialState: {
    title: [],
    subtitle: [],
    series: [],
    legend: [],
    backgroundColor: [],
    borderColor: []
  },
  reducers: {
    setRecentColorsForColorPicker: (state, {payload}) => {
      console.log('setRecentColorsForColorPicker=> payload: ', payload)
      console.log("state[payload.type] ", JSON.stringify(state))
      // #TODO dont add duplicate colors
      // if (!state[payload.type].contains(payload.color))
      state[payload.type].push(payload.color)
    },
  },
})


// Action creators are generated for each case reducer function
export const {setRecentColorsForColorPicker} = ColorPickerSlice.actions
export default ColorPickerSlice.reducer
