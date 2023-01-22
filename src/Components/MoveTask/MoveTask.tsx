import React, {useEffect, useState} from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import { DropdownList } from 'react-widgets';
import "react-widgets/styles.css";

//The MoveTask component provides a dialog box for moving tasks between lists

interface MoveTaskProps {
    handleMoveTaskConfirmed: any;
    handleClose: any;
  }

export default function MoveTask ({handleMoveTaskConfirmed, handleClose}: MoveTaskProps): JSX.Element {

    //state of data in list combobox
    const [listCbxData, setListCbxData] = useState([]); 

    //state of whether a list is selected
    const [isListSelected, setIsListSelected] = useState(false);

    //state of list selected
    const [selectedList, setSelectedList] = useState({}); 

    interface cbxListValues {
        tbl_PK_ListValue: number,
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
    
    const handleListSelectionChange = (value: cbxListValues) => {
        setSelectedList(value)
        setIsListSelected(true)
    }  

    return (        

        <Dialog onClose={handleClose} open>
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
            <Button onClick={handleMoveTaskConfirmed} sx={{justifySelf: 'left', margin: 'auto'}} disabled={!isListSelected}>Confirm</Button>
            <Button onClick={handleClose} sx={{justifySelf: 'right', margin: 'auto'}}>Cancel</Button>
            </DialogActions>
        </Dialog>

    )

}