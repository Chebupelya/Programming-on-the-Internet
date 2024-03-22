const { send } = require('./m06_INS');

try 
{
    const email = 'nikitailyin186@gmail.com';
    const password = 'vihf qvey qbdc cgtu';
    const message = 'Hello from m06_INS module!';

    send(email, password, message);

    console.log('Email sent successfully');
} 
catch (error) 
{
    console.error('Error sending email:', error);
}