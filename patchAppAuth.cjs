const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Fix the auth listener block
const authRegex = /const unsubscribeAuth = onAuthStateChanged\(auth, \(currentUser\) => \{[\s\S]*?if \(false\) \{/;
const authReplacement = `const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
         // User is signed out
         setUser(null);
         setAuthLoading(false);
         return;
      }

      // User is signed in
      // If it's an anonymous user, we should log them out if they want real accounts? 
      // Actually, if they are anonymous, they can't have private data unless they link, 
      // but let's just let currentUser pass. If they want a real account they can sign out.
      setUser(currentUser);
      setAuthLoading(false);
      startSubscriptions(currentUser.uid);
      
      if (false) {`;

content = content.replace(authRegex, authReplacement);

// 2. Add the Login/Register render block right after `if (authLoading)`
const renderRegex = /if \(authLoading\) \{[\s\S]*?return \([\s\S]*?\);\s*\}/;
const renderReplacement = `if (authLoading) {
      return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem'}}>
          <div style={{width: 40, height: 40, border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
          <p style={{color: 'var(--text-muted)'}}>Verificando sesión...</p>
          <style>{\`@keyframes spin { to { transform: rotate(360deg); } }\`}</style>
        </div>
      );
    }
  
    if (!user || user.isAnonymous) {
      // Si el usuario no existe o es anónimo (de la versión anterior que puenteaba el login)
      // Forzamos el login/registro
      if (showLogin) {
        return <Login onSwitchToRegister={() => setShowLogin(false)} />;
      }
      return <Register onSwitchToLogin={() => setShowLogin(true)} />;
    }`;

content = content.replace(renderRegex, renderReplacement);

fs.writeFileSync(file, content);
console.log('App.jsx patched for authentication');
