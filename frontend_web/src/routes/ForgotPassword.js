import * as React from 'react';
import Box from '@mui/material/Box';
import Card from 'react-bootstrap/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Back from '@mui/icons-material/ArrowBackRounded';
import { Link } from 'react-router-dom'; 
import axios from '../api/axios.js';
import './routes.css';
const resetURL = '/password_reset'

export default function ForgotPassword(){
    const [email, setEmail] = React.useState('');
    const [message, setMessage] = React.useState('');
    const em = React.useRef(null);
    const emMess = React.useRef(null);
    const successMess = React.useRef(null);
    const forgotForm = React.useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(email.length < 7){
            setMessage('Please provide a valid email (minimum length 7)');
            emMess.current.style.display = 'inline-block';
            em.current.focus();
            return;
        } else {
            emMess.current.style.display = 'none';
            sendForgotEmail(e);
        }
    }

    const sendForgotEmail = async (e) => {

        try{
            await axios.post(resetURL, JSON.stringify({ email: email }), {
                headers: { 'Content-Type': 'application/json' },
            });

            forgotForm.current.style.display = 'none';
            successMess.current.style.display = 'block';
        } catch (error) {
            setMessage(error.response.data?.message);
            forgotForm.current.style.display = 'block';
            return;
        }
    }

    const BackgroundImageComponent = () => {
        const backgroundImageRef = React.useRef(null);
        const [imageLoaded, setImageLoaded] = React.useState(false);

        /*
        runs only once
        allows background color to change depending on whether background image loaded
        */
        React.useEffect(() => {

            //console.log("start of script");

            /* get the page element by using its class name */
            var pageElements = document.getElementsByClassName("pageTemplateForgotPassword");

            /*
            check that the page element was successfully found
            only 1 element uses the class, so length should be 1
            */
            if (pageElements.length > 0) {

                //console.log("1 ", imageLoaded);

                /* check that image loaded */
                const imageLoadedCheck = () => {
                    // if the image successfully loads, stores image url
                    const isImageLoaded = window.getComputedStyle(backgroundImageRef.current, '::before').getPropertyValue('background-image');
                    //console.log("- - - - -", isImageLoaded);
                    // check that isImageLoaded isn't null/undefined, then check that it isn't none
                    if ((isImageLoaded) && (isImageLoaded !== 'none' )) {
                        //console.log("image object created");
                        setImageLoaded(true);
                        //console.log("2 ", imageLoaded);
                    } else {
                        console.log("image did not load, ", isImageLoaded);
                    }
                };
                imageLoadedCheck();

                //console.log("3 ", imageLoaded);

                // check that the image is still loading if the window is resized
                window.addEventListener('resize', imageLoadedCheck);
                return() => {
                    window.removeEventListener('resize', imageLoadedCheck);
                }
            } else {
                console.log("page element was not found");
            }

            //console.log("end of script");

        }, []);

        React.useEffect(() => {
            /* get the page element by using its class name */
            var pageElements = document.getElementsByClassName("pageTemplateForgotPassword");

            /*
            check that the page element was successfully found
            only 1 element uses the class, so length should be 1
            */
            if (pageElements.length > 0) {
                /* get the 1 page Element */
                var pageElement = pageElements[0];
                //console.log("2 page element found: ", pageElement.classList);

                //console.log("add class")
                /* add classes with different background colors depending on whether the image loaded */
                if (imageLoaded == true) {
                    //console.log("image loaded");
                    pageElement.classList.add("backgroundImageForgotPasswordLoaded");
                    pageElement.classList.remove("backgroundImageForgotPasswordNotLoaded");
                } else {
                    //console.log("error loading image");
                    pageElement.classList.add("backgroundImageForgotPasswordNotLoaded");
                    pageElement.classList.remove("backgroundImageForgotPasswordLoaded");
                }
            } else {
                console.log("page element was not found");
            }
        }, [imageLoaded]);

        return(
            <div id='forgotPass'>
                <div className='pageTemplateForgotPassword' ref={backgroundImageRef}>
                    <Link className='backButton' to='/'><Back className='iconShadow' /></Link>
                    <Card style={{padding: '10px', backgroundColor: 'rgba(221, 221, 221, 0.73)', backdropFilter: 'blur(4px)'}}>
                        <Card.Body>
                            <h3>Forgot Password</h3>
                            <Box id='forgotBox' ref={forgotForm} component='form' sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                <div style={{ marginBottom: '10px' }}>Please enter the email for the account with the forgotten password.</div>
                                <span ref={emMess} style={{ display: 'none', color: 'red' }}>{message}</span>
                                <TextField
                                    className='nonFCInput'
                                    id='outlined-forgot'
                                    label='Email'
                                    type='email'
                                    name='email'
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    ref={em}
                                    style={{ marginBottom: '20px'}}
                                />
                                <Button onClick={handleSubmit} className='scheme' style={{backgroundColor: 'rgba(254, 216, 6, 0.7)'}}>Send Reset Email</Button>
                            </Box>
                        </Card.Body>
                        <Card.Body ref={ successMess } style={{ display: 'none', marginBottom: '10px', backgroundColor: '#b6d7a8', outlineWidth: '1px', outlineColor: '#6aa84f' }}>
                            <Box style={{ fontSize: 'large' }}>
                                An email containing a link to reset your password has been sent to {email}, it may take a few minutes to appear. <div style={{fontSize: 'medium'}}> In case you do not see an email in your inbox, check your Spam or Junk Folders.</div>
                            </Box>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        );
    }
    
    return <BackgroundImageComponent />
}