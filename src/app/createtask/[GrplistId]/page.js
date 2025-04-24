"use client";
import Cookies from 'js-cookie';
import Header from "../../components/header";
import 'bootstrap/dist/css/bootstrap.css'
import '../../globals.css';
import '../../styles/createtask.css';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

const EditList = () => {
    const router = useRouter();
    const { listId } = useParams(); 
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [tasks, setTasks] = useState([]); 
    const [checkedTasks, setCheckedTasks] = useState([]);
    const [openTaskId, setOpenTaskId] = useState(null); 
    const [editTaskName, setEditTaskName] = useState(''); 
    const [editTaskContent, setEditTaskContent] = useState(''); 


    useEffect(() => {
        validateForm();
    }, [name, content]);

    useEffect(() => {
        if (listId) {
            fetch(`/api/editGROUPlist?GrplistId=${GrplistId}`)
                .then(response => response.json())
                .then(data => {
                    setTasks(data);
                })
                .catch(error => {
                    console.error("Error fetching tasks", error);
                });
        }
    }, [listId]);

    const validateForm = () => {
        let errors = {};

        if (!name) {
            errors.name = 'Task Name is required.';
        }

        if (!content) {
            errors.content = 'Task Content is required.';
        }

        setErrors(errors);
        setIsFormValid(Object.keys(errors).length === 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!GrplistId) {
            console.error("No List ID");
            setErrors({ form: 'Could not identify the list.' });
            return;
        }

        if (isFormValid) {
            try {
                console.log('Sending task creation request with userId:', userIdFromCookie, 'and listId:', listId);
                const response = await fetch('/api/editGROUPlist', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: name, content: content, status: 'Incomplete', userId: userIdFromCookie, listId: listId }),
                });

                const result = await response.json();

                if (response.ok) {
                    fetch(`/api/editGROUPlist?GrplistId=${GrplistId}`)
                        .then(response => response.json())
                        .then(data => {
                            setTasks(data);
                            setName(''); 
                            setContent('');
                        })
                        .catch(error => {
                            console.error("Error re-fetching tasks", error);
                        });
                } else {
                    setErrors({ form: result.message || 'Failed to create task' });
                    console.error('Task creation failed', result.message);
                }
            } catch (error) {
                console.error('Error creating task', error);
                setErrors({ form: 'Internal server error' });
            }
        } else {
            console.log('Form has errors. Please correct them.');
        }
    };

    const handleCheckboxChange = (taskId) => {
        if (checkedTasks.includes(taskId)) {
            setCheckedTasks(checkedTasks.filter(id => id !== taskId));
        } else {
            setCheckedTasks([...checkedTasks, taskId]);
        }
    };

    //Deletes only the selected tasks, and then re-fetches the list to update it
    const handleDeleteSelected = async () => {
        if (checkedTasks.length > 0) {
            try {
                const response = await fetch('/api/deleteTasks', { 
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ taskIds: checkedTasks }),
                });

                const result = await response.json();

                if (response.ok) {
                    fetch(`/api/editGROUPlist?GrplistId=${GrplistId}`)
                        .then(response => response.json())
                        .then(data => {
                            setTasks(data);
                            setCheckedTasks([]); 
                        })
                        .catch(error => {
                            console.error("Error re-fetching tasks after deletion", error);
                        });
                } else {
                    console.error('Failed to delete tasks', result.message);
                }
            } catch (error) {
                console.error('Error deleting tasks', error);
            }
        } else {
            alert('Please select tasks to delete.');
        }
    };

    //dropdown menu to choose a task to edit
    const handleDropdownToggle = (taskId) => {
        if (openTaskId === taskId) {
            setOpenTaskId(null); 
        } else {
            const taskToEdit = tasks.find(task => task.GrpTask_ID === taskId);
            if (taskToEdit) {
                setEditTaskName(taskToEdit.GrpTask_Name);
                setEditTaskContent(taskToEdit.GrpTask_Content);
                setOpenTaskId(taskId); 
            }
        }
    };

    const handleEditNameChange = (event) => {
        setEditTaskName(event.target.value);
    };

    const handleEditContentChange = (event) => {
        setEditTaskContent(event.target.value);
    };

    //Saves the edited task
    const handleSaveTask = async (taskId) => {
        try {
            const response = await fetch('/api/updateTasks', { 
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    IndTask_ID: taskId,
                    IndTask_Name: editTaskName,
                    IndTask_Content: editTaskContent,
                }),
            });

            if (response.ok) {

                setOpenTaskId(null); 

                fetch(`/api/editGROUPlist?GrplistId=${GrplistId}`)
                    .then(response => response.json())
                    .then(data => {
                        setTasks(data);
                    })
                    .catch(error => {
                        console.error("Error re-fetching tasks after update", error);
                    });
            } else {
                console.error('Failed to update task', await response.json());
            }
        } catch (error) {
            console.error('Error updating task', error);
        }
    };

    

    return (
        <>
            <head>
                <title>Create Task</title>
            </head>

                <Header />
                    <div className="row">
                            <div className="card" style={{width: '33%'}}>
                                <h2 className="card-title">Delete Tasks</h2>
                                <div className="card-body">
                                    {tasks.length > 0 ? (
                                        <ul className="list-group">
                                            {tasks.map(task => (
                                                <li key={task.GrpTask_ID} className="list-group-item d-flex align-items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input me-2"
                                                        value={task.GrpTask_ID}
                                                        checked={checkedTasks.includes(task.GrpTask_ID)}
                                                        onChange={() => handleCheckboxChange(task.GrpTask_ID)}
                                                    />
                                                    <span>{task.GrpTask_Name}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No tasks in this list yet.</p>
                                    )}
                                    
                                        <button onClick={handleDeleteSelected} style={{width:'fit-content'}}>
                                            Delete Selected Tasks
                                        </button>
                                </div>
                            </div>
                       
                             <form onSubmit={handleSubmit} style={{width: '33%'}}>
                                 <h2>Create a Task</h2>
                                 <div className="mb-3">
                                     <label className="form-label"><b>Name</b></label>
                                  <input
                                        type="text" 
                                        className="form-control"
                                        id="InputTaskName"
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)} 
                                    />
                                    {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label"><b>Content</b></label>
                                    <input
                                        type="text" 
                                        className="form-control"
                                        id="InputTaskContent"
                                        value={content} 
                                        onChange={(e) => setContent(e.target.value)} 
                                    />
                                    {errors.content && <p style={{ color: 'red' }}>{errors.content}</p>}
                                </div>
                                <button type="submit" className="btn-primary">Create</button>
                            </form>
                        
                            <div className="card" style={{ width: '33%' }}>
                    <h2 className="card-title">Modify Tasks</h2>
                    <div className="card-body">
                        {tasks.length > 0 ? (
                            <ul className="list-group">
                                {tasks.map(task => (
                                    <li key={task.GrpTask_ID} className="list-group-item">
                                        <div className="d-flex align-items-center">
                                            <span onClick={() => handleDropdownToggle(task.GrpTask_ID)} style={{ cursor: 'pointer' }}>
                                                {task.GrpTask_Name}
                                            </span>
                                        </div>
                                        {openTaskId === task.GrpTask_ID && (
                                            <div style={{ marginTop: '10px', border: '1px solid #ccc', padding: '10px' }}>
                                                <div className="mb-3">
                                                    <label className="form-label"><b>Name:</b></label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={editTaskName}
                                                        onChange={handleEditNameChange}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label"><b>Content:</b></label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={editTaskContent}
                                                        onChange={handleEditContentChange}
                                                    />
                                                </div>
                                                <button className="btn btn-primary" onClick={() => handleSaveTask(task.GrpTask_ID)}>
                                                    Save
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No tasks in this list yet.</p>
                        )}
                                </div>
                            </div>

                    </div>
                    </>


    );
};

export default EditList;