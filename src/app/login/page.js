'use client';
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.css';
import '../globals.css';
import '../styles/login.css';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 

//Form Validation Tutorial: https://www.geeksforgeeks.org/how-to-add-form-validation-in-next-js/
//js-cookie: https://github.com/js-cookie/js-cookie

export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        console.log('Validating form'); 
        validateForm();
    }, [username, password]);

    // Validating the form
    const validateForm = () => {
        let errors = {};

        if (!username) {
            errors.username = 'Username is required.';
        }

        if (!password) {
            errors.password = 'Password is required.';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters.';
        }

        setErrors(errors);
        setIsFormValid(Object.keys(errors).length === 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted'); 
        validateForm();

        if (isFormValid) { 
            try {
                const response = await fetch('/api', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                const result = await response.json();

                if (response.ok) {

                    //Setting the cookies for User ID and Account Type, so they can be used in other pages
                    if (result.userId) { 
                        Cookies.set('userId', String(result.userId), { expires: 7 }); 
                    }

                    if (result.accountType) {
                        Cookies.set('accountType', result.accountType, { expires: 7 });
                    }
                    
                    router.push('/dashboard');
                } else {
                    setErrors({ form: result.message });
                }
            } catch (error) {
                setErrors({ form: 'Internal server error' });
            }
        } else {
        }
    };

    return (
        <main>
            <h1>Jello</h1>
            <div id='form'>
                <form onSubmit={handleSubmit}>
                    <h2>Login</h2>
                    <div className="mb-3">
                        <label className="form-label"><b>Username</b></label>
                        <input
                            type="text" 
                            className="form-control" 
                            id="InputUsername" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label"><b>Password</b></label>
                        <input
                           type="password" 
                           className="form-control" 
                           id="InputPassword" 
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                    </div>
                    {errors.form && <p style={{ color: 'red' }}>{errors.form}</p>}
                    <button type="submit" className="btn-primary"> Login </button>
                </form>
            </div>
        </main>
    );
};