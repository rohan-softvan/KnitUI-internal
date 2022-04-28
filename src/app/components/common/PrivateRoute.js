import React from "react";
import { Redirect, Route } from "react-router-dom";
import { getCsrfCookie, getUserTypeCookie, removeCookie } from "../../_helpers";

export const PrivateRoute = ({ component: Component, roles, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      let csrf = getCsrfCookie();
      let userType = getUserTypeCookie();

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
      return <Component {...props} />;
    }}
  />
);
