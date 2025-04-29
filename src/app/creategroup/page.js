"use client";
import Cookies from 'js-cookie';
import Header from "../components/header";
import Footer from "../components/footer";
import 'bootstrap/dist/css/bootstrap.css'
import '../globals.css';
import '../styles/createlist.css'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateGroup() {
    const accountTypeString = Cookies.get('accountType');
    
    if (!accountTypeString) {
        return (
          <>
              <Header />
              <main>
                <br />
                <br />
                <div className='card'>
                    <h1>Please log in!</h1>
                </div>
              </main>
              <Footer />
              </>
          )
    } else if (accountTypeString !== 'Group Admin') {
        return (
          <>
                  <Header />
                  <main>
                    <br />
                    <br />
                    <div className='card'>
                        <h1>Only Group Admin Users have access to this page.</h1>
                    </div>
                  </main>
              </>
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
                const response = await fetch('/api/createAgroup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: name, status: 'incomplete', userId: userIdFromCookie }),
                });
    
                const result = await response.json();
    
                if (response.ok) {
                    router.push('/groups');
                } else {
                    setErrors({ form: result.message || 'Failed to create group' });
                    console.error('Group creation failed', result.message);
                }
            } catch (error) {
                console.error('Error creating group', error);
                setErrors({ form: 'Internal server error' });
            }
        } else {
        }
    };

    return (
      <>
          <Header />
          <main>
            <br />
            <br />
            <div id='form'>
                <form onSubmit={handleSubmit}>
                    <h2>Create a Group</h2>
                    <div className="mb-3">
                        <label className="form-label"><b>Name</b></label>
                        <input
                                    type="text" 
                                    className="form-control"
                                    id="InputGroupName"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                    </div>
                    <button type="submit" className="btn-primary">Create</button> 
                </form>
            </div>
          </main>
          <Footer />
          </>
    );
  }
};