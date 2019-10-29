import React from 'react';

import styles from '../css/addPost.module.css'

class AddPosts extends React.Component {
    constructor(props) {
        super(props)
        this.publishPost = this.publishPost.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.fileInput = React.createRef();
        this.state = {
            title: '',
            content: '',
            errorMessage: "",
        }
    }

    publishPost(imageId, token) {
        fetch(process.env.REACT_APP_WP_URL + '/wp/wp-json/wp/v2/posts/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token,
            },
            body: JSON.stringify({
                'title': this.state.title,
                'content': this.state.content,
                'status': 'publish',
                'featured_media': imageId
            }),
        }).then((response) => {
            return response.json();
        }).then((data) => {
            this.checkResponse(data)
        });
    }

    uploadImage = () => {
        const token = localStorage.getItem('bearerToken')
        const image = this.fileInput.current.files[0]
        const formData = new FormData()
        formData.append('file', image)
        fetch(process.env.REACT_APP_WP_URL + '/wp/wp-json/wp/v2/media', {
            method: "POST",
            headers: {
                'Content-Disposition': 'attachment; filename=tmp.jpg',
                'Authorization': 'Bearer ' + token,
            },
            body: formData
        }).then((response) => {
            return response.json();
        }).then((data) => {
            this.publishPost(data.id, token)
        });
    }

    checkResponse = (data) => {
        if(!data.code) {
            this.setState({
                errorMessage: ""
            })
            window.location.assign(process.env.REACT_APP_REACT_URL + '/'); 
        } else {
            this.setState({
                errorMessage: "Something went wrong.. Are you logged in?"
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
            if(localStorage.getItem('bearerToken'))
            return (
                <div>
                    <h1>Add a post</h1>
                    <div className={styles.formContainer} >
                        <form method="post">
                            <div className={styles.inputContainer}>
                                <label className={styles.label}>Title</label>
                                <input
                                    className={styles.input} 
                                    name="title"
                                    type="text"
                                    value={this.state.username}
                                    onChange={this.handleInputChange} />
                            </div>
                            <div className={styles.inputContainer}>
                                <label className={styles.label}>Content</label>
                                <textarea
                                    className={styles.textarea} 
                                    name="content"
                                    value={this.state.password}
                                    onChange={this.handleInputChange} />
                            </div>
                            <div className={styles.inputContainer}>
                                <label className={styles.label}>Image</label>
                                <input type="file" onChange={this.onChange} ref={this.fileInput}/>
                                
                            </div>
                        </form>
                        <button className={styles.button} type='Submit' onClick={this.uploadImage}>Publish</button>
                        <p>{this.state.errorMessage}</p>
                    </div>
                </div>
            ) 
        else
            return (
                <div>
                    <h1>Add a post</h1>
                    <div className={styles.container}>
                        <p>Login to add posts.</p>
                    </div>
                </div>
            )

    }
}


export default AddPosts
