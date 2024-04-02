import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from 'react-bootstrap/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Back from '@mui/icons-material/ArrowBackRounded';
import { Link } from 'react-router-dom'; 
import axios from '../api/axios.js';
import './routes.css';
const resetURL = '/password_reset';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const emRef = useRef(null);
    const emMessRef = useRef(null);
    const successMessRef = useRef(null);
    const forgotFormRef = useRef(null);

    useEffect(() => {
        emRef.current.focus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (email.length < 7) {
            setMessage('Please provide a valid email (minimum length 7)');
            emMessRef.current.style.display = 'inline-block';
            emRef.current.focus();
            return;
        } else {
            emMessRef.current.style.display = 'none';
            try {
                await axios.post(resetURL, JSON.stringify({ email: email }), {
                    headers: { 'Content-Type': 'application/json' },
                });
                forgotFormRef.current.style.display = 'none';
                successMessRef.current.style.display = 'block';
            } catch (error) {
                setMessage(error.response.data?.message);
                forgotFormRef.current.style.display = 'block';
                return;
            }
        }
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
        <div id='forgotPass'>
            <div className='pageTemplateForgotPassword'>
                <Link className='backButton' to='/'><Back className='iconShadow' /></Link>
                <Card style={{ padding: '10px', backgroundColor: 'rgba(221, 221, 221, 0.73)', backdropFilter: 'blur(4px)' }}>
                    <Card.Body>
                        <h3>Forgot Password</h3>
                        <Box id='forgotBox' ref={forgotFormRef} component='form' sx={{ display: 'flex', flexWrap: 'wrap' }}>
                            <div style={{ marginBottom: '10px' }}>Please enter the email for the account with the forgotten password.</div>
                            <span ref={emMessRef} style={{ display: 'none', color: 'red' }}>{message}</span>
                            <TextField
                                className='nonFCInput'
                                id='outlined-forgot'
                                label='Email'
                                type='email'
                                name='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                inputRef={emRef}
                                style={{ marginBottom: '20px' }}
                            />
                            <Button onClick={handleSubmit} className='scheme' style={{ backgroundColor: 'rgba(254, 216, 6, 0.7)' }}>Send Reset Email</Button>
                        </Box>
                    </Card.Body>
                    <Card.Body ref={successMessRef} style={{ display: 'none', marginBottom: '10px', backgroundColor: '#b6d7a8', outlineWidth: '1px', outlineColor: '#6aa84f' }}>
                        <Box style={{ fontSize: 'large' }}>
                            An email containing a link to reset your password has been sent to {email}, it may take a few minutes to appear. <div style={{ fontSize: 'medium' }}> In case you do not see an email in your inbox, check your Spam or Junk Folders.</div>
                        </Box>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
    
}