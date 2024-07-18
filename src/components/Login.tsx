import React, {useState} from 'react';
import permit, {LoginMethod} from "@permitio/permit-js";
import {btnStyle} from "./Home";

const Login = () => {
    const [isLogin, setIsLogin] = useState(false);
    const tenantKey = process.env.REACT_APP_TENANT_KEY|| 'default';
    const backendUrl = process.env.REACT_APP_BACKEND_URL|| `http://localhost:8080/login_cookie`

    const login = () => {
        permit.elements
            .login({loginUrl: backendUrl, tenant: tenantKey, loginMethod: LoginMethod.cookie})
            .then((res: any) => {
                console.log("res", res);
                setIsLogin(true)
            })
            .catch((err: any) => {
                console.log("err", err);
                setIsLogin(false)
            });
    }

    return (
        <div>
            <button
                style={btnStyle}
                onClick={() => {
                    login();
                }}
            >
                login
            </button>
            <button
                style={btnStyle}
                onClick={() => {
                    permit.elements.logout()
                }}
            >
                logout
            </button>
            {isLogin && <div>Logged in</div>}
        </div>
    );
}

export default Login;