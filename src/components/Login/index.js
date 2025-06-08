import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
    showError: false,
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showError: true, errorMsg})
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch('https://apis.ccbp.in/login', options)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, errorMsg, showError} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <form className="login-form" onSubmit={this.onSubmitForm}>
          <h1 className="login-heading">Login</h1>
          <label htmlFor="name">USERNAME</label>
          <input
            type="text"
            className="login-input"
            value={username}
            onChange={this.onChangeUsername}
            placeholder="Username"
            id="name"
          />
          <label htmlFor="password">PASSWORD</label>
          <input
            type="password"
            className="login-input"
            value={password}
            onChange={this.onChangePassword}
            placeholder="Password"
            id="password"
          />
          <button type="submit" className="login-button" role="button">
            Login
          </button>
          {showError && <p className="error-message">{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
