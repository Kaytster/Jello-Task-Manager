"use client";
import Cookies from 'js-cookie';
import Header from "../components/header";
import 'bootstrap/dist/css/bootstrap.css'
import '../globals.css';
import '../styles/createlist.css'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateGroup() {
    const accountTypeString = Cookies.get('accountType');
    
    if (!accountTypeString) {
        return (
        <html>
            <head>
            </head>
            <body>
              <Header />
              <main>
                <br />
                <br />
                <div class='card'>
                    <h1>Please log in!</h1>
                </div>
              </main>
            </body>
          </html>
          )
    } else if (accountTypeString !== 'Group Admin') {
        return (
            <html>
                <head>
                </head>
                <body>
                  <Header />
                  <main>
                    <br />
                    <br />
                    <div class='card'>
                        <h1>Only Group Admin Users have access to this page.</h1>
                    </div>
                  </main>
                </body>
              </html>
              )
    } else {
    const router = useRouter();
    const [name, setName] = useState('');
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
  
      useEffect(() => {
          validateForm();
      }, [name]);
  
      const validateForm = () => {
          let errors = {};
  
          if (!name) {
              errors.name = 'Group Name is required.'; 
          }
  
          setErrors(errors);
          setIsFormValid(Object.keys(errors).length === 0);
      };
  
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const userIdFromCookie = Cookies.get('userId');
    
        if (!userIdFromCookie) {
            console.error("No User ID");
            setErrors({ form: 'Could not identify the user. Please log in again.' });
            return; 
        }
    
        if (isFormValid) {
            try {
                console.log('Sending list creation request with userId:', userIdFromCookie);
                const response = await fetch('/api/createAgroup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: name, status: 'incomplete', userId: userIdFromCookie }),
                });
    
                const result = await response.json();
    
                if (response.ok) {
                    console.log('List creation successful!', result);
                    router.push('/tasklists');
                } else {
                    setErrors({ form: result.message || 'Failed to create list' });
                    console.error('List creation failed', result.message);
                }
            } catch (error) {
                console.error('Error creating list', error);
                setErrors({ form: 'Internal server error' });
            }
        } else {
            console.log('Form has errors. Please correct them.');
        }
    };

    return (
      <html>
        <head>
        </head>
        <body>
          <Header />
          <main>
            <br />
            <br />
            <div id='form'>
                <form onSubmit={handleSubmit}>
                    <h2>Create a Group</h2>
                    <div class="mb-3">
                        <label class="form-label"><b>Name</b></label>
                        <input
                                    type="text" 
                                    className="form-control"
                                    id="InputListName"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                    </div>
                    <button type="submit" class="btn-primary">Create</button> 
                </form>
            </div>
          </main>
        </body>
      </html>
    );
  }
};