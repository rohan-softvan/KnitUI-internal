import Cookies from "universal-cookie";
import {request, request2} from './UtilService'
import {BASE_URL} from "../Constants";

const cookies = new Cookies();

const PROJECT_PATH = "project/utils"
const PROJECT_CREATION_PATH = "project/creation"

// get all Project Data 
export async function getProjectDataWithSearch() {
    return await request({
        url: BASE_URL + PROJECT_PATH + "/search-tabs?custom_search=",
        // url:"https://z8u0f7pppb.execute-api.us-east-1.amazonaws.com/dev/project/video/get-data",
        method: "GET",
        // body: JSON.stringify(data)
    });
}


export async function getProjectData(data){
    return await request({
        url: BASE_URL + "project",
        // url:"https://z8u0f7pppb.execute-api.us-east-1.amazonaws.com/dev/project/video/get-data",
        method: "POST",
        body: JSON.stringify(data)
    });
}



export async function getSurveyFromToken(data){
    return await request({
        url: BASE_URL + PROJECT_CREATION_PATH + "/surveys-retrieval",
        method: "POST",
        body: JSON.stringify(data)
    });
}

// Create New Project
export async function createNewProject(data){
    return await request({
        url: BASE_URL + PROJECT_CREATION_PATH,
        method: "POST",
        body: JSON.stringify(data)
    });
}

// Delete Project API
export async function deleteProject(projectId){
    return await request({
        url: BASE_URL + PROJECT_PATH + "/delete?knit_project_id=" + projectId + "&is_deleted=true",
        method: "GET"
    })
}
