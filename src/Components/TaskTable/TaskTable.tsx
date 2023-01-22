import React, {useState} from 'react';
import MaterialTable, { Column } from '@material-table/core';

//The TaskTable component provides a table of tasks

export default function TaskTable ({tableData}:any): JSX.Element {

  type tableDataColumns = {
    tbl_PK_Task: number,
    tbl_FK_List: number,
    tbl_TaskName: string,
    tbl_TaskDescription: string,
    tbl_TaskDeadline: Date,
    tbl_TaskComplete: boolean
  }
  const columns = [
    { title: 'tbl_PK_Task', field: 'tbl_PK_Task', type: 'number', hidden: true },
    { title: 'tbl_FK_List', field: 'tbl_FK_List', type: 'number', hidden: true },
    { title: 'Task Title', field: 'tbl_TaskName', type: 'string'},
    { title: 'Task Description', field: "tbl_TaskDescription", type: 'string'},
    { title: 'Task Deadline', field: "tbl_TaskDeadline", type: 'date'},
    { title: 'Task Complete', field: "tbl_TaskComplete", type: 'boolean'},
  ] as Column<tableDataColumns>[]  

  return (       

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

  )

}