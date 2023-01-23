import React, {useState} from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

//The CreateList component provides a dialog box for creating new lists

interface CreateListProps {
  handleSaveCreateList: any;
  handleClose: any;
}

export default function CreateList ({handleSaveCreateList, handleClose}: CreateListProps): JSX.Element {

  //state of tbl_ListName and tbl_PK_ListName
  const [updatedListValues, setUpdatedListValues] = useState({tbl_PK_List: 0, tbl_ListName: ""});

  //state of whether an error in form validation  or fetch request has occurred
  const [error, setError] = useState(false)

  //state of error message presented to the user if an error in form validation or fetch request has occurred 
  const [errorMessage, setErrorMessage] = useState("")

  //POST request to insert record in tbl_List
  const createList = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedListValues)
    };
    await fetch(`${process.env.REACT_APP_API_HOST}/api/list/add`, requestOptions)
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
      //If POST request is unsuccessful log error to console and display error dialog box
      console.error('There was an error!', error);
    });     
  }   

  const handleSaveListName = async () => {
    //check input passes validation before saving updated record
    if (validateInputs()) {
      await createList()
      handleSaveCreateList()
    }
  };

  const validateInputs = () => {
  
    //check list name text input is not empty
    if(updatedListValues.tbl_ListName.trim().length === 0) {
        setError(true)
        setErrorMessage("List Name must not be empty, please enter.")
        return false
    } else {
        return true
    }
  
  }

  //update listname in updatedListValues object
  const handleUpdatedListName = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { value } = e.target;
  
    setUpdatedListValues({
      ...updatedListValues,
      tbl_ListName: value
    });

  };
  
  //hide error message and reset error status
  const handleCloseErrorMessage = () => {
    setError(false)
    setErrorMessage("")
  }

  return (       

      <>
        
        <Dialog open onClose={handleClose}>
          <DialogTitle sx={{justifySelf: 'center', margin:'auto'}}>New List</DialogTitle>
          <DialogContent>  
            <TextField 
              placeholder='Enter New List Name' 
              sx={{justifyContent:'center'}}
              type='text'
              value={updatedListValues.tbl_ListName}
              onChange={handleUpdatedListName}>  
              </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSaveListName} sx={{justifySelf: 'left', margin: 'auto'}}>Save</Button>
            <Button onClick={handleClose} sx={{justifySelf: 'right', margin: 'auto'}}>Cancel</Button>
          </DialogActions>
        </Dialog>
    
      {error ?
        <ErrorMessage errorMessage={errorMessage} handleCloseErrorMessage={handleCloseErrorMessage}/>
      : ""}      
    
    </>

  )

}