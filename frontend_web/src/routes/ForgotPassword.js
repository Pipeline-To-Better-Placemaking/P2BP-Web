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
 
    return(
        <div id='forgotPass'>
            <div className='pageTemplate'>
                <Link className='backButton' to='/'><Back className='iconShadow' /></Link>
                <Card style={{padding: '10px'}}>
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
                            <Button onClick={handleSubmit} className='scheme'>Send Reset Email</Button>
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