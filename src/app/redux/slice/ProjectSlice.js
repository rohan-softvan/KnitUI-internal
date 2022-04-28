import { createSlice } from '@reduxjs/toolkit'  

  
  export const projectSlice = createSlice({
    name: 'ProjectPage',
    initialState: {
       projectId:''
    },
    reducers: {
        setProjectId: (state,action) => {
            state.projectId=action.payload
        },
    },
  })



  // Action creators are generated for each case reducer function
export const { setProjectId } = projectSlice.actions
export default projectSlice.reducer
  