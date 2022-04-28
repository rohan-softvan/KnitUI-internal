import React from "react";
import ReactDOM from "react-dom";
import "../src/app/css/common.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import {store} from "./app/redux/store";
import { Provider } from "react-redux";
import Amplify from 'aws-amplify';
import {setupAxiosInterceptor} from "./app/services/UtilService"

import {AWS_REGION,AWS_APP_CLIENT_ID,AWS_USER_POOL_ID,API_URL} from "./config";

setupAxiosInterceptor();
Amplify.configure({
    Auth: {
        mandatorySignIn: true,
        region: AWS_REGION,
        userPoolId: AWS_USER_POOL_ID,
        //identityPoolId: config.cognito.IDENTITY_POOL_ID,
        userPoolWebClientId: AWS_APP_CLIENT_ID
    },
    API: {
        endpoints: [
            {
                name: 'KnitApiCall',
                endpoint: API_URL,
                region: AWS_REGION,
                custom_header: async () => {
                    /* return { Authorization: (await Auth.currentSession()).idToken.jwtToken }*/
                    return { Authorization: 'token' }
                }
            }
        ]
    },
    Storage: {
        //bucket: 'com.purpics.dev', //REQUIRED -  Amazon S3 bucket
        region: 'us-east-1', //OPTIONAL -  Amazon service region
    }
});

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
        <App />
      {/* <App /> */}
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);

serviceWorker.unregister();
