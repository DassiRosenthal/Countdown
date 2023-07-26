import React, { useState } from 'react'
import useFormData from './useForm';

export default function LogIn({ setUsername, setError }) {
  const [formData, setFormData] = useFormData({
    email: '',
    password: '',
    session: localStorage.getItem('sessionID') || ''
  });

  const [message, setMessage] = useState();

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch('https://inotherwords-api.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      console.log(data)
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      let name = formData.email.split('@');
      setUsername(name[0]);
      localStorage.setItem('sessionID', data.user.sessionID)
    } catch (e) {
      console.log(e)
      setError(e.message);
    }
  }

  async function register() {
    try {
      const response = await fetch('https://inotherwords-api.onrender.com/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      setMessage('registration successful');
      setTimeout(() => setMessage(), 5000);
    } catch (e) {
      setError(e.message);
    }
  }


  return (
    <form onSubmit={onSubmit}>
      <input type='email' name='email' placeholder='email address' required value={formData.email} onChange={setFormData} />
      <input type='password' name='password' placeholder='password' required value={formData.password} onChange={setFormData} />
      <button className='header-button'>Login</button>
      <button className='header-button' type='button' onClick={register}>Register</button>
      <div className='registration-msg'>{message}</div>
    </form>
  )
}
