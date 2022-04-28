import {request } from './UtilService'
import {BASE_URL} from "../Constants";

const PROJECT_VIDEO = "project/video"
const PROJECT_SUMMARY = "project/showreels"

export async function allReels(projectId) {
    return await request({
        url: BASE_URL + PROJECT_VIDEO + "/showreels-by-project-id?knit_project_id=" + projectId,
        method: "GET",
    });
}

export async function getAllReelsFromVideoId(projectId,videoId) {
    return await request({
        url: BASE_URL + PROJECT_VIDEO + "/showreels-by-project-id?knit_project_id=" + projectId + "&knit_video_id="+videoId,
        method: "GET",
    });
}

export async function searchReels(data) {
    return await request({
        url: BASE_URL + "/project/showreels/search",
        method: "POST",
        body: JSON.stringify(data)
    });
}

export async function newShowReels(data){
    return await request({
        url: BASE_URL + "project/showreels/summary-mapping",
        method: "POST",
        body: JSON.stringify(data)
    });
}

export  async  function newShowReelTitle(data){
    return await request({
        url: BASE_URL + "project/showreels/blank-creation",
        method: "POST",
        body: JSON.stringify(data)
    })
}

export async function updateShowReelTitle(data){
    return await request({
        url: BASE_URL + "project/showreels/details-updation",
        method:"POST",
        body: JSON.stringify(data)
    })
}

export async function showReelsDetails(data) {
    return await request({
        url: BASE_URL + PROJECT_SUMMARY +"/retrieval",
        method: "POST",
        body: JSON.stringify(data)
    });
}


export async function ShowCheckedShowReel(data){
    return await request({
        url:BASE_URL + PROJECT_VIDEO + "/generate-showreels",
        method: "POST",
        body: JSON.stringify(data)
    })
}

export async function UpdateShowReel(data){
    return await request({
        url:BASE_URL + PROJECT_VIDEO + "/update-showreels",
        method: "POST",
        body: JSON.stringify(data)
    })
}

export async function exportShowReel(data){
    return await request({
        url:BASE_URL + PROJECT_SUMMARY + "/highlight-generation",
        method: "POST",
        body: JSON.stringify(data)
    })
}

export async function checkShowreelStatus(data){
    return await request({
        url:BASE_URL + PROJECT_SUMMARY + "/highlight-process-check",
        method: "POST",
        body: JSON.stringify(data)
    })
}
export async function highlightsConcatenation(data){
    return await request({
        url:BASE_URL + PROJECT_SUMMARY + "/highlights-concatenation",
        method: "POST",
        body: JSON.stringify(data)
    })
}
export async function subtitleConfigUpdation(data){
    return await request({
        url:BASE_URL + PROJECT_SUMMARY + "/subtitle-config-updation",
        method: "POST",
        body: JSON.stringify(data)
    })
}
export async function onesignalops(data){
    return await request({
        url:BASE_URL + PROJECT_SUMMARY + "/onesignal-ops",
        method: "POST",
        body: JSON.stringify(data)
    })
}

export async function deleteShowReels(id) {
    return await request({
        url: BASE_URL + PROJECT_SUMMARY +"/delete-showreels?is_delete_showreel=true&knit_showreel_id=" + id,
        method: "GET",
        // body: JSON.stringify(data)
    });
}