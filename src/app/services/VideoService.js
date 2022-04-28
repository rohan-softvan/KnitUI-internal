import Cookies from "universal-cookie";
import {request, request2} from './UtilService'
import {BASE_URL,API_GOKNIT_URL} from "../Constants";

const cookies = new Cookies();

const VIDEO_PATH = "project/video"
function getCookie(cookieName) {
    let name = cookieName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
// get all Video Data 
export async function getGridViewVideoData(data) {
    return await request({
        url: BASE_URL + VIDEO_PATH + "/get-data",
        // url:"https://z8u0f7pppb.execute-api.us-east-1.amazonaws.com/dev/project/video/get-data",
        method: "POST",
        body: JSON.stringify(data)
        // body:{}
    });
}
// get searcgh Video Data for bulk Annotation
export async function getbulkAnnotationSearchData(data) {
    return await request({
        //url: BASE_URL +"semantic/search",
        url: API_GOKNIT_URL +"semantic/search",
        headers: {
            'Authorization': getCookie('csrf'),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(data)
    });
}

//see more sentences for bulk annotation
export async function getSeeMoreVideo(data){
    return await request({
        url: API_GOKNIT_URL +"semantic/see-more-sentences",
        headers: {
            'Authorization': getCookie('csrf'),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(data)
    });
}

export async function getVideoDetailsFromId(data){
    return await request({
        url: BASE_URL + VIDEO_PATH + "/get-insight-data",
        method:"POST",
        body:JSON.stringify(data)
    })
}

export async function actionDropdown(data){
    return await request({
        url: BASE_URL + VIDEO_PATH + "/delete",
        method:"POST",
        body:JSON.stringify(data)
    })
}

export async function getVideoTagDetails(responseId){
    return await request({
        url: BASE_URL + VIDEO_PATH + "/tag-operation/fetch?knit_video_response_id="+responseId+"&is_tag=true",
        method:"GET",
        // body:JSON.stringify(data)
    })
}

export async function tagCardOperation(data){
    return await request({
        url: BASE_URL + VIDEO_PATH + "/comment/delete",
        method:"POST",
        body:JSON.stringify(data)
    })
}

export async function tagCardEditOperation(data){
    return await request({
        url: BASE_URL + VIDEO_PATH + "/comment/insert",
        method:"POST",
        body:JSON.stringify(data)
    })  
}

export async function tagUsageDeleteAction(id){
    return await request({
        url: BASE_URL + VIDEO_PATH + "/tag-usage/delete?tag_usage_id="+id,
        method:"GET"
    })
}

export async function getThemeDetails(id){
    return await request({
        url: BASE_URL + VIDEO_PATH + "/get-theme-tag-hierarchy?knit_project_id="+id+"&is_hierarchy=true",
        method:"GET"
    })
}

export async function insertThemes(data){
    return await request({
        url: BASE_URL + "project/themes",
        method:"POST",
        body:JSON.stringify(data)
    })
}

export async function insertTag(data){
    return await request({
        url: BASE_URL+ VIDEO_PATH + "/tag-operation/insert",
        method:"POST",
        body:JSON.stringify(data)
    })
}

export async function applySearchFilterForVideo(data){
    return await request({
        url: BASE_URL+ VIDEO_PATH + "/get-data",
        method:"POST",
        body:JSON.stringify(data)
    })
}
 

export async function applyTagForBulkAnnotation(data){
    return await request({
        url: BASE_URL + VIDEO_PATH +"/tag-operation/insert",
        method:"POST",
        body:JSON.stringify(data)
    })
}

export async function updateTranscript(data){
    return await request({
        url:BASE_URL + VIDEO_PATH +"/edit-transcript",
        method:"POST",
        body:JSON.stringify(data)
    })
}

export async function suggestedTagAction(data){
    return await request({
        url:BASE_URL +"/project/tag-suggestion",
        method:"POST",
        body:JSON.stringify(data)
    })
}
