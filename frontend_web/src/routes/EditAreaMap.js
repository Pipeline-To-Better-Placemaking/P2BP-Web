import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import axios from '../api/axios';
import Map from '../components/Map';

export default function EditAreaMap() {
    const loc = useLocation();
    const nav = useNavigate();
    const area = loc.state.area ? loc.state.area : {}
    const [name, setName] = React.useState(area.title ? area.title : 'New Area');
    var temp = [];
    var updatedPoints = [];
    var updatedArea = {};

    if(loc.state.area){
        area.points.forEach((point, index)=>(
            temp.push({ lat: point.latitude, lng: point.longitude})
        ))
    }

    const updateArea = (newarea) => async (e) => {
        e.preventDefault();

        newarea.forEach((point, index) => (
            updatedPoints.push({ latitude: point.lat, longitude: point.lng })
        ));
        updatedArea = {title: name, points: updatedPoints};

        try {
            await axios.put(`/projects/${loc.pathname.split('/')[5]}/areas/${area._id}`, JSON.stringify(updatedArea), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${loc.state.userToken.token}`
                },
                withCredentials: true
            });

            nav(`../edit/${loc.pathname.split('/')[5]}`, { replace: true, state: { project: loc.state.project, owner: loc.state.owner, team: loc.state.team, userToken: loc.state.userToken } })

        } catch (error) {
            console.log('ERROR: ', error);
            return;
        }
    }

    const addArea = (newarea) => async (e) => {
        e.preventDefault();

        newarea.forEach((point, index) => (
            updatedPoints.push({ latitude: point.lat, longitude: point.lng })
        ));
        updatedArea = { title: name, points: updatedPoints };
        console.log(updatedArea)

        try {
            await axios.post(`/projects/${loc.pathname.split('/')[5]}/areas`, JSON.stringify(updatedArea), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${loc.state.userToken.token}`
                },
                withCredentials: true
            });

            nav(`../edit/${loc.pathname.split('/')[5]}`, { replace: true, state: { project: loc.state.project, owner: loc.state.owner, team: loc.state.team, userToken: loc.state.userToken } })

        } catch (error) {
            console.log('ERROR: ', error);
            return;
        }
    }

    // Return area point values need to be reconverted to objects with latitude longitude keys 
    return (
        <div id='editAreaMap' className='pages'>
            {/* Empty New Project page, Google map component w/ searchable locations for new projects */}
            <TextField 
                style={{ position: 'fixed', top: '70px', zIndex: '9999', backgroundColor: 'white', width: '30vw', margin: '5px', alignSelf: 'center', borderRadius: '5px', left: '35vw'}}
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <Map center={loc.state.area ? temp[0] : loc.state.center} area={temp} type={6} zoom={16} update={loc.state.area ? updateArea : addArea}/>
        </div>
    );
}