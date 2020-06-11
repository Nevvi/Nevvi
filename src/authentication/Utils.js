import axios from "axios";

export function setTokenHeaders(idToken, accessToken) {
    axios.defaults.headers.common = {
        "Authorization": idToken,
        "AccessToken": accessToken
    };
}

export function clearTokenHeaders() {
    delete axios.defaults.headers.common['Authorization']
    delete axios.defaults.headers.common['AccessToken']
}