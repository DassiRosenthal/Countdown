import './Posts.css';
import React, { useEffect, useState } from 'react'
import Post from './Post';
import { io } from 'socket.io-client';

export default function Posts({ setError }) {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('https://inotherwords-api.onrender.com/posts');
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }
        const posts = await response.json();
        setPosts(posts);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [setError]);

  useEffect(() => {
    const socket = io('https://inotherwords-api.onrender.com/');

    socket.on('post', newPost => {
      const newPostsArray = [...posts];
      newPostsArray.push(newPost);
      setPosts(newPostsArray);
    });
    socket.on('comment', comment => {
      const newPostsArray = [...posts];
      newPostsArray.forEach(p => {
        if (p._id === comment.post) {
          p.comments ? p.comments.push(comment) : p.comments = [comment];
        }
      })
      setPosts(newPostsArray);

    });
    // socket.on('like', like => {
    //   const newPostsArray = [...posts];
    //   newPostsArray.forEach(p => {
    //     if (p._id === like.post) {
    //       p.likes = like.count;
    //     }
    //   })
    //   setPosts(newPostsArray);
    // });
    // socket.on('dislike', dislike => {
    //   const newPostsArray = [...posts];
    //   newPostsArray.forEach(p => {
    //     if (p._id === dislike.post) {
    //       p.dislikes = dislike.count;
    //     }
    //   })
    //   setPosts(newPostsArray);
    // });

    return () => {
      socket.disconnect();
    }
  }, [posts]);

  return (
    <div className='route posts'>
      {posts.map(post => <Post key={post._id} post={post} setError={setError} />)}
    </div>
  )
}
