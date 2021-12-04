import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  typography:{
    fontSize: 18
  },
  title:{
    fontSize: 18
  },
  name: {
    fontWeight: 600,
    color: "black"
  },
  score:{
    color: "red",
    fontSize: 20
  }
}));

const MessageDialog = ({state, userName, score, resetMatchedCards}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    resetMatchedCards()
  }

  useEffect(() => {
    if(state.isGameEnded){
      console.log('game ended')
      setOpen(state.isGameEnded)
    }
  },[state.isGameEnded])
  
    return (
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className={classes.root}
        >
          <DialogContent>
            <DialogContentText className={classes.title}>
                Thank you for playing <br/> 
                <span className={classes.name}>{userName}</span>. 
                <br/> Your score is <strong className={classes.score}> {score} </strong>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
              <Button onClick={handleClose} size="lg">Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
}
export default MessageDialog