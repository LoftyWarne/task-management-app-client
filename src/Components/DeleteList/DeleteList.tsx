import React, {useState} from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

//The Delete component provides a dialog box for confirming list deletion

interface DeleteListProps {
  selectedList: any;
  handleDeleteListConfirmed: any;
  handleClose: any;
}

export default function DeleteList ({selectedList, handleDeleteListConfirmed, handleClose}: DeleteListProps): JSX.Element {

  //state of whether an error in fetch request has occurred
  const [error, setError] = useState(false)

  //state of error message presented to the user if an error in fetch request has occurred 
  const [errorMessage, setErrorMessage] = useState("")

  //DELETE request to delete all records in list from tbl_Task
  const deleteAllTasks = async () => {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    };
    await fetch(`${process.env.REACT_APP_API_HOST}/api/task/deleteall/${selectedList.tbl_PK_List}`, requestOptions)
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
      //If DELETE request is unsuccessful log error to console
      console.error('There was an error!', error);
    });     
  }

  //DELETE request to delete record in tbl_List
  const deleteList = async () => {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    };
    await fetch(`${process.env.REACT_APP_API_HOST}/api/list/delete/${selectedList.tbl_PK_List}`, requestOptions)
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
      //If DELETE request is unsuccessful log error to console
      console.error('There was an error!', error);
    });     
  }

  const handleDeleteList = async () => {
    //delete all tasks in list before deleting list, otherwise unable to delete list due to foreign key constraint
    await deleteAllTasks()
    await deleteList()
    handleDeleteListConfirmed()
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
              <DialogContentText>Are you sure you want to delete {selectedList.tbl_ListName}?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteList} sx={{justifySelf: 'left', margin: 'auto'}}>Yes</Button>
              <Button onClick={handleClose} sx={{justifySelf: 'right', margin: 'auto'}}>Cancel</Button>
            </DialogActions>
        </Dialog>
    
      {error ?
        <ErrorMessage errorMessage={errorMessage} handleCloseErrorMessage={handleCloseErrorMessage}/>
      : ""}      
    
    </>

  )

}