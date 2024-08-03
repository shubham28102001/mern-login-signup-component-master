import axios from "axios";
import { returnStatus } from "./statusActions";

import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  AUTH_SUCCESS,
  AUTH_FAIL,
  LOGOUT_SUCCESS,
  IS_LOADING,
  UPDATE_FAIL,
  UPDATE_SUCCESS,
} from "./types";

//Uncomment below for local testing
// axios.defaults.baseURL = "http://localhost:5000";

//uncomment and set url to your own for prod
//axios.defaults.baseURL = "https://demos.shawndsilva.com/sessions-auth-app"

//Check if user is already logged in
export const isAuth = () => (dispatch) => {
  const AccessToken = localStorage.getItem("AccessToken");
  const headers = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `${AccessToken}`,
    },
  };
  axios
    .get(`${process.env.REACT_APP_BACKEND_URL}/api/users/authchecker`, headers)
    .then((res) =>
      dispatch({
        type: AUTH_SUCCESS,
        payload: res.data,
      })
    )
    .catch((err) => {
      dispatch({
        type: AUTH_FAIL,
      });
    });
};

//Register New User
export const register =
  ({ name, email, password }) =>
  (dispatch) => {
    // Headers
    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Request body
    const body = JSON.stringify({ name, email, password });

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/users/register`, body, headers)
      .then((res) => {
        dispatch(returnStatus(res.data, res.status, "REGISTER_SUCCESS"));
        dispatch({ type: IS_LOADING });
      })
      .catch((err) => {
        dispatch(
          returnStatus(err.response.data, err.response.status, "REGISTER_FAIL")
        );
        dispatch({
          type: REGISTER_FAIL,
        });
        dispatch({ type: IS_LOADING });
      });
  };

//Login User
export const login =
  ({ email, password }) =>
  (dispatch) => {
    // Headers
    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Request body
    const body = JSON.stringify({ email, password });

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/users/login`, body, headers)
      .then((res) => {
        console.log(res);
        localStorage.setItem("AccessToken", res?.data?.token);
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data,
        });
        dispatch({ type: IS_LOADING });
      })
      .catch((err) => {
        dispatch(
          returnStatus(err.response.data, err.response.status, "LOGIN_FAIL")
        );
        dispatch({
          type: LOGIN_FAIL,
        });
        dispatch({ type: IS_LOADING });
      });
  };

//Logout User and Destroy session
export const logout = () => (dispatch) => {
  localStorage.removeItem("AccessToken");
  dispatch({
    type: LOGOUT_SUCCESS,
  });
};

//Update User
export const update =
  ({ profile, key, id }) =>
  (dispatch) => {
    const AccessToken = localStorage.getItem("AccessToken");
    // Headers
    const headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${AccessToken}`,
      },
    };

    console.log("===========>", profile, "----------", id);

    // Request body
    const body = JSON.stringify({ profile, key });

    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/users/update/${id}`, body, headers)
      .then((res) => {
        console.log(res);
        dispatch({
          type: UPDATE_SUCCESS,
          payload: res.data,
        });
        dispatch({ type: IS_LOADING });
      })
      .catch((err) => {
        dispatch(
          returnStatus(err.response.data, err.response.status, "UPDATE_FAIL")
        );
        dispatch({
          type: UPDATE_FAIL,
        });
        dispatch({ type: IS_LOADING });
      });
  };
