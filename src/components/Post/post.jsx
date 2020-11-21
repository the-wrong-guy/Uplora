import React,{useState,useEffect} from 'react'
import {Paper, Avatar, Typography,Button,IconButton,Menu,MenuItem} from '@material-ui/core'
import {db} from '../../firebase'
import styles from './post.module.css'
import firebase from 'firebase'
import MoreVertIcon from '@material-ui/icons/MoreVert';

export default function Post({postId,username,user,caption,imageUrl}){
  
    const [comments,setcomments] = useState ([]);
    const [comment,setComment] = useState('')
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
    
    useEffect(() =>    {
        let unsubscribe
         if (postId){
            unsubscribe=db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp','desc')
            .onSnapshot((snapshot)  => {
                setcomments(snapshot.docs.map((doc) => doc.data()));
            });
        }

        return()  => {
            unsubscribe();
        }  ;  
    }, [postId]);

    const postComment = (event)=>{

        event.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            text : comment,
            username : user.displayName,
            timestamp : firebase.firestore.FieldValue.serverTimestamp()
        });

        setComment('')

    }

    return(
        <div className={styles.container}>
        <Paper elevation={15} className={styles.paper}>
            <div className={styles.post_header}>
                <div className={styles.post_header_profile}>
                    <Avatar className={styles.post_avatar} alt="Cindy Baker" src="https://images.pexels.com/photos/2937623/pexels-photo-2937623.jpeg?cs=srgb&dl=pexels-nugroho-wahyu-2937623.jpg&fm=jpg" />
                    <Typography className={styles.username}>{username}</Typography>
                </div>
                <div>
                    <IconButton aria-label="options">
                        <MoreVertIcon  onClick={handleClick}/>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={handleClose}>Edit</MenuItem>
                            <MenuItem onClick={handleClose}>Delete</MenuItem>
                            <MenuItem onClick={handleClose}>Share</MenuItem>
                        </Menu>
                    </IconButton>
                    
                </div>    
            </div>
            <img className={styles.post_img} src={imageUrl} alt="photo"/>
            <div className={styles.post_footer}>
                <Typography variant="caption"  color="initial" style={{fontWeight:"bold",paddingRight:"5px"}}>{username}</Typography>
                <Typography variant="caption" color="initial">{caption}</Typography>
            </div>

            <div >
                {comments.map((comment)=>(
                    <div className={styles.users_comments}>
                    <Typography variant="caption"  color="initial" style={{fontWeight:"bold",paddingRight:"5px"}}>{comment.username}</Typography>
                    <Typography variant="caption" className={styles.posted_comments} color="initial">{comment.text}</Typography>
                    </div>
                ))}            
            </div>
         

            <div className={styles.comment_box}>
                <textarea
                    className={styles.comment_box_input}
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e)=>setComment(e.target.value)} 
                />
                <Button
                className={styles.comment_box_button}
                disabled={!comment}
                type="submit"
                onClick={postComment}
                >post</Button>
            </div>
            
        </Paper>
        </div>
    );
}