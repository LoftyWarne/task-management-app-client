import React, {useEffect, useState} from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import { DropdownList } from 'react-widgets';
import "react-widgets/styles.css";
import "./MoveTask.css";

export default function MoveTask ({handleMoveListConfirmed, handleClose}) {

    const [listCbxData, setListCbxData] = useState([]); 

    const [isListSelected, setIsListSelected] = useState(false);

    const [selectedList, setSelectedList] = useState({}); 

    useEffect(() => {
        fetchLists();
    }, []);

    const fetchLists = async () => {
        try {
          const resp = await fetch(`${process.env.REACT_APP_API_HOST}/api/list`)
          const json = await resp.json();
          setListCbxData(json)
        } catch (error) {
          console.error('There was an error!', error);
        }
    }
    
    const handleListSelectionChange = (value) => {
        setSelectedList(value)
        setIsListSelected(true)
    }  

    return (        

        <Dialog onClose={handleClose}>
            <DialogTitle sx={{justifySelf: 'center', margin:'auto'}}>Move Task</DialogTitle>
            <DialogContent>  
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
            </DialogContent>
            <DialogActions>
            <Button onClick={handleMoveListConfirmed} sx={{justifySelf: 'left', margin: 'auto'}} disabled={!isListSelected}>Confirm</Button>
            <Button onClick={handleClose} sx={{justifySelf: 'right', margin: 'auto'}}>Cancel</Button>
            </DialogActions>
        </Dialog>

    )

}