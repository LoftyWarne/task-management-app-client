import React, {useEffect, useState} from 'react';
import { Button} from '@mui/material';
import { DropdownList } from 'react-widgets';
import "react-widgets/styles.css";
import './App.css';
import LoadingSpinner from './Components/LoadingSpinner/LoadingSpinner'
import CreateList from './Components/CreateList/CreateList';
import EditList from './Components/EditList/EditList';
import DeleteList from './Components/DeleteList/DeleteList';
import TaskTable from './Components/TaskTable/TaskTable'
import MoveTask from './Components/MoveTask/MoveTask'
import CreateTask from './Components/CreateTask/CreateTask';

function App() {

  const [initialRender, setinitialRender] = useState(true);

  const [listCbxData, setListCbxData] = useState([]);  

  const [selectedList, setSelectedList] = useState({tbl_PK_List: 0});  

  const [isListSelected, setIsListSelected] = useState(false);  

  const [isTaskSelected, setIsTaskSelected] = useState(false);

  const [showTasks, setShowTasks] = useState(false);

  const [showCreateTask, setShowCreateTask] = useState(false);  

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

  const showCompleteCheckboxSelectionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setinitialRender(false)
    setCheckboxShowComplete(event.target.checked)
    setSelectedRows({})
    setIsRowSelected(false)
  } 

  useEffect(() => {
    fetchLists();
  }, []);

  useEffect(() => {
    if (!initialRender) {
      fetchListTasks();
      setShowTasks(true)
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

  const updateTask = async (newData: any) => {
    setIsLoading(true)
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    };
    await fetch(`${process.env.REACT_APP_API_HOST}/${newData.tbl_PK_Task}`, requestOptions)
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
      console.error('There was an error!', error);
    });     
}

  const handleSaveCreateList = () => {
    setShowCreateList(false)
    fetchLists()
  }

  const handleSaveEditListName = () => {
    setShowEditList(false)
    fetchLists()
  } 

  const handleDeleteListConfirmed = () => {
    setShowDeleteList(false)
    setShowTasks(false)
  }

  const handleMoveTaskConfirmed = () => {
    setShowMoveTask(false)
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
    if (showCreateTask) {
      setShowCreateTask(false)
    }         
  }  

  const handleSaveCreateTask = () => {
    setShowCreateTask(false)
    fetchListTasks()
  }

  const handleListSelectionChange = (value: any) => {
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
        renderListItem={({ item }: any)=> (
          <table>
            <tbody>
              <tr>
                <td >{item.tbl_ListName}</td>
              </tr>
            </tbody>
          </table>
          
        )}
        renderValue={({ item }: any) => (
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

        {showCreateList ? <CreateList handleSaveCreateList={handleSaveCreateList} handleClose={handleClose}/> : ""}
          
        {showEditList ? <EditList selectedList={selectedList} handleSaveEditListName={handleSaveEditListName} handleClose={handleClose}/> : ""}

        {showDeleteList ? <DeleteList selectedList={selectedList} handleDeleteListConfirmed={handleDeleteListConfirmed} handleClose={handleClose}/> : ""}        

      {showTasks ?            

        isLoading ? <LoadingSpinner />  :

          <>
            <div style={{marginTop: '30px', width: '90%', marginLeft:'auto', marginRight: 'auto'}}>

              <TaskTable tableData={tableData}/>

            </div>

            <div style={{marginTop: '30px', width: '90%', marginLeft:'auto', marginRight: 'auto'}}>

              <Button variant="contained" className='taskBtn' size='medium' sx={{mx: "30px"}} onClick={() => setShowCreateTask(true)}>Add Task</Button>

              <Button variant="contained" className='taskBtn' size='medium' sx={{mx: "30px"}} onClick={() => setShowMoveTask(true)} disabled={!isTaskSelected}>Move Task</Button>

              <Button variant="contained" className='taskBtn' size='medium' sx={{mx: "30px"}} onClick={() => setShowDeleteTask(true)} disabled={!isTaskSelected}>Delete Task</Button>

              {showMoveTask ? <MoveTask handleMoveTaskConfirmed={handleMoveTaskConfirmed} handleClose={handleClose} /> : ""}

              {showCreateTask ? <CreateTask handleSaveCreateTask={handleSaveCreateTask} handleClose={handleClose} selectedList={selectedList.tbl_PK_List}/> : ""}

            </div>

          </>

      :
      ""}
        
        
    </div>
  );
}

export default App;
