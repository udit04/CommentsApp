import React, { Component } from 'react';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
    };
  }

  render() {
    const { username, password } = this.state;
    return (
        <div>
            <div style={{ padding: '10px' }}>
            <input
                type="text"
                style={{ width: '200px' }}
                onChange={(e) => this.setState({ username: e.target.value })}
                placeholder="username"
            />
            <input
                type="text"
                style={{ width: '200px' }}
                onChange={(e) => this.setState({ password: e.target.value })}
                placeholder="password"
            />
            <button onClick={() => this.props.userLogin('login',{username:username,password:password})}>
                LOGIN
            </button>
            </div>
        </div>
    );
  }
}

export default Login;