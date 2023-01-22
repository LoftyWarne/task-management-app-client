import React, {useEffect, useState} from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from '@mui/material';
import { DropdownList } from 'react-widgets';
import "react-widgets/styles.css";
import './App.css';
import LoadingSpinner from './Components/LoadingSpinner/LoadingSpinner'
import MoveTask from './Components/MoveTask/MoveTask'
import CreateList from './Components/CreateList/CreateList';
import EditList from './Components/EditList/EditList';
import DeleteList from './Components/DeleteList/DeleteList';
import TaskTable from './Components/TaskTable/TaskTable'

function App() {

  const [initialRender, setinitialRender] = useState(true);

  const [listCbxData, setListCbxData] = useState([]);  

  const [selectedList, setSelectedList] = useState({});  

  const [isListSelected, setIsListSelected] = useState(false);  

  const [isTaskSelected, setIsTaskSelected] = useState(false);

  const [showTasks, setShowTasks] = useState(false);

  const [showTaskAdd, setShowTaskAdd] = useState(false);

  const [taskValues, setTaskValues] = useState({});

  const [showCreateList, setShowCreateList] = useState(false);

  const [showDeleteList, setShowDeleteList] = useState(false);

  const [showEditList, setShowEditList] = useState(false);

  const [showMoveTask, setShowMoveTask] = useState(false);

  const [showDeleteTask, setShowDeleteTask] = useState(false)

  const [tableData, setTableData] = useState([]);  

  const [isLoading, setIsLoading] = useState(false);

  const [checkboxShowComplete, setCheckboxShowComplete]  = useState(false);

  const [selectedRows, setSelectedRows] = useState({});

  const [isRowSelected, setIsRowSelected] = useState(false);

  const showCompleteCheckboxSelectionChange = (event) => {
    setinitialRender(false)
    setCheckboxShowComplete(event.target.checked)
    setSelectedRows(null)
    setIsRowSelected(false)
  } 

  useEffect(() => {
    fetchLists();
  }, []);

  useEffect(() => {
    if (!initialRender) {
      fetchListTasks();
      //setShowTasks(true)
    }
  }, [selectedList]);

  const fetchLists = async () => {
    try {
      const resp = await fetch(`${process.env.REACT_APP_API_HOST}/api/list`)
      const json = await resp.json();
      setListCbxData(json)
      console.log(json)
    } catch (error) {
      console.error('There was an error!', error);
    }
  }

  const createTask = async () => {
    setIsLoading(true)
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
        fetchLists()
        setIsLoading(false)              
    })      
    .catch(error => {
      console.error('There was an error!', error);
    });     
  }

  const fetchAllTasks = async () => {
    try {  
      setIsLoading(true)
      const resp = await fetch(`${process.env.REACT_APP_API_HOST}/api/task`)    
      const json = await resp.json();
      setTableData(json)
      setIsLoading(false)
    } catch (error) {
      console.error('There was an error!', error);
    }
  }

  const fetchListTasks = async () => {
    try {  
      setIsLoading(true)
      const resp = await fetch(`${process.env.REACT_APP_API_HOST}/api/task/${selectedList.tbl_PK_List}`)    
      const json = await resp.json();
      setTableData(json)
      setIsLoading(false)
    } catch (error) {
      console.error('There was an error!', error);
    }
  }

  const handleSaveCreateList = () => {
    setShowCreateList(false)
  }

  const handleDeleteListConfirmed = () => {
    setShowDeleteList(false)
    setShowTasks(false)
  }

  const handleClose = () => {
    if (showEditList) {
      setShowEditList(false)
    }     
    if (showCreateList) {
      setShowCreateList(false)
    }
    if (showDeleteList) {
      setShowDeleteList(false)
    }
    if (showTaskAdd) {
      setShowTaskAdd(false)
    }         
  }

  const handleSaveEditListName = () => {
    setShowEditList(false)
    fetchLists()
  }  

  const handleAddTaskClick = () => {
    setShowTaskAdd(true)
  }

  const handleSaveAddTaskClick = () => {
    createTask()
    setShowTaskAdd(false)
  }

  

  const handleTaskInputChange = (e) => {
    //const name = e.target.name 
    //const value = e.target.value 
    const { name, value } = e.target;
  
    setTaskValues({
      ...taskValues,
      tbl_FK_List: selectedList.tbl_PK_List,
      [name]: value,
    });
  };

  const handleListSelectionChange = (value) => {
    setinitialRender(false)
    setSelectedList(value)
    setIsListSelected(true)
  }    

  return (
    <div className="App">

      <h1>Task Management App</h1>         

      <DropdownList
        className='listCbx'
        name='list'
        placeholder="Select List"
        title="Select List"
        dataKey="tbl_PK_List"
        textField="tbl_ListName"
        value={selectedList}
        data={listCbxData}
        style={{maxWidth: '500px', marginBottom: '30px', justifySelf: 'center', marginLeft: 'auto', marginRight: 'auto'}}
        onChange={value => handleListSelectionChange(value)}
        filter='contains'
        renderListItem={({ item })=> (
          <table>
            <tbody>
              <tr>
                <td >{item.tbl_ListName}</td>
              </tr>
            </tbody>
          </table>
          
        )}
        renderValue={({ item }) => (
          <table>
            <tbody>
              <tr>
                <td >{item.tbl_ListName}</td>
              </tr>
            </tbody>
          </table>
        )}
      />

        <div className='listBtnGroup'>

          <Button variant="contained" className='listBtn' size='medium' sx={{mx: "30px"}} onClick={() => setShowCreateList(true)}>Create List</Button>

          <Button variant="contained" className='listBtn' size='medium' sx={{mx: "30px"}} onClick={() => setShowDeleteList(true)} disabled={!isListSelected}>Delete List</Button>

          <Button variant="contained" className='listBtn' size='medium' sx={{mx: "30px"}} onClick={() => setShowEditList(true)} disabled={!isListSelected}>Rename List</Button>
        
        </div>

        {showCreateList ? <CreateList selectedList={selectedList} handleSaveCreateList={handleSaveCreateList} handleClose={handleClose}/> : ""}
          
        {showEditList ? <EditList selectedList={selectedList} handleSaveEditListName={handleSaveEditListName} handleClose={handleClose}/> : ""}

        {showDeleteList ? <DeleteList selectedList={selectedList} handleDeleteListConfirmed={handleDeleteListConfirmed} handleClose={handleClose}/> : ""}        

      {showTasks ?            

        isLoading ? <LoadingSpinner />  :

          <>
            <div style={{marginTop: '30px', width: '90%', marginLeft:'auto', marginRight: 'auto'}}>

              <TaskTable tableData={tableData}/>

            </div>

            <div style={{marginTop: '30px', width: '90%', marginLeft:'auto', marginRight: 'auto'}}>

              <Button variant="contained" className='taskBtn' size='medium' sx={{mx: "30px"}} onClick={handleAddTaskClick}>Add Task</Button>

              <Button variant="contained" className='taskBtn' size='medium' sx={{mx: "30px"}} onClick={setShowMoveTask(true)} disabled={!isTaskSelected}>Move Task</Button>

              <Button variant="contained" className='taskBtn' size='medium' sx={{mx: "30px"}} onClick={setShowDeleteTask(true)} disabled={!isTaskSelected}>Delete Task</Button>

              {showMoveTask ? <MoveTask></MoveTask> : ""}
              

              <Dialog open={showTaskAdd} onClose={handleClose}>
                <DialogTitle sx={{justifySelf: 'center', margin:'auto'}}>Add/Edit Task</DialogTitle>
                <DialogContent>  
                  <div style={{marginTop: "20px"}}>
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
                  </div>
                  <div style={{marginTop: "20px"}}>
                    <DialogContentText style={{color:'black', fontWeight: '500'}}>
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
                        value={taskValues.tbl_TaskDescription}
                        onChange={handleTaskInputChange}  
                      />
                    </DialogContentText>
                  </div>
                  <div style={{marginTop: "20px"}}>
                    <DialogContentText style={{color:'black', fontWeight: '500'}}>
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
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleSaveAddTaskClick} sx={{justifySelf: 'left', margin: 'auto'}}>Save</Button>
                  <Button onClick={handleClose} sx={{justifySelf: 'right', margin: 'auto'}}>Cancel</Button>
                </DialogActions>
              </Dialog>

            </div>

          </>

      :
      ""}
        
        
    </div>
  );
}

export default App;
