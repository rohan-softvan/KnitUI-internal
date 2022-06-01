import Cookies from "universal-cookie";
import {request, request2} from './UtilService'
import {BASE_URL} from "../Constants";

const cookies = new Cookies();

const DATA_PATH = "project/data"


// get all Question Tabular Data 
export async function getChartJSON(data) {
    return await request({
        url: BASE_URL + DATA_PATH + "/chart-resp",
        method: "POST",
        body: JSON.stringify(data)
    })
}