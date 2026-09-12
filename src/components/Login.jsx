import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';
import { LogIn } from 'lucide-react';

export default function Login({ onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Credenciales incorrectas o usuario no encontrado.');
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError('Error al iniciar sesión con Google.');
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2><LogIn size={24} /> Iniciar Sesión</h2>
        <p className="auth-subtitle">Accede a tu cuenta de Lista de Compras</p>
        
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleEmailLogin} className="auth-form">
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="tu@correo.com"
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Ingresar
          </button>
        </form>

        <div className="auth-divider">o</div>

        <button onClick={handleGoogleLogin} className="btn btn-secondary btn-block" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{width: 18, marginRight: 8}}/>
          Continuar con Google
        </button>

        <div className="auth-footer">
          ¿No tienes cuenta? <button type="button" className="btn-link" onClick={onSwitchToRegister}>Regístrate aquí</button>
        </div>
      </div>
    </div>
  );
}
