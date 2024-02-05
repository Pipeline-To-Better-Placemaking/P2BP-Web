import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { APDialog } from '../FAQDialog';
import * as XLSX from 'xlsx/xlsx.mjs';
import axios from '../api/axios';
import './routes.css';
import ActivityTable from '../components/ActivityTable';
import ActivityForm from '../components/ActivityForm';
import { testNames } from '../functions/HelperFunctions';

export default function ActivityPage(props) {
    // Props from MapPage.js
    const drawers = props.drawers;

    console.log("🚀 ~ file: ActivityPage.js:23 ~ ActivityPage ~ drawers:", drawers);

    const loc = useLocation();
    const nav = useNavigate();

    const [message, setMessage] = React.useState('');
    const deleteResp = React.useRef(null);
    var selectedID = '';
    var selectedType = '';

    const openConfirmation = (cat, title, id) => (e) => {
        // Opens confirmation window for deleting a project
        const popup = document.getElementById('deleteWindow');
        const inner = document.getElementById('popUpText');
        selectedID = id;
        selectedType = cat;
        inner.innerHTML = '';
        inner.innerHTML = `<h6>Are you sure you would like to delete '${title}' activity?<br/> This cannot be undone.</h6>`
        popup.style.display = 'flex';
    }

    const closeWindow = (e) => {
        e.preventDefault();
        //console.log('close');
        const popup = document.getElementById('deleteWindow');
        const inner = document.getElementById('popUpText');
        popup.style.display = 'none';
        inner.innerHTML = '';
        selectedID = '';
        selectedType = '';
        setMessage('');
        deleteResp.current.style.display = 'none';
    }

    // Called to export a workbook with all activity data
    const exportData = (e) => {
        var workbook = XLSX.utils.book_new();
        var stationary = [];
        var moving = [];
        var order = [];
        var boundaries = [];
        var lighting = [];
        var nature = [];
        var sound = [];
        var access = [];
        var section = [];
        var program = [];

        // Loop through Project Data
        Object.entries(drawers).forEach(([category, catobject])=>{
            Object.entries(catobject).forEach(([date, dateobject])=>{
                Object.entries(dateobject).forEach(([time, timeobject])=>{
                    Object.entries(timeobject.data).forEach(([index, dataobjects])=>{
                        console.log(category)
                        var obj = {}
                        // Create an object based on category and append it to its related array
                        if(category === 'stationary_maps') {
                            obj = { 'Activity Type': testNames(category), Date: date, Time: time, Point: index, Posture: dataobjects.posture, Age: dataobjects.age, Gender: dataobjects.gender, Activity: `${dataobjects.activity}` };
                            stationary.push(obj);
                        } else if(category === 'moving_maps') {
                            obj = { 'Activity Type': testNames(category), Date: date, Time: time, Point: index, Mode: dataobjects.mode }
                            moving.push(obj);
                        } else if (category === 'sound_maps') {
                            if ((!dataobjects.decibel_1.recording) || (!dataobjects.decibel_2.predominant_type))
                            {
                                console.log("Dataobjects is undefined");
                                obj = {
                                    'Activity Type': testNames(category), 
                                    Date: date, Time: time, Point: index,
                                    'Reading 1': 'null'
                                }
                                sound.push(obj)
                            }
                            else {
                                obj = { 
                                    'Activity Type': testNames(category), 
                                    Date: date, Time: time, Point: index, 
                                    'Average (dB)': dataobjects.average, 
                                    'Sound Types/Sources': `${dataobjects.sound_type}`,
                                    'Reading 1': `${dataobjects.decibel_1.recording} ${dataobjects.decibel_1.predominant_type}`,
                                    'Reading 2': `${dataobjects.decibel_2.recording} ${dataobjects.decibel_2.predominant_type}`,
                                    'Reading 3': `${dataobjects.decibel_3.recording} ${dataobjects.decibel_3.predominant_type}`,
                                    'Reading 4': `${dataobjects.decibel_4.recording} ${dataobjects.decibel_4.predominant_type}`,
                                    'Reading 5': `${dataobjects.decibel_5.recording} ${dataobjects.decibel_5.predominant_type}`
                                }
                                sound.push(obj);
                            } 
                        } else if (category === 'boundaries_maps') {
                            obj = { 'Activity Type': testNames(category), Date: date, Time: time, Point: index, Kind: dataobjects.kind, Description: dataobjects.description, Purpose: `${dataobjects.purpose}`, 'Value (ft/sq.ft)': dataobjects.value }
                            boundaries.push(obj);
                        } else if (category === 'section_maps') {
                            obj = { 'Activity Type': testNames(category), Date: date, Time: time, Title: dataobjects.title, Tags: `${dataobjects.tags}`, URL : dataobjects.url_link }
                            section.push(obj);
                        } else if (category === 'program_maps') {
                            console.log("dataobjects for program_maps", dataobjects);
                            dataobjects.floorData.forEach((floor, index) => {
                                console.log("floor", floor)
                                floor.programs.map((programfml, idx) => {
                                    obj = { 'Activity Type': testNames(category), Date: date, Time: time, Floor: floor.floorNum, ProgramType: programfml.programType, 'Square Footage (ft/sq.ft)': programfml.sqFootage.toFixed(2) }
                                    program.push(obj);
                                })
                            })
                        } else if(category === 'order_maps') {
                            dataobjects.points.forEach((point, ind)=>{
                                obj = { 'Activity Type': testNames(category), Date: date, Time: time, Point: ind, Kind: point.kind, Description: `${point.description}` }
                                order.push(obj);
                            })
                        } else if(category === 'light_maps') {
                            dataobjects.points.forEach((point, ind) => {
                                obj = { 'Activity Type': testNames(category), Date: date, Time: time, Point: ind, Description: point.light_description }
                                lighting.push(obj);
                            })
                        } else if(category === 'access_maps') {

                            //console.log("🚀 ~ file: ActivityPage.js:111 ~ Object.entries ~ category:", category);

                            obj = { 'Activity Type': testNames(category), Date: date, Time: time, Point: index, 'Access Type': dataobjects.accessType, Description: dataobjects.description, "Length/Area (ft/sq.ft)": dataobjects.area, 'Distance From Area (ft)': dataobjects.distanceFromArea, 'In Perimeter': dataobjects.inPerimeter, 'Difficulty Rating': dataobjects.details.diffRating, Cost: dataobjects.details.cost, Spots: dataobjects.details.spots, Floors: dataobjects.details.floors, 'Lane Count': dataobjects.details.laneCount, Median: dataobjects.details.median, 'Toll Lane': dataobjects.details.tollLane, Paved: dataobjects.details.paved, 'Two Way': dataobjects.details.twoWay, 'Turn Lane': dataobjects.details.turnLane.length > 1 ? "Left and Right" : (dataobjects.details.turnLane.length === 1 ? (dataobjects.details.turnLane[0] === 0 ?  "None" : (dataobjects.details.turnLane[0] === 1 ? "Left" : "Right")) : "" )}
                            access.push(obj);
                        } else if (category === 'nature_maps') {
                            Object.entries(dataobjects).forEach(([type, pointArr], ind0)=>{
                                if(type === 'weather'){
                                    obj = { 'Activity Type': testNames(category), Date: date, Time: time, Point: 'N/A', 'Category': 'Weather', Temperature: `${pointArr.temperature}\u00B0F`, 'Kind/Area (ft/sq.ft)': '', Description: `${pointArr.description}` }
                                    nature.push(obj);
                                } else if(type === 'water' || type === 'vegetation'){
                                    pointArr.forEach((natureArea, ind1)=>{
                                        obj = { 'Activity Type': testNames(category), Date: date, Time: time, Point: ind1, 'Category': type === 'water' ? 'Water' : 'Vegetation', Temperature: '', 'Kind/Area (ft/sq.ft)': `${natureArea.area}`, Description: `${natureArea.description}` }
                                        nature.push(obj);
                                    })
                                } else if(type === 'animal') {
                                    pointArr.forEach((natureArea, ind1) => {
                                        obj = { 'Activity Type': testNames(category), Date: date, Time: time, Point: ind1, 'Category': 'Animal', Temperature: '', 'Kind/Area (ft/sq.ft)': `${natureArea.kind}`, Description: `${natureArea.description}` }
                                        nature.push(obj);
                                    })
                                }
                            })
                        } 
                    })
                })
            })
        })

        // Create new worksheets for each category
        var worksheetstat = XLSX.utils.json_to_sheet(stationary);
        var worksheetmov = XLSX.utils.json_to_sheet(moving);
        var worksheetord = XLSX.utils.json_to_sheet(order);
        var worksheetbounds = XLSX.utils.json_to_sheet(boundaries);
        var worksheetlight = XLSX.utils.json_to_sheet(lighting);
        var worksheetnat = XLSX.utils.json_to_sheet(nature);
        var worksheetsound = XLSX.utils.json_to_sheet(sound);
        var worksheetaccess = XLSX.utils.json_to_sheet(access);
        var worksheetsection = XLSX.utils.json_to_sheet(section);
        var worksheetprogram = XLSX.utils.json_to_sheet(program);

        // Append worksheets to workbook and name them
        XLSX.utils.book_append_sheet(workbook, worksheetord, 'AbsenceOfOrder');
        XLSX.utils.book_append_sheet(workbook, worksheetsound, 'AcousticalProfile');
        XLSX.utils.book_append_sheet(workbook, worksheetaccess, 'IdentifyingAccess');
        XLSX.utils.book_append_sheet(workbook, worksheetprogram, 'IdentifyingProgram');
        XLSX.utils.book_append_sheet(workbook, worksheetlight, 'LightingProfile');
        XLSX.utils.book_append_sheet(workbook, worksheetnat, 'NaturePrevalence');
        XLSX.utils.book_append_sheet(workbook, worksheetmov, 'PeopleInMotion');
        XLSX.utils.book_append_sheet(workbook, worksheetstat, 'PeopleInPlace');
        XLSX.utils.book_append_sheet(workbook, worksheetsection, 'SectionCutter');
        XLSX.utils.book_append_sheet(workbook, worksheetbounds, 'SpatialBoundaries');

        
        // Excel Format
        XLSX.writeFileXLSX(workbook, `${props.title}.xlsx`);

        // CSV universal Format, in case this is preferred
        //XLSX.writeFileXLSX(workbook, 'PlaceProject.csv');
    }

    const deleteActivity = async (e) => {
        try {
            await axios.delete(`/${selectedType}/${selectedID}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${loc.state.userToken.token}`
                },
                withCredentials: true
            });

            closeWindow(e);
            nav(`../../projects/${loc.pathname.split('/')[5]}/activities`, { replace: true, state: { team: loc.state.team, owner: loc.state.owner, project: loc.state.project, userToken: loc.state.userToken } });

        } catch (error) {
            console.log('ERROR: ', error);
            setMessage(error.response.data?.message);
            deleteResp.current.style.display = 'inline-block';
            return;
        }
    }

    return(
        <div id='activityPage' className='pages'>
            <ActivityForm/>
            <TableContainer component={Paper}>
                <Table aria-label='collapsible table'>
                    <TableHead>
                        <TableRow>
                            <TableCell 
                                align='center' 
                                colSpan={ 12 }
                            >
                                <APDialog />
                                <Typography variant='h6'>  Activity Results</Typography>
                                <Button onClick={ exportData }>Export Data</Button>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* type 0 is the expandable/nested tables for the Activity Project Page */}
                        <ActivityTable type={ 0 } activity={ drawers } open={openConfirmation}/>
                    </TableBody>
                </Table>
            </TableContainer>
            <div id='deleteWindow' style={{ display: 'none', position: 'fixed', justifyContent: 'center', alignItems: 'center' }}>
                <div id='popUpBlock'>
                    <span ref={deleteResp} style={{ display: 'none', color: 'red' }}>{message}</span>
                    <div id='popUpText'></div>
                    <Button id='deleteButton' onClick={deleteActivity}>Confirm</Button>
                    <Button id='cancelButton' onClick={closeWindow}>Cancel</Button>
                </div>
            </div>
        </div>
    );
}