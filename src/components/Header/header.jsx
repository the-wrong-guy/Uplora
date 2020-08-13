import React,{useState,useEffect} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import {Container,Button,Modal,Input,Dialog,DialogTitle,TextField,DialogContent,DialogActions,Avatar} from '@material-ui/core';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Zoom from '@material-ui/core/Zoom';
import styles from './header.module.css'
import {db,auth} from '../../firebase'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import BottomAppBar from '../Footer/footer'

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}


const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  paper: {
    position: 'absolute',
    width: 400,
    padding: theme.spacing(2, 4, 3),
    backgroundColor:"#fff"
  }
}));

function ScrollTop(props) {
  const { children, window } = props;
  const classes = useStyles();
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.root}>
        {children}
      </div>
    </Zoom>
  );
}


export default function BackToTop(props) {
  const classes = useStyles();
  const [user,setUser] = useState(null);
  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [email,setEmail] = useState('');
  const [openSignIn,setOpenSignIn] = useState(false)
  const [open, setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);




 useEffect(() =>  {
   const unsubscribe=auth.onAuthStateChanged((authUser) =>  {
      if (authUser){
        console.log(authUser);
        setUser(authUser);
     }
       else{
        setUser(null);
      }
   })
      return()=> {
        unsubscribe();
      }


  },[user,username]);


    const signUp = (event) =>{
      event.preventDefault();
      auth
      .createUserWithEmailAndPassword(email,password)
      .then((authUser)=>{
       return  authUser.user.updateProfile({
          displayName : username
        })
      })
      .catch(error=>alert(error.message))
  
      setOpen(false)
    }
  
    const signIn = (event) =>{
      event.preventDefault()
  
      auth
      .signInWithEmailAndPassword(email,password)
      .catch(err=>alert(err.message))
  
      setOpenSignIn(false)
    }
  
    const handleClose = () => {
      setOpen(false);
    };


  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar style={{backgroundColor : '#ffffff'}}>
        <Toolbar className={styles.toolbar}>
          <div>
          <Typography className={styles.header} style={{color:"#000000"}} variant="h6">Instagram</Typography>
          </div>
          <div>
            {user ? (<div className={styles.logout}>
              <Avatar><p style={{fontSize:"12px",wordWrap:"break-word",textAlign:"center"}}>{user.displayName}</p></Avatar>
              <Button onClick={()=>auth.signOut()}  startIcon={<ExitToAppIcon/>}>Logout</Button>
              </div>):
            ( 
              <div className="app_loginContainer">
              <Button type="button" onClick={()=>setOpenSignIn(true)}>Sign in</Button>
              <Button type="button" onClick={()=>setOpen(true)}>Sign Up</Button>
              </div>
            )}
          </div>
        </Toolbar>
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <Container>
    <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Sign Up</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="UserName"
            type="email"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Password"
            type="email"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} onClick={signUp} color="primary">
            sign up
          </Button>
        </DialogActions>
      </Dialog>


      <Dialog
       open={openSignIn}
       onClose={()=>setOpenSignIn(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Sign In</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            value={email}
            onChange={(e) =>setEmail(e.target.value)}
          />
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Password"
            type="email"
            fullWidth
            value={password}
            onChange={(e) =>setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button  onClick={signIn} color="primary">
            sign in
          </Button>
        </DialogActions>
      </Dialog>

      </Container>
      <ScrollTop {...props}>
        <Fab color="secondary" className={styles.KeyboardArrowUpIcon} size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
}