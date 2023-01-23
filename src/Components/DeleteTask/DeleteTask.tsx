import React, {useState} from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

//The Delete component provides a dialog box for confirming task deletion

interface DeleteListProps {
  selectedRows: any;
  handleDeleteTaskConfirmed: any;
  handleClose: any;
}

export default function DeleteTask ({selectedRows, handleDeleteTaskConfirmed, handleClose}: DeleteListProps): JSX.Element {

  //state of whether an error in fetch request has occurred
  const [error, setError] = useState(false)

  //state of error message presented to the user if an error in fetch request has occurred 
  const [errorMessage, setErrorMessage] = useState("")

  //DELETE request to delete record in tbl_Task
  const deleteTask = async (pkTask: number) => {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    };
    await fetch(`${process.env.REACT_APP_API_HOST}/api/task/delete/${pkTask}`, requestOptions)
      .then(async response => {
        const data = await response.json()   
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }           
    })      
    .catch(error => {
      //If DELETE request is unsuccessful log error to console and display error dialog box
      console.error('There was an error!', error);
      setError(true)
      setErrorMessage(`There was an error! ${error}`)
    });     
  }

  const handleDeleteTask = async() => {

    for (const tbl_PK_Task of selectedRows) {
      await deleteTask(tbl_PK_Task)
    }

    handleDeleteTaskConfirmed()
        
  };

  //hide error message and reset error status
  const handleCloseErrorMessage = () => {
    setError(false)
    setErrorMessage("")
  }

  return (       

      <>
        
        <Dialog open onClose={handleClose}>
            <DialogTitle sx={{justifySelf: 'center', margin:'auto'}}>Delete Confirmation</DialogTitle>
            <DialogContent>  
              <DialogContentText>Are you sure you want to delete {selectedRows.tbl_ListName}?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteTask} sx={{justifySelf: 'left', margin: 'auto'}}>Yes</Button>
              <Button onClick={handleClose} sx={{justifySelf: 'right', margin: 'auto'}}>Cancel</Button>
            </DialogActions>
        </Dialog>
    
      {error ?
        <ErrorMessage errorMessage={errorMessage} handleCloseErrorMessage={handleCloseErrorMessage}/>
      : ""}      
    
    </>

  )

}