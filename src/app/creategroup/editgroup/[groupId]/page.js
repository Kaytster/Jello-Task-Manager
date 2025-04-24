"use client"
import Cookies from 'js-cookie';
import Header from "../../../components/header";
import 'bootstrap/dist/css/bootstrap.css'
import '../../../styles/editgroup.css'
import '../../../globals.css';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; 

export default function EditGroup() {
  const accountTypeString = Cookies.get('accountType');
  
  //Only group admins have access to this page
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
      const { groupId } = useParams(); 
      const [name, setName] = useState('');
      const [userid, setID] = useState('');
      const [errors, setErrors] = useState({});
      const [isFormValid, setIsFormValid] = useState(false);
  
      useEffect(() => {
          validateForm();
      }, [userid, name]);
  
      const validateForm = () => {
          let errors = {};
          console.log('Validating creation');
  
          if (!userid) {
              errors.name = 'UserID is required.';
          }
          if (!name) {
            errors.name = 'Task Name is required.';
        }
  
          setErrors(errors);
          setIsFormValid(Object.keys(errors).length === 0);
      };
  
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (!groupId) {
          setErrors({ form: 'Could not identify the group.' });
          return;
        }
      
        if (!userid) {
          setErrors({ name: 'User ID to add is required.' });
          return;
        }
      
        try {
          const response = await fetch('/api/editAgroup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'addMember', userid: userid, groupId: groupId }), 
          });
      
          const result = await response.json();
      
          if (response.ok) {
            setID('');
          } else {
            setErrors({ form: result.message || 'Failed to add member.' });
            console.error('Failed to add member:', result.message);
          }
        } catch (error) {
          console.error('Error adding member:', error);
          setErrors({ form: 'Internal server error' });
        }
      };

      const handleSubmitAddList = async (e) => {
        e.preventDefault();
      
        if (!groupId) {
          setErrors({ form: 'Could not identify the group.' });
          return;
        }
      
        if (!name) {
          setErrors({ name: 'List name is required.' });
          return;
        }
      
        try {
          const response = await fetch('/api/editAgroup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'addList', name: name, status: 'incomplete', groupId: groupId }), 
          });
      
          const result = await response.json();
      
          if (response.ok) {
            setName('');
          } else {
            setErrors({ form: result.message || 'Failed to create list' });
          }
        } catch (error) {
          setErrors({ form: 'Internal server error' });
        }
      };
    return (
      <>
          <Header />
          <main>
            <br/>
            <br/>
            <div className="row">
                <div className="card">
                    <form onSubmit={handleSubmit}>
                        <h2>Add Members</h2>
                        <div className="mb-3">
                            <label className="form-label"><b>Name</b></label>
                            <input
                                        type="text" 
                                        className="form-control"
                                        id="InputListName"
                                        value={userid}
                                        onChange={(e) => setID(e.target.value)}
                                    /> 
                                    {errors.form && <p style={{ color: 'red' }}>{errors.form}</p>}
                                    
                        </div>
                        <button type="submit" className="btn-primary">Add</button> 
                    </form>
                </div>

                <div className="card">
                    <form onSubmit={handleSubmitAddList}>
                        <h2>Add List</h2>
                        <div className="mb-3">
                            <label className="form-label"><b>Name</b></label>
                            <label className="form-label"><b>Name</b></label>
                                <input
                                    type="text" 
                                    className="form-control"
                                    id="InputListName"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                        </div>
                        <button type="submit" className="btn-primary">Create</button> 
                    </form>
                </div>
                

                
            </div>
          </main>
          </>
    );
  }
};
