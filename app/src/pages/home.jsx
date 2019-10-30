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

    getPosts = () => {
        this.setState({
            loading: true
        })
        console.log(process.env.REACT_APP_WP_URL )
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

    goToPostDetail = (e) => {
        const postId = e.target.id
        localStorage.setItem('postId', postId)
        window.location.assign(process.env.REACT_APP_REACT_URL + '/post/' + postId); 
    }

    render() {
        return (
            <div>
                <h1>Creatures</h1>
                <div className={styles.container}>
                        <ClipLoader
                        css={'margin: 0 auto;'}
                        sizeUnit={"px"}
                        size={30}
                        color={'#123abc'}
                        loading={this.state.loading}
                        />
                    {this.state.posts.map((post, index) => {
                        return(
                        <div className={styles.card} id={post.id} key={ index} onClick={this.goToPostDetail}>
                            { post.fimg_url
                                ? <img  id={post.id} className={styles.cardImage} alt={post.title} src={post.fimg_url}></img>
                                : ""
                            }
                            <h2 id={post.id} className={styles.cardTitle} key={ index + 1}>{post.title.rendered}</h2>
                            <p id={post.id} className={styles.cardContent} key={ index + 2}>{post.content.rendered}</p>
                        </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default Home
