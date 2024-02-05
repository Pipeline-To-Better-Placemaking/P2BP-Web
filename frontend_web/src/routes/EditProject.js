import * as React from 'react';
import Card from 'react-bootstrap/Card';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Map from '../components/Map';
import axios from '../api/axios.js';

export default function EditProject() {
    //load project coords and area(?)
    const [projectInfo, setProjectInfo] = React.useState();
    const [standingPoints, setStandingPoints] = React.useState();
    const [loaded, setLoaded] = React.useState(false);
    const [projectName, setProjectName] = React.useState('');
    const [projectDesc, setProjectDesc] = React.useState('');
    const loc = useLocation();
    const nav = useNavigate();
    const segment = loc.pathname.split('/');
    var updatedProj = {};

    const projectData = async () => {
        try {
            const response = await axios.get(`/projects/${segment[5]}`, {
                headers: {
                    // 'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${loc.state?.userToken?.token}`
                },
                withCredentials: true
            });

            // set editable states
            setProjectInfo(response.data);
            setProjectName(response?.data?.title);
            setProjectDesc(response?.data?.description);
            setStandingPoints(response?.data?.standingPoints);
            setLoaded(true);

        } catch (error) {
            //project api get error
            console.log('ERROR: ', error);
            return;
        }
    }

    React.useEffect(() => {
        projectData()
    },[]);

    //update submission (title) function (delete ?), redirect to TeamHome (project listings)
    const updateProject = async (e) => {
        e.preventDefault();
        updatedProj = { title: projectName, description: projectDesc }

        try {
            await axios.put(`/projects/${projectInfo._id}`, JSON.stringify(updatedProj), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${loc.state.userToken.token}`
                },
                withCredentials: true
            });

            nav(`../`, { replace: true, state: { team: loc.state.team, userToken: loc.state.userToken , owner: loc.state.owner} });

        } catch (error) {
            console.log('ERROR: ', error);
            return;
        }
    }

    const deleteProject = async (e) => {
        e.preventDefault();

        try {
            await axios.delete(`/projects/${projectInfo._id}`, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${loc.state.userToken.token}`
                },
                withCredentials: true
            });
            
            nav('../', { replace: true, state: { team: loc.state.team, userToken: loc.state.userToken, owner: loc.state.owner } });

        } catch (error) {
            console.log('ERROR: ', error);
            return;
        }
    }

    var center = { lat: projectInfo?.standingPoints[0].latitude, lng: projectInfo?.standingPoints[0].longitude };
    var area = projectInfo?.area?.points;
    var subAreas = projectInfo?.subareas;

    return(
        <div id='projectEdit'>
            <Card id='editCard'>
                <Card.Body style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center'}}>
                    <h1>Edit Project</h1>
                    { loaded ? 
                        <Box component='form' sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            <TextField 
                                className='nonFCInput' 
                                id='outlined-input' 
                                label='Project Name' 
                                type='text' 
                                value={ projectName } 
                                onChange={ e => setProjectName(e.target.value) } 
                            />
                            <TextField
                                className='nonFCInput'
                                id='outlined-input'
                                label='Project Description'
                                type='text'
                                value={projectDesc}
                                onChange={e => setProjectDesc(e.target.value)}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', margin: '10px', padding: '5px', border: '1px solid #BEBEBE', borderRadius: '5px', justifyContent: 'center'}}>
                                <h6 style={{alignSelf: 'center'}}>Project Map</h6>
                                <Map center={ center } zoom={16} type={2} standingPoints={standingPoints} subAreas={subAreas} area={area} />
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
                                    <Button
                                        component={Link}
                                        className='scheme'
                                        type='submit'
                                        size='lg'
                                        id='updateAreas'
                                        state={{ ...loc.state, areas: subAreas, center: center }}
                                        to='areas'
                                    >
                                        Edit Areas
                                    </Button>
                                    <Button
                                        component={Link}
                                        className='scheme'
                                        type='submit'
                                        size='lg'
                                        id='updatePoints'
                                        state={{ ...loc.state, points: standingPoints }}
                                        to='points'
                                    >
                                        Edit Points
                                    </Button>
                                </div>
                            </div>
                            <Button 
                                className='scheme' 
                                type='submit' 
                                size='lg' 
                                id='updateProjectButton' 
                                onClick={ updateProject }
                            >
                                Update
                            </Button>
                            <br/>
                            <Button
                                className='scheme'
                                type='submit'
                                size='lg'
                                id='deleteButton'
                                onClick={deleteProject}
                            >
                                Delete
                            </Button>
                            <Button component={Link} state={{ team: loc.state && loc.state.team ? loc.state.team : '', userToken: loc.state && loc.state.userToken ? loc.state.userToken : '', owner: loc.state && loc.state.owner ? loc.state.owner : ''}} type='submit' size='lg' to={`/home/teams/${segment[3]}`}>
                                Cancel
                            </Button>
                        </Box>
                    : null }
                </Card.Body>
            </Card>
            <br />
        </div>
    );
}