import React, {useEffect, useState} from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import { DropdownList } from 'react-widgets';
import "react-widgets/styles.css";

//The MoveTask component provides a dialog box for moving tasks between lists

interface MoveTaskProps {
    selectedRows: any;
    handleMoveTaskConfirmed: any;
    handleClose: any;
  }

export default function MoveTask ({selectedRows, handleMoveTaskConfirmed, handleClose}: MoveTaskProps): JSX.Element {

    //state of data in list combobox
    const [listCbxData, setListCbxData] = useState([]); 

    //state of whether a list is selected
    const [isListSelected, setIsListSelected] = useState(false);

    //state of list selected
    const [selectedList, setSelectedList] = useState({});

    interface cbxListValues {
        tbl_PK_List: number,
        tbl_ListName: string
    }

    // fetch lists on initial render
    useEffect(() => {
        fetchLists();
    }, []);

    // GET request to select all lists from tbl_List
    const fetchLists = async () => {
        try {
          const resp = await fetch(`${process.env.REACT_APP_API_HOST}/api/list`)
          const json = await resp.json();
          setListCbxData(json)
        } catch (error) {
          console.error('There was an error!', error);
        }
    }

    // PUT request to update task record in tbl_Task
    const moveTask = async (pkTask: number) => {
        const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedList)
        };
        await fetch(`${process.env.REACT_APP_API_HOST}/api/task/updateTaskList/${pkTask}`, requestOptions)
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
            //If PUT request is unsuccessful log error to console
            console.error('There was an error!', error);
        });    
    }

    
    const handleListSelectionChange = (value: cbxListValues) => {
        setSelectedList(value)
        setIsListSelected(true)
    }  

    const handleMoveTaskClick = async () => {

        for (const tbl_PK_Task of selectedRows) {
            await moveTask(tbl_PK_Task)
          }

        handleMoveTaskConfirmed(selectedList)
    }

    return (        

        <Dialog onClose={handleClose} open>
            <DialogTitle sx={{justifySelf: 'center', margin:'auto'}}>Move Task</DialogTitle>
            <DialogContent sx={{minHeight: '300px'}}>  
                <DialogContentText>Select Destination List</DialogContentText>
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
                    renderListItem={({ item }: any) => (
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
            </DialogContent>
            <DialogActions>
            <Button onClick={handleMoveTaskClick} sx={{justifySelf: 'left', margin: 'auto'}} disabled={!isListSelected}>Confirm</Button>
            <Button onClick={handleClose} sx={{justifySelf: 'right', margin: 'auto'}}>Cancel</Button>
            </DialogActions>
        </Dialog>

    )

}