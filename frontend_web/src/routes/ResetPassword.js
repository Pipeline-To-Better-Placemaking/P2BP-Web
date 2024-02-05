import * as React from 'react';
import Box from '@mui/material/Box';
import Card from 'react-bootstrap/Card';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from '../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ResetPassword(){

    let nav = useNavigate();
    const loc = useLocation();
    const path = loc.pathname.split('/');
    console.log(path);
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [message, setMessage] = React.useState('');

    const pw = React.useRef(null);
    const cpw = React.useRef(null);
    const pwMess = React.useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!password || password.length < 8 || /\s/g.test(password) || !/\d/g.test(password) || !/[!@#$%^&*]/g.test(password) || !/[A-Z]/g.test(password)) {  
            setMessage('*Please provide a valid password, matching the requirements above');
            pwMess.current.style.display = 'inline-block';
            return;
        } else if(confirmPassword !==  password){
            setMessage('*Passwords do not match');
            pwMess.current.style.display = 'inline-block';
            return;
        } else {
            pwMess.current.style.display = 'none';
            updatePass(e);
        }
    }

    const updatePass = async (e) => {
        //On successful request, navigate to title page for user to login
        try {
            await axios.post(`/password_reset/${path[2]}/${path[3]}`, JSON.stringify({ password: password }), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            //redirect user to url/ to log in and confirm successful password reset
            nav('/'); 

        } catch (error) {
            //user login error
            //console.log('ERROR: ', error);
            setMessage(error.response.data?.message);
            pwMess.current.style.display = 'inline-block';
            return;
        }
    }

    return(
        <div id='resetPass'>
            <div className='pageTemplate'>
                <Card id='resetCard' style={{ padding: '10px' }}>
                    <Card.Body>
                        <h3>Reset Password</h3>
                        <Box component='form' sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            <div style={{ marginBottom: '10px', fontSize: 'larger' }}>Enter your new password <br /> <div style={{fontSize: 'smaller'}}>*Minimum password length of 8 characters, including a number, a symbol, and an uppercase letter</div></div>
                            <span ref={pwMess} style={{ display: 'none', color: 'red' }}>{message}</span>
                            <FormControl sx={{ m: 1 }} variant='outlined'>
                                <InputLabel htmlFor='outlined-adornment-password'>New Password *</InputLabel>
                                <OutlinedInput
                                    id='outlined-adornment-password'
                                    type={showPassword ? 'text' : 'password'}
                                    name='password'
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    ref={pw}
                                    endAdornment={
                                        <InputAdornment position='end'>
                                            <IconButton
                                                aria-label='visibility toggle'
                                                onClick={e => setShowPassword(!showPassword)}
                                                onMouseDown={e => e.preventDefault()}
                                                edge='end'
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label='New Password'
                                />
                            </FormControl>
                            <FormControl sx={{ m: 1 }} variant='outlined'>
                                <InputLabel htmlFor='outlined-adornment-password'>
                                    Confirm New Password *
                                </InputLabel>
                                <OutlinedInput
                                    id='outlined-adornment-cpassword'
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name='confirmPassword'
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    ref={cpw}
                                    endAdornment={
                                        <InputAdornment position='end'>
                                            <IconButton
                                                aria-label='visibility toggle'
                                                onClick={e => setShowConfirmPassword(!showConfirmPassword)}
                                                onMouseDown={e => e.preventDefault()}
                                                edge='end'
                                            >
                                                {
                                                    showConfirmPassword ?
                                                        <VisibilityOff /> : <Visibility />
                                                }
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label='Confirm New Password'
                                    style={{ marginBottom: '20px' }}
                                />
                            </FormControl>
                            <Button className='scheme' onClick={handleSubmit}>Set New Password</Button>
                        </Box>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
}