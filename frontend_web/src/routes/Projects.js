import * as React from 'react';
import axios from '../api/axios.js';
import Button from '@mui/material/Button';
import DisplayCards from '../components/DisplayCards';
import { Link, useLocation } from 'react-router-dom';
import './routes.css';

export default function Projects(props){
    const [teamInfo, setTeamInfo] = React.useState();
    const teamAndUser = useLocation();
    const [message, setMessage] = React.useState('');
    const deleteResp = React.useRef(null);
    // Team id is in URL
    const teamId = teamAndUser.pathname.split('/')[3];
    // State is passed through Links accessed via useLocation
    const user = teamAndUser.state ? teamAndUser.state.userToken : {};
    var selected = '';

    const openConfirmation = (title, id) => (e) => {
        // Opens confirmation window for deleting a project
        const popup = document.getElementById('deleteWindow');
        const inner = document.getElementById('popUpText');
        selected = id;
        inner.innerHTML = '';
        inner.innerHTML = `<h6>Are you sure you would like to delete '${title}' project?<br/> This cannot be undone.</h6>`
        popup.style.display = 'flex';
    }

    //Called from pop up (confirmation) window below
    const deleteProject = async (e) => {
        e.preventDefault();
        console.log(selected);
        try {
            await axios.delete(`/projects/${selected}`, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${user.token}`
                },
                withCredentials: true
            });

            //on success  
            closeWindow(e);
            // reload team projects
            teamPull();
        } catch (error) {
            console.log('ERROR: ', error);
            setMessage(error.response.data?.message);
            deleteResp.current.style.display = 'inline-block';
            return;
        }
    }

    const closeWindow = (e) => {
        e.preventDefault();
        console.log('close');
        const popup = document.getElementById('deleteWindow');
        const inner = document.getElementById('popUpText');
        popup.style.display = 'none';
        inner.innerHTML = '';
        selected = '';
        setMessage('');
        deleteResp.current.style.display = 'none';
    }

    const teamPull = async () => {
        
        try {
            const response = await axios.get(`/teams/${teamId}`, {
                headers: {
                    // 'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${user.token}`
                },
                withCredentials: true
            });

            setTeamInfo(response.data);
        } catch (error) {
            console.log('ERROR: ', error);
            return;
        }
    }

    // Used to load projects from team ID
    React.useEffect(() => {
        teamPull();
    },[]);

    return(
        <div id='teamHome'>
            <div style={{display:'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                <h1 style={{margin: '20px 0px 20px 0px', textAlign: 'center'}}>
                    {teamInfo?.title}
                </h1>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    <div style={{ alignSelf: 'center' }}>Owner: {teamInfo?.users[0].firstname} {teamInfo?.users[0].lastname}</div>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                        {teamInfo?.users.map((user, index)=>(
                            index !== (teamInfo?.users.length - 1) && teamInfo?.users[index].role !== 'owner' ? 
                                <span>{user.firstname} {user.lastname},&nbsp;</span>
                            : 
                                (index === (teamInfo?.users.length - 1) && teamInfo?.users[index].role !== 'owner' ? 
                                    <span>{user.firstname} {user.lastname}</span> : null )
                        ))}
                    </div>
                </div>
                <Button component={Link} to={`/home/edit/${teamId}`} state={teamAndUser.state ? teamAndUser.state : null} style={{ width: '40vw' }}>Edit Team</Button>
            </div>
            <div id='newProjectButtonBox'>
                <Button 
                    id='newProjectButton' 
                    variant='contained'
                    component={ Link } 
                    state={ teamAndUser.state }
                    to='new'
                >
                    New Project
                </Button>
            </div>
            {/* type = 1 implies the project style cards, need to be loaded in one by one without loading conditional */}
            <div id='cardFlexBox'>
                {
                    teamInfo?.projects?.map((project, index) => (
                        <DisplayCards key={(project._id + index)} type={1} project={project} owner={teamInfo.users[0]} user={user} team={teamAndUser.state ? teamAndUser.state.team : null} open={openConfirmation}/>
                    ))
                }
            </div>
            <div id='deleteWindow' style={{ display: 'none', position: 'fixed', justifyContent: 'center', alignItems: 'center' }}>
                <div id='popUpBlock'>
                    <span ref={deleteResp} style={{ display: 'none', color: 'red' }}>{message}</span>
                    <div id='popUpText'></div>
                    <Button id='deleteButton' onClick={deleteProject}>Confirm</Button>
                    <Button id='cancelButton' onClick={closeWindow}>Cancel</Button>
                </div>
            </div>
        </div>
    );
}