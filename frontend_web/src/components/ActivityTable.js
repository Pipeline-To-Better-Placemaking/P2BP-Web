import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { testNames } from '../functions/HelperFunctions';

// Collapsible Table for Activity Page, Activity Titles
function Row(props) {
    const row = props.row;
    const name = props.name;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow className='categories' sx={{ '& > *': {borderBottom: 'unset'} }}>
                <TableCell>
                    <IconButton
                        aria-label='expand row'
                        size='small'
                        onClick={ () => setOpen(!open) }
                    >
                        { open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon /> }
                    </IconButton>
                </TableCell>
                <TableCell className='catTitle' component='th' scope='row'>
                    { testNames(name) }
                </TableCell>
                <TableCell> </TableCell>
                <TableCell> </TableCell>
                <TableCell> </TableCell>
                <TableCell> </TableCell>
            </TableRow>
            <TableRow className='subtables'>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={ 12 }>
                    <Collapse in={ open } timeout='auto' unmountOnExit>
                        { subtable(row, 0, name, props.open) }
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

//Subtables for Map Page Data Drawer and Activity Page Collapsible Table
//type 0 is the subtable for The activity page, 1 is the Map page table
// handles alternate structures for different activities
const subtable = (row, type, name, open) => (    
    <Box sx={{ margin: 1 }} className='subTable'>
        <Table stickyHeader size='small' aria-label='activity'>
            <TableHead sx={{ bgcolor: '#e2e2e2'}}>
                <TableRow>
                    <TableCell colSpan={ 2 } className='value'>{ type === 0 ? 'Value' : 'Category' }</TableCell>
                    <TableCell colSpan={ type === 0 ? 2 : 1 } className='type'>
                        { type === 0 ? 'Type' : 'Value' }
                    </TableCell>
                    <TableCell>{ type === 0 ? 'Location' : 'Type(s)/Source(s)' }</TableCell>
                    <TableCell>{ type === 0 ? 'Date Time': 'Location' }</TableCell>
                    <TableCell>{ type === 0 ? 'Surveyor' : 'Date Time' }</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                { type === 0 ? 
                    name === 'nature_maps' ?  
                        (Object.entries(row).map(([date, dObj]) => (
                            Object.entries(dObj).map(([time, tObj]) => (
                                tObj.data.map((object, index) => (
                                    Object.entries(object).map(([natureType, pointArr], i1) => (
                                        natureType === '_id' || natureType === 'time' ? null :
                                            (natureType === 'weather' ? 
                                                <>
                                                    <TableRow style={{ backgroundColor: '#aed5fa' }}>
                                                        <TableCell align='center' colSpan={4} className='value'>
                                                            {tObj.title}
                                                        </TableCell>
                                                        <TableCell align='right' colSpan={2}>
                                                            {date} {time}
                                                        </TableCell>
                                                        <TableCell align='right' colSpan={1}>
                                                            <Button onClick={open(name, tObj.title, tObj._id)}><DeleteIcon /></Button>
                                                        </TableCell>
                                                    </TableRow>
                                                    <TableRow key={`${index}.${i1}`}>
                                                        <TableCell colSpan={2} className='value'>
                                                            {pointArr.temperature}&ordm;F
                                                        </TableCell>
                                                        <TableCell colSpan={2} className='type'>
                                                            {`Weather ${pointArr.description}`}
                                                        </TableCell>
                                                        <TableCell>N/A</TableCell>
                                                        <TableCell>{date} {time}</TableCell>
                                                        <TableCell>{tObj.researchers.map((researcher, index) => (index !== (tObj.researchers.length - 1) ? `${researcher.firstname} ${researcher.lastname}, ` : `${researcher.firstname} ${researcher.lastname}`))}</TableCell>
                                                    </TableRow>
                                                </>
                                            : pointArr.map((natureObj, i3)=>(                                        
                                                <TableRow key={`${index}.${i1}`}>
                                                    <TableCell colSpan={2} className='value'>
                                                        {natureType === 'animal' ? `${natureObj.kind}` : `${natureObj.area} ft\u00B2`}
                                                    </TableCell>
                                                    <TableCell colSpan={2} className='type'>
                                                        {natureType === 'animal' ? `Animal: ${natureObj.description}` : (natureType === 'water' ? `Water: ${natureObj.description}` : `Vegetation: ${natureObj.description}`)}
                                                    </TableCell>
                                                    <TableCell>Location {i3 + 1}</TableCell>
                                                    <TableCell>{date} {time}</TableCell>
                                                    <TableCell>{tObj.researchers.map((researcher, index) => (index !== (tObj.researchers.length - 1) ? `${researcher.firstname} ${researcher.lastname}, ` : `${researcher.firstname} ${researcher.lastname}`))}</TableCell>
                                                </TableRow>
                                            )))
                                    ))
                                ))
                            ))
                        ))) 
                    : ( name === 'light_maps' || name === 'order_maps' ? 
                        (Object.entries(row).map(([date, dObj]) => (
                            Object.entries(dObj).map(([time, tObj]) => (
                                tObj.data.map((object, index) => (
                                    Object.values(object.points).map((point, i1)=>(
                                        i1 === 0 ? 
                                            <>
                                                <TableRow style={{ backgroundColor: '#aed5fa' }}>
                                                    <TableCell align='center' colSpan={4} className='value'>
                                                        {tObj.title}
                                                    </TableCell>
                                                    <TableCell align='right' colSpan={2}>
                                                        {date} {time}
                                                    </TableCell>
                                                    <TableCell align='right' colSpan={1}>
                                                        <Button onClick={open(name, tObj.title, tObj._id)}><DeleteIcon /></Button>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow key={`${index}.${i1}`}>
                                                    <TableCell colSpan={2} className='value'>
                                                        {point.kind ? point.kind : 'N/A'}
                                                    </TableCell>
                                                    <TableCell colSpan={2} className='type'>
                                                        {point.description ? `${point.description}` : (point.light_description ? `${point.light_description}` : (`${point.access_description}` ? `${point.access_description}` : `test`)) }
                                                    </TableCell>
                                                    <TableCell>Location {i1 + 1}</TableCell>
                                                    <TableCell>{date} {time}</TableCell>
                                                    <TableCell>{tObj.researchers.map((researcher, index) => (index !== (tObj.researchers.length - 1) ? `${researcher.firstname} ${researcher.lastname}, ` : `${researcher.firstname} ${researcher.lastname}`))}</TableCell>
                                                </TableRow>
                                            </> 
                                        : 
                                        <TableRow key={`${index}.${i1}`}>
                                            <TableCell colSpan={2} className='value'>
                                                { point.kind ? point.kind : 'N/A'}
                                            </TableCell>
                                            <TableCell colSpan={2} className='type'>
                                                { point.description ? `${point.description}` : (point.light_description ? `${point.light_description}` : `${point.access_description}`) }
                                            </TableCell>
                                            <TableCell>Location {i1 + 1}</TableCell>
                                            <TableCell>{date} {time}</TableCell>
                                                <TableCell>{tObj.researchers.map((researcher, index) => (index !== (tObj.researchers.length - 1) ? `${researcher.firstname} ${researcher.lastname}, ` : `${researcher.firstname} ${researcher.lastname}`))}</TableCell>
                                        </TableRow>
                                   ))
                                ))
                            ))
                        ))) 
                    : name === 'access_maps' ? 
                    (Object.entries(row).map(([date, dObj]) => (
                        Object.entries(dObj).map(([time, tObj]) => (
                            tObj.data.map((object, index) => {

                                console.log("🚀 ~ file: ActivityTable.js:172 ~ tObj.data.map ~ object:", object);

                                if(index === 0) {
                                    return(
                                        <TableRow style={{ backgroundColor: '#aed5fa' }}>
                                            <TableCell align='center' colSpan={4} className='value'>
                                                {tObj.title}
                                            </TableCell>
                                            <TableCell align='right' colSpan={2}>
                                                {date} {time}
                                            </TableCell>
                                            <TableCell align='right' colSpan={1}>
                                                <Button onClick={open(name, tObj.title, tObj._id)}><DeleteIcon /></Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                } else {
                                    return( 
                                        <TableRow key={`${index}`}>
                                            <TableCell colSpan={2} className='value'>
                                                {!object.inPerimeter && object.distanceFromArea !== undefined ? `${object.distanceFromArea.toFixed(2)} ft from perimeter` : "Inside perimeter"}
                                                {/* {object.accessType === "Access Path" ? 
                                                    (object.area > 0 ? 
                                                        (`${object.area} ft`) 
                                                        : 'N/A') 
                                                    : (object.area > 0 ? 
                                                        (`${object.area} ft\u00B2`) 
                                                        : 'N/A')} */}
                                            </TableCell>
                                            <TableCell colSpan={2} className='type'>
                                                {(`${object.accessType} (${object.description})`)}
                                            </TableCell>
                                            <TableCell>Location {index}</TableCell>
                                            <TableCell>{date} {time}</TableCell>
                                            <TableCell>{tObj.researchers.map((researcher, index) => (index !== (tObj.researchers.length - 1) ? `${researcher.firstname} ${researcher.lastname}, ` : `${researcher.firstname} ${researcher.lastname}`))}</TableCell>
                                        </TableRow>
                                    )
                                }
                            })
                        ))
                    ))) 
                    : (
                        name === 'section_maps' ? 
                        (Object.entries(row).map(([date, dObj]) => (
                            Object.entries(dObj).map(([time, tObj]) => (
                                tObj.data.map((object, index) => (
                                        (index == 0 ? null : <TableRow key={`${index}`}>
                            
                                            <TableCell colSpan={2} className='value'>
                                                { object.title ? object.title : 'N/A'}
                                            </TableCell>
                                            <TableCell colSpan={2} className='type'>
                                                { object.tags ? `${object.tags}` : 'N/A tags' }
                                            </TableCell>
                                            <TableCell></TableCell>
                                            <TableCell>{date} {time}</TableCell>
                                                <TableCell>{tObj.researchers.map((researcher, index) => (index !== (tObj.researchers.length - 1) ? `${researcher.firstname} ${researcher.lastname}, ` : `${researcher.firstname} ${researcher.lastname}`))}</TableCell>
                                        </TableRow>)
                           
                                ))
                            ))
                        )))
                        :
                        (name === 'program_maps' ? 
                            (Object.entries(row).map(([date, dObj]) => (
                                Object.entries(dObj).map(([time, tObj]) => (
                                    tObj.data.map((object, index) => (
                                        object.floorData.map((floor, idx) => (
                                            floor.programs.map((program, i) => (
                                                <TableRow key={`${index}`}>
                                                    <TableCell colSpan={2} className='value'>
                                                        { program.sqFootage ? `${program.sqFootage.toFixed(1)} ft\u00B2` : 'N/A'}
                                                    </TableCell>
                                                    <TableCell colSpan={2} className='type'>
                                                        { program.programType ? `${program.programType}` : 'N/A tags' }
                                                    </TableCell>
                                                    <TableCell>Floor {floor.floorNum}</TableCell>
                                                    <TableCell>{date} {time}</TableCell>
                                                        <TableCell>{tObj.researchers.map((researcher, index) => (index !== (tObj.researchers.length - 1) ? `${researcher.firstname} ${researcher.lastname}, ` : `${researcher.firstname} ${researcher.lastname}`))}</TableCell>
                                                </TableRow>
                                            ))
                                        ))
                                    ))
                                ))
                            )))
                            :
                            (Object.entries(row).map(([date, dObj])=>(
                            Object.entries(dObj).map(([time, tObj])=>(
                                tObj.data.map((object, index) => (
                                    index === 0 ? 
                                        <>
                                            <TableRow style={{ backgroundColor: '#aed5fa' }}>
                                                <TableCell align='center' colSpan={4} className='value'>
                                                    {tObj.title}
                                                </TableCell>
                                                <TableCell align='right' colSpan={2}>
                                                    {date} {time}
                                                </TableCell>
                                                <TableCell align='right' colSpan={1}>
                                                    <Button onClick={open(name, tObj.title, tObj._id)}><DeleteIcon /></Button>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow key={ index }>
                                                <TableCell colSpan={ 2 } className='value'>
                                                    {object.average ? `${object.average} dB` : (object.value && (object.kind === 'Construction' || object.kind === 'Constructed') ? `${object.value} ft` : (object.value && object.kind ? `${object.value} ft\u00B2` : (object.posture ? object.posture : (object.mode ? object.mode : ''))))}
                                                </TableCell>
                                                <TableCell colSpan={ 2 } className='type'>
                                                    {object.average ? `${object.sound_type}` : (object.kind ? (`${object.kind} (${object.description})`) : (object.age ? `${object.age} ${object.gender} (${object.activity})` : 'N/A'))}
                                                </TableCell>
                                                <TableCell>Location { index + 1 }</TableCell>
                                                <TableCell>{ date } { time }</TableCell>
                                                <TableCell>{tObj.researchers.map((researcher, index) => (index !== (tObj.researchers.length - 1) ? `${researcher.firstname} ${researcher.lastname}, ` : `${researcher.firstname} ${researcher.lastname}`))}</TableCell>
                                            </TableRow>
                                        </>
                                    :
                                        <TableRow key={ index }>
                                            <TableCell colSpan={ 2 } className='value'>
                                                {object.average ? `${object.average} dB` : (object.value && (object.kind === 'Construction' || object.kind === 'Constructed') ? `${object.value} ft` : (object.value && object.kind ? `${object.value} ft\u00B2` : (object.posture ? object.posture : (object.mode ? object.mode : ''))))}
                                            </TableCell>
                                            <TableCell colSpan={ 2 } className='type'>
                                                {object.average ? `${object.sound_type}` : (object.kind ? (`${object.kind} (${object.description})`) : (object.age ? `${object.age} ${object.gender} (${object.activity})` : 'N/A'))}
                                            </TableCell>
                                            <TableCell>Location { index + 1 }</TableCell>
                                            <TableCell>{ date } { time }</TableCell>
                                            <TableCell>{tObj.researchers.map((researcher, index) => (index !== (tObj.researchers.length - 1) ? `${researcher.firstname} ${researcher.lastname}, ` : `${researcher.firstname} ${researcher.lastname}`))}</TableCell>
                                        </TableRow>
                                
                                ))
                            ))
                            )))
                        ) 
                    ))
                // Data Drawers
                : Object.entries(row).map(([instance, data])=>(
                        Object.values(data.data).map((inst, ind) => (
                            instance.split('.')[0] === 'nature_maps' ? 
                                Object.entries(inst).map(([type, pointArr])=>(
                                    type === '_id' || type === 'time' ? null : 
                                        (type === 'weather' ? 
                                            <TableRow key={ind}>
                                                <TableCell colSpan={2} className='category'>
                                                    {testNames(instance.split('.')[0])}
                                                </TableCell>
                                                <TableCell colSpan={1} className='value'>
                                                    {`${pointArr.temperature}`}&ordm;F
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                    `Weather ${pointArr.description}`
                                                    }
                                                </TableCell>
                                                <TableCell>N/A</TableCell>
                                                <TableCell>{`${instance.split('.')[1]} ${instance.split('.')[2]}`}</TableCell>
                                            </TableRow> 
                                            : pointArr.map((nature, in1)=>(
                                                <TableRow key={`${ind}.${in1}`}>
                                                    <TableCell colSpan={2} className='category'>
                                                        {testNames(instance.split('.')[0])}
                                                    </TableCell>
                                                    <TableCell colSpan={1} className='value'>
                                                        {
                                                            nature.area ? `${nature.area} ft\u00B2` : nature.kind
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            type === 'animal' ? `Animal: ${nature.description}` : (type === 'water' ? `Water: ${nature.description}` : `Vegetation: ${nature.description}`)
                                                        }
                                                    </TableCell>
                                                    <TableCell>Location {in1 + 1}</TableCell>
                                                    <TableCell>{`${instance.split('.')[1]} ${instance.split('.')[2]}`}</TableCell>
                                                </TableRow>
                                            ))
                                        )
                                ))
                            :
                                instance.split('.')[0] === 'light_maps' || instance.split('.')[0] === 'order_maps' ? 
                                    (inst.points).map((point, i2) => (
                                        <TableRow key={`${ind}.${i2}`}>
                                            <TableCell colSpan={2} className='category'>
                                                {testNames(instance.split('.')[0])}
                                            </TableCell>
                                            <TableCell colSpan={1} className='value'>
                                                { point.kind ? point.kind : 'N/A' }
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    point.description ? `${point.description}` : (point.light_description ? `${point.light_description}` : `${point.access_description}`)
                                                }
                                            </TableCell>
                                            <TableCell>Location {i2 + 1}</TableCell>
                                            <TableCell>{`${instance.split('.')[1]} ${instance.split('.')[2]}`}</TableCell>
                                        </TableRow>
                                    )) 
                                    : instance.split('.')[0] === 'access_maps' ?
                                   // (inst).map((object, index) => {

                                    //console.log("🚀 ~ file: ActivityTable.js:345 ~ inst:", inst);


                                        //return(
                                            (<TableRow key={`${ind}`}>
                                            <TableCell colSpan={2} className='category'>
                                                {testNames(instance.split('.')[0])}
                                            </TableCell>
                                            <TableCell colSpan={1} className='value'>
                                                {!inst.inPerimeter && inst.distanceFromArea !== undefined ? `${inst.distanceFromArea.toFixed(2)} ft from perimeter` : "Inside perimeter"}
                                                {/* {object.accessType === "Access Path" ? 
                                                    (object.area > 0 ? 
                                                        (`${object.area} ft`) 
                                                        : 'N/A') 
                                                    : (object.area > 0 ? 
                                                        (`${object.area} ft\u00B2`) 
                                                        : 'N/A')} */}
                                            </TableCell>
                                            <TableCell colSpan={1} className='type'>
                                                {(`${inst.accessType} (${inst.description})`)}
                                            </TableCell>
                                            <TableCell>Location {ind + 1}</TableCell>
                                            <TableCell>{`${instance.split('.')[1]} ${instance.split('.')[2]}`}</TableCell>
                                        </TableRow>)
                                  //  )
                                //})
                                    : 
                                    ( instance.split('.')[0] === 'section_maps' ?
                                        (ind == 0 ? null : 
                                        <TableRow key={`${ind}`}>
                                            <TableCell colSpan={2} className='category'>
                                                {testNames(instance.split('.')[0])}
                                            </TableCell>
                                            <TableCell colSpan={1} className='value'>
                                                { inst.title ? inst.title : 'N/A'}
                                            </TableCell>
                                            <TableCell colSpan={1} className='type'>
                                                { inst.tags ? `${inst.tags}` : 'N/A tags' }
                                            </TableCell>
                                            <TableCell></TableCell>
                                            <TableCell>{`${instance.split('.')[1]} ${instance.split('.')[2]}`}</TableCell>
                                        </TableRow>)
                                    : 
                                        (instance.split('.')[0] === 'program_maps' ? 
                                        inst.floorData.map((floor, ind) => (
                                            floor.programs.map((program, i) => (
                                                <TableRow key={`${ind}`}>
                                                    <TableCell colSpan={2} className='category'>
                                                        {testNames(instance.split('.')[0])}
                                                    </TableCell>
                                                    <TableCell colSpan={1} className='value'>
                                                        { program.sqFootage ? `${program.sqFootage.toFixed(1)} ft\u00B2` : 'N/A'}
                                                    </TableCell>
                                                    <TableCell colSpan={1} className='type'>
                                                        { program.programType ? `${program.programType}` : 'N/A tags' }
                                                    </TableCell>
                                                    <TableCell>Floor {floor.floorNum}</TableCell>
                                                    <TableCell>{`${instance.split('.')[1]} ${instance.split('.')[2]}`}</TableCell>
                                                </TableRow>
                                            ))
                                        ))
                                        :
                                        <TableRow key={ind}>
                                        <TableCell colSpan={2} className='category'>
                                            {testNames(instance.split('.')[0])}
                                        </TableCell>
                                        <TableCell colSpan={1} className='value'>
                                            {
                                                instance.split('.')[0] === 'sound_maps' ? `${inst.average} dB` : (inst.value && (inst.kind === 'Construction' || inst.kind === 'Constructed') ? `${inst.value} ft` : (inst.value && inst.kind ? `${inst.value} ft\u00B2` : (inst.posture ? inst.posture : (inst.mode ? `${inst.mode}` : 'N/A'))))
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {
                                                inst.average ? `${inst.sound_type}` : (inst.kind ? (`${inst.kind} (${inst.description})`) : (inst.age ? `${inst.age} ${inst.gender} (${inst.activity})` : 'N/A'))
                                            }
                                        </TableCell>
                                        <TableCell>Location {ind + 1}</TableCell>
                                        <TableCell>{`${instance.split('.')[1]} ${instance.split('.')[2]}`}</TableCell>
                                    </TableRow>)
                        )))

                    ))
                }
            </TableBody>
        </Table>
    </Box>
)

Row.propTypes = {
    row: PropTypes.shape({}).isRequired,
};

export default function ActivityTable(props) {
    /* Nested Expandable Tables */
    const activityRow = props.activity;

    return(
            props.type === 0 ? (Object.entries(activityRow).sort(([categoryA, datesA], [categoryB, datesB]) => {
                if (categoryA < categoryB) {
                    return -1;
                } else if (categoryA > categoryB) {
                    return 1;
                } else {
                    return 0;
                }
            }).map(([type, obj]) => (
                <Row key={ type } name={ type } row={ obj } open={props.open}/>
            ))) : subtable(activityRow, 1, '', '')
    );
}