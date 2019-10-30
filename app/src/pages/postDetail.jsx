import React from 'react';
import { ClipLoader } from 'react-spinners';

import styles from '../css/postDetail.module.css'

class PostDetail extends React.Component {
    constructor(props) {
        super(props)
        this.getPost = this.getPost.bind(this)
        this.state = {
            post: [],
            loading: false,
            postId: "",
        }
    }

    componentDidMount() {
        this.getPost()
    }

    getPost = () => {
        const postId = localStorage.getItem('postId')
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
                loading: false
            })
        });
    }

    deletePost = () => {
        const postId = localStorage.getItem('postId')
        const token = JSON.parse(localStorage.getItem('userObject')).token

        if(window.confirm("You are about to delete a post. Are you sure? This action is irreversable.")) {
            fetch(process.env.REACT_APP_WP_URL + '/wp/wp-json/wp/v2/posts/' + postId, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + token,
                }
            }).then((response) => {
                return response.json();
            }).then(() => {
                window.history.back(); 
            });
        }
    }

    render() {

        let deleteButton = ""

        if(localStorage.getItem('userObject'))
            deleteButton = <button className={styles.button} onClick={this.deletePost}>Delete post</button>

        if(this.state.post.title)
            return (
                <div>
                    <div className={styles.container}>
                        <ClipLoader
                        css={'margin: 0 auto;'}
                        sizeUnit={"px"}
                        size={30}
                        color={'#000'}
                        loading={this.state.loading}
                        />
                            { this.state.post.fimg_url
                                ? <img alt={this.state.post.title} src={this.state.post.fimg_url}></img>
                                : ""
                            }
                            <div className={styles.contentContainer}>
                                <h1>{this.state.post.title.rendered}</h1>
                                <p className={styles.content}>{this.state.post.content.rendered}</p>
                                {deleteButton}
                            </div>
                    </div>
                </div>
            )
        else 
            return (
                <div>
                    <div className={styles.container}>
                        <ClipLoader
                        css={'margin: 0 auto;'}
                        sizeUnit={"px"}
                        size={30}
                        color={'#123abc'}
                        loading={this.state.loading}
                        />
                    </div>
                </div>
            )
    }
}

export default PostDetail
