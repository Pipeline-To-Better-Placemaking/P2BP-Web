import * as React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Card from 'react-bootstrap/Card';
import DoneIcon from '@mui/icons-material/Done';
import axios from '../api/axios';
import TimeForm from '../components/TimeForm';
import { testNames } from '../functions/HelperFunctions';
import { TSDialog } from '../FAQDialog';
import '../components/controls.css';

export default function NewActivityTimes(props) {
    const nav = useNavigate();
    const loc = useLocation();
    const [message, setMessage] = React.useState('');
    const response = React.useRef(null);
    const [timeSlots, setTimeSlots] = React.useState([]);
    const date = new Date();
    const [activity, setActivity] = React.useState({
        title: loc.state.form.title && loc.state.form.title !== '' ? loc.state.form.title : testNames(loc.state.form.activity),
        activity: loc.state.form.activity,
        date: loc.state.form.date,
        timer: loc.state.form.timer,
        number: 0
    });

    const collections = {
        boundaries_maps: ['boundaries_collections', 'boundary'],
        light_maps: ['light_collections', 'light'],
        moving_maps: ['moving_collections', 'moving'],
        nature_maps: ['nature_collections', 'nature'],
        order_maps: ['order_collections', 'order'],
        sound_maps: ['sound_collections', 'sound'],
        stationary_maps: ['stationary_collections', 'stationary'],
        access_maps: ['access_collections', 'access'],
        program_maps: ['program_collections', 'program'],
        section_maps: ['section_collections', 'section'],
    }

    //dynamically adds removes timeSlot cards for the activity
    const timeCards = (timeSlots) => (
        timeSlots.map((value, index) => (
            <Card key={value.instance} className='timeSlots'>
                <Card.Body>
                    {value.points ?
                        <TimeForm
                            type={value.type}
                            instance={value.instance}
                            index={value.index !== index ? index : value.index}
                            time={value.time}
                            maxResearchers={value.maxResearchers}
                            points={value.points}
                            deleteTime={deleteTimeSlot}
                            updateTime={updateTimeSlot}
                            standingPoints={props.projectInfo.standingPoints}
                        /> :
                        <TimeForm
                            type={value.type}
                            instance={value.instance}
                            index={value.index !== index ? index : value.index}
                            time={value.time}
                            maxResearchers={value.maxResearchers}
                            deleteTime={deleteTimeSlot}
                            updateTime={updateTimeSlot}
                            standingPoints={props.projectInfo.standingPoints}
                        />
                    }
                </Card.Body>
            </Card>
        ))
    );

    function newTime(e) {
        var temp = timeSlots;
        if (activity.activity !== 'boundaries_maps' && activity.activity !== 'light_maps' && activity.activity !== 'nature_maps' && activity.activity !== 'order_maps' && activity.activity !== 'program_maps' && activity.activity !== 'section_maps') {
            temp.push({
                type: collections[activity.activity][1],
                instance: activity.number,
                index: temp.length,
                time: `${date.getHours()}:${date.getMinutes() > 10 ? date.getMinutes() : `0${date.getMinutes()}`}`,
                maxResearchers: 0,
                points: {},
                researchers: []
            });
            // Add an else if statement
        } else {
            temp.push({
                type: collections[activity.activity][1],
                instance: activity.number,
                index: temp.length,
                time: `${date.getHours()}:${date.getMinutes() > 10 ? date.getMinutes() : `0${date.getMinutes()}`}`,
                maxResearchers: 0,
                researchers: []
            });
        }
        setTimeSlots(temp);
        //shallow comparison for React to recognize for update
        var num = activity.number;
        num++;
        setActivity({ ...activity, number: num })
    }

    function updateTimeSlot(index, timeForm) {
        var temp = [];
        timeSlots.forEach((card, ind) => ind !== index ? temp.push(card) : temp.push(timeForm));
        setTimeSlots(temp);
    }

    function deleteTimeSlot(index) {
        var temp = [];
        timeSlots.forEach((card, ind) => ind !== index ? temp.push(card) : null);
        setTimeSlots(temp);
    }

    const addNewActivity = async (e) => {
        var isoDate = new Date(`${activity.date}T00:00:00`)
        console.log(isoDate.toISOString());

        try {
            const response = await axios.post(`/projects/${props.projectInfo._id}/${collections[activity.activity][0]}`, JSON.stringify({
                title: activity.title,
                date: isoDate.toISOString(),
                area: props.projectInfo.subareas[0]._id,
                duration: `${activity.timer}`

            }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${loc.state.userToken.token}`
                },
                withCredentials: true
            });

            // create collection then add time slots to the collection
            let collectionDetails = await response.data;
            for (let i = 0; i < timeSlots.length; i++) {
                await addNewTimeSlots(timeSlots[i], activity.title, collectionDetails._id, `${activity.activity}/`, timeSlots[i].type)
            }

            collectionDetails.test_type = collections[activity.activity][1];
            collectionDetails.date = new Date(collectionDetails.date);
            let area = props.projectInfo.subareas.findIndex((element) => element._id === collectionDetails.area);
            collectionDetails.area = props.projectInfo.subareas[area];

            nav('../map', { replace: true, state: { team: loc.state.team, owner: loc.state.owner, project: loc.state.project, userToken: loc.state.userToken } });

        } catch (error) {
            console.log('ERROR: ', error);
            setMessage(error.response.data?.message);
            response.current.style.display = 'inline-block';
            return;
        }
    }

    const addNewTimeSlots = async (timeSlot, title, id, timeSlotName, type) => {
        var selectedPoints = [];
        console.log(type);
        if (type !== 'boundary' && type !== 'nature' && type !== 'order' && type !== 'survey' && type !== 'program' && type !== 'section') {
            if (timeSlot.points && timeSlot.points.length !== 0) {
                Object.entries(timeSlot.points).forEach(([pointInd, bool]) => (
                    bool ? selectedPoints.push(props.projectInfo.standingPoints[pointInd]) : null
                ))
            }
        } else {
            selectedPoints = props.projectInfo.standingPoints;
        }

        var adjusted = new Date(`${activity.date}T${timeSlot.time}`);
        console.log(adjusted);
        console.log(adjusted.toISOString())

        if (type === 'program') {
            let isoDate = new Date(`${activity.date}T00:00:00`);
            let activityDetails;
            console.log(loc.state.buildingArea);
            console.log(loc.state.sqFootage);

            const buildingData = {
                numFloors: loc.state.numFloors,
                perimeterPoints: loc.state.buildingArea,
                time: isoDate.toISOString(),
                sqFootage: loc.state.sqFootage

            }

            try {
                const response = await axios.post(`/${timeSlotName}`, JSON.stringify({
                    title: title,
                    standingPoints: selectedPoints,
                    researchers: [],
                    project: props.projectInfo._id,
                    collection: id,
                    date: (adjusted.toISOString()),
                    maxResearchers: `${timeSlot.maxResearchers}`,
                    data: buildingData

                }), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': `Bearer ${loc.state.userToken.token}`
                    },
                    withCredentials: true
                });

                activityDetails = await response.data;

            } catch (error) {
                console.log('ERROR: ', error);
                setMessage(error.response.data?.message);
                response.current.style.display = 'inline-block';
                return;
            }

            let floorsArr = [];

            for (let i = 0; i < loc.state.numFloors; i++) {

                // const floorData = {
                //     map: activityDetails._id,
                //     floorNum: (i+1),
                //     programCount: 0
                // }
                console.log(activityDetails._id);
                try {
                    const response = await axios.post(`/program_floors`, JSON.stringify({
                        mapId: activityDetails._id,
                        floorNum: (i + 1),
                        programCount: 0
                    }), {
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                            'Authorization': `Bearer ${loc.state.userToken.token}`
                        },
                        withCredentials: true
                    });
                    let floorId = await response.data._id;
                    floorsArr.push(floorId);

                } catch (error) {
                    console.log('ERROR: ', error);
                    setMessage(error.response.data?.message);
                    response.current.style.display = 'inline-block';
                    return;
                }
            }


            try {
                const response = await axios.put(`/${timeSlotName}/${activityDetails._id}/data/${activityDetails.data[0]._id}`, JSON.stringify({
                    floors: floorsArr
                }), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': `Bearer ${loc.state.userToken.token}`
                    },
                    withCredentials: true
                });
                activityDetails = await response.data;

            } catch (error) {
                console.log('ERROR: ', error);
                setMessage(error.response.data?.message);
                response.current.style.display = 'inline-block';
                return;
            }

            // for (let i = 0; i < loc.state.numFloors; i++)
            // {
            //     try {
            //         const response = await axios.post(`/${timeSlotName}/${activityDetails._id}/data/${activityDetails.data[0]._id}/floors`, JSON.stringify({
            //             floorNum: (i+1),
            //             programCount: 0

            //         }), {
            //             headers: {
            //                 'Content-Type': 'application/json',
            //                 'Access-Control-Allow-Origin': '*',
            //                 'Authorization': `Bearer ${loc.state.userToken.token}`
            //             },
            //             withCredentials: true
            //         });
            //         let floorDetails = await response.data;

            //     } catch (error) {
            //         console.log('ERROR: ', error);
            //         setMessage(error.response.data?.message);
            //         response.current.style.display = 'inline-block';
            //         return;
            //     }
            // }
        }

        else if (type === 'section') {
            let isoDate = new Date(`${activity.date}T00:00:00`);
            let activityDetails;
            console.log(loc.state.path);
            const pathData = {
                path: [{
                    latitude: loc.state.path[0].lat,
                    longitude: loc.state.path[0].lng
                },
                {
                    latitude: loc.state.path[1].lat,
                    longitude: loc.state.path[1].lng,
                }],
                modified: isoDate.toISOString(),
            }

            console.log(pathData);
            try {
                const response = await axios.post(`/${timeSlotName}`, JSON.stringify({
                    title: title,
                    researchers: [],
                    project: props.projectInfo._id,
                    collection: id,
                    date: (adjusted.toISOString()),
                    maxResearchers: `${timeSlot.maxResearchers}`,
                    data: pathData

                }), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': `Bearer ${loc.state.userToken.token}`
                    },
                    withCredentials: true
                });

                activityDetails = await response.data;

                console.log(activityDetails);

            } catch (error) {
                console.log('ERROR: ', error);
                setMessage(error.response.data?.message);
                response.current.style.display = 'inline-block';
                return;
            }
        }

        else {
            try {
                const response = await axios.post(`/${timeSlotName}`, JSON.stringify({
                    title: title,
                    standingPoints: selectedPoints,
                    researchers: [],
                    project: props.projectInfo._id,
                    collection: id,
                    date: (adjusted.toISOString()),
                    maxResearchers: `${timeSlot.maxResearchers}`
                }), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': `Bearer ${loc.state.userToken.token}`
                    },
                    withCredentials: true
                });

                let activityDetails = await response.data;

            } catch (error) {
                console.log('ERROR: ', error);
                setMessage(error.response.data?.message);
                response.current.style.display = 'inline-block';
                return;
            }
        }

    }

    return (
        <div id='newActivityTimes'>
            <Card id='timeCard'>
                <Card.Header>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <h1>{activity.title}</h1>
                        <Button id='createActivityButton' className='confirm' onClick={addNewActivity}>Schedule Activity <DoneIcon /></Button>
                    </div>
                    Project: {props.projectInfo.title}
                    <br />
                    Category: {testNames(activity.activity)}
                    <br />
                    Date: {activity.date}
                    <br />
                    Time per Location: {activity.timer}
                    <TSDialog />
                </Card.Header>
                <Card.Body id='timeCardContent'>
                    <span ref={response} style={{ display: 'inline-block', color: 'red' }}>{message}</span>
                    <Button id='newTimeButton' onClick={newTime} className='scheme'>New Time Slot</Button>
                    {timeCards(timeSlots)}
                </Card.Body>
                <Button component={Link} to='../activities' state={{ team: loc.state.team, owner: loc.state.owner, project: loc.state.project, userToken: loc.state.userToken }}>Cancel</Button>

                {testNames(activity.activity) !== 'Identifying Program' ? null
                    :
                    null}
            </Card>
        </div>
    );
}