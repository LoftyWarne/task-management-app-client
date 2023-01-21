import React, {useState} from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material';
import "react-widgets/styles.css";
import "./EditList.css";

export default function EditList ({selectedList, handleSaveEditListName, handleClose}) {

    const [updatedListValues, setUpdatedListValues] = useState(selectedList);

    const handleUpdatedListName = (e) => {

        const { value } = e.target;
      
        setUpdatedListValues({
          ...updatedListValues,
          tbl_ListName: value
        });

    };

    return (      

        <Dialog open onClose={handleClose}>
            <DialogTitle>Edit List Name</DialogTitle>
            <DialogContent>  
              <TextField
                sx={{justifyContent:'center'}}
                type='text'
                value={updatedListValues.tbl_ListName}
                onChange={handleUpdatedListName}> 
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={(updatedListValues) => handleSaveEditListName(updatedListValues)} sx={{justifySelf: 'left', margin: 'auto'}}>Save</Button>
              <Button onClick={handleClose} sx={{justifySelf: 'right', margin: 'auto'}}>Cancel</Button>
            </DialogActions>
        </Dialog>

    )

}