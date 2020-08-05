import React from 'react'
import {Paper, Avatar, Typography} from '@material-ui/core'
import styles from './post.module.css'

export default function Post({userName,caption,imageUrl}){
    return(
        <div className={styles.container}>
        <Paper>
            <div className={styles.post_header}>
                <Avatar className={styles.post_avatar} alt="Cindy Baker" src="https://images.pexels.com/photos/2937623/pexels-photo-2937623.jpeg?cs=srgb&dl=pexels-nugroho-wahyu-2937623.jpg&fm=jpg" />
                <Typography className={styles.userName}>{userName}</Typography>
            </div>
            <img className={styles.post_img} src={imageUrl} alt="photo"/>
            <div className={styles.post_footer}>
                <Typography variant="caption"  color="initial" style={{fontWeight:"bold",paddingRight:"5px"}}>{userName}</Typography>
                <Typography variant="caption" color="initial">{caption}</Typography>
            </div>
        </Paper>
        </div>
    );
}