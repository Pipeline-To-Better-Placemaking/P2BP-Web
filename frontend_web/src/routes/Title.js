import * as React from 'react';
import axios from '../api/axios.js';
import Box from '@mui/material/Box';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link, useNavigate } from 'react-router-dom';
import './routes.css';
import Back from '@mui/icons-material/ArrowBackRounded';
import logo1 from '../images/PtBPLogo.png';

export default function Title(props) {
    // Props from App.js, login function to pass user/token info to AppNavBar
    let nav = useNavigate();
    // Access email, password like values.email, do not mutate or modify
    const [values, setValues] = React.useState({
        email: '',
        password: '',
        showPassword: false
    });

    const [message, setMessage] = React.useState('');
    const em = React.useRef(null);
    const pw = React.useRef(null);
    const loginResponse = React.useRef(null);
    const emMess = React.useRef(null);
    const pwMess = React.useRef(null);

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    };

    const handleClickShowPassword = () => {
        setValues({
            ...values,
            showPassword: !values.showPassword
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };;

    //Needs a handle login function for login field feedback i.e. incorrect email or password
    const handleLogin = (e) => {
        e.preventDefault();

        if (values.email === '' || values.email.length <= 3){
            pwMess.current.style.display = 'none';
            setMessage('Please provide an email');
            emMess.current.style.display = 'inline-block';
            em.current.focus();
            return;
        } else if (values.password === '' || values.password.length <= 3){
            emMess.current.style.display = 'none';
            setMessage('Please provide a password');
            pwMess.current.style.display = 'inline-block';
            pw.current.focus();
            return;
        } else {
            emMess.current.style.display = 'none';
            pwMess.current.style.display = 'none';
            loginUser(e);
        }
    }

    const loginUser = async (e) => {

        try {
            console.log('login try');
            const response = await axios.post('/login', JSON.stringify({ email: values.email, password: values.password }), {
               headers: { 'Content-Type': 'application/json' },
               withCredentials: true
            });
            let user = response.data;
            // user login confirmation and navigation handling in App.js
            // retrieve user's name or name and token to verify status
            props.onLogin(true, user);

            //redirect user to url/home
            nav('/home', { state: { userToken: user } });
        } catch(error){
            //user login error
            console.log('ERROR: ', error);

            setMessage(error.response.data?.message);
            loginResponse.current.style.display = 'inline-block';
            return;
        }
    };

    return (
        <div id='titlePage'>
            {/* pageTemplate -> Blue base background */}
            <div className='initpageTemplate' id='login'>
                {/* tag - sizing for logo/tag (title text) */}
                <Link className='backButton' to='/'><Back className='iconShadow' /></Link>
                <div className='tagBox'>
                    <Card className='formCard' style={{ backgroundColor: '#ddddddbb', padding: '30px 35px 0px 35px'}}>
                        <h3><b>Welcome Back,</b></h3>
                        <p><i>Please Login.</i></p>
                        <Card.Body>
                            <Box id='titleBox' component='form' sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <span ref={loginResponse} style={{ display: 'none', color: 'red' }}>{message}</span>
                                <span ref={emMess} style={{ display: 'none', color: 'red' }}>{message}</span>
                                <TextField 
                                    className='nonFCInput' 
                                    id='outlined-search' 
                                    label='Email' 
                                    type='email' 
                                    name='email' 
                                    value={ values.email } 
                                    onChange={handleChange} 
                                    ref={em}
                                />
                                <span ref={pwMess} style={{ display: 'none', color: 'red' }}>{message}</span>
                                {/* Form Control component to hold MUI visibility changing password field */}
                                <FormControl sx={{ m: 1 }} variant='outlined'>
                                    <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
                                    <OutlinedInput
                                        id='outlined-adornment-password'
                                        type={ values.showPassword ? 'text' : 'password' }
                                        name='password'
                                        value={ values.password }
                                        onChange={ handleChange }
                                        ref={pw}
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
                                <Button 
                                    className='scheme' 
                                    id='loginButton' 
                                    type='submit' 
                                    size='lg' 
                                    onClick={ handleLogin }
                                    style={{ borderRadius: '10px'}}
                                >
                                    Log in
                                </Button>
                                <Link to='/forgot_password' id='forgotpasslink'style={{fontSize: 'small'}}> <b>Forgot Password?</b> </Link>
                            </Box>
                            <div className='d-grid'>
                                <Button component={ Link } to='/new' className='scheme secondButton' size='lg' style={{ borderRadius: '10px'}}>
                                    Create Account
                                </Button>
                            </div>

                            <br/><br/>
                            <div className='logo'>
                                <Image src={ logo1 }  alt='logo' id='logo1' style={{width: '40px', height: 'auto'}}/>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
    );
}