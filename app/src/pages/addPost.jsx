import React from 'react';
import { ClipLoader } from 'react-spinners';

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
            loading: false,
            post: [],
            postId: "",
        }
    }

    componentDidMount() {
        if(!(window.location.href.indexOf("edit") > -1)) {
            localStorage.removeItem('postId')
            this.setState({
                title: "",
                content: "",
                post: []
            })
        }
        this.getPost()
    }
    

    getPost = () => {
        const postId = localStorage.getItem('postId')
        if(postId) {
            this.setState({
                loading: true
            })
            fetch(process.env.REACT_APP_WP_URL + '/wp/wp-json/wp/v2/posts/' + postId, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }
            }).then((response) => {
                return response.json();
            }).then((data) => {
                this.setState({
                    post: data,
                    title: data.title.rendered,
                    content: data.content.rendered,
                    loading: false
                })
            });
        }
    }

    publishPost(imageId, token) {
        let url = process.env.REACT_APP_WP_URL + '/wp/wp-json/wp/v2/posts/'
        if(window.location.href.indexOf("edit") > -1)
            url = process.env.REACT_APP_WP_URL + '/wp/wp-json/wp/v2/posts/' + this.state.post.id
        fetch(url, {
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
            this.setState({
                loading: false
            })
            this.checkResponse(data)
        });
    }

    uploadImage = () => {
        const token = JSON.parse(localStorage.getItem('userObject')).token
        const image = this.fileInput.current.files[0]
        const formData = new FormData()

        this.setState({
            loading: true
        })

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
            window.history.back();  
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
        let heading = <h1>Add a post</h1>
        if(window.location.href.indexOf("edit") > -1)
            heading = <h1>Edit This Post</h1>
        
        if(localStorage.getItem('userObject'))
        return (
            <div>
                {heading}
                <div className={styles.formContainer} >
                    <form method="post">
                        <div className={styles.inputContainer}>
                            <label className={styles.label}>Title</label>
                            <input
                                className={styles.input} 
                                name="title"
                                type="text"
                                value={this.state.title}
                                onChange={this.handleInputChange} />
                        </div>
                        <div className={styles.inputContainer}>
                            <label className={styles.label}>Content</label>
                            <textarea
                                className={styles.textarea} 
                                name="content"
                                value={this.state.content}
                                onChange={this.handleInputChange} />
                        </div>
                        <div className={styles.inputContainer}>
                            <label className={styles.label}>Image</label>
                            <input type="file" ref={this.fileInput}/>
                            
                        </div>
                    </form>
                    <ClipLoader
                    css={'margin: 0 auto;'}
                    sizeUnit={"px"}
                    size={30}
                    color={'#123abc'}
                    loading={this.state.loading}
                    />
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
