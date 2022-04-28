import Cookies from "universal-cookie";
import axios from 'axios'
import  {store}  from '../redux/store/index' 
import {changeApplyButtonStatus} from "../redux/slice/DataSlice"
	
const cookie = new Cookies();

// export const request = (options) => {
//     const headers = new Headers({
//         'Content-Type': 'application/json',
//     });
//     const cookies = new Cookies();
//     if (cookies.get('csrf', {httpOnly: false})) {

//         headers.append('Authorization', cookies.get('csrf', {httpOnly: false}));
//     } else {

//     }

//     const defaults = {headers: headers};
//     options = Object.assign({}, defaults, options);
//     return fetch(options.url, options)
//         .then(response =>
//             response.json().then(json => {

//                 if (!response.ok) {

//                     return Promise.reject(json);
//                 }
//                 return json;
//             })
//         );
// };

// export const request2 = (options,accessToken) => {
//     const headers = new Headers({
//         'Content-Type': 'application/json',
//     });
//     const cookies = new Cookies();
//     if (cookies.get('csrf', {httpOnly: false})) {
//         headers.append('Authorization', cookies.get('csrf', {httpOnly: false}));
//         headers.append( 'access_token' , accessToken);
//     } else {

//     }

//     const defaults = {headers: headers};
//     options = Object.assign({}, defaults, options);
//     return fetch(options.url, options)
//         .then(response =>
//             response.json().then(json => {

//                 if (!response.ok) {

//                     return Promise.reject(json);
//                 }
//                 return json;
//             })
//         );
// };

export const withOutToken = (options) => {

    options = Object.assign({}, options);
    return fetch(options.url, options)
      .then(response =>
        response.json().then(json => {

            if (!response.ok) {

                return Promise.reject(json);
            }
            return json;
        })
      );
};


const MAX_REQUESTS_COUNT = 3
const INTERVAL_MS = 1
let PENDING_REQUESTS = 0

export function setupAxiosInterceptor() {
axios.interceptors.request.use(function (config) {
    const csrf = cookie.get('csrf', {httpOnly: false});
    if (csrf) {
        config.headers.Authorization = csrf;
        // config.headers.access_token = `Bearer ${accessToken}`;
     }
     return new Promise((resolve, reject) => {
       resolve(config)
       // let interval = setInterval(() => {
         //   if (PENDING_REQUESTS < MAX_REQUESTS_COUNT) {
           PENDING_REQUESTS++
           //     clearInterval(interval)
           //   } 
           // }, INTERVAL_MS)
          })
        })
        if(PENDING_REQUESTS === 0){
          store.dispatch(changeApplyButtonStatus(false))
        }else{
         store.dispatch(changeApplyButtonStatus(true))
        }


axios.interceptors.response.use((response) => {
  PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1)
  return new Promise((resolve) => {
    if(response.data.type == 'application/json'){
      response.data.text().then(data => {
        resolve(JSON.parse(data));
        if(PENDING_REQUESTS === 0){
          store.dispatch(changeApplyButtonStatus(false))
        }else{
         store.dispatch(changeApplyButtonStatus(true))
        }
    })
    }else{
      // response.data.text().then(data => {
        resolve(JSON.parse(JSON.stringify(response.data.data)));
        // resolve(response)
    // })
    } 

    // response.data.text().then(data => {
    //     resolve(JSON.parse(data));
    // })
  })
  
//   response.json().then(json => {

//         if (!response.ok) {

//             return Promise.reject(json);
//         }
        
//         return json;
//     })
},(error) => {
  PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1)
  return Promise.reject(error)
})
}

export const request = (options) => {
    const config = {
        headers: { 'Content-Type': 'application/json' },
        url: options['url'],
        method: options['method'],
        responseType: 'blob',
     };


   if (options['body']) {
    config['data'] = options['body'];
 }
 if (options['params']) {
    config['params'] = options['params'];
 }
 if (options.cancelToken) {
    config['cancelToken'] = options.cancelToken;
 }

 if (navigator.onLine) {
    return axios.request(config);
 } else {
    let response;
    response = {
       status: false,
       message: "Internet Disconnected",
    };
    return response;
 }

}