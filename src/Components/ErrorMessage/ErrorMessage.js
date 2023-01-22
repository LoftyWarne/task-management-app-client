import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';

export default function ErrorMessage ({errorMessage, handleCloseErrorMessage}) {

  return (      

    <Dialog open onClose={handleCloseErrorMessage}>
    <DialogTitle>Error</DialogTitle>
    <DialogContent>  
      <DialogContentText>{errorMessage}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseErrorMessage}>Close</Button>
    </DialogActions>
    </Dialog>

  )

}