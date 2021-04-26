export function login(data) {
    return {
        type: "LOGIN",
        data: data
    }
}

export function logout() {
    return {
        type: "LOGOUT",
        data: {}
    }
}