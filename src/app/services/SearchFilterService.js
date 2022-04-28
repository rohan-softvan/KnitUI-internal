import Cookies from "universal-cookie";
import {request, request2} from './UtilService'
import {BASE_URL} from "../Constants";

const cookies = new Cookies();

const PROJECT_PATH = "project/utils"

//filter option details for Questions
export async function getResponseQuestions(data){
    return await request({
        url: BASE_URL +PROJECT_PATH+ "/filter-options",
        method: "POST",
        body: JSON.stringify(data)
    });
}
