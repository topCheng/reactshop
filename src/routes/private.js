import React from 'react';
import {Route, Redirect} from 'react-router-dom';

//console.log(window.base.config)
export function AuthRoute({component: Component, ...rest}) {
    return (
        <Route {...rest} render={props =>
            Boolean(localStorage['isLogin']) ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: window.base.config.path + "login/index",
                        state: {from: props.location}
                    }}
                />
            )
        }
        />
    );
}