const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

const authRegex = /setUser\(currentUser\);\s*setAuthLoading\(false\);\s*startSubscriptions\(currentUser\.uid\);/;
const authReplacement = `setUser(currentUser);
      setAuthLoading(false);
      if (!currentUser.isAnonymous) {
        startSubscriptions(currentUser.uid);
      }`;

content = content.replace(authRegex, authReplacement);
fs.writeFileSync(file, content);
console.log('App.jsx patched to block anonymous subscriptions');
