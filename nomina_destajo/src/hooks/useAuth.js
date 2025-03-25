import axios from "axios";
import { appsettings } from "../settings/ApiUrl";

const API_URL =  appsettings.apiUrl + "login/";

class AuthActions {

  _loginVerified = false;
  _callbacks = []

  _isAuthenticated = false
  _user = null
  _nextSubscriptionId = 0

  static get instance() {
    return authActions
  }

  subscribe(callback) {
    this._callbacks.push({callback, subscription: this._nextSubscriptionId++});
    return this._nextSubscriptionId - 1;
  }

  unsubscribe(subscriptionId) {
    const subscriptionIndex = this._callbacks
        .map((element, index) => element.subscription === subscriptionId ? {found: true, index} : {found: false})
        .filter(element => element.found === true);
    if (subscriptionIndex.length !== 1) {
      throw new Error(`Found an invalid number of subscriptions ${subscriptionIndex.length}`);
    }

    this._callbacks.splice(subscriptionIndex[0].index, 1);
  }

  notifySubscribers() {
    for (let i = 0; i < this._callbacks.length; i++) {
      const callback = this._callbacks[i].callback;
      callback();
    }
  }

  checkAuth = async () => {
    return await axios.get(API_URL + "IsLoggedIn").then(response => {
      console.log(response)
      this._isAuthenticated = response.data.isLoggedIn
    }).catch(err => {
      console.log(err)
      this._isAuthenticated = false
    })
  }

  async fetchCurrentUser() {
    await axios.get(API_URL + "CurrentUser").then((response) => {
      console.log(response)
      if (response.data.userData === null) {
        this._isAuthenticated = false
        this._user = null
      } else {
        // console.log(response.data.userData)
        this._user = response.data.userData
      }
    }).catch(() => {
      this._isAuthenticated = false;
      this._user = null;
    });
    this.notifySubscribers()
  }

  async isAuthenticated() {
    await this.ensureUserManagerInitialized()
    return this._isAuthenticated
  }

  async getCurrentUser() {
    await this.ensureUserManagerInitialized()
    // console.log(this._user)
    return this._user
  };

  async getCurrentUserRoles() {
    await this.ensureUserManagerInitialized()
    if (this._user) {
      return this._user.roles;
    }
    return null;
  }

  async getCurrentUserPermissions() {
    await this.ensureUserManagerInitialized()
    if (this._user) {
      return this._user.permissions;
    }
    return null;
  }

  login = async (loginViewModel) => {
    return await axios
        .post(API_URL,
            loginViewModel
        ).then(async (response) => {
          if (response.data.success) {
            this._isAuthenticated = true
            await this.fetchCurrentUser()
          }
          this.notifySubscribers()
          return response.data
        }).catch(err => {
          console.log(err)
          this._isAuthenticated = false
          this.notifySubscribers()
        })
  }

  logout = async () => {
    return await axios.post(API_URL + "logout").then(async (response) => {
      if (response.data.success) {
        this._isAuthenticated = false
        this._user = null
        this.notifySubscribers()
        return {status: 'success', returnUrl: "/login"}
      }
      return false
    }).catch(err => {
      console.log(err)
      this._isAuthenticated = false
      this._user = null
      this.notifySubscribers()
    })
  };

  async ensureUserManagerInitialized() {
    if (this._loginVerified) {
      return;
    }

    await this.fetchCurrentUser();
    await this.checkAuth();

    this._loginVerified = true
  }
}

const authActions = new AuthActions();
export default authActions

//   const AuthActions = {
//   login, logout, getCurrentUser, isAuthenticated
// }

// export default AuthActions
