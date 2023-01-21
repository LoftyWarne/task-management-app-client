import React, {useEffect, useState} from 'react';
import MaterialTable, { Column } from '@material-table/core';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField} from '@mui/material';
import { DropdownList } from 'react-widgets';
import "react-widgets/styles.css";
import './App.css';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner.js'
import { create } from '@mui/material/styles/createTransitions';

function App() {

  const [initialRender, setinitialRender] = useState(true);

  const [listCbxData, setListCbxData] = useState([]);  

  const [selectedList, setSelectedList] = useState({});  

  const [isListSelected, setIsListSelected] = useState(false);  

  const [isTaskSelected, setIsTaskSelected] = useState(false);  

  const [listName, setListName] = useState({tbl_ListName: ""});  

  const [showTasks, setShowTasks] = useState(false);

  const [showListCreator, setShowListCreator] = useState(false);

  const [showListEditor, setShowListEditor] = useState(false);

  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

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
      setShowTasks(true)
    }
  }, [selectedList]);

  const fetchLists = async () => {
    try {  
      setIsLoading(true)
      const resp = await fetch(`${process.env.REACT_APP_API_HOST}/api/list`)
      const json = await resp.json();
      setListCbxData(json)
      setIsLoading(false)
    } catch (error) {
      console.error('There was an error!', error);
    }
  }

  const createList = async () => {
    setIsLoading(true)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listName)
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
        fetchLists()
        setIsLoading(false)              
    })      
    .catch(error => {
      console.error('There was an error!', error);
    });     
  }

  const updateListName = async () => {
    setIsLoading(true)
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedList)
    };
    await fetch(`${process.env.REACT_APP_API_HOST}/api/list/update/${selectedList.tbl_PK_List}`, requestOptions)
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

  const deleteList = async () => {
    setIsLoading(true)
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedList)
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

  const handleCreateListClick = () => {
    setShowListCreator(true)
  }

  const handleSaveNewList = () => {    
    createList()
    setShowListCreator(false)
  }

  const handleRenameListClick = () => {
    setShowListEditor(true)
  }

  const handleRenameListConfirmed = () => {    
    updateListName()
    setShowListEditor(false)
    setShowTasks(false)
  }

  const handleDeleteListClick = () => {
    setShowDeleteWarning(true)
  }

  const handleDeleteListConfirmed = () => {    
    deleteList()
    setShowDeleteWarning(false)
    setShowTasks(false)
  }

  const handleClose = () => {
    if (showListEditor) {
      setShowListEditor(false)
    }     
    if (showListCreator) {
      setShowListCreator(false)
    }
    if (showDeleteWarning) {
      setShowDeleteWarning(false)
    }       
  }

  const handleSaveEditListName = () => {
    setShowListEditor(false)
  }  

  const handleInputChange = (e) => {
    //const name = e.target.name 
    //const value = e.target.value 
    const { name, value } = e.target;
  
    setListName({
      ...selectedList,
      tbl_ListName: value
    });
  };

  const handleListSelectionChange = (value) => {
    setinitialRender(false)
    setSelectedList(value)
    setIsListSelected(true)
  }  

  const columns = [
    { title: 'tbl_PK_Task', field: 'tbl_PK_Task', hidden: true },
    { title: 'tbl_FK_List', field: 'tbl_FK_List', hidden: true },
    { title: 'Task Title', field: 'tbl_TaskName'},
    { title: 'Task Description', field: "tbl_TaskDescription"},
    { title: 'Task Deadline', field: "tbl_TaskDeadline"},
    { title: 'Task Complete', field: "tbl_TaskComplete"},
  ]

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

          <Button variant="contained" className='listBtn' size='medium' sx={{mx: "30px"}} onClick={handleCreateListClick}>Create List</Button>

          <Button variant="contained" className='listBtn' size='medium' sx={{mx: "30px"}} onClick={handleDeleteListClick} disabled={!isListSelected}>Delete List</Button>

          <Button variant="contained" className='listBtn' size='medium' sx={{mx: "30px"}} onClick={handleRenameListClick} disabled={!isListSelected}>Rename List</Button>
        
        </div>

          <Dialog open={showListEditor} onClose={handleClose}>
            <DialogTitle>Edit List Name</DialogTitle>
            <DialogContent>  
              <TextField
                sx={{justifyContent:'center'}}
                type='text'
                value={listName.tbl_ListName}
                onChange={handleInputChange}> 
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSaveEditListName} sx={{justifySelf: 'left', margin: 'auto'}}>Save</Button>
              <Button onClick={handleClose} sx={{justifySelf: 'right', margin: 'auto'}}>Cancel</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={showListCreator} onClose={handleClose}>
            <DialogTitle sx={{justifySelf: 'center', margin:'auto'}}>New List</DialogTitle>
            <DialogContent>  
              <TextField 
                placeholder='Enter New List Name' 
                sx={{justifyContent:'center'}}
                type='text'
                value={listName.tbl_ListName}
                onChange={handleInputChange}>  
                </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSaveNewList} sx={{justifySelf: 'left', margin: 'auto'}}>Save</Button>
              <Button onClick={handleClose} sx={{justifySelf: 'right', margin: 'auto'}}>Cancel</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={showDeleteWarning} onClose={handleClose}>
            <DialogTitle sx={{justifySelf: 'center', margin:'auto'}}>Delete Confirmation</DialogTitle>
            <DialogContent>  
              <DialogContentText>Are you sure you want to delete {selectedList.tbl_ListName}?</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteListConfirmed} sx={{justifySelf: 'left', margin: 'auto'}}>Yes</Button>
              <Button onClick={handleClose} sx={{justifySelf: 'right', margin: 'auto'}}>Cancel</Button>
            </DialogActions>
          </Dialog>

      {showTasks ?            

        isLoading ? <LoadingSpinner />  :

          <>
            <div style={{marginTop: '30px', width: '90%', marginLeft:'auto', marginRight: 'auto'}}>

              <MaterialTable columns={columns} data={tableData}
                options={{
                  search: false, draggable: false, idSynonym: 'tbl_PK_Task', searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
                  filtering: false, paging: false, addRowPosition: "first", actionsColumnIndex: -1, selection: true, toolbar:false,
                  showSelectAllCheckbox: true, showTextRowsSelected: true, showTitle: false, grouping: false, columnsButton: false,
                  rowStyle: {padding: '0', margin:'0', textAlign:'left', border: "solid black 1px",background: "white"},
                  headerStyle: { background: "#75C9FA",color:"#000", padding: '1', margin:'0', textAlign:'left', justifyContent: "left",
                  position: "sticky", borderBottom: "solid black 1px", borderLeft: "solid black 1px", borderRight: "solid black 1px" },
                  maxBodyHeight:' 675px'
                }}
              />

            </div>

            <div style={{marginTop: '30px', width: '90%', marginLeft:'auto', marginRight: 'auto'}}>

              <Button variant="contained" className='taskBtn' size='medium' sx={{mx: "30px"}} onClick={handleDeleteListClick}>Add Task</Button>

              <Button variant="contained" className='taskBtn' size='medium' sx={{mx: "30px"}} onClick={handleDeleteListClick} disabled={!isTaskSelected}>Move Task</Button>

              <Button variant="contained" className='taskBtn' size='medium' sx={{mx: "30px"}} onClick={handleDeleteListClick} disabled={!isTaskSelected}>Delete Task</Button>

            </div>

          </>

      :
      ""}
        
        
    </div>
  );
}

export default App;
