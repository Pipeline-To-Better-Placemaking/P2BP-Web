import * as React from 'react';
import Button from '@mui/material/Button';
import Card from 'react-bootstrap/Card';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios.js';
import './routes.css';

export default function NewTeamForm() {
    let nav = useNavigate();
    let loc = useLocation();
    const user = loc.state ? loc.state.userToken : {};
    const [message, setMessage] = React.useState('');
    const addTeamResponse = React.useRef(null);
    const titleRef = React.useRef(null);
    const titleMess = React.useRef(null);

    const [formValues, setFormValues] = React.useState({
        title: '',
        description: '',
        public: false
    });

    const handleChange = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const handleChecked = (e) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.checked });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!formValues.title || formValues.title === ''){
            setMessage('Please provide a team name');
            titleMess.current.style.display = 'block';
            return;
        } else {
            titleMess.current.style.display = 'none';
            //call API function
            submitNewTeam(e);
        }
    }

    const submitNewTeam = async (e) => {
        //add new team
        try {
            const response = await axios.post('/teams', JSON.stringify({ title: formValues.title, description: formValues.description, public: formValues.public }), {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}` 
                },
                withCredentials: true
            });

            //redirect user to url/home
            nav('/home', { replace: true, state: { ...loc.state, userToken: { ...loc.state.userToken, user: { ...loc.state.userToken.user, teams: [...loc.state.userToken.user.teams, response.data ]}}} });
        } catch (error) {
            console.log('ERROR: ', error);
            //success = false;
            setMessage(error.response.data?.message);
            addTeamResponse.current.style.display = 'inline-block';
            return;
        }
    }

    return(
        <div id='newTeamForm'>
            <Card id='newTeamCard'>
                <h1>Create a New Team</h1>
                <span>Create a team to create projects and begin surveying. </span>
                <br/>
                <Card.Body>
                    <span ref={addTeamResponse} style={{ display: 'none', color: 'red' }}>{message}</span>
                    <span ref={titleMess} style={{ display: 'none', color: 'red' }}>{message}</span>
                    <TextField
                        className='nonFCInput'
                        id='outlined-input'
                        label='Title'
                        name='title'
                        type='text'
                        value={formValues.title}
                        onChange={handleChange}
                        required
                        ref={titleRef}
                    />
                    <TextField
                        className='nonFCInput'
                        id='outlined-input'
                        label='Description'
                        name='description'
                        multiline
                        rows={2}
                        value={formValues.description}
                        onChange={handleChange}
                    />
                    <FormControl>
                        <FormControlLabel 
                            control={<Checkbox
                                name='public'
                                checked={formValues.public}
                                onChange={handleChecked}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />} 
                            label="Public" 
                        />
                    </FormControl>
                    <br/>
                    <span style={{fontSize: 'smaller'}}>*Any team you create will have you as an admin and user by default.</span>
                    <br/>
                    <Button 
                        className='scheme' 
                        type='submit' 
                        size='large' 
                        onClick={handleSubmit} 
                        id='newTeamFormButton'
                    >
                        Create Team
                    </Button>
                </Card.Body>
                
            </Card>
        </div>
    );
}