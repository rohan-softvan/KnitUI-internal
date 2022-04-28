import React, { Component, Fragment, lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import SignIn from "./app/views/Auth/SignIn"
import SignUp from "./app/views/Auth/SignUp"
import SignUpWithTeam from "./app/views/Auth/SignUpWithTeam"
import ForgotPassword from "./app/views/Auth/ForgotPassword"
import ResetPassword from "./app/views/Auth/ResetPassword"
import userAlreadyConfirmed from "./app/views/blankPages/UserAlreadyConfirmed"
import RedirectURL from "./app/views/Auth/RedirectURL";
import Error404 from "./app/views/Auth/Error404"
import InvaldiLink from "./app/views/Auth/ErrorInvalidLink"
import LinkExpire from "./app/views/Auth/ErrorVerificationLinkExpire"
import LinkUsed from "./app/views/Auth/ErrorVerificationLinkUsed"
import ResetLinkExpire from "./app/views/Auth/ErrorResetLinkExpire"
import ResetLinkUsed from "./app/views/Auth/ErrorResetLinkUsed"
import { roleEnum } from "./app/enums";
import {getCsrfCookie, getUserTypeCookie} from "./app/_helpers";
const knitRoute = lazy(() =>
  import("./app/views/knitPages/KnitRoute")
);

let userID;
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { inputValue: "Lable" };
  }

  render() { 
    let userType = getUserTypeCookie();
    return (
      <div style={{ flex: 1 }}>
        <Fragment>
          <Suspense fallback={<></>}>
            <Switch>

              <Route
                exact
                path="/"
                render={() => {
                  return userType ? (
                  userType === roleEnum.KNIT ? (
                      <Redirect to={"/knit/projects"}  />
                    ) : (
                          <Redirect to={"/login"} />
                        )
                  ) : (
                      <Redirect to={"/login"} />
                    );
                }}
              />
              <AuthenticatedRoute userType={userType} path="/knit" component={knitRoute} />
              {/*<Route path="/signUp" component={signUp}/>*/}
              <Route path={"/login"} component={SignIn}  />
              <Route path={"/signUp"} component={SignUp}  />
              <Route path={"/forgotPassword"} component={ForgotPassword}  />
              <Route path={"/resetPassword"} component={ResetPassword}  />
              <Route path={"/signUpWithTeam"} component={SignUpWithTeam}  />
              <Route path={"/error404"} component={Error404} />
              <Route path={"/errorInvalidLink"} component={InvaldiLink}/>
              <Route path={"/errorInvalidLinkExpire"} component={LinkExpire}/>
              <Route path={"/errorInvalidLinkUsed"} component={LinkUsed}/>
                
              <Route path={"/errorResetPasswordLinkExpire"} component={ResetLinkExpire}/>
              <Route path={"/errorResetPasswordLinkUsed"} component={ResetLinkUsed}/>

              <Route path={"/redirectURL"} component={RedirectURL}/>

              <Route path="/userUnauthorised" component={userAlreadyConfirmed}/>
              <Route path="/invalidPage" component={Error404}/>
              <Route path="/verificationLinkExpired" component={LinkExpire}/>
            </Switch>
          </Suspense>
        </Fragment>
      </div>
    );
  }
}

export const AuthenticatedRoute = ({ component: Component, userType, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
          // let csrf = getCsrfCookie();
          // let userType = getUserTypeCookie();

          // if (!csrf || !userType) {
          //   // not logged in so redirect to login page with the return url
          //   removeCookie();
          //   console.log("in the privateRoutes==>",props.loc)
          //   return (
          //     <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          //   );
          // }

          // check if route is restricted by role
          // if (roles && roles.indexOf(userType) === -1) {
          //   // role not authorised so redirect to home page
          //   removeCookie();
          //   return <Redirect to={{ pathname: "/" }} />;
          // }

          // authorised so return component

          if(userType === roleEnum.KNIT) {
            return <Component {...props} />;
          }

          return <Redirect to={"/"}/>
        }}
    />
);


export default App;
