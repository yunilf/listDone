const fs = require('fs');
const file = 'c:/Users/Yunil/Documents/antigravity/listDone_apk/src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

const targetAuthBlock = /const unsubscribeAuth = onAuthStateChanged\(auth, \(currentUser\) => \{[\s\S]*?if \(\!currentUser\) \{[\s\S]*?signInAnonymously\(auth\)[\s\S]*?return;\s*\}\s*setUser\(currentUser\);\s*setAuthLoading\(false\);\s*if \(currentUser\) \{/g;

const replacement = `    const startSubscriptions = (uid) => {
      setUserId(uid);
      setLoading(true);
      
      checkAndSeedUser(uid);
      
      let loadedSections = {
        products: false,
        suppliers: false,
        orders: false,
        categories: false,
        drafts: false
      };

      const checkLoadingFinished = (section) => {
        loadedSections[section] = true;
        const allLoaded = Object.values(loadedSections).every(val => val === true);
        if (allLoaded) {
          setLoading(false);
        }
      };

      unsubProducts = subscribeProducts(
        (list) => { setProducts(list); checkLoadingFinished("products"); },
        (err) => { console.error("Error productos:", err); checkLoadingFinished("products"); }
      );

      unsubSuppliers = subscribeSuppliers(
        (list) => { setSuppliers(list); checkLoadingFinished("suppliers"); },
        (err) => { console.error("Error proveedores:", err); checkLoadingFinished("suppliers"); }
      );

      unsubOrders = subscribeOrders(
        (list) => { setOrders(list); checkLoadingFinished("orders"); },
        (err) => { console.error("Error órdenes:", err); checkLoadingFinished("orders"); }
      );

      unsubCategories = subscribeCategories(
        (list) => { setCategories(list); checkLoadingFinished("categories"); },
        (err) => { console.error("Error categorías:", err); checkLoadingFinished("categories"); }
      );

      unsubDrafts = subscribeDrafts(
        (list) => { setDrafts(list); checkLoadingFinished("drafts"); },
        (err) => { console.error("Error borradores:", err); checkLoadingFinished("drafts"); }
      );
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        signInAnonymously(auth).then(({ user }) => {
           setUser(user);
           setAuthLoading(false);
           startSubscriptions(user.uid);
        }).catch(err => {
           console.error("Anonymous auth error", err);
           const localUser = { uid: "local_offline_user" };
           setUser(localUser);
           setAuthLoading(false);
           startSubscriptions(localUser.uid);
        });
        return;
      }

      setUser(currentUser);
      setAuthLoading(false);
      startSubscriptions(currentUser.uid);
      
      // Prevent original block from running by commenting out the if condition
      if (false) {`;

content = content.replace(targetAuthBlock, replacement);
fs.writeFileSync(file, content);
console.log('App.jsx init patched');
