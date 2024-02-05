import * as React from 'react';
import DisplayCards from '../components/DisplayCards';
import './routes.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function SurveyorPage(props) {
    // Props from ProjectPage.js
    const results = props.drawers;
    const surveyors = {};
        <Table stickyHeader size='small' aria-label='activity'>
            <TableHead sx={{ bgcolor: '#e2e2e2'}}>
                
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>{'Test'}</TableCell>
                    <TableCell>{'Date'}</TableCell>
                    <TableCell>{'Time'}</TableCell>
                </TableRow>
                {
                Object.entries(results).forEach(([cat, obj])=>(
                    Object.entries(obj).forEach(([date, dObj])=>(
                        Object.entries(dObj).forEach(([time, tObj])=>(
                            tObj.researchers.forEach((researcher)=>{
                                if(!surveyors[researcher._id]){
                                    surveyors[researcher._id] = {};
                                    surveyors[researcher._id].name = `${researcher.firstname} ${researcher.lastname}`;
                                    surveyors[researcher._id].activities = [];
                                }
                                // <TableRow>
                                //     <TableCell align='center' colSpan={3}>
                                //         {cat}                   
                                //     </TableCell>
                                //     <TableCell align='center' colSpan={3}>
                                //         {date}                   
                                //     </TableCell>
                                //     <TableCell align='center' colSpan={3}>
                                //         {time}                   
                                //     </TableCell>
                                // </TableRow>
                                
                                surveyors[researcher._id].activities.push({activity: cat, date: date, time: time, id: tObj._id});
                            })
                        ))
                    ))
                ))
                }
            </TableBody>
            </Table>

    /* organized by id in case of common names
    ex: surveyors = {
        'idnumber' : {
            name: 'John Smith',
            activities: [
                {
                    activity: 'nature_maps',
                    date: '2/2/22',
                    time: '2pm'
                },
                {
                    activity: 'sound_maps',
                    date: '3/1/22',
                    time: '4pm'
                }
            ]
        },
        'idnumber2': {
            name: 'Anne Doe',
            activities: [
                {
                    activity: 'boundaries_maps',
                    date: '2/2/22',
                    time: '12pm'
                },
                {
                    activity: 'light_maps',
                    date: '3/1/22',
                    time: '10am'
                }
            ]
        }
    ]; */

    return(
        <div id='SurveyorPage'>
            <div id='projectCardFlexBox'>
                {/* type = 0 implies Surveyor style cards */}
                <DisplayCards type={ 0 } surveyors={ surveyors }/>
            </div>
        </div>
    );
}