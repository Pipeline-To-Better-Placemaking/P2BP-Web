import * as React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Card from 'react-bootstrap/Card';
import axios from '../api/axios';

export default function EditPoints(){
    const nav = useNavigate();
    const loc = useLocation();
    const standingPoints = loc?.state?.points
    var currId;

    const pointCards = (points) => (
        points.map((value, index) => (
            <Card key={index} className='pointCards'>
                <Card.Body>
                    <h4>{value.title}</h4>
                    <Button component={Link} to='point_map' state={{ ...loc?.state, point: value}}>Edit</Button>
                    <Button onClick={openConfirmation(value.title, value._id)}>Delete</Button>
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
        console.log('close');
        const popup = document.getElementById('deleteWindow');
        const inner = document.getElementById('popUpText');
        popup.style.display = 'none';
        inner.innerHTML = '';
        currId = '';
    }

    const deletePoint = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`/projects/${loc.pathname.split('/')[5]}/standing_points/${currId}`, {
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

    return(
        <div id='editPoints'>
            <Card id='pointCard'>
                <Card.Header >
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <h1>{loc?.state?.project}</h1>
                    </div>
                </Card.Header>
                <Card.Body id='pointCardContent'>
                    <Button id='addNewPoint' component={Link} to='point_map' state={loc.state}>New Standing Point</Button>
                    {pointCards(standingPoints)}
                    <Button component={Link} to={`../edit/${loc.pathname.split('/')[5]}`} state={{project: loc.state.project, owner: loc.state.owner, team: loc.state.team, userToken: loc.state.userToken}}>Cancel</Button>
                </Card.Body>
            </Card>
            <div id='deleteWindow' style={{ display: 'none', position: 'fixed', justifyContent: 'center', alignItems: 'center' }}>
                <div id='popUpBlock'>
                    <div id='popUpText'></div>
                    <Button id='deleteButton' onClick={deletePoint}>Confirm</Button>
                    <Button id='cancelButton' onClick={closeWindow}>Cancel</Button>
                </div>
            </div>
        </div>
    );
}