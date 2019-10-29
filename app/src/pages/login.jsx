import React from 'react';

import styles from '../css/login.module.css'

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.state = {
            username: '',
            password: '',
            errorMessage: "",
        }
    }

    componentDidMount() {
        if(localStorage.getItem('bearerToken')) {
            window.alert("Already logged in.")
            window.history.back(); 
        }
    }

    handleSubmit() {
        fetch(process.env.REACT_APP_WP_URL + '/wp/wp-json/jwt-auth/v1/token', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                'username': this.state.username,
                'password': this.state.password,
            }),
        }).then((response) => {
            return response.json();
        }).then((data) => {
            this.checkResponse(data)
        });
    }

    checkResponse = (data) => {
        if(data.token) {
            localStorage.setItem('bearerToken', data.token)
            this.setState({
                errorMessage: ""
            })
            window.location.assign(process.env.REACT_APP_REACT_URL + '/admin'); 
        } else {
            this.setState({
                errorMessage: "Wrong credentials."
            })
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
          [name]: value
        });
      }

    render() {
        return (
            <div>
                <h2>Login</h2>
                <div className={styles.formContainer} >
                    <form method="post">
                        <div className={styles.inputContainer}>
                            <label className={styles.label}>Username</label>
                            <input
                                className={styles.input} 
                                name="username"
                                type="text"
                                value={this.state.username}
                                onChange={this.handleInputChange} />
                        </div>
                        <div className={styles.inputContainer}>
                            <label className={styles.label}>Password</label>
                            <input
                                className={styles.input} 
                                name="password"
                                type="password"
                                value={this.state.password}
                                onChange={this.handleInputChange} />
                        </div>
                    </form>
                    <button className={styles.button} type='Submit' onClick={this.handleSubmit}>Login</button>
                    <p>{this.state.errorMessage}</p>
                </div>
            </div>
        )
    }
}


export default Login
