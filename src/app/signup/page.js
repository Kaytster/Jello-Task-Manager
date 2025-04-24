"use client"
import 'bootstrap/dist/css/bootstrap.css'
import '../globals.css';
import '../styles/signup.css';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 

//Form Validation Tutorial: https://www.geeksforgeeks.org/how-to-add-form-validation-in-next-js/

const Signup = () => {
    const router = useRouter();
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [type, setType] = useState('');
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        validateForm();
    }, [username, password]);

    // Validating the form
    const validateForm = () => {
        let errors = {};

        if (!firstname) {
            errors.firstname = 'First Name is required.';
        }

        if (!lastname) {
            errors.lastname = 'Last Name is required.';
        }

        if (!email) {
            errors.email = 'Email Address is required.';
        }

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
        validateForm();
      
        // Setting the account type
        const standardChecked = document.getElementById("standardcheck").checked;
        const adminChecked = document.getElementById("admincheck").checked;
      
        setType(adminChecked ? "Group Admin" : "Standard");
      
        if (isFormValid) {
          try {
            const response = await fetch('/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                firstname,
                lastname,
                email,
                username,
                password,
                type,
              }),
            });
      
            if (!response.ok) {
              const errorData = await response.json();
              setErrors({ form: errorData.message || 'Something went wrong, please try again' });
              return;
            }
      
            const result = await response.json();
            console.log('API response:', result);
      
            if (response.ok) {
              router.push('/dashboard');
            } else {
              setErrors({ form: result.message || 'Registration failed.' });
            }
          } catch (error) {
            console.error('Error during the registration:', error);
            setErrors({ form: 'Internal server error' });
          }
        }
      };

    return (
        <>
                <main>
                    <h1>Jello</h1>
                    <div id='form'>
                    <form onSubmit={handleSubmit}>
                        <h2>Signup</h2>
                        <div className="mb-3">
                            <label className="form-label"><b>First Name</b></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="InputFname"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                            />
                            {errors.firstname && <p style={{color: 'red'}}>{errors.firstname}</p>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label"><b>Last Name</b></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="InputLname"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                            />
                            {errors.lastname && <p style={{color: 'red'}}>{errors.lastname}</p>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label"><b>Email Address</b></label>
                            <input 
                                type="email" 
                                className="form-control" 
                                id="InputEmail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <p style={{color: 'red'}}>{errors.email}</p>}
                        </div>
                        <div className="mb-3">
                            <label className="form-label"><b>Username</b></label>
                            <input 
                                type="text" 
                                className="form-control" 
                                id="InputUsername"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {errors.username && <p style={{color: 'red'}}>{errors.username}</p>}
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
                            {errors.password && <p style={{color: 'red'}}>{errors.password}</p>}
                        </div>
                        {errors.form && <p style={{color: 'red'}}>{errors.form}</p>}

                        <div className="mb-3" >
                            <label className="form-label"><b>Account Type</b></label>
                            <br />
                            <div className='check' style={{display: 'inline-flex'}}>
                                <div id='standard'>
                                    <p>Standard</p>
                                    <input id='standardcheck' type="checkbox" />
                                </div>
                                <div className='brk'></div>
                                <div id='admin'>
                                    <p>Group Admin</p>
                                    <input id='admincheck' type="checkbox"/>
                                </div>
                            </div>
                            {errors.password && <p style={{color: 'red'}}>{errors.password}</p>}
                        </div>

                        <button 
                            type="submit" 
                            className="btn-primary"
                        >
                            Create Account
                        </button>
                    </form>
                    </div>
                </main>
                </>
    );
};
export default Signup;