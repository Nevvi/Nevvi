import axios from "axios";

export async function login(username, password) {
    console.log("Logging in!")
    try {
        const response = await axios.post(
            `/authentication/v1/login`,
            {username, password}
        )

        const authentication = response.data.AuthenticationResult
        localStorage.setItem('Authentication', JSON.stringify(authentication))
        setTokenHeaders(authentication.IdToken, authentication.AccessToken)

        return authentication
    } catch (e) {
        throw new Error(`Login failed because ${e.response.data}`)
    }
}

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