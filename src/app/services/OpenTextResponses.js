import Cookies from "universal-cookie";
import {request, request2} from './UtilService'
import {BASE_URL,API_GOKNIT_URL} from "../Constants";

const cookies = new Cookies();

const OPENTEXT = "project/open-text"
const VIDEO_PATH = "project/video"


export async function fetchTableData(data){
    return await request({
        url: BASE_URL + OPENTEXT+"/fetch",
        method: "POST",
        body: JSON.stringify(data)
    });
}
export async function openTextSearchData(data){
    return await request({
        url:API_GOKNIT_URL + "semantic/search",
        method: "POST",
        body: JSON.stringify(data)
    })
}
export async function tagDeletion(id,min,max){
    return await request({
        url: BASE_URL + VIDEO_PATH + "/tag-usage/delete?tag_usage_id="+id+"&feature_index="+min+","+max,
        method:"GET"
    })
}