import React, { useState } from 'react';
import './shared.css';

export default function LoginCard({ onLogin = ()=>{} }) {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('')

  function tryLogin(){
    setErr('')
    if (!mobile) return setErr('Enter mobile')
    if (!password) return setErr('Enter password')
    // simple fake auth: accept any mobile/password and return a user object
    const user = { name: mobile, role: 'delivery' }
    try { onLogin(user) } catch(e){}
  }

  return (
    <div className="sw-login-card">
      <div className="sw-login-left">
        <h3>Welcome back</h3>
        <p>Login to continue.</p>
      </div>
      <div className="sw-login-right">
        <input placeholder="Mobile number" value={mobile} onChange={e => setMobile(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <div style={{color:'red', minHeight:18}}>{err}</div>
        <button className="sw-login-btn" onClick={tryLogin}>Login</button>
      </div>
    </div>
  );
}
