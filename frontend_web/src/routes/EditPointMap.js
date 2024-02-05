import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import axios from '../api/axios';
import Map from '../components/Map';

export default function EditPointMap(){
    const loc = useLocation();
    const nav = useNavigate();
    const point = loc.state.point ? loc.state.point : {}
    const [name, setName] = React.useState(point.title ? point.title : 'New Point');
    // reformatted from DB where mobile uses latitude and longitude, and Google Maps JS uses lat and lng
    var conv = {};
    if(loc.state.point){
        conv = { '_id': point._id, lat: point.latitude, lng: point.longitude }
    } else {
        conv = { lat: loc.state.points[0].latitude, lng: loc.state.points[0].longitude }
    }
    var updatedPoint = {};

    const updatePoint = (point) => async (e) => {
        e.preventDefault();
        updatedPoint = {title: name, latitude: point.lat, longitude: point.lng};

        try {
            axios.put(`/projects/${loc.pathname.split('/')[5]}/standing_points/${conv._id}`, JSON.stringify(updatedPoint), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${loc.state.userToken.token}`
                },
                withCredentials: true
            });

            nav(`../edit/${loc.pathname.split('/')[5]}`, { replace: true, state: { project: loc.state.project, owner: loc.state.owner, team: loc.state.team, userToken: loc.state.userToken }});

        } catch (error) {
            console.log('ERROR: ', error);
            return;
        }
    }

    const addPoint = (point) => async (e) => {
        e.preventDefault();
        updatedPoint = { title: name, latitude: point.lat, longitude: point.lng };

        try {
            axios.post(`/projects/${loc.pathname.split('/')[5]}/standing_points`, JSON.stringify(updatedPoint), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${loc.state.userToken.token}`
                },
                withCredentials: true
            });

            nav(`../edit/${loc.pathname.split('/')[5]}`, { replace: true, state: { project: loc.state.project, owner: loc.state.owner, team: loc.state.team, userToken: loc.state.userToken } });

        } catch (error) {
            console.log('ERROR: ', error);
            return;
        }
    }

    return(
        <div id='editPointMap'>
            {/* Empty New Project page, Google map component w/ searchable locations for new projects */}
            <TextField
                style={{ position: 'fixed', top: '70px', zIndex: '9999', backgroundColor: 'white', width: '30vw', margin: '5px', alignSelf: 'center', borderRadius: '5px', left: '35vw' }}
                value={name}
                onChange={e => setName(e.target.value)}
            />
            {/* 7 is for editing points */}
            <Map center={conv} type={7} zoom={16} update={loc.state.point ? updatePoint : addPoint}/>
        </div>
    );
}