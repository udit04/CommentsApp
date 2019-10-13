import React, { Component } from 'react';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      password: null,
      email: null
    };
  }

  render() {
    const { username, password, email } = this.state;
    return (
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
            <input
                type="text"
                style={{ width: '200px' }}
                onChange={(e) => this.setState({ email: e.target.value })}
                placeholder="email"
            />
            <button onClick={() => this.props.userLogin('signup',{username:username,password:password,email:email})}>
                SIGNUP
            </button>
        </div>
    );
  }
}

export default Register;