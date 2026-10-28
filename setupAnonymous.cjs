const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// Import signInAnonymously
content = content.replace('import { onAuthStateChanged, signOut } from "firebase/auth";', 'import { onAuthStateChanged, signOut, signInAnonymously } from "firebase/auth";');

// Remove Login component import so it's not referenced
content = content.replace('import Login from "./components/Login";', '');
content = content.replace('import Register from "./components/Register";', '');

// Update Auth logic
const authLogic = `    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      
      if (currentUser) {
        setUserId(currentUser.uid);
      } else {
        // Automatic anonymous login to avoid the login screen
        signInAnonymously(auth).catch(error => {
          console.error("Error with anonymous auth:", error);
          // Fallback to local mode if auth fails
          setUser({ uid: "local_offline_user" });
          setUserId("local_offline_user");
          setAuthLoading(false);
        });
      }
    });`;

content = content.replace(/const unsubscribeAuth = onAuthStateChanged\(auth, \(currentUser\) => \{[\s\S]*?\}\);/, authLogic);

// Remove the Login screen render block
const renderLoginRegex = /\s*if \(\!user\) \{[\s\S]*?<Register[\s\S]*?\/>;\s*\}/;
content = content.replace(renderLoginRegex, '');

fs.writeFileSync(file, content);
console.log('Setup anonymous auth');
