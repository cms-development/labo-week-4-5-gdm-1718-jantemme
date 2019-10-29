import React from 'react';
import { ClipLoader } from 'react-spinners';

import styles from '../css/home.module.css'

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.getPosts = this.getPosts.bind(this)
        this.state = {
            posts: [],
            loading: false
        }
    }

    componentDidMount() {
        this.getPosts()
    }

    rmToken() {
        localStorage.removeItem('bearerToken')
        window.location.reload()
    }

    getPosts = () => {
        this.setState({
            loading: true
        })
        fetch(process.env.REACT_APP_WP_URL + '/wp/wp-json/wp/v2/posts', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            this.setState({
                posts: data,
                loading: false
            })
        });
    }

    render() {
        return (
            <div>
                <h1>Posts</h1>
                <div className={styles.container}>
                        <ClipLoader
                        css={'margin: 0 auto;'}
                        sizeUnit={"px"}
                        size={30}
                        color={'#123abc'}
                        loading={this.state.loading}
                        />
                    {this.state.posts.map(function(post, index){
                        return(
                        <div className={styles.card} key={ index}>
                            { post.fimg_url
                                ? <img  className={styles.cardImage} alt={post.title} src={post.fimg_url}></img>
                                : ""
                            }
                            <h2 className={styles.cardTitle} key={ index + 1}>{post.title.rendered}</h2>
                            <p className={styles.cardContent} key={ index + 2}>{post.content.rendered}</p>
                        </div>
                        )
                    })}
                </div>
                <button onClick={this.rmToken}>Remove bearer token</button>
            </div>
        )
    }
}

export default Home
