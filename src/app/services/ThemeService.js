import Cookies from "universal-cookie";
import {request, request2} from './UtilService'
import {BASE_URL} from "../Constants";

const cookies = new Cookies();

const PROJECT_THEME = "project/themes"
const THEME_TAG_FREQUENCY="/fetch-tag-frequency"
const THEME_ANNOTATION_lIST="/fetch-annotations-data"
const CHILD_TAG = "project/video/tag-operation/delete"
// load all theme (only name)
export async function allThemeNameList(data) {
    return await request({
        url: BASE_URL + PROJECT_THEME,
        method: "POST",
        body: JSON.stringify(data)
    });
}
export async function updateThemeTreeHirerachy(data) {
    return await request({
        url: BASE_URL + PROJECT_THEME+"/update-hirerachy",
        method: "POST",
        body: JSON.stringify(data)
    });
}
export async function deleteTagThemeTree(data) {
    return await request({
        url: BASE_URL + CHILD_TAG,
        method: "POST",
        body: JSON.stringify(data)
    });
}
export async function insertChildTag(data) {
    return await request({
        url: BASE_URL + PROJECT_THEME,
        method: "POST",
        body: JSON.stringify(data)
    });
}
export async function themesTagFrequencyList(id) {
    return await request({
        url: BASE_URL + PROJECT_THEME+THEME_TAG_FREQUENCY+"?knit_project_id="+id,
        method: "GET",
        //body: JSON.stringify(data)
    });
}
export async function themesTagFrequencyDetail(projectId,themeId) {
    return await request({
        url: BASE_URL + PROJECT_THEME+THEME_TAG_FREQUENCY+"?knit_project_id="+projectId+"&knit_theme_id="+themeId,
        method: "GET",
        //body: JSON.stringify(data)
    });
}

export async function themesAnnotationList(knitProjectId) {
    return await request({
        url: BASE_URL + PROJECT_THEME+THEME_ANNOTATION_lIST+"?knit_project_id="+knitProjectId,
        method: "GET",
        //body: JSON.stringify(data)
    });
}
export async function themesAnnotationListByTheme(knitProjectId,themeId) {
    return await request({
        url: BASE_URL + PROJECT_THEME+THEME_ANNOTATION_lIST+"?knit_project_id="+knitProjectId+"&knit_theme_id="+themeId,
        method: "GET",
        //body: JSON.stringify(data)
    });
}
export async function themesAnnotationListByTag(knitProjectId,tagId) {
    return await request({
        url: BASE_URL + PROJECT_THEME+THEME_ANNOTATION_lIST+"?knit_project_id="+knitProjectId+"&knit_tag_id="+tagId,
        method: "GET",
        //body: JSON.stringify(data)
    });
}

export async function themesParallelMapping(knitProjectId) {
    return await request({
        url: BASE_URL +"project/data/question-list?knit_project_id="+knitProjectId+"&is_grid_view=true&is_theme=true",
        method: "GET",
        //body: JSON.stringify(data)
    });
}
export async function themesParallelMappingBYQID(knitProjectId,QId) {
    return await request({
        url: BASE_URL + PROJECT_THEME+"/question-by-id?knit_project_id="+knitProjectId+"&question_id="+QId+"&is_grid_view=true",
        method: "GET",
        //body: JSON.stringify(data)
    });
}
export async function themesParallelMappingBYQIDAndThemeId(knitProjectId,QId,themeId) {
    return await request({
        url: BASE_URL + PROJECT_THEME+"/question-by-id?knit_project_id="+knitProjectId+"&question_id="+QId+"&is_grid_view=true&knit_theme_id="+themeId,
        method: "GET",
        //body: JSON.stringify(data)
    });
}
export async function themesParallelMappingBYQIDAndTagId(knitProjectId,QId,tagId) {
    return await request({
        url: BASE_URL + PROJECT_THEME+"/question-by-id?knit_project_id="+knitProjectId+"&question_id="+QId+"&is_grid_view=true&knit_tag_id="+tagId,
        method: "GET",
        //body: JSON.stringify(data)
    });
}
