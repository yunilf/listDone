import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';
import { UserPlus } from 'lucide-react';

export default function Register({ onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError('Error al crear la cuenta. Verifica que el correo sea válido o que la contraseña tenga 6 o más caracteres.');
      console.error(err);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError('Error al registrarse con Google.');
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2><UserPlus size={24} /> Crear Cuenta</h2>
        <p className="auth-subtitle">Regístrate para guardar tu catálogo y órdenes en la nube</p>
        
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleEmailRegister} className="auth-form">
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
              placeholder="Min. 6 caracteres"
              minLength={6}
            />
          </div>
          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input 
              type="password" 
              className="form-input" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block">
            Registrarse
          </button>
        </form>

        <div className="auth-divider">o</div>

        <button onClick={handleGoogleLogin} className="btn btn-secondary btn-block" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{width: 18, marginRight: 8}}/>
          Continuar con Google
        </button>

        <div className="auth-footer">
          ¿Ya tienes cuenta? <button type="button" className="btn-link" onClick={onSwitchToLogin}>Inicia sesión</button>
        </div>
      </div>
    </div>
  );
}
