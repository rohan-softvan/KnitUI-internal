
import {getChartJSON}  from '../../services/ChartEditorService'
import {setDataJSONConfig} from "../../redux/slice/ChartEditorSlice"

  export const getChartJSONResponse = (event) =>  async (dispatch,getState) =>  {
    let projectId=getState().project.projectId
        getChartJSON(event).then((response) => {
        dispatch(setDataJSONConfig(response.data))
        }).catch((error)=>{
          console.log('Fetch All Question error==>',error)
      });
  };
  
