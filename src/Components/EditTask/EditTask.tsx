import React, {useState} from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from '@mui/material';
import { dateFormatReverse } from '../../utils';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

//The EditTask component provides a dialog box for editing task details

interface EditTaskProps {
    handleEditTaskConfirmed: any;
    handleClose: any;
    taskBeingEdited: any;
  }

export default function EditTask ({handleEditTaskConfirmed, handleClose, taskBeingEdited}: EditTaskProps): JSX.Element {

  //state of task values
  const [taskValues, setTaskValues] = useState({
      tbl_PK_Task: taskBeingEdited.tbl_PK_Task,
      tbl_FK_List: taskBeingEdited.tbl_FK_List,
      tbl_TaskName: taskBeingEdited.tbl_TaskName,
      tbl_TaskDescription: taskBeingEdited.tbl_TaskDescription,
      tbl_TaskDeadline: taskBeingEdited.tbl_TaskDeadline
  });

  //state of whether an error in form validation  or fetch request has occurred
  const [error, setError] = useState(false)

  //state of error message presented to the user if an error in form validation or fetch request has occurred 
  const [errorMessage, setErrorMessage] = useState("")

  // PUT request to update task record in tbl_Task
  const editTask = async () => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskValues)
    };
    await fetch(`${process.env.REACT_APP_API_HOST}/api/task/update/${taskBeingEdited.tbl_PK_Task}`, requestOptions)
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
        //If PUT request is unsuccessful log error to console and display error dialog box
        console.error('There was an error!', error);
        setError(true)
        setErrorMessage(`There was an error! ${error}`)
    });    
  }

  const handleSaveEditTask = async () => {
    //check input passes validation before saving updated record
    if (validateInputs()) {
      await editTask()
      handleEditTaskConfirmed()
    }
  };
    
  const validateInputs = () => {

    const datetimeToday = new Date()
    const dateToday = new Date(datetimeToday.setHours(0, 0, 0, 0))

    /* @ts-ignore */  
    const taskDeadline = new Date(dateFormatReverse(taskValues.tbl_TaskDeadline, 'dateonly'))    
    
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
        <DialogTitle sx={{justifySelf: 'center', margin:'auto'}}>Edit Task</DialogTitle>
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
          <Button onClick={handleSaveEditTask} sx={{justifySelf: 'left', margin: 'auto'}}>Save</Button>
          <Button onClick={handleClose} sx={{justifySelf: 'right', margin: 'auto'}}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {error ?
        <ErrorMessage errorMessage={errorMessage} handleCloseErrorMessage={handleCloseErrorMessage}/>
      : ""}   

    </>

  )

}