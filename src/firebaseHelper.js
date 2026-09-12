import { initializeApp, getApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
  getDoc
} from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";
import { DEFAULT_SEED_PRODUCTS, DEFAULT_SEED_SUPPLIERS, DEFAULT_SEED_CATEGORIES } from "./defaultSeedData";

// Verificar si Firebase está configurado con credenciales reales
export const isFirebaseConfigured = () => {
  return (
    firebaseConfig &&
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== "TU_API_KEY" &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== "TU_PROJECT_ID"
  );
};

let app = null;
let db = null;
let useFirestoreSession = false; // Flag para controlar si la sesión actual usará Firestore
let currentUserId = null;

export const setUserId = (uid) => {
  currentUserId = uid;
};

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    useFirestoreSession = true;
  } catch (error) {
    console.error("Error al inicializar Firebase:", error);
    useFirestoreSession = false;
  }
}

// --- ENVOLTURAS DE SEGURIDAD (TIMEOUT Y CAÍDA A LOCALSTORAGE) ---

const withTimeout = (promise, ms = 3500) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Timeout de conexión a Firebase Firestore")), ms)
    )
  ]);
};

const executeQuery = async (firestorePromiseFn, fallbackFn) => {
  if (db && useFirestoreSession) {
    try {
      return await withTimeout(firestorePromiseFn(), 3500);
    } catch (error) {
      console.warn("Fallo al conectar con Firestore, cambiando a LocalStorage para esta sesión:", error);
      useFirestoreSession = false;
      return await fallbackFn();
    }
  }
  return await fallbackFn();
};

const executeMutation = async (firestoreMutationFn, fallbackFn) => {
  if (db && useFirestoreSession) {
    try {
      return await withTimeout(firestoreMutationFn(), 3500);
    } catch (error) {
      console.warn("Fallo al guardar en Firestore, guardando localmente:", error);
      useFirestoreSession = false;
      return await fallbackFn();
    }
  }
  return await fallbackFn();
};

// --- PRESETS DE PRODUCTOS DE COMIDA RÁPIDA ---
const DEFAULT_PRODUCTS = [
  { name: "funda de papas", category: "Congelados", unit: "funda", estimatedPrice: 15.0 },
  { name: "pan HB sasty", category: "Panes", unit: "funda", estimatedPrice: 3.5 },
  { name: "coca cola", category: "Bebidas", unit: "faldo", estimatedPrice: 8.0 },
  { name: "carne aniversario", category: "Carnes", unit: "paquete", estimatedPrice: 12.0 },
  { name: "toallas", category: "Otros", unit: "unidad", estimatedPrice: 2.0 },
  { name: "masa de burrito", category: "Otros", unit: "unidad", estimatedPrice: 3.0 },
  { name: "lechuga", category: "Verduras", unit: "unidad", estimatedPrice: 0.8 },
  { name: "agua planeta azul", category: "Bebidas", unit: "faldo", estimatedPrice: 6.0 },
  { name: "Pan de Hamburguesa (x12)", category: "Panes", unit: "paquete", estimatedPrice: 3.5 },
  { name: "Pan de Perro Caliente (x12)", category: "Panes", unit: "paquete", estimatedPrice: 3.0 },
  { name: "Carne de Res para Hamburguesa (150g)", category: "Carnes", unit: "unidad", estimatedPrice: 1.2 },
  { name: "Pechuga de Pollo Fileteada", category: "Carnes", unit: "kg", estimatedPrice: 5.5 },
  { name: "Salchichas Jumbo (x10)", category: "Carnes", unit: "paquete", estimatedPrice: 4.0 },
  { name: "Queso Cheddar Feteado (x50)", category: "Lácteos/Quesos", unit: "paquete", estimatedPrice: 8.5 },
  { name: "Queso Mozzarella Rallado", category: "Lácteos/Quesos", unit: "kg", estimatedPrice: 7.0 },
  { name: "Papas Fritas Congeladas", category: "Congelados", unit: "caja (10kg)", estimatedPrice: 15.0 },
  { name: "Tocino Ahumado", category: "Carnes", unit: "kg", estimatedPrice: 9.0 },
  { name: "Lechuga Capuchina", category: "Verduras", unit: "unidad", estimatedPrice: 0.8 },
  { name: "Tomate de Ensalada", category: "Verduras", unit: "kg", estimatedPrice: 1.5 },
  { name: "Cebolla Morada", category: "Verduras", unit: "kg", estimatedPrice: 1.2 },
  { name: "Salsa Ketchup (Galón)", category: "Salsas/Aderezos", unit: "unidad", estimatedPrice: 6.0 },
  { name: "Mayonesa (Galón)", category: "Salsas/Aderezos", unit: "unidad", estimatedPrice: 7.5 },
  { name: "Mostaza (Galón)", category: "Salsas/Aderezos", unit: "unidad", estimatedPrice: 5.0 },
  { name: "Aceite de Freír (Bidón 20L)", category: "Otros", unit: "unidad", estimatedPrice: 28.0 },
  { name: "Servilletas de Papel", category: "Desechables", unit: "paquete", estimatedPrice: 2.0 },
  { name: "Bolsas de Papel Kraft", category: "Desechables", unit: "paquete", estimatedPrice: 4.5 }
];

const DEFAULT_SUPPLIERS = [
  { name: "Plaza de la Yaroa", phone: "18090000000", contactName: "Contacto Yaroa" },
  { name: "Distribuidora El Panal", phone: "5491122334455", contactName: "Carlos Pérez" },
  { name: "FrigoCarnes Express", phone: "5491199887766", contactName: "María Gómez" }
];

const DEFAULT_CATEGORIES = [
  { name: "Panes" },
  { name: "Carnes" },
  { name: "Lácteos/Quesos" },
  { name: "Verduras" },
  { name: "Salsas/Aderezos" },
  { name: "Bebidas" },
  { name: "Congelados" },
  { name: "Desechables" },
  { name: "Otros" }
];

// --- MOCK STORAGE (LOCAL STORAGE FALLBACK) ---
const getLocalStorageData = (key, defaultData) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(data);
};

const saveLocalStorageData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- REAL-TIME SUBSCRIPTION METHODS (SYNC AUTOMATICO ENTRE DISPOSITIVOS) ---

export const subscribeProducts = (onUpdate, onError) => {
  if (db && useFirestoreSession) {
    const colRef = collection(db, "products");
    const q = query(colRef, where("userId", "==", currentUserId));
    return onSnapshot(q, async (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      onUpdate(list);
    }, (error) => {
      console.warn("Fallo en suscripción de productos, cayendo a LocalStorage:", error);
      useFirestoreSession = false;
      onUpdate(getLocalStorageData("fastfood_products", DEFAULT_PRODUCTS.map((p, i) => ({ id: `p-${i}`, ...p }))));
      if (onError) onError(error);
    });
  } else {
    const localData = getLocalStorageData("fastfood_products", DEFAULT_PRODUCTS.map((p, i) => ({ id: `p-${i}`, ...p })));
    onUpdate(localData);
    return () => {};
  }
};

export const subscribeSuppliers = (onUpdate, onError) => {
  if (db && useFirestoreSession) {
    const colRef = collection(db, "suppliers");
    const q = query(colRef, where("userId", "==", currentUserId));
    return onSnapshot(q, async (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      onUpdate(list);
    }, (error) => {
      console.warn("Fallo en suscripción de proveedores, cayendo a LocalStorage:", error);
      useFirestoreSession = false;
      onUpdate(getLocalStorageData("fastfood_suppliers", DEFAULT_SUPPLIERS.map((s, i) => ({ id: `s-${i}`, ...s }))));
      if (onError) onError(error);
    });
  } else {
    const localData = getLocalStorageData("fastfood_suppliers", DEFAULT_SUPPLIERS.map((s, i) => ({ id: `s-${i}`, ...s })));
    onUpdate(localData);
    return () => {};
  }
};

export const subscribeCategories = (onUpdate, onError) => {
  if (db && useFirestoreSession) {
    const colRef = collection(db, "categories");
    const q = query(colRef, where("userId", "==", currentUserId));
    return onSnapshot(q, async (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      onUpdate(list.sort((a, b) => a.name.localeCompare(b.name)));
    }, (error) => {
      console.warn("Fallo en suscripción de categorías, cayendo a LocalStorage:", error);
      useFirestoreSession = false;
      const list = getLocalStorageData("fastfood_categories", DEFAULT_CATEGORIES.map((c, i) => ({ id: `c-${i}`, ...c })));
      onUpdate(list.sort((a, b) => a.name.localeCompare(b.name)));
      if (onError) onError(error);
    });
  } else {
    const list = getLocalStorageData("fastfood_categories", DEFAULT_CATEGORIES.map((c, i) => ({ id: `c-${i}`, ...c })));
    onUpdate(list.sort((a, b) => a.name.localeCompare(b.name)));
    return () => {};
  }
};

export const subscribeOrders = (onUpdate, onError) => {
  if (db && useFirestoreSession) {
    const colRef = collection(db, "orders");
    const q = query(colRef, where("userId", "==", currentUserId));
    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? (data.createdAt.toDate ? data.createdAt.toDate().toISOString() : new Date(data.createdAt).toISOString()) : new Date().toISOString()
        };
      });
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      onUpdate(list);
    }, (error) => {
      console.warn("Fallo en suscripción de órdenes, cayendo a LocalStorage:", error);
      useFirestoreSession = false;
      onUpdate(getLocalStorageData("fastfood_orders", []));
      if (onError) onError(error);
    });
  } else {
    const localData = getLocalStorageData("fastfood_orders", []);
    onUpdate(localData);
    return () => {};
  }
};

export const subscribeDrafts = (onUpdate, onError) => {
  if (db && useFirestoreSession) {
    const colRef = collection(db, "drafts");
    const q = query(colRef, where("userId", "==", currentUserId));
    return onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      onUpdate(list);
    }, (error) => {
      console.warn("Fallo en suscripción de borradores, cayendo a LocalStorage:", error);
      useFirestoreSession = false;
      onUpdate(getLocalStorageData("fastfood_drafts", []));
      if (onError) onError(error);
    });
  } else {
    const localData = getLocalStorageData("fastfood_drafts", []);
    onUpdate(localData);
    return () => {};
  }
};

// --- METODOS DE ESCRITURA ---

// 1. PRODUCTOS
export const getProducts = async () => {
  return executeQuery(
    async () => {
      const colRef = collection(db, "products");
      const q = query(colRef, where("userId", "==", currentUserId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    async () => {
      return getLocalStorageData("fastfood_products", DEFAULT_PRODUCTS.map((p, i) => ({ id: `p-${i}`, ...p })));
    }
  );
};

export const addProduct = async (product) => {
  return executeMutation(
    async () => {
      const docRef = await addDoc(collection(db, "products"), { ...product, userId: currentUserId });
      return { id: docRef.id, ...product };
    },
    async () => {
      const products = await getProducts();
      const newProduct = { id: `p-${Date.now()}`, ...product };
      products.push(newProduct);
      saveLocalStorageData("fastfood_products", products);
      return newProduct;
    }
  );
};

export const updateProduct = async (id, updatedFields) => {
  return executeMutation(
    async () => {
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, updatedFields);
      return { id, ...updatedFields };
    },
    async () => {
      const products = await getProducts();
      const index = products.findIndex(p => p.id === id);
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedFields };
        saveLocalStorageData("fastfood_products", products);
      }
      return products[index];
    }
  );
};

export const deleteProduct = async (id) => {
  return executeMutation(
    async () => {
      await deleteDoc(doc(db, "products", id));
      return id;
    },
    async () => {
      let products = await getProducts();
      products = products.filter(p => p.id !== id);
      saveLocalStorageData("fastfood_products", products);
      return id;
    }
  );
};

// 2. PROVEEDORES
export const getSuppliers = async () => {
  return executeQuery(
    async () => {
      const colRef = collection(db, "suppliers");
      const q = query(colRef, where("userId", "==", currentUserId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    async () => {
      return getLocalStorageData("fastfood_suppliers", DEFAULT_SUPPLIERS.map((s, i) => ({ id: `s-${i}`, ...s })));
    }
  );
};

export const addSupplier = async (supplier) => {
  return executeMutation(
    async () => {
      const docRef = await addDoc(collection(db, "suppliers"), { ...supplier, userId: currentUserId });
      return { id: docRef.id, ...supplier };
    },
    async () => {
      const suppliers = await getSuppliers();
      const newSupplier = { id: `s-${Date.now()}`, ...supplier };
      suppliers.push(newSupplier);
      saveLocalStorageData("fastfood_suppliers", suppliers);
      return newSupplier;
    }
  );
};

export const updateSupplier = async (id, updatedFields) => {
  return executeMutation(
    async () => {
      const docRef = doc(db, "suppliers", id);
      await updateDoc(docRef, updatedFields);
      return { id, ...updatedFields };
    },
    async () => {
      const suppliers = await getSuppliers();
      const index = suppliers.findIndex(s => s.id === id);
      if (index !== -1) {
        suppliers[index] = { ...suppliers[index], ...updatedFields };
        saveLocalStorageData("fastfood_suppliers", suppliers);
      }
      return suppliers[index];
    }
  );
};

export const deleteSupplier = async (id) => {
  return executeMutation(
    async () => {
      await deleteDoc(doc(db, "suppliers", id));
      return id;
    },
    async () => {
      let suppliers = await getSuppliers();
      suppliers = suppliers.filter(s => s.id !== id);
      saveLocalStorageData("fastfood_suppliers", suppliers);
      return id;
    }
  );
};

// 3. ÓRDENES DE COMPRA
export const getOrders = async () => {
  return executeQuery(
    async () => {
      const colRef = collection(db, "orders");
      const q = query(colRef, where("userId", "==", currentUserId));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : new Date().toISOString()
        };
      });
      return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    async () => {
      return getLocalStorageData("fastfood_orders", []);
    }
  );
};

export const generateNextOrderNumber = async () => {
  let latestNum = 0;
  
  if (db && useFirestoreSession) {
    try {
      const colRef = collection(db, "orders");
      const q = query(colRef, where("userId", "==", currentUserId));
      const snapshot = await withTimeout(getDocs(q), 3500);
      if (!snapshot.empty) {
        const allOrders = snapshot.docs.map(doc => doc.data());
        allOrders.sort((a, b) => {
          const aDate = a.createdAt ? (a.createdAt.toDate ? a.createdAt.toDate() : new Date(a.createdAt)) : new Date(0);
          const bDate = b.createdAt ? (b.createdAt.toDate ? b.createdAt.toDate() : new Date(b.createdAt)) : new Date(0);
          return bDate - aDate;
        });
        const lastOrder = allOrders[0];
        if (lastOrder && lastOrder.orderNumber) {
          const match = lastOrder.orderNumber.match(/\d+/);
          if (match) latestNum = parseInt(match[0], 10);
        }
      }
    } catch (e) {
      console.warn("Fallo al obtener número de orden de Firestore, usando local:", e);
    }
  } else {
    const orders = getLocalStorageData("fastfood_orders", []);
    if (orders.length > 0) {
      const lastOrder = orders[0];
      if (lastOrder && lastOrder.orderNumber) {
        const match = lastOrder.orderNumber.match(/\d+/);
        if (match) latestNum = parseInt(match[0], 10);
      }
    }
  }
  
  return `OC-${String(latestNum + 1).padStart(4, "0")}`;
};

export const createOrder = async (orderData) => {
  const nextNumber = await generateNextOrderNumber();
  const fullOrder = {
    orderNumber: nextNumber,
    status: "borrador",
    createdAt: db && useFirestoreSession ? serverTimestamp() : new Date().toISOString(),
    ...orderData
  };

  return executeMutation(
    async () => {
      const docRef = await addDoc(collection(db, "orders"), fullOrder);
      return {
        id: docRef.id,
        ...fullOrder,
        createdAt: new Date().toISOString()
      };
    },
    async () => {
      const orders = await getOrders();
      const newOrder = { id: `o-${Date.now()}`, ...fullOrder };
      orders.unshift(newOrder);
      saveLocalStorageData("fastfood_orders", orders);
      return newOrder;
    }
  );
};

export const updateOrderStatus = async (id, status) => {
  return executeMutation(
    async () => {
      const docRef = doc(db, "orders", id);
      await updateDoc(docRef, { status });
      return { id, status };
    },
    async () => {
      const orders = await getOrders();
      const index = orders.findIndex(o => o.id === id);
      if (index !== -1) {
        orders[index].status = status;
        saveLocalStorageData("fastfood_orders", orders);
      }
      return { id, status };
    }
  );
};

// 4. CATEGORÍAS
export const getCategories = async () => {
  return executeQuery(
    async () => {
      const colRef = collection(db, "categories");
      const q = query(colRef, where("userId", "==", currentUserId));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (list.length === 0) {
        for (const cat of DEFAULT_CATEGORIES) {
          await addDoc(colRef, { ...cat, userId: currentUserId });
        }
        const newSnapshot = await getDocs(colRef);
        return newSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
      return list.sort((a, b) => a.name.localeCompare(b.name));
    },
    async () => {
      const list = getLocalStorageData("fastfood_categories", DEFAULT_CATEGORIES.map((c, i) => ({ id: `c-${i}`, ...c })));
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
  );
};

export const addCategory = async (category) => {
  return executeMutation(
    async () => {
      const docRef = await addDoc(collection(db, "categories"), { ...category, userId: currentUserId });
      return { id: docRef.id, ...category };
    },
    async () => {
      const categories = await getCategories();
      const newCategory = { id: `c-${Date.now()}`, ...category };
      categories.push(newCategory);
      saveLocalStorageData("fastfood_categories", categories);
      return newCategory;
    }
  );
};

export const updateCategory = async (id, updatedFields) => {
  return executeMutation(
    async () => {
      const docRef = doc(db, "categories", id);
      await updateDoc(docRef, updatedFields);
      return { id, ...updatedFields };
    },
    async () => {
      const categories = await getCategories();
      const index = categories.findIndex(c => c.id === id);
      if (index !== -1) {
        categories[index] = { ...categories[index], ...updatedFields };
        saveLocalStorageData("fastfood_categories", categories);
      }
      return categories[index];
    }
  );
};

export const deleteCategory = async (id) => {
  return executeMutation(
    async () => {
      await deleteDoc(doc(db, "categories", id));
      return id;
    },
    async () => {
      let categories = await getCategories();
      categories = categories.filter(c => c.id !== id);
      saveLocalStorageData("fastfood_categories", categories);
      return id;
    }
  );
};

// 5. BORRADORES / LISTAS EN CURSO POR PROVEEDOR
export const getDrafts = async () => {
  return executeQuery(
    async () => {
      const colRef = collection(db, "drafts");
      const q = query(colRef, where("userId", "==", currentUserId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    async () => {
      return getLocalStorageData("fastfood_drafts", []);
    }
  );
};

export const saveDraft = async (draftId, items, supplierName = "") => {
  const draftData = {
    items,
    supplierName,
    updatedAt: new Date().toISOString()
  };

  return executeMutation(
    async () => {
      const docRef = doc(db, "drafts", draftId);
      await setDoc(docRef, draftData, { merge: true });
      return { id: draftId, ...draftData };
    },
    async () => {
      const drafts = await getDrafts();
      const index = drafts.findIndex(d => d.id === draftId);
      if (index !== -1) {
        drafts[index] = { ...drafts[index], ...draftData };
      } else {
        drafts.push({ id: draftId, ...draftData });
      }
      saveLocalStorageData("fastfood_drafts", drafts);
      return { id: draftId, ...draftData };
    }
  );
};

export const deleteDraft = async (draftId) => {
  return executeMutation(
    async () => {
      await deleteDoc(doc(db, "drafts", draftId));
      return draftId;
    },
    async () => {
      let drafts = await getDrafts();
      drafts = drafts.filter(d => d.id !== draftId);
      saveLocalStorageData("fastfood_drafts", drafts);
      return draftId;
    }
  );
};

// --- IMPORTAR RESPALDO / BACKUP ---
export const importBackupData = async (backupData) => {
  const { products, suppliers } = backupData;
  
  // Guardar productos secuencialmente para evitar colisiones
  if (products && Array.isArray(products)) {
    for (const prod of products) {
      const { id, ...prodData } = prod;
      // Verificar si ya existe un producto con el mismo nombre para no duplicarlo
      const existingProducts = await getProducts();
      const exists = existingProducts.some(p => p.name.toLowerCase() === prodData.name.toLowerCase());
      if (!exists) {
        await addProduct(prodData);
      }
    }
  }
  
  // Guardar proveedores secuencialmente
  if (suppliers && Array.isArray(suppliers)) {
    for (const sup of suppliers) {
      const { id, ...supData } = sup;
      const existingSuppliers = await getSuppliers();
      const exists = existingSuppliers.some(s => s.name.toLowerCase() === supData.name.toLowerCase() || s.phone === supData.phone);
      if (!exists) {
        await addSupplier(supData);
      }
    }
  }
};

// --- MIGRAR DATOS LOCALES A LA NUBE ---
export const migrateLocalToCloud = async () => {
  if (!db || !useFirestoreSession) return { success: false, error: "Firebase no está conectado" };

  try {
    const localProducts = JSON.parse(localStorage.getItem("fastfood_products") || "[]");
    const localSuppliers = JSON.parse(localStorage.getItem("fastfood_suppliers") || "[]");

    if (localProducts.length === 0 && localSuppliers.length === 0) {
      return { success: false, error: "No se encontraron datos locales para migrar en este navegador." };
    }

    await importBackupData({ products: localProducts, suppliers: localSuppliers });
    
    return { 
      success: true, 
      migratedProducts: localProducts.length, 
      migratedSuppliers: localSuppliers.length 
    };
  } catch (error) {
    console.error("Error en migración:", error);
    return { success: false, error: error.message };
  }
};

// --- RECONSTRUIR CATÁLOGO DESDE EL HISTORIAL DE ÓRDENES ---
export const rebuildCatalogFromHistory = async () => {
  try {
    const orders = await getOrders();
    const existingProducts = await getProducts();
    const existingNames = new Set(existingProducts.map(p => p.name.toLowerCase()));
    
    let addedCount = 0;
    
    // Recorrer todas las órdenes pasadas
    for (const order of orders) {
      if (order.items && Array.isArray(order.items)) {
        for (const item of order.items) {
          if (!existingNames.has(item.name.toLowerCase())) {
            // El producto no existe en el catálogo, lo insertamos
            const newProduct = {
              name: item.name,
              category: item.category || "Otros",
              unit: item.unit || "unidad",
              estimatedPrice: item.price || 0
            };
            await addProduct(newProduct);
            existingNames.add(item.name.toLowerCase());
            addedCount++;
          }
        }
      }
    }
    
    return { success: true, addedCount };
  } catch (error) {
    console.error("Error al reconstruir catálogo:", error);
    return { success: false, error: error.message };
  }
};

// --- RECUPERAR DATOS HUÉRFANOS (LEGACY) ---
export const claimLegacyData = async () => {
  if (!db || !useFirestoreSession || !currentUserId) {
    return { 
      success: false, 
      error: `No hay sesión activa. db:${!!db}, fsSession:${useFirestoreSession}, uid:${!!currentUserId}` 
    };
  }
  
  try {
    let claimedCount = 0;
    const collectionsToClaim = ["products", "suppliers", "categories", "orders", "drafts"];
    
    for (const colName of collectionsToClaim) {
      // Obtenemos TODOS los documentos (sin filtro de userId) para buscar los huérfanos
      const snapshot = await getDocs(collection(db, colName));
      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        if (!data.userId) {
          await updateDoc(doc(db, colName, docSnap.id), { userId: currentUserId });
          claimedCount++;
        }
      }
    }
    
    return { success: true, count: claimedCount };
  } catch (error) {
    console.error("Error al reclamar datos:", error);
    return { success: false, error: error.message };
  }
};

// --- BORRAR TODOS LOS DATOS DEL USUARIO ---
export const deleteAllUserData = async () => {
  if (!db || !useFirestoreSession || !currentUserId) {
    return { 
      success: false, 
      error: `No hay sesión activa. db:${!!db}, fsSession:${useFirestoreSession}, uid:${!!currentUserId}` 
    };
  }
  
  try {
    let deletedCount = 0;
    const collectionsToClear = ["products", "suppliers", "categories", "orders", "drafts"];
    
    for (const colName of collectionsToClear) {
      const q = query(collection(db, colName), where("userId", "==", currentUserId));
      const snapshot = await getDocs(q);
      for (const docSnap of snapshot.docs) {
        await deleteDoc(doc(db, colName, docSnap.id));
        deletedCount++;
      }
    }
    
    return { success: true, count: deletedCount };
  } catch (error) {
    console.error("Error al borrar datos:", error);
    return { success: false, error: error.message };
  }
};

// --- SEMBRADO (SEEDING) PARA NUEVOS USUARIOS ---
export const checkAndSeedUser = async (uid) => {
  if (!db || !useFirestoreSession || !uid) return;
  
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    
    // Si el usuario ya fue sembrado, no hacemos nada
    if (userDoc.exists() && userDoc.data().seeded) {
      return;
    }

    console.log("Usuario nuevo detectado. Sembrando base predeterminada (Plaza de la Yaroa)...");

    // 1. Crear el proveedor primero para obtener su ID
    const supplier = DEFAULT_SEED_SUPPLIERS[0]; // Solo es Plaza de la Yaroa
    const newSupplierRef = await addDoc(collection(db, "suppliers"), {
      ...supplier,
      userId: uid
    });
    const newSupplierId = newSupplierRef.id;

    // 2. Crear las categorías
    for (const cat of DEFAULT_SEED_CATEGORIES) {
      await addDoc(collection(db, "categories"), {
        ...cat,
        userId: uid
      });
    }

    // 3. Crear los productos, asociándolos al nuevo ID del proveedor
    for (const prod of DEFAULT_SEED_PRODUCTS) {
      await addDoc(collection(db, "products"), {
        ...prod,
        supplierId: newSupplierId,
        userId: uid
      });
    }

    // 4. Marcar al usuario como sembrado para no repetir
    await setDoc(userDocRef, { seeded: true }, { merge: true });
    
    console.log("Sembrado inicial completado con éxito.");
  } catch (error) {
    console.error("Error al sembrar datos del usuario:", error);
  }
};
