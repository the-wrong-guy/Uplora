import React,{useState,useEffect, useDebugValue} from 'react';
import './App.css';
import Header from './components/Header/header'
import Post from './components/Post/post'
import {db} from './firebase'
function App() {

 const [posts,setPosts] = useState([])

useEffect(()=>{
  db.collection('posts').onSnapshot(snapShot=>{
     setPosts(snapShot.docs.map(doc=>doc.data()))
  })
},[])


  return (
    <div className="App"> 
      <Header/>
      {
        posts.map(post=>(
          <Post userName={post.userName} caption={post.caption} imageUrl={post.imageUrl} />
        ))
      }
    </div>
  );
}

export default App;
