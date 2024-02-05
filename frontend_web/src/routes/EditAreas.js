import * as React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Card from 'react-bootstrap/Card';
import axios from '../api/axios';

export default function EditAreas(){
    const loc = useLocation();
    const nav = useNavigate();
    const areas = loc.state ? loc?.state?.areas : [];
    var currId = '';

    const areaCards = (areas) => (
        areas.map((obj, index) => (
            <Card key={index} className='areaCards'>
                <Card.Body>
                    <h4>{obj.title}</h4>
                    <Button component={Link} to='area_map' state={{...loc?.state, area: obj}}>Edit</Button>
                    <Button onClick={openConfirmation(obj.title, obj._id)}>Delete</Button>
                </Card.Body>
            </Card>
        ))
    );

    const openConfirmation = (title, id) => (e) => {
        const popup = document.getElementById('deleteWindow');
        const inner = document.getElementById('popUpText');
        currId = id;
        inner.innerHTML = '';
        inner.innerHTML = `<h6>Are you sure you would like to delete '${title}'?<br/> This cannot be undone.</h6>`
        popup.style.display = 'flex';
    }

    const closeWindow = (e) => {
        e.preventDefault();
        //console.log('close');
        const popup = document.getElementById('deleteWindow');
        const inner = document.getElementById('popUpText');
        popup.style.display = 'none';
        inner.innerHTML = '';
        currId = '';
    }

    const deleteArea = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`/projects/${loc.pathname.split('/')[5]}/areas/${currId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${loc.state.userToken.token}`
                },
                withCredentials: true
            });

            closeWindow(e);
            nav(`../edit/${loc.pathname.split('/')[5]}`, { replace: true, state: { project: loc.state.project, owner: loc.state.owner, team: loc.state.team, userToken: loc.state.userToken } });

        } catch (error) {
            console.log('ERROR: ', error);
            return;
        }
    }

    return (
        <div id='editAreas'>
            <Card id='editAreaCard'>
                <Card.Header >
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <h1>{loc?.state?.project}</h1>
                    </div>
                </Card.Header>
                <Card.Body id='areaCardContent'>
                    <Button id='addNewArea'component={Link} to='area_map' state={loc?.state}>New Area</Button>
                    {areaCards(areas)}
                    <Button component={Link} to={`../edit/${loc.pathname.split('/')[5]}`} state={{ project: loc.state.project, owner: loc.state.owner, team: loc.state.team, userToken: loc.state.userToken }}>Cancel</Button>
                </Card.Body>
            </Card>
            <div id='deleteWindow' style={{ display: 'none', position: 'fixed', justifyContent: 'center', alignItems: 'center' }}>
                <div id='popUpBlock'>
                    <div id='popUpText'></div>
                    <Button id='deleteButton' onClick={deleteArea}>Confirm</Button>
                    <Button id='cancelButton' onClick={closeWindow}>Cancel</Button>
                </div>
            </div>
        </div>
    );
}