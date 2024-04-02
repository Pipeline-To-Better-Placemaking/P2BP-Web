import React, { useState, useRef } from 'react';
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
import { TailSpin } from 'react-loading-icons';

export default function Title(props) {
    const nav = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [buttonText, setButtonText] = useState('Login');
    const [message, setMessage] = useState('');
    const em = useRef(null);
    const pw = useRef(null);
    const loginResponse = useRef(null);
    const emMess = useRef(null);
    const pwMess = useRef(null);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setButtonText('Loading...');

        if (email === '' || email.length <= 3) {
            pwMess.current.style.display = 'none';
            setMessage('Please provide an email');
            loginResponse.current.style.display = 'inline-block';
            em.current.focus();
            return;
        } else if (password === '' || password.length <= 3) {
            emMess.current.style.display = 'none';
            setMessage('Please provide a password');
            loginResponse.current.style.display = 'inline-block';
            pw.current.focus();
            return;
        } else {
            emMess.current.style.display = 'none';
            pwMess.current.style.display = 'none';
            try {
                setLoading(true);
                const response = await axios.post('/login', JSON.stringify({ email, password }), {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
                const user = response.data;
                props.onLogin(true, user);
                nav('/home', { state: { userToken: user } });
                setLoading(false);
            } catch (error) {
                console.log('ERROR: ', error);
                setMessage(error.response.data?.message);
                loginResponse.current.style.display = 'inline-block';
            }
        }

        setTimeout(() => {
            setButtonText('Login');
        }, 10000);
    }

    const BackgroundImageComponentLogin = () => {
        const backgroundImageRefLogin = React.useRef(null);
        const [imageLoadedLogin, setImageLoadedLogin] = React.useState(false);

        /*
        runs only once
        allows background color to change depending on whether background image loaded
        */
        React.useEffect(() => { 
            /* get the page element by using its class name */
            var pageElementsLogin = document.getElementsByClassName("pageTemplateLogin");

            if (pageElementsLogin.length > 0) {

                /* check that image loaded */
                const imageLoadedLoginCheck = () => {
                    // if the image successfully loads, stores image url
                    const isImageLoadedLogin = window.getComputedStyle(backgroundImageRefLogin.current, '::before').getPropertyValue('background-image');

                    // check that isImageLoadedLogin isn't null/undefined, then check that it isn't none
                    if ((isImageLoadedLogin) && (isImageLoadedLogin !== 'none' )) {
                        setImageLoadedLogin(true);
                    } else {
                        console.log("image did not load, ", isImageLoadedLogin);
                    }
                };
                imageLoadedLoginCheck();

                // check that the image is still loading if the window is resized
                window.addEventListener('resize', imageLoadedLoginCheck);
                return() => {
                    window.removeEventListener('resize', imageLoadedLoginCheck);
                }
            } else {
                console.log("page element was not found");
            }

        }, []);

        React.useEffect(() => {
            /* get the page element by using its class name */
            var pageElementsLogin = document.getElementsByClassName("pageTemplateLogin");

            if (pageElementsLogin.length > 0) {
                var pageElementLogin = pageElementsLogin[0];

                /* add classes with different background colors depending on whether the image loaded */
                if (imageLoadedLogin == true) {
                    pageElementLogin.classList.add("backgroundImageLoginLoaded");
                    pageElementLogin.classList.remove("backgroundImageLoginNotLoaded");
                } else {
                    pageElementLogin.classList.add("backgroundImageLoginNotLoaded");
                    pageElementLogin.classList.remove("backgroundImageLoginLoaded");
                }
            } else {
                console.log("page element was not found");
            }
        }, [imageLoadedLogin]);}

    return (
        <div id='titlePage'>
            <div className='pageTemplateLogin' id='login'>
                <Card className='formCard' style={{ backgroundColor: '#ddddddbb', padding: '30px 102px 0px 102px', backdropFilter: 'blur(4px)'}}>
                    <h3><b>Welcome!</b></h3>
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
                                value={email} 
                                onChange={handleChange} 
                                ref={em}
                                autoFocus 
                            />
                            <span ref={pwMess} style={{ display: 'none', color: 'red' }}>{message}</span>
                            <FormControl sx={{ m: 1 }} variant='outlined'>
                                <InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
                                <OutlinedInput
                                    id='outlined-adornment-password'
                                    type={showPassword ? 'text' : 'password'}
                                    name='password'
                                    value={password}
                                    onChange={handleChange}
                                    ref={pw}
                                    endAdornment={
                                        <InputAdornment position='end'>
                                            <IconButton
                                                aria-label='visibility toggle'
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge='end'
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
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
                                style={{backgroundColor: 'rgba(254, 216, 6, 0.7)'}} 
                                onClick={handleLogin}
                            >
                                {buttonText}
                            </Button>
                            {!loading ?(<div></div>) : (<div className='tailSpin'><TailSpin/></div>)}
                            <Link to='/forgot_password' style={{fontSize: 'small'}}> Forgot Password? </Link>
                        </Box>
                        <div className='d-grid'>
                            <Button component={ Link } to='/new' className='scheme secondButton' size='lg' style={{backgroundColor: 'rgba(254, 216, 6, 0.7)'}}>
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
    );

    return <BackgroundImageComponentLogin />
}