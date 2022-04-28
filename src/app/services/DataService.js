import Cookies from "universal-cookie";
import {request, request2} from './UtilService'
import {BASE_URL} from "../Constants";

const cookies = new Cookies();

const DATA_PATH = "project/data"


// get all Question Tabular Data 
export async function getQuestionTabData(projectId) {
    return await request({
        url: BASE_URL + DATA_PATH + "/question-list?knit_project_id="+projectId+"&is_que_tabular=true",
        // url:"https://z8u0f7pppb.execute-api.us-east-1.amazonaws.com/dev/project/video/get-data",
        method: "GET",
    });
}


//get QuestionAnserId Data using for the cancel token
export async function getQuestionAnswerId(projectId,id,numericId,cancelToken){
    const option = {
        url: BASE_URL + DATA_PATH + "/question-by-id?knit_project_id="+projectId+"&is_gridview=true&question_id="+id+"&numeric_question_id="+numericId,
        method:"GET",
    }
    if (cancelToken){
        option['cancelToken'] = cancelToken
    }
    return await request(option)
}

// get all qestionId Data 
export async function getDetailsFromParticularId(page,projectId) {
    return await request({
        url: BASE_URL + DATA_PATH + "/qualtrics-data?knit_project_id="+projectId+"&page_no="+page+"&page_size=10&is_tabular=true",
        // url:"https://z8u0f7pppb.execute-api.us-east-1.amazonaws.com/dev/project/video/get-data",
        method: "GET",
        // body: JSON.stringify(data)
    });
}


// get all for list view Data 
export async function getAllQuestionForGrid(projectId) {
    return await request({
        url: BASE_URL + DATA_PATH + "/question-list?knit_project_id="+projectId+"&is_grid_view=true",
        // url:"https://z8u0f7pppb.execute-api.us-east-1.amazonaws.com/dev/project/video/get-data",
        method: "GET",
        // body: JSON.stringify(data)
    });
}

// sorting API for question
export async function getSortedQuestionTableData(projectId, numericQuestionId, pageNo, pageSize, sortOrder) {
    return await request({
        url: BASE_URL + DATA_PATH + "/qualtrics-data?knit_project_id=" + projectId + "&sort_numeric_id=" + numericQuestionId
             + "&page_no=" + pageNo + "&page_size=" + 10 + "&sort_order=" + sortOrder + "&is_tabular=" + true,
        method: "GET"
    });
}

export async function getVideoFileTypeData(projectId,id) {
    return await request({
        url: BASE_URL + "project/utils/sunburst-chart?knit_project_id="+projectId+"&is_sunburst=true&question_id="+id,
        // url:"https://z8u0f7pppb.execute-api.us-east-1.amazonaws.com/dev/project/video/get-data",
        method: "GET",
    });
}

// perform actions on Table
export async function dataActionDropdown(data) {
    return await request({
        url: BASE_URL + DATA_PATH + "/bulk-operations",
        method: "POST",
        body: JSON.stringify(data)
    });
}

// search filter vise get data using cancel token
export async function applySearchFilterForDATA(data,cancelToken) {
    const option = {
        url: BASE_URL + DATA_PATH + "/qualtrics-data",
        method: "POST",
        body: JSON.stringify(data)
    }
    if (cancelToken){
        option['cancelToken'] = cancelToken
    }

    return await request(option)


}

// search filter vise get data
export async function getFilterListForGrid(data) {
    return await request({
        url: BASE_URL + "project/utils/filter-options",
        method: "POST",
        body: JSON.stringify(data)
    });
}


// Filter and Sorting API
export async function getSortedFilteredQuestionTableData(data) {
    return await request({
        url: BASE_URL + DATA_PATH + "/qualtrics-data",
        method: "POST",
        body: JSON.stringify(data)
    });
}


// Get CSV download details for data table
export async function getCSVDetailsFromParticularId(pageSize, projectId) {
    return await request({
        url: BASE_URL + DATA_PATH + "/qualtrics-data?knit_project_id=" +projectId+ "&page_no=1&page_size=" + pageSize+"&is_tabular=true&is_export=true",
        method: "GET",
    });
}

// Get CSV download details for video table


//Check Project data updated or not
export async function getprojectDataUpdated(data){
    return await request({
        url: BASE_URL + "redux/json-operations",
        method: "POST",
        body: JSON.stringify(data)
    })
}
//Check Project data updated or not

//Check Project data updated or not
export async function getProjectThemeData(data){
    return await request({
        url: BASE_URL + "redux/json-operations",
        method: "POST",
        body: JSON.stringify(data)
    })
}


//update the updated flag for data Json
export async function setUpdatedData(data){
    return await request({
        url: BASE_URL + "redux/json-operations",
        method: "POST",
        body: JSON.stringify(data)
    })
}