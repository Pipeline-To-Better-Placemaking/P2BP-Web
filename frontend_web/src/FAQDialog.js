import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';

// this dialog function is to instruct users how to setup the identifying program test
export function IPDialog() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button onClick={handleClickOpen} style={{ marginTop: '5px' }}>
                <HelpOutlineRoundedIcon fontSize='large' />
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"How to Use"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        In order to create the model, put down at least 3 points on the map. Note, if you draw
                        an invalid shape, it will not render in the Unity Player.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Okay</Button>

                </DialogActions>
            </Dialog>
        </div>
    );
}

// this dialog function is to instruct users how to setup the section cutter test
export function SCDialog() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button onClick={handleClickOpen} style={{ marginTop: '5px' }}>
                <HelpOutlineRoundedIcon fontSize='large' />
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"How to Use"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        In order to create the section cut, put down at 2 points on the map. Note, if you plot
                        an invalid shape, it will not create the test.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Okay</Button>

                </DialogActions>
            </Dialog>
        </div>
    );
}

// this dialog function is used in the activity page to instruct users how to view and export data
export function APDialog() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button onClick={handleClickOpen} style={{ marginTop: '5px' }}>
                <HelpOutlineRoundedIcon fontSize='large' />
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"How to Use"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        To view captured data, you can click the drop down table for each test. Alternatively, you can export the raw data
                        into an excel spreadsheet.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Okay</Button>

                </DialogActions>
            </Dialog>
        </div>
    );
}

// this function is to instruct users how to create a new timeslot for a test
export function TSDialog() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button onClick={handleClickOpen} style={{ marginTop: '5px' }}>
                <HelpOutlineRoundedIcon fontSize='large' />
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"How to use"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        In order to create a timeslot, click New Time Slot, you can do this multiple times for multiple slots. 
                        You can edit the start time, number of researchers, and points where the test is carried out. Note, verify the
                        number of researchers and test details are correct before scheduling the activity.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Okay</Button>

                </DialogActions>
            </Dialog>
        </div>
    );
}