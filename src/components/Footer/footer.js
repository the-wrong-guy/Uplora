import React,{useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import styles from './footer.module.css'
import cx from 'classnames'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ImageUpload from '../Upload/imageUplaod'
import Slide from '@material-ui/core/Slide';
import {db,auth} from '../../firebase'


const useStyles = makeStyles((theme) => ({
  text: {
    padding: theme.spacing(2, 2, 0),
  },
  paper: {
    paddingBottom: 50,
  },
  list: {
    marginBottom: theme.spacing(2),
  },
  subheader: {
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  grow: {
    flexGrow: 1,
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
    margin: '0 auto',
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function BottomAppBar(props) {

  const classes = useStyles();
  const [username,setUsername] = useState('');
  const [user,setUser] = useState(null);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
 
  

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="fixed" color="inherit" className={classes.appBar}>
        <Toolbar>
          <Fab color="secondary" onClick={handleClickOpen} aria-label="add" className={cx(classes.fabButton,styles.fabButton)}>
            <AddIcon />
          </Fab>
          <div className={classes.grow} />
        </Toolbar>
      </AppBar>


      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <DialogContent>
      <ImageUpload username={props}/>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>


    </React.Fragment>
  );
}
