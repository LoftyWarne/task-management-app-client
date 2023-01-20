import React, {useEffect, useState} from 'react';
import MaterialTable, { Column } from '@material-table/core';
import { Button} from '@mui/material';
import { DropdownList } from 'react-widgets';
import "react-widgets/styles.css";
import './App.css';
import LoadingSpinner from './LoadingSpinner/LoadingSpinner.js'

function App() {

  const [initialRender, setinitialRender] = useState(true);

  const [listCbxData, setListCbxData] = useState([]);  

  const [selectedList, setSelectedList] = useState([]);  

  const [showTasks, setShowTasks] = useState(false);

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
      body: JSON.stringify()
    };
    await fetch(`${process.env.REACT_APP_API_HOST}/api/add`, requestOptions)
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

  const updateListName = async (selectedList) => {
    setIsLoading(true)
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedList)
    };
    await fetch(`${process.env.REACT_APP_API_HOST}/api/list/update/${selectedList.id}`, requestOptions)
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

  const deleteList = async (selectedList) => {
    setIsLoading(true)
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedList)
    };
    await fetch(`${process.env.REACT_APP_API_HOST}/api/list/delete/${selectedList.id}`, requestOptions)
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

  const fetchTasks = async () => {
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
        onChange={value => setListCbxData(value)}
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

        <Button variant="contained" className='listBtn' size='medium' sx={{mx: "30px"}}>Create List</Button>

        <Button variant="contained" className='listBtn' size='medium' sx={{mx: "30px"}}>Delete List</Button>

        <Button variant="contained" className='listBtn' size='medium' sx={{mx: "30px"}}>Rename List</Button>

      </div>

      {showTasks ?            

        isLoading ? <LoadingSpinner />  :
          <>

            <MaterialTable columns={columns} data={tableData}
              options={{
                search: true, draggable: false, idSynonym: 'tbl_PK_Task', searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
                filtering: false, paging: false, addRowPosition: "first", actionsColumnIndex: -1, selection: true,
                showSelectAllCheckbox: false, showTextRowsSelected: false, showTitle: false, grouping: false, columnsButton: false,
                rowStyle: {padding: '0', margin:'0', textAlign:'left', border: "solid black 1px",background: "white"},
                headerStyle: { background: "#75C9FA",color:"#000", padding: '1', margin:'0', textAlign:'left', justifyContent: "left",
                position: "sticky", borderBottom: "solid black 1px", borderLeft: "solid black 1px", borderRight: "solid black 1px" },
                maxBodyHeight:' 675px'
              }}
            />

          </>
      :
      ""}
        
        
    </div>
  );
}

export default App;
