import React, {useState} from 'react';
import MaterialTable, { Column } from '@material-table/core';
import { Done, Edit, RemoveDone } from '@mui/icons-material';
import ErrorMessage from '../ErrorMessage/ErrorMessage';

//The TaskTable component provides a table of tasks

export default function TaskTable ({tableData, handleTaskEdit}:any): JSX.Element {

   //state of whether an error in form validation  or fetch request has occurred
   const [error, setError] = useState(false)

   //state of error message presented to the user if an error in form validation or fetch request has occurred 
   const [errorMessage, setErrorMessage] = useState("")

  type tableDataColumns = {
    tbl_PK_Task: number,
    tbl_FK_List: number,
    tbl_TaskName: string,
    tbl_TaskDescription: string,
    tbl_TaskDeadline: Date,
    tbl_TaskComplete: boolean
  }
  const columns = [
    { title: 'tbl_PK_Task', field: 'tbl_PK_Task', type: 'numeric', hidden: true },
    { title: 'tbl_FK_List', field: 'tbl_FK_List', type: 'numeric', hidden: true },
    { title: 'Task Title', field: 'tbl_TaskName', type: 'string'},
    { title: 'Task Description', field: "tbl_TaskDescription", type: 'string'},
    { title: 'Task Deadline', field: "tbl_TaskDeadline", type: 'date'},
    { title: 'Task Complete', field: "tbl_TaskComplete", type: 'boolean'},
  ] as Column<tableDataColumns>[] 

  const updateTask = async (rowData: any) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rowData)
    };
    await fetch(`${process.env.REACT_APP_API_HOST}/api/task/update/${rowData.tbl_PK_Task}`, requestOptions)
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
      //If PUT request is unsuccessfull log error to console and display error dialog box
      console.error('There was an error!', error);
      setError(true)
      setErrorMessage(`There was an error! ${error}`)
    }); 
  }
  
  const handleMarkComplete = (rowData: any) => {
    updateTask(rowData)
  }

  const handleMarkIncomplete = (rowData: any) => {
    updateTask(rowData)
  }

  const handleEditClick = (rowData: any) => {
    updateTask(rowData)
  }

  //hide error message and reset error status
  const handleCloseErrorMessage = () => {
    setError(false)
    setErrorMessage("")
  }

  return (       

    <>
      <MaterialTable columns={columns} data={tableData}    
        actions={[
          // Only allow incomplete rows to be editable
          // @ts-ignore
          rowData => !rowData.tbl_TaskComplete ?  ({
            icon: Edit,
            position: "row",
            tooltip: 'Edit',
            onClick: (event, rowData) => {
              handleEditClick(rowData)
            }             
          }) : "",
          // Display a different icon if a row is complete or incomplete
          // @ts-ignore
          {
            position: "row",
            action: (rowData) => ({
                icon: rowData.tbl_TaskComplete ? Done : RemoveDone,
                position: "row",
                tooltip: 'Mark Complete',
                onClick: (event: any, rowData: any) => {
                  handleMarkComplete(rowData)
                }             
              })
          }
        ]}
        
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

      {error ?
        <ErrorMessage errorMessage={errorMessage} handleCloseErrorMessage={handleCloseErrorMessage}/>
      : ""}   

    </>

  )

}