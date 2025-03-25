import { Component } from 'react'
import { Navigate } from 'react-router-dom'
import authService from './useAuth'

export default class AuthorizeRoute extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ready: false,
      authenticated: false,
      username: null,
    }
  }

  componentDidMount() {
    this._subscription = authService.subscribe(() => this.authenticationChanged())
    this.populateAuthenticationState()
  }

  componentWillUnmount() {
    authService.unsubscribe(this._subscription)
  }

  render() {
    const { ready, authenticated, user } = this.state
    const link = document.createElement('a')
    link.href = this.props.path
    const returnUrl = `${window.location.pathname}${window.location.search}`
    const redirectUrl = `/login?${returnUrl !== '/'?"ReturnUrl"+'='+encodeURIComponent(returnUrl):''}`
    if (!ready) {
      return <div></div>
    } else {
      const { element, allowed, permission } = this.props
      if (allowed) {
        let allowedUser = allowed.find(a => a === user.usuarioId)
        if (!allowedUser) {
          return <Navigate replace to={'/'}/>
        }
      }
      // console.log(user)
      if (permission) {
        let forbidden = false
        switch (permission) {
          case 'isAdmin': {
            if (!user.userPermissions.isAdmin) {
              forbidden = true
            }
            break
          }
          default: {
            break
          }
        }
        if (forbidden)
          return <Navigate replace to={'/'}/>
      }
      return authenticated ? element : <Navigate replace to={redirectUrl}/>
    }
  }

  async populateAuthenticationState() {
    const authenticated = await authService.isAuthenticated()
    const user = await authService.getCurrentUser()
    console.log(authenticated,user)
    this.setState({ ready: true, authenticated, user })
  }

  async authenticationChanged() {
    this.setState({ ready: false, authenticated: false, user: null })
    await this.populateAuthenticationState()
  }
}
