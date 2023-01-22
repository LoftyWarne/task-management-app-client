import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';

//The ErrorMessage component provides a dialog box for displaying errors to users

interface ErrorMessageProps {
  errorMessage: string;
  handleCloseErrorMessage: any;
}

export default function ErrorMessage ({errorMessage, handleCloseErrorMessage}: ErrorMessageProps) {

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