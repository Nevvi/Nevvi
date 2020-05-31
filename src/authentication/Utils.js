import axios from "axios";

export async function login(username, password) {
    console.log("Logging in!")
    try {
        const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/authentication/v1/login`,
            {username, password}
        )

        return response.data.AuthenticationResult
    } catch (e) {
        throw new Error(`Login failed because ${e.response.data}`)
    }
}