import * as React from 'react';
import Card from 'react-bootstrap/Card';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import Image from 'react-bootstrap/Image';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Back from '@mui/icons-material/ArrowBackRounded';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios.js';
import logo1 from '../images/PtBPLogo.png';

import './routes.css';
const registerURL = '/users'

export default function NewUser(props) {
    //Props from App.js will log user in after success
    let nav = useNavigate();
    // to access fname lname...etc values.fname, do not access show(Confirm)Password
    const [values, setValues] = React.useState({
        fname: '',
        lname: '',
        email: '',
        password: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false
    });

    const [message, setMessage] = React.useState('');
    const fn = React.useRef(null);
    const ln = React.useRef(null); 
    const em = React.useRef(null);
    const pw = React.useRef(null);
    const cpw = React.useRef(null);
    const registerResponse = React.useRef(null);
    const fnameMess = React.useRef(null);
    const lnameMess = React.useRef(null);
    const emMess = React.useRef(null);
    const pwMess = React.useRef(null);
    
    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        });
    };

    // Handles visibility toggle for password fields
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

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check all inputs for valid input
        if (values.fname === '' || values.fname.length <= 3 ) {
            lnameMess.current.style.display = 'none';
            pwMess.current.style.display = 'none';
            emMess.current.style.display = 'none';
            setMessage('Please provide your first name (minimum 3 letters)');
            fnameMess.current.style.display = 'inline-block';
            fn.current.focus();
            return;
        } else if (values.lname === '' || values.lname.length <= 3) {
            fnameMess.current.style.display = 'none';
            pwMess.current.style.display = 'none';
            emMess.current.style.display = 'none';
            setMessage('Please provide your last name (minimum 3 letters)');
            lnameMess.current.style.display = 'inline-block';
            ln.current.focus();
            return;
        } else if (values.email === '' || values.email.length <= 7) {
            fnameMess.current.style.display = 'none';
            lnameMess.current.style.display = 'none';
            pwMess.current.style.display = 'none';
            setMessage('Please provide an email (minimum length 7)');
            emMess.current.style.display = 'inline-block';
            em.current.focus();
            return;
        } else if (values.password === '' || values.password.length < 8 || /\s/g.test(values.password) || !/\d/g.test(values.password) || !/[!@#$%^&*]/g.test(values.password) || !/[A-Z]/g.test(values.password)) {
            fnameMess.current.style.display = 'none';
            lnameMess.current.style.display = 'none';
            emMess.current.style.display = 'none';
            setMessage('Please provide a password (minimum length 8 including a number, a symbol, and an uppercase letter)');
            pwMess.current.style.display = 'inline-block';
            pw.current.focus();
            return;
        } else if (values.password !== values.confirmPassword){
            fnameMess.current.style.display = 'none';
            lnameMess.current.style.display = 'none';
            emMess.current.style.display = 'none';
            setMessage('Provided passwords do not match');
            pwMess.current.style.display = 'inline-block';
            return;
        } else {
            fnameMess.current.style.display = 'none';
            lnameMess.current.style.display = 'none';
            emMess.current.style.display = 'none';
            pwMess.current.style.display = 'none';
            submitNewUser(e);
        }
    }

    const submitNewUser = async (e) => {
        //register new user instead of login, not saving data
        try{
            const response = await axios.post(registerURL, JSON.stringify({ firstname: values.fname, lastname: values.lname, email: values.email, password: values.password }), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            
            let user = response.data;
            props.onLogin(true, user);
            //redirect user to url/home
            nav('/home', { replace: true });
        } catch (error) {
            //user login error
            setMessage(error.response.data?.message);
            registerResponse.current.style.display = 'inline-block';
            return;
        }
    }

    const BackgroundImageComponentSignUp = () => {
        const backgroundImageRefSignUp = React.useRef(null);
        const [imageLoadedSignUp, setImageLoadedSignUp] = React.useState(false);

        /*
        runs only once
        allows background color to change depending on whether background image loaded
        */
        React.useEffect(() => {
            /* get the page element by using its class name */
            var pageElementsSignUp = document.getElementsByClassName("pageTemplateSignUp");

            if (pageElementsSignUp.length > 0) {
                
                /* check that image loaded */
                const imageLoadedSignUpCheck = () => {
                    // if the image successfully loads, stores image url
                    const isImageLoadedSignUp = window.getComputedStyle(backgroundImageRefSignUp.current, '::before').getPropertyValue('background-image');

                    // check that isImageLoadedSignUp isn't null/undefined, then check that it isn't none
                    if ((isImageLoadedSignUp) && (isImageLoadedSignUp !== 'none' )) {
                        setImageLoadedSignUp(true);
                    } else {
                        console.log("image did not load, ", isImageLoadedSignUp);
                    }
                };
                imageLoadedSignUpCheck();

                // check that the image is still loading if the window is resized
                window.addEventListener('resize', imageLoadedSignUpCheck);
                return() => {
                    window.removeEventListener('resize', imageLoadedSignUpCheck);
                }
            } else {
                console.log("page element was not found");
            }

        }, []);

        React.useEffect(() => {
            /* get the page element by using its class name */
            var pageElementsSignUp = document.getElementsByClassName("pageTemplateSignUp");

            if (pageElementsSignUp.length > 0) {
                var pageElementSignUp = pageElementsSignUp[0];

                /* add classes with different background colors depending on whether the image loaded */
                if (imageLoadedSignUp == true) {
                    pageElementSignUp.classList.add("backgroundImageSignUpLoaded");
                    pageElementSignUp.classList.remove("backgroundImageSignUpNotLoaded");
                } else {
                    pageElementSignUp.classList.add("backgroundImageSignUpNotLoaded");
                    pageElementSignUp.classList.remove("backgroundImageSignUpLoaded");
                }
            } else {
                console.log("page element was not found");
            }
        }, [imageLoadedSignUp]);

        return(
            <div className='pageTemplateSignUp' id='newuser' ref={backgroundImageRefSignUp}>
                <Link className='backButton' to='/'><Back className='iconShadow' /></Link>
                    <Card className='pageCard' style={{ backgroundColor: '#ddddddbb', padding: '30px 95px 0px 95px', backdropFilter: 'blur(4px)'}}>
                        <Card.Body>
                            <h3><b>Welcome</b></h3>
                            <p><i>Create your account by filling in the form.</i></p>
                            
                            <br/>
                            <Box component='form' sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <span ref={ registerResponse } style={{ display: 'none', color: 'red' }}>{message}</span>
                                <span ref={ fnameMess } style={{ display: 'none', color: 'red' }}>{message}</span>
                                <TextField  
                                    className='nonFCInput' 
                                    id='outlined-input' 
                                    label='First Name' 
                                    name='fname'
                                    type='text' 
                                    value={ values.fname } 
                                    onChange={ handleChange }
                                    required
                                    ref={ fn }
                                    style={{ width: '150%' }}
                                />
                                <span ref={ lnameMess } style={{ display: 'none', color: 'red' }}>{ message }</span>
                                <TextField 
                                    className='nonFCInput' 
                                    id='outlined-input' 
                                    label='Last Name' 
                                    name='lname'
                                    type='text' 
                                    value={ values.lname } 
                                    onChange={ handleChange }
                                    required
                                    ref={ ln }
                                    style={{ width: '150%' }}
                                />
                                <span ref={ emMess } style={{ display: 'none', color: 'red' }}>{ message }</span>
                                <TextField 
                                    className='nonFCInput' 
                                    id='outlined-input' 
                                    label='Email' 
                                    type='email' 
                                    name='email'
                                    value={ values.email } 
                                    onChange={ handleChange }
                                    required
                                    ref={ em }
                                    style={{ width: '150%' }}
                                />
                                <span ref={ pwMess } style={{ display: 'none', color: 'red' }}>{ message }</span>
                                <FormControl sx={{ m: 1}} variant='outlined'>
                                    <InputLabel htmlFor='outlined-adornment-password'>Password *</InputLabel>
                                    <OutlinedInput
                                        id='outlined-adornment-password'
                                        type={ values.showPassword ? 'text' : 'password' }
                                        name='password'
                                        value={ values.password }
                                        onChange={ handleChange }
                                        ref={ pw }
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
                                        style={{ width: '150%' }}
                                    />
                                </FormControl>
                                <FormControl sx={{ m: 1 }} variant='outlined'>
                                    <InputLabel htmlFor='outlined-adornment-password'>
                                        Confirm Password *
                                    </InputLabel>
                                    <OutlinedInput
                                        id='outlined-adornment-password'
                                        type={ values.showConfirmPassword ? 'text' : 'password' }
                                        name='confirmPassword'
                                        value={ values.confirmPassword }
                                        onChange={ handleChange }
                                        ref={ cpw }
                                        endAdornment={
                                            <InputAdornment position='end'>
                                                <IconButton
                                                    aria-label='visibility toggle'
                                                    onClick={ handleClickShowConPassword }
                                                    onMouseDown={ handleMouseDownPassword }
                                                    edge='end'
                                                >
                                                    {
                                                        values.showConfirmPassword ? 
                                                        <VisibilityOff /> : <Visibility />
                                                    }
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label='Confirm Password'
                                        style={{ width: '150%' }}
                                    />
                                </FormControl>
                                <span>All fields ending with * are required</span>
                                <br/><br/>
                                <Button 
                                    className='scheme' 
                                    type='submit' 
                                    size='small' 
                                    id='newUserButton' 
                                    onClick={ handleSubmit }
                                    style={{ borderRadius: '10px', backgroundColor: 'rgba(254, 216, 6, 0.7)'}}
                                >
                                    Sign Up
                                </Button>
                            </Box>
                            <br/><br/>
                            <div className='logo'>
                                <Image src={ logo1 }  alt='logo' id='logo1' style={{width: '40px', height: 'auto'}}/>
                            </div>
                        </Card.Body>
                    </Card>
            </div>
        );
    }

    return <BackgroundImageComponentSignUp />
}