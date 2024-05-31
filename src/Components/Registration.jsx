/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, getAuth, signOut, updateProfile } from "firebase/auth";
import app from '../firebase/firebase.config';
import axios from 'axios';

const Registration = () => {
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const auth = getAuth(app);

    const handleRegister = (event) => {
        setSuccess('');
        setError('');
        event.preventDefault();
        const form = event.target;
        const photo = form.photo.value;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((result) => {
                const loggedInUser = result.user;
                const role = "Student";

                // Update user profile first
                updateProfile(loggedInUser, { displayName: name, photoURL: photo })
                    .then(() => {   
                        // Now the profile is updated, save the user with the correct name
                        const saveUser = { name: loggedInUser.displayName, email: loggedInUser.email, role: role, img: photo };
                        
                        // Method1: Regular way
                        // fetch('http://localhost:5001/users', {
                        //     method: 'POST',
                        //     headers: {
                        //         'content-type': 'application/json'
                        //     },
                        //     body: JSON.stringify(saveUser)
                        // })
                        // .then(response => response.json())

                        // Method2: Using axios in post function, cause post function in axios is easy
                        axios.post('http://localhost:5001/users', saveUser)
                        .then(() => {
                            setSuccess('User created successfully! Go to Login Page'); // Display account created message
                            event.target.reset(); // Reset the form after successful account creation

                            // Logout after account created    
                            signOut(auth)
                                .then()
                                .catch();
                        });
                    })
                    .catch((error) => {
                        setError(error.message);
                    });
            })
            .catch(error => {
                setError(error.message);
            });
    }

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 mt-14">
                <h3 className="text-3xl font-semibold text-center mt-5 ">Please Register</h3>
                <form onSubmit={handleRegister} className="card-body">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Photo URL</span>
                        </label>
                        <input type="text" name="photo" placeholder="photo url" className="input input-bordered" />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input type="text" name="name" placeholder="name" className="input input-bordered" required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email address</span>
                        </label>
                        <input type="email" name="email" placeholder="email" className="input input-bordered" required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input type="password" name="password" placeholder="password" className="input input-bordered" required />
                        <div className="form-control mt-6">
                            <button className="btn btn-primary">Register</button>
                        </div>
                        <label className="label my-0">
                            <p>Already have an account? <Link to="/login" className="text-[#1d28ba]">Login</Link><br /></p>
                        </label>

                        <label className="label my-0 text-center">
                            <p className='text-[#30bb45]'>{success}</p>
                        </label>
                        <label className="label my-0 text-center">
                            <p className='text-[#bb3030]'>{error}</p>
                        </label>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Registration;
