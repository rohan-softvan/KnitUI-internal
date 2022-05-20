// export default {
//     apiGateway: {
//         REGION: 'us-east-1',
//         URL: 'https://services.goknit.us/v1/'
//     },
//     cognito: {
//         REGION: 'us-east-1',
//         USER_POOL_ID: 'us-east-1_ISM7nmxX9',
//         APP_CLIENT_ID: '7n1oqrvclhv6n7bp6efk2lbh7s',
//         //IDENTITY_POOL_ID: 'bjpi67m9gvfnm8p8n54a7knd1' bjpi67m9gvfnm8p8n54a7knd1
//     }
// };

const SERVER_ENV = window && window.location && window.location.hostname;

let REGION;
let URL;
let USER_POOL_ID;
let APP_CLIENT_ID;
let SET_ENVIRONMENT;
let DOMAIN_URL;
let REDIRECT_SIGNIN_URL;
// DEV: OR LOCAL
if (SERVER_ENV.includes("localhost") || SERVER_ENV.includes("app.goknit.us") || SERVER_ENV.includes("18.209.1.84") || SERVER_ENV.includes("192.168.0.27")) {

    REGION="us-east-1";
    URL="https://services.goknit.us/v1/";
    USER_POOL_ID="us-east-1_ISM7nmxX9";
    APP_CLIENT_ID="7n1oqrvclhv6n7bp6efk2lbh7s";
    DOMAIN_URL="knitdev.auth.us-east-1.amazoncognito.com";
    REDIRECT_SIGNIN_URL="https://app.goknit.us/redirectURL";
    // REDIRECT_SIGNIN_URL="http://localhost:3000/redirectURL";
    SET_ENVIRONMENT = "dev";
}
// UAT
else if (SERVER_ENV.includes("demo.goknit.com")){

    REGION="us-east-1";
    URL="https://uatservices.goknit.com/v1/";
    USER_POOL_ID="us-east-1_ISM7nmxX9";
    APP_CLIENT_ID="7n1oqrvclhv6n7bp6efk2lbh7s";
    DOMAIN_URL="knitdev.auth.us-east-1.amazoncognito.com";
    REDIRECT_SIGNIN_URL="https://demo.goknit.com/redirectURL";
    // REDIRECT_SIGNIN_URL="http://localhost:3000/redirectURL";
    SET_ENVIRONMENT = "dev";
}
// PROD:
else if (SERVER_ENV.includes("app.goknit.com")) {

    REGION="us-east-1";
    URL="https://services.goknit.com/v1/";
    USER_POOL_ID="us-east-1_5xWJGmm65";
    APP_CLIENT_ID="3jsjcvpje5guq5svgh7jlg7ek3";
    DOMAIN_URL="knitprod.auth.us-east-1.amazoncognito.com";
    REDIRECT_SIGNIN_URL="https://app.goknit.com/redirectURL";
    SET_ENVIRONMENT = "prod";
}


//GoogleSIGNIN For loacalHOst use this DOMAIN_URL and comment above URL
//REDIRECT_SIGNIN_URL= "http://localhost:3000/"


export const AWS_REGION = REGION;
export const API_URL = URL;
export const AWS_USER_POOL_ID = USER_POOL_ID;
export const AWS_APP_CLIENT_ID = APP_CLIENT_ID;
export const ENVIRONMENT = SET_ENVIRONMENT;
export const COGNITO_DOMAIN_URL = DOMAIN_URL;
export const GOOGLE_REDIRECT_SIGNIN_URL = REDIRECT_SIGNIN_URL;
// PROD:
// exportdefault{​​​​​​​
// ​apiGateway: {​​​​​​​
//     ​REGION: 'us-east-1',
//             URL: 'https://services.goknit.com/v1/'
//     }​​​​​​​​,
//     cognito: {​​​​​​​
//     ​REGION: 'us-east-1',
//             USER_POOL_ID: 'us-east-1_5xWJGmm65',
//             APP_CLIENT_ID: '19kptdn9psd5f1nk11ts7nom3'
//     }​​​​​​​​
// }​​​​​​​​;
//
//
// DEV:
//     exportdefault{​​​​​​​
// ​apiGateway: {​​​​​​​
//     ​REGION: 'us-east-1',
//             URL: 'https://services.goknit.us/v1/'
//     }​​​​​​​​,
//     cognito: {​​​​​​​
//     ​REGION: 'us-east-1',
//             USER_POOL_ID: 'us-east-1_ISM7nmxX9',
//             APP_CLIENT_ID: 'bjpi67m9gvfnm8p8n54a7knd1'
//     }​​​​​​​​
// }​​​​​​​​;
