
import {getChartJSON}  from '../../services/ChartEditorService'
import {setDataJSONConfig} from "../../redux/slice/ChartEditorSlice"

  export const getChartJSONResponse = (event) =>  async (dispatch,getState) =>  {
      console.log('event==>',event)
    let projectId=getState().project.projectId
        getChartJSON(event).then((response) => {
            console.log("response-->",response)
        // flag=0
        dispatch(setDataJSONConfig(response.data))
        //   dispatch(updateResponseCount(response.user_response_count))
        //   dispatch(fetchAllQuestions({data:response.data,projectId: projectId}))
        }).catch((error)=>{
          console.log('Fetch All Question error==>',error)
      });
  };
  
