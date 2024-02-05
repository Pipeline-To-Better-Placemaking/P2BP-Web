import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Close from '@mui/icons-material/Close';
import Switch from '@mui/material/Switch';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import ActivityTable from './ActivityTable';
import Charts from './Charts';
import { testNames } from '../functions/HelperFunctions';
import './controls.css';

export default function MapDrawer(props) {
    const drawers = props.drawers;
    const area = props.area;
    // Selections holds all selected activity instances and is used to render the data for the data and graph drawers
    // aka activities with switch toggled 'on', empty because key values are rendered depending on data 
    const [selections, setSelections] = React.useState({});
    const [stationary, setStationary] = React.useState({});
    const [moving, setMoving] = React.useState({});
    const [order, setOrder] = React.useState({});
    const [boundaries, setBoundaries] = React.useState({});
    const [lighting, setLighting] = React.useState({});
    const [nature, setNature] = React.useState({});
    const [sound, setSound] = React.useState({});
    const [access, setAccess] = React.useState({});
    const [program, setProgram] = React.useState({});
    const [section, setSection] = React.useState({});

    // Holds boolean toggle values to pass onto the map and determing if the value needs to be added or removed to selections
    const [checked, setChecked] = React.useState({});

    // Boolean toggle for collapsing time sublists
    const [timeOpen, setTimeOpen] = React.useState({});

    const menuAnchors = {
        Results: 'left',
        Graphs: 'right',
        Data: 'bottom'
    };

    const [dateOpen, setDateOpen] = React.useState({
        stationary_maps: false,
        moving_maps: false,
        order_maps: false,
        boundaries_maps: false,
        light_maps: false,
        nature_maps: false,
        sound_maps: false,
        access_maps: false,
        program_maps: false,
        section_maps: false,
    });

    // Boolean toggle for opening the drawers with the Activity, Graphs, and Data drawers
    const [state, setState] = React.useState({
        left: false,
        bottom: false,
        right: false,
    });

    const handleClickDate = (text, open) => (event) => {
        setDateOpen({ ...dateOpen, [text]: open });
    };

    const handleClickTime = (text, open) => (event) => {
        setTimeOpen({ ...timeOpen, [text]: open });
    };

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.title === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const toggleSwitch = (category, date, time) => (event) => {
        setChecked({ ...checked, [`${category}.${date}.${time}`]: event.target.checked });
        // default is false has reverse setting so !checked[cat + date] must be sent
        // selected means checked[..]=false
        props.selection(category, date, time, !checked[`${category}.${date}.${time}`]);
        if (!checked[`${category}.${date}.${time}`]) {
            var newSelections = selections;
            var newEntry;
            newSelections[`${category}.${date}.${time}`] = drawers.Results[category][date][time];
            setSelections(newSelections);
            switch (category) {
                case 'stationary_maps':
                    newEntry = stationary;

                    if (!newEntry[`${date}.${time}`]) newEntry[`${date}.${time}`] = [];
                    newEntry[`${date}.${time}`].push(drawers.Results[category][date][time].data);
                    setStationary(newEntry);
                    break;
                case 'moving_maps':
                    newEntry = moving;

                    if (!newEntry[`${date}.${time}`]) newEntry[`${date}.${time}`] = [];
                    newEntry[`${date}.${time}`].push(drawers.Results[category][date][time].data);
                    setMoving(newEntry);
                    break;
                case 'order_maps':
                    newEntry = order;

                    if (!newEntry[`${date}.${time}`]) newEntry[`${date}.${time}`] = [];
                    newEntry[`${date}.${time}`].push(drawers.Results[category][date][time].data);
                    setOrder(newEntry);
                    break;
                case 'boundaries_maps':
                    newEntry = boundaries;

                    if (!newEntry[`${date}.${time}`]) newEntry[`${date}.${time}`] = [];
                    newEntry[`${date}.${time}`].push(drawers.Results[category][date][time].data);
                    setBoundaries(newEntry);
                    break;

                case 'section_maps':
                    newEntry = section;

                    if (!newEntry[`${date}.${time}`]) newEntry[`${date}.${time}`] = [];
                    newEntry[`${date}.${time}`].push(drawers.Results[category][date][time].data);
                    setSection(newEntry);
                    break;
                case 'light_maps':
                    newEntry = lighting;

                    if (!newEntry[`${date}.${time}`]) newEntry[`${date}.${time}`] = [];
                    newEntry[`${date}.${time}`].push(drawers.Results[category][date][time].data);
                    setLighting(newEntry);
                    break;
                case 'nature_maps':
                    newEntry = nature;

                    if (!newEntry[`${date}.${time}`]) newEntry[`${date}.${time}`] = [];
                    newEntry[`${date}.${time}`].push(drawers.Results[category][date][time].data);
                    setNature(newEntry);
                    break;
                case 'sound_maps':
                    newEntry = sound;

                    if (!newEntry[`${date}.${time}`]) newEntry[`${date}.${time}`] = [];
                    newEntry[`${date}.${time}`].push(drawers.Results[category][date][time].data);
                    setSound(newEntry);
                    break;
                case 'access_maps':
                    newEntry = access;

                    if (!newEntry[`${date}.${time}`]) newEntry[`${date}.${time}`] = [];
                    newEntry[`${date}.${time}`].push(drawers.Results[category][date][time].data);
                    setAccess(newEntry);
                    break;
                case 'program_maps':
                    newEntry = program;

                    console.log("🚀 ~ file: MapDrawers.js:165 ~ toggleSwitch ~ program:", program);


                    if (!newEntry[`${date}.${time}`]) newEntry[`${date}.${time}`] = [];
                    newEntry[`${date}.${time}`].push(drawers.Results[category][date][time].data);
                    setProgram(newEntry);
                    break;
                default:
                    console.log(`Error handling selection change.`);
            }
        } else {
            var delSelections = selections;
            var removeEntry;
            delete delSelections[`${category}.${date}.${time}`];
            setSelections(delSelections);

            switch (category) {
                case 'stationary_maps':
                    removeEntry = stationary;
                    delete removeEntry[`${date}.${time}`]
                    setStationary(removeEntry);
                    break;
                case 'moving_maps':
                    removeEntry = moving;
                    delete removeEntry[`${date}.${time}`]
                    setMoving(removeEntry);
                    break;
                case 'order_maps':
                    removeEntry = order;
                    delete removeEntry[`${date}.${time}`]
                    setOrder(removeEntry);
                    break;
                case 'boundaries_maps':
                    removeEntry = boundaries;
                    delete removeEntry[`${date}.${time}`]
                    setBoundaries(removeEntry);
                    break;

                case 'section_maps':
                    removeEntry = section;
                    delete removeEntry[`${date}.${time}`]
                    setSection(removeEntry);
                    break;

                case 'light_maps':
                    removeEntry = lighting;
                    delete removeEntry[`${date}.${time}`]
                    setLighting(removeEntry);
                    break;
                case 'nature_maps':
                    removeEntry = nature;
                    delete removeEntry[`${date}.${time}`]
                    setNature(removeEntry);
                    break;
                case 'sound_maps':
                    removeEntry = sound;
                    delete removeEntry[`${date}.${time}`]
                    setSound(removeEntry);
                    break;
                case 'access_maps':
                    removeEntry = access;
                    delete removeEntry[`${date}.${time}`]
                    setAccess(removeEntry);
                    break;
                case 'program_maps':
                    removeEntry = program;
                    delete removeEntry[`${date}.${time}`]
                    setProgram(removeEntry);
                    break;
                default:
                    console.log(`Error handling selection change.`);
            }
        }
    };

    const list = (name, drawer) => (
        <Box
            sx={{ width: menuAnchors[name] === 'top' || menuAnchors[name] === 'bottom' ? 'auto' : 250 }}
            id={menuAnchors[name] + 'ListBox'}
        >
            <List>
                {Object.entries(drawer).sort(([categoryA, datesA], [categoryB, datesB]) => {
                    if (categoryA < categoryB) {
                        return -1;
                    } else if (categoryA > categoryB) {
                        return 1;
                    } else {
                        return 0;
                    }
                }).map(([category, dates], index) => (
                    <div key={category}>
                        <ListItemButton
                            key={category + index}
                            onClick={handleClickDate(category, !dateOpen[category])}
                        >
                            <ListItemText primary={category ? testNames(category) : ''} />
                            {menuAnchors[name] === 'left' ?
                                (dateOpen[category] ? <ExpandLess /> : <ExpandMore />) : null}
                        </ListItemButton>
                        {menuAnchors[name] === 'left' ? dateList(category, dates) : null}
                    </div>
                ))}
            </List>
        </Box>
    );

    function dateList(title, dates) {
        return (
            <Collapse in={dateOpen[title]} timeout='auto' unmountOnExit>
                <List component='div' disablePadding>
                    {Object.entries(dates).sort((a,b) => a.date - b.date).map(([date, times], index) => (
                        <div key={title + date}>
                            <ListItemButton
                                key={title + date + index} sx={{ pl: 4, bgcolor: '#dcedfc' }}
                                onClick={handleClickTime(`${title}${date}`, !timeOpen[`${title}${date}`])}
                            >
                                <ListItemText primary={date} />
                                {date ? (timeOpen[`${title}${date}`] ? <ExpandLess /> : <ExpandMore />) : null}
                            </ListItemButton>
                            {timeList(title, date, times)}
                        </div>
                    ))}
                </List>
            </Collapse>
        );
    };

    const timeList = (title, date, times) => (
        <Collapse in={timeOpen[`${title}${date}`]} timeout='auto' unmountOnExit>
            <List component='div' disablePadding>
                {
                    Object.keys(times).sort((a,b) => a.time - b.time).map((time, index) => (
                        time ? <ListItem key={date + time + index} sx={{ pl: 4, bgcolor: '#aed5fa' }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={checked[`${title}.${date}.${time}`] ?
                                            checked[`${title}.${date}.${time}`] : false}
                                        onChange={toggleSwitch(title, date, time, checked[`${title}${date}${time}`])}
                                    />
                                }
                                label={time}
                            />
                        </ListItem> : null
                    ))
                }
            </List>
        </Collapse>
    );

    const dataDrawer = (selections) => (
        <TableContainer component={Paper}>
            {/* type 1 - bottom drawer table */}
            <ActivityTable type={1} activity={selections} />
        </TableContainer>
    );

    const charts = (selections, stationary, moving, order, boundaries, lighting, nature, sound, access, program, section) => (
        <>
            {Object.entries(selections).map(([selection, obj]) => (
                <Charts key={selection} selection={selection} data={obj.data} type={0} projArea={area} />
            ))}
            {Object.keys(stationary)?.length > 1 ? <Charts selection='stationary_maps.Group' data={stationary} type={1} projArea={area} /> : null}
            {Object.keys(moving)?.length > 1 ? <Charts selection='moving_maps.Group' data={moving} type={1} projArea={area} /> : null}
            {Object.keys(order)?.length > 1 ? <Charts selection='order_maps.Group' data={order} type={1} projArea={area} /> : null}
            {Object.keys(boundaries)?.length > 1 ? <Charts selection='boundaries_maps.Group' data={boundaries} type={1} projArea={area} /> : null}
            {Object.keys(lighting)?.length > 1 ? <Charts selection='light_maps.Group' data={lighting} type={1} projArea={area} /> : null}
            {Object.keys(nature)?.length > 1 ? <Charts selection='nature_maps.Group' data={nature} type={1} projArea={area} /> : null}
            {Object.keys(sound)?.length > 1 ? <Charts selection='sound_maps.Group' data={sound} type={1} projArea={area} /> : null}
            {Object.keys(access)?.length > 1 ? <Charts selection='access_maps.Group' data={access} type={1} projArea={area} /> : null}
            {Object.keys(program)?.length > 1 ? <Charts selection='program_maps.Group' data={program} type={1} projArea={area} /> : null}
            {Object.keys(section)?.length > 1 ? <Charts selection='section_maps.Group' data={section} type={1} projArea={area} /> : null}
        </>
    );

    /* Drawers use objects and are setting the keys as menu values (i.e. date/time).
        Change the references for the menu titles or restructure the objects if drawer data
        is changed to sort/list items by name instead of date a time
    */

    return (
        <div id='projectFrame'>
            {Object.entries(drawers).map(([name, data]) => (
                <React.Fragment key={menuAnchors[name]}>
                    <Button
                        id={menuAnchors[name] + 'Button'}
                        onClick={toggleDrawer(menuAnchors[name], !state[menuAnchors[name]])}
                    >
                        {name}
                    </Button>
                    <Drawer
                        id={menuAnchors[name] + 'Drawer'}
                        anchor={menuAnchors[name]}
                        open={state[menuAnchors[name]]}
                        onClose={toggleDrawer(menuAnchors[name], false)}
                        hideBackdrop={true}
                    >
                        {menuAnchors[name] === 'bottom' ?
                            <Button
                                id={menuAnchors[name] + 'CloseButton'}
                                sx={{ position: 'fixed', alignSelf: 'center' }}
                                onClick={toggleDrawer(menuAnchors[name], !state[menuAnchors[name]])}
                            >
                                Close <Close />
                            </Button>
                            : null}
                        {menuAnchors[name] === 'left' ?
                            list(name, data)
                            : (menuAnchors[name] === 'bottom' ? dataDrawer(selections) : (menuAnchors[name] === 'right' ? charts(selections, stationary, moving, order, boundaries, lighting, nature, sound, access, program, section) : null))}
                    </Drawer>
                </React.Fragment>
            ))}
        </div>
    );
}