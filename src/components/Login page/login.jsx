import React from 'react'
import {Typography} from '@material-ui/core'
import './login.css'

export default function Login(){
    return(
        <div className="main-container">
            <div className="general-container">
            <div className="shadow"></div>
            <div className="dragon1-container">
                <div className="tail-spikes">
                <div className="base"></div>
                </div>
                <div className="horns"></div>
                <div className="body">
                <div className="belly"></div>
                <div className="spots"></div>
                <div className="eye-R"></div>
                <div className="eye-L"></div>
                <div className="mouth"></div>
                </div>
            </div>
            </div>
            <p className="header">Sorry! You need to login to upload</p>
        </div>
    );
}