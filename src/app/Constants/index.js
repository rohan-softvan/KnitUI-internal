// export const BASE_URL = 'https://nfaov78lk3.execute-api.us-east-1.amazonaws.com/dev';
// export const REDIRECT_URL = 'http://ec2-3-210-214-73.compute-1.amazonaws.com:3001';


const SERVER_ENV = window && window.location && window.location.hostname;

let SET_BASE_URL;
let SET_S3_UPLOAD;
let SET_REDIRECT_URL;
let SET_ADMIN_REDIRECT_URL;
let SET_ENVIRONMENT;
let SET_CLOUDFRONT_URL;
let API_GOKNIT;
let ONE_SIGNAL_APPID;
if (SERVER_ENV.includes("localhost") || SERVER_ENV.includes("app.goknit.us") || SERVER_ENV.includes("84") || SERVER_ENV.includes("192.168.0.27")
) {

  SET_BASE_URL = "https://services.goknit.us/v1/";
  API_GOKNIT="https://api.goknit.us/api/v1/dev/";
  SET_S3_UPLOAD = "https://s3.amazonaws.com/com.knit.dev/public";
  SET_REDIRECT_URL = "https://services.goknit.us/v1/";
  SET_CLOUDFRONT_URL= "https://d3mer4pbzhq4ts.cloudfront.net/";
  SET_ADMIN_REDIRECT_URL = "http://admin.picauso.com/index.html?csrf=";
  SET_ENVIRONMENT = "dev";
  ONE_SIGNAL_APPID = "c74eac16-1a0a-4721-9387-8f3d5d29316b"

}else if (SERVER_ENV.includes("demo.goknit.com")) {

  SET_BASE_URL = "https://uatservices.goknit.com/v1/";
  API_GOKNIT="https://uatapi.goknit.com/api/v1/dev/";
  SET_S3_UPLOAD = "https://s3.amazonaws.com/com.knit.dev/public";
  SET_REDIRECT_URL = "https://uatservices.goknit.us/v1/";
  SET_CLOUDFRONT_URL= "https://d3mer4pbzhq4ts.cloudfront.net/";
  SET_ADMIN_REDIRECT_URL = "http://admin.picauso.com/index.html?csrf=";
  SET_ENVIRONMENT = "dev";
  ONE_SIGNAL_APPID = "c74eac16-1a0a-4721-9387-8f3d5d29316b"
}
else if (SERVER_ENV.includes("app.goknit.com")) {

  SET_BASE_URL = "https://services.goknit.com/v1/";
  API_GOKNIT="https://api.goknit.com/api/v1/prod/";
  SET_S3_UPLOAD = "https://s3.amazonaws.com/com.knit.prod/public";
  SET_REDIRECT_URL = "https://services.goknit.com/v1/";
  SET_CLOUDFRONT_URL= "https://d2kltgp8v5sml0.cloudfront.net/";
  SET_ADMIN_REDIRECT_URL = "https://admin.purpics.com/index.html?csrf=";
  SET_ENVIRONMENT = "prod";
  ONE_SIGNAL_APPID = "4928f066-86e8-4c0c-abfd-d871fa4c0104"
}

export const BASE_URL = SET_BASE_URL;
export const API_GOKNIT_URL=API_GOKNIT;
export const S3_UPLOAD = SET_S3_UPLOAD;
export const REDIRECT_URL = SET_REDIRECT_URL;
export const ADMIN_REDIRECT_URL = SET_ADMIN_REDIRECT_URL;
export const ENVIRONMENT = SET_ENVIRONMENT;
export const CLOUDFRONT_URL = SET_CLOUDFRONT_URL;
export const textFieldPadding = { padding: 8 };
export const textAreaPadding = { padding: 10 };
export const ONE_SIGNAL_APP_ID = ONE_SIGNAL_APPID
