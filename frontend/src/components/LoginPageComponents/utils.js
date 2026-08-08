
function signupCredsValidator(creds, setLoginFailed, setLoginErrorMessage) {
    if (!creds.email?.includes('@') || creds.email?.slice(-4) !== '.com') {
        setLoginFailed(true);
        setLoginErrorMessage('Enter a valid email');
        return false;
    } else if (creds.username?.length < 1) {
        setLoginFailed(true);
        setLoginErrorMessage('Enter a valid Username');
        return false;
    } else if (creds.password?.length < 8) {
        setLoginFailed(true);
        setLoginErrorMessage('Password must be atleast 8 characters');
        return false;
    }

    return true;
}

function signinCredsValidator(creds, setLoginFailed, setLoginErrorMessage) {
    if (!creds.identity?.length) {
        setLoginFailed(true);
        setLoginErrorMessage('Invalid Username or Email');
        return false;
    } else if (creds.password?.length < 8) {
        setLoginFailed(true);
        setLoginErrorMessage('Password must be atleast 8 characters');
        return false;
    }

    return true;
}

export {signupCredsValidator, signinCredsValidator};