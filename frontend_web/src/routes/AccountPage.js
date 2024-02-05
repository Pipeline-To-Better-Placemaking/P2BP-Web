import * as React from 'react';
import { Link, useLocation, useNavigate} from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from '../api/axios';
import '../routes/routes.css';

export default function AccountPage(props) {
    const loc = useLocation();
    const nav = useNavigate();
    const [invites, setInvites] = React.useState(loc.state?.userToken?.user?.invites);

    const [values, setValues] = React.useState({
        updateFName: loc.state ? loc.state?.userToken?.user?.firstname : '',
        updateLName: loc.state ? loc.state?.userToken?.user?.lastname : '',
        updateEmail: loc.state ? loc.state?.userToken?.user?.email : '',
        updatePassword: '',
        confirmUpdatePassword: '',
        showPassword: false,
        showConfirmPassword: false
    });
    const [message, setMessage] = React.useState('');
    const invMess = React.useRef(null);
    const infoMess = React.useRef(null);

    const handleChange = (prop) => (event) => {
        setValues({ 
            ...values, 
            [prop]: event.target.value 
        });
    };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword,
        });
    };

    const handleClickShowConPassword = () => {
        setValues({
            ...values,
            showConfirmPassword: !values.showConfirmPassword,
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        //console.log(values);
        if (values.updatePassword === '' && values.confirmUpdatePassword === '') {
            updateUser(false);
        } else if ((values.updatePassword !== '' && values.updatePassword !== values.confirmUpdatePassword) || (values.updatePassword === '' && values.updatePassword !== values.confirmUpdatePassword)) {
            setMessage(`Passwords do not match`);
            infoMess.current.style.display = 'inline-block';
            return;
        } else if (values.updatePassword !== '' && values.updatePassword === values.confirmUpdatePassword ){
            if (values.updatePassword.length < 8 || /\s/g.test(values.updatePassword) || !/\d/g.test(values.updatePassword) || !/[!@#$%^&*]/g.test(values.updatePassword) || !/[A-Z]/g.test(values.updatePassword)) {  
                setMessage(`*Please provide a valid password <br/><div style={{fontSize: 'smaller'}}> *Minimum password length of 8 characters, including a number, a symbol, and an uppercase letter</div>`);
                infoMess.current.style.display = 'inline-block';
                return;
            }
            updateUser(true);
        }
    }
     
    const updateUser = async (pw) => {

        var user = {}
        if (values.updateFName !== loc.state?.userToken?.user?.firstname && values.updateFName !== ''){
            user.firstname = values.updateFName;
        }
        if (values.updateLName !== loc.state?.userToken?.user?.lastname && values.updateLName !== '') {
            user.lastname = values.updateLName;
        }
        if (values.updateEmail !== loc.state?.userToken?.user?.email && values.updateEmail !== '') {
            user.email = values.updateEmail;
        }
        if(pw){
            user.password = values.updatePassword;
        }

        try {
            const response = await axios.put('/users', JSON.stringify(user), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${loc.state.userToken.token}`
                },
                withCredentials: true
            });

            loc.state.userToken.user.firstname = response.data.firstname;
            loc.state.userToken.user.lastname = response.data.lastname;
            loc.state.userToken.user.email = response.data.email;
            props.updateToken(loc.state.userToken);

            nav(loc.state?.from, { replace: true, state: loc.state });

        } catch (error) {

            setMessage(error.response.data?.message);
            infoMess.current.style.display = 'inline-block';
            infoMess.current.style.width = '30vw';
            return;
        }

    }

    const answerInvite = async (e, id, claim, title, index) => {
        e.preventDefault();
        setMessage('');
        invMess.current.style.display = 'none';

        try {
            await axios.post('/users/invites', JSON.stringify({
                responses:
                    [{
                        team: id,
                        accept: claim
                    }]
            }), {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${loc.state.userToken.token}`
                },
                withCredentials: true
            });

            var invitations = [];

            invites.map((invite)=>(
                invitations.push(invite)
            ))
            invitations.splice(index, 1);
            loc.state.userToken.user.invites = invitations;
            if(claim){
                loc.state.userToken.user.teams.push({'_id': id, title: title})
            }
            props.updateToken(loc.state.userToken);
            setInvites(invitations);

        } catch (error) {

            setMessage(error.response.data?.message);
            invMess.current.style.display = 'inline-block';
            invMess.current.style.width = '30vw';
            return;
        }

    }

    return(
        <div id='accountPage'>
            <div id='settingsTemplate'>
                <Card id='inviteCard' style={{marginBottom: '10px'}}>
                    <h1>Invites</h1>
                    <Card.Body style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center'}}>
                        <span ref={invMess} style={{ display: 'none', color: 'red' }}>{message}</span>
                        <br/>
                        {invites.length > 0 ? (invites.map((invite, index)=>(
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', textAlign: 'center', border: '1px solid rgba(0,0,0,.125)', borderRadius: '5px', padding: '10px' }}>
                                {invite.title}
                                <br/>
                                {`From: ${invite.firstname} ${invite.lastname}`}
                                <br/>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', textAlign: 'center' }}>
                                    <Button className='confirm' onClick={(e) => answerInvite(e, invite._id, true, invite.title, index)}>Accept</Button><Button className='cancelButton' onClick={(e) => answerInvite(e, invite._id, false, invite.title, index)}>Decline</Button>
                                </div>
                            </div>
                        ))) : 'You currently have no pending invites.'}
                    </Card.Body>
                </Card>
                <Card id='settingsCard'>
                    <h1>Settings</h1>
                    <Card.Body>
                        <span ref={infoMess} style={{ display: 'none', color: 'red' }}>{message}</span>
                        <Box component='form' sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            <TextField 
                                className='nonFCInput' 
                                id='outlined-input' 
                                label='First Name' 
                                type='text' 
                                value={ values.updateFName } 
                                onChange={ handleChange('updateFName') } 
                            />
                            <TextField 
                                className='nonFCInput' 
                                id='outlined-input' 
                                label='Last Name' 
                                type='text'
                                value={ values.updateLName } 
                                onChange={ handleChange('updateLName') } 
                            />
                            <TextField 
                                className='nonFCInput' 
                                id='outlined-input' 
                                label='Email' 
                                type='email' 
                                value={ values.updateEmail } 
                                onChange={ handleChange('updateEmail') } 
                            />
                            <FormControl sx={{ m: 1 }} variant='outlined'>
                                <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
                                <OutlinedInput
                                    id='outlined-adornment-password'
                                    type={ values.showPassword ? 'text' : 'password' }
                                    value={ values.updatePassword }
                                    onChange={ handleChange('updatePassword') }
                                    endAdornment={
                                        <InputAdornment position='end'>
                                            <IconButton
                                                aria-label='visibility toggle'
                                                onClick={ handleClickShowPassword }
                                                onMouseDown={ handleMouseDownPassword }
                                                edge='end'
                                            >
                                                { values.showPassword ? <VisibilityOff /> : <Visibility /> }
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label='Password'
                                />
                            </FormControl>
                            <FormControl sx={{ m: 1 }} variant='outlined'>
                                <InputLabel htmlFor='outlined-adornment-password'> Confirm Password</InputLabel>
                                <OutlinedInput
                                    id='outlined-adornment-password'
                                    type={ values.showConfirmPassword ? 'text' : 'password' }
                                    value={ values.confirmUpdatePassword }
                                    onChange={ handleChange('confirmUpdatePassword') }
                                    endAdornment={
                                        <InputAdornment position='end'>
                                            <IconButton
                                                aria-label='visibility toggle'
                                                onClick={ handleClickShowConPassword }
                                                onMouseDown={ handleMouseDownPassword }
                                                edge='end'
                                            >
                                                { values.showConfirmPassword ? <VisibilityOff /> : <Visibility /> }
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label='Confirm Password'
                                />
                            </FormControl>
                            <Button 
                                className='scheme' 
                                type='submit' 
                                size='lg' 
                                id='updateUserButton' 
                                onClick={ handleUpdate }
                            >
                                Update
                            </Button>
                            <br />
                            <Button
                                component={Link}
                                to={loc.state.from}
                                state={loc.state}
                                type='submit'
                                size='lg'
                                id='deleteButton'
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}