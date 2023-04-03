import axios from "axios";

class Auth {
  constructor() {
    let userData = window.localStorage.getItem("user");
    this.token = window.localStorage.getItem("token");
    this.user = userData ? JSON.parse(userData) : null;

    if (this.token) {
      axios.defaults.headers.common["Authorization"] = this.token;
    }
  }

  login(token, user) {
    window.localStorage.setItem("token", token);
    window.localStorage.setItem("user", JSON.stringify(user));
    axios.defaults.headers.common["Authorization"] = token;

    this.token = token;
    this.user = user;
  }

  check() {
    return !!this.token;
  }

  logout() {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    this.user = null;
    this.token = null;
  }
}
export default new Auth();
