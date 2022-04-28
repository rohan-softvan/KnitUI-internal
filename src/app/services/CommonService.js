import {Auth} from "aws-amplify";
import { request, withOutToken } from "./UtilService";
import {BASE_URL} from "../Constants";
const FORGOT_PASSWORD = 'auth/forgot-password/email-send';
const RESET_PASSWORD = 'auth/forgot-password/reset-password';
const CHECK_EMAIL_EXIST = 'auth/verify-email';
const CHECK_USER_EXIST = "/utils/delete_check";
const TEAM_NAME = 'auth/user-registration';
export async function refreshToken() {
    return await Auth.currentSession();
}

export async function currentAuthenticatedUser() {
    return await Auth.currentAuthenticatedUser();
}

export async function setResetPassword (data) {

    return await withOutToken({
        url: BASE_URL + RESET_PASSWORD,
        method: 'POST',
        body: JSON.stringify(data)
    })
}

export async function forgotPassword (data) {

    return await withOutToken({
        url: BASE_URL + FORGOT_PASSWORD,
        method: 'POST',
        body: JSON.stringify(data)
    })
}

export async function checkEmailExist ( data ) {
    return await request({
        url: BASE_URL + CHECK_EMAIL_EXIST,
        method: 'POST',
        body: JSON.stringify(data)
    })
}

export async function insertTeamNameSignup ( data ) {
    return await request({
        url: BASE_URL + TEAM_NAME,
        method: 'POST',
        body: JSON.stringify(data)
    })
}

export async function checkUserExist() {
    return await request({
        url: BASE_URL+CHECK_USER_EXIST,
        method: 'GET'
    })
}
export async function checkOrganizationExist(name) {
    return await request({
        url: BASE_URL+"/user/organization/validate-name?organization_name="+name,
        method: 'GET'
    })
}
