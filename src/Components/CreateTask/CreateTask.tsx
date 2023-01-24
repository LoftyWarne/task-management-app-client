import React, {useEffect, useState} from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from '@mui/material';
import { dateFormatReverse } from '../../utils';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

//The CreateTask component provides a dialog box for creating new tasks

interface CreateTaskProps {
    selectedList: number;
    handleSaveCreateTask: any;
    handleClose: any;
  }

export default function CreateTask ({handleSaveCreateTask, handleClose, selectedList}: CreateTaskProps): JSX.Element {

  //state of new task values
  const [taskValues, setTaskValues] = useState({
      tbl_FK_List: selectedList,
      tbl_TaskName: "",
      tbl_TaskDescription: "",
      tbl_TaskDeadline: ""
  });

  //state of whether an error in form validation  or fetch request has occurred
  const [error, setError] = useState(false)

  //state of error message presented to the user if an error in form validation or fetch request has occurred 
  const [errorMessage, setErrorMessage] = useState("")

  // POST request to insert new task into tbl_Task
  const createTask = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskValues)
    };
    await fetch(`${process.env.REACT_APP_API_HOST}/api/task/add`, requestOptions)
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

  const handleSaveTask = async () => {
    //check input passes validation before saving updated record
    if (validateInputs()) {
      await createTask()
      handleSaveCreateTask()
    }
  };
    
  const validateInputs = () => {

    const datetimeToday = new Date()
    const dateToday = new Date(datetimeToday.setHours(0, 0, 0, 0))
    const taskDeadline = new Date(taskValues.tbl_TaskDeadline) 
    
    if(taskValues.tbl_TaskName.trim().length === 0) /*check task name text input is not empty*/ {
        setError(true)
        setErrorMessage("Task Name must not be empty, please enter.")
        return false
    } else if (taskValues.tbl_TaskDeadline.trim().length === 0) /*check task deadline input is not empty*/  {
        setError(true)
        setErrorMessage("Task Deadline is a required field, please enter or select from the date picker.")
        return false
    } else if (dateToday > taskDeadline) /*check task deadline is not before today's date*/  {
        setError(true)
        setErrorMessage("Task Deadline cannot be earlier than today's date.")
        return false
    } else {
        return true
    }
  
  }

  const handleTaskInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      //const name = e.target.name 
      //const value = e.target.value 
      const { name, value } = e.target;
    
      setTaskValues({
        ...taskValues,
        [name]: value,
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
        <DialogTitle sx={{justifySelf: 'center', margin:'auto'}}>Add Task</DialogTitle>
        <DialogContent sx={{marginTop: "20px"}}>
            <DialogContentText style={{color:'black', fontWeight: '500'}}>
              Task Name:
            </DialogContentText>
            <DialogContentText>
              <TextField
                margin="dense"
                id="tbl_TaskName"
                name="tbl_TaskName"
                type="text" 
                placeholder='Enter Task Name' 
                title='Enter Task Name'                 
                variant="outlined"
                value={taskValues.tbl_TaskName}
                onChange={handleTaskInputChange}  
              />
            </DialogContentText>
            <DialogContentText style={{color:'black', fontWeight: '500', marginTop: "20px"}}>
              Task Description:
            </DialogContentText>
            <DialogContentText>
              <TextField
                margin="dense"
                id="tbl_TaskDescription"
                name="tbl_TaskDescription"
                type="text" 
                placeholder='Enter Task Description' 
                title='Enter Task Description'                 
                variant="outlined"
                multiline
                fullWidth
                minRows={5}
                value={taskValues.tbl_TaskDescription}
                onChange={handleTaskInputChange}  
              />
            </DialogContentText>
            <DialogContentText style={{color:'black', fontWeight: '500', marginTop: "20px"}}>
              Task Deadline:
            </DialogContentText>
            <DialogContentText>
              <TextField
                margin="dense"
                id="tbl_TaskDeadline"
                name="tbl_TaskDeadline"
                type="date"
                title='Enter Task Description'                 
                variant="outlined"
                value={taskValues.tbl_TaskDeadline}
                onChange={handleTaskInputChange}  
              />
            </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveTask} sx={{justifySelf: 'left', margin: 'auto'}}>Save</Button>
          <Button onClick={handleClose} sx={{justifySelf: 'right', margin: 'auto'}}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {error ?
        <ErrorMessage errorMessage={errorMessage} handleCloseErrorMessage={handleCloseErrorMessage}/>
      : ""}   

    </>

  )

}