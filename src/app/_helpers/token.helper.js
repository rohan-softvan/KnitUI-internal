import Cookies from "universal-cookie";
import { cookieEnum } from "../enums";

const cookie = new Cookies();

export function setCookie(user_type, csrf) {
  // return authorization header with jwt token
  cookie.set(cookieEnum.CSRF, csrf, { httpOnly: false, path: "/" });
  cookie.set(cookieEnum.USER_TYPE, user_type, { httpOnly: false, path: "/" });
}

export function removeCookie() {
  // return authorization header with jwt token
  cookie.remove(cookieEnum.CSRF, { httpOnly: false, path: "/" });
  cookie.remove(cookieEnum.USER_TYPE, { httpOnly: false, path: "/" });
}

export function getCsrfCookie() {
  // return authorization header with jwt token
  return cookie.get(cookieEnum.CSRF);
}

export function getUserTypeCookie() {
  // return authorization header with jwt token
  return cookie.get(cookieEnum.USER_TYPE);
}
