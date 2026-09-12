import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import Login from "./components/Login";
import Register from "./components/Register";
import { 
  ClipboardList, 
  History, 
  Package, 
  Users, 
  Settings, 
  Database,
  Wifi,
  WifiOff,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Lock
} from "lucide-react";

import {
  addProduct,
  deleteProduct,
  updateProduct,
  addSupplier,
  deleteSupplier,
  updateSupplier,
  createOrder,
  updateOrderStatus,
  isFirebaseConfigured,
  addCategory,
  deleteCategory,
  updateCategory,
  saveDraft,
  deleteDraft,
  subscribeProducts,
  subscribeSuppliers,
  subscribeOrders,
  subscribeDrafts,
  subscribeCategories,
  importBackupData,
  migrateLocalToCloud,
  rebuildCatalogFromHistory,
  setUserId,
  claimLegacyData,
  deleteAllUserData,
  checkAndSeedUser
} from "./firebaseHelper";

import ActiveList from "./components/ActiveList";
import OrderHistory from "./components/OrderHistory";
import Catalog from "./components/Catalog";
import Suppliers from "./components/Suppliers";

export default function App() {
  const [activeTab, setActiveTab] = useState("lista-activa");
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);
  
  const [businessName, setBusinessName] = useState(() => {
    return localStorage.getItem("fastfood_business_name") || "Mi Negocio de Comida Rápida";
  });

  const firebaseActive = isFirebaseConfigured();

  // Manejo de Autenticación y Carga de datos
  useEffect(() => {
    let unsubProducts, unsubSuppliers, unsubOrders, unsubCategories, unsubDrafts;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
      
      if (currentUser) {
        setUserId(currentUser.uid);
        setLoading(true);
        
        // Ejecutar sembrado de base de datos de ser necesario
        checkAndSeedUser(currentUser.uid);
        
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

      } else {
        setUserId(null);
        setProducts([]);
        setSuppliers([]);
        setOrders([]);
        setCategories([]);
        setDrafts([]);
        setLoading(true);
        if (unsubProducts) unsubProducts();
        if (unsubSuppliers) unsubSuppliers();
        if (unsubOrders) unsubOrders();
        if (unsubCategories) unsubCategories();
        if (unsubDrafts) unsubDrafts();
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubProducts) unsubProducts();
      if (unsubSuppliers) unsubSuppliers();
      if (unsubOrders) unsubOrders();
      if (unsubCategories) unsubCategories();
      if (unsubDrafts) unsubDrafts();
    };
  }, []);

  // Guardar nombre del negocio en localStorage localmente
  const handleSaveBusinessName = (name) => {
    setBusinessName(name);
    localStorage.setItem("fastfood_business_name", name);
  };

  // --- HANDLERS PRODUCTOS ---
  const handleAddProduct = async (productData) => {
    try {
      const newProd = await addProduct(productData);
      setProducts(prev => {
        if (prev.some(p => p.id === newProd.id)) return prev;
        return [...prev, newProd];
      });
    } catch (e) {
      console.error(e);
      alert("Error al agregar producto");
    }
  };

  const handleUpdateProduct = async (id, updatedFields) => {
    try {
      const updated = await updateProduct(id, updatedFields);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    } catch (e) {
      console.error(e);
      alert("Error al actualizar producto");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto del catálogo?")) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      console.error(e);
      alert("Error al eliminar producto");
    }
  };

  // --- HANDLERS PROVEEDORES ---
  const handleAddSupplier = async (supplierData) => {
    try {
      const newSup = await addSupplier(supplierData);
      setSuppliers(prev => {
        if (prev.some(s => s.id === newSup.id)) return prev;
        return [...prev, newSup];
      });
    } catch (e) {
      console.error(e);
      alert("Error al agregar proveedor");
    }
  };

  const handleUpdateSupplier = async (id, updatedFields) => {
    try {
      const updated = await updateSupplier(id, updatedFields);
      setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...updated } : s));
    } catch (e) {
      console.error(e);
      alert("Error al actualizar proveedor");
    }
  };

  const handleDeleteSupplier = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este proveedor?")) return;
    try {
      await deleteSupplier(id);
      setSuppliers(prev => prev.filter(s => s.id !== id));
    } catch (e) {
      console.error(e);
      alert("Error al eliminar proveedor");
    }
  };

  // --- HANDLERS CATEGORÍAS ---
  const handleAddCategory = async (categoryData) => {
    try {
      const newCat = await addCategory(categoryData);
      setCategories(prev => {
        if (prev.some(c => c.id === newCat.id)) return prev;
        return [...prev, newCat].sort((a, b) => a.name.localeCompare(b.name));
      });
    } catch (e) {
      console.error(e);
      alert("Error al agregar categoría");
    }
  };

  const handleUpdateCategory = async (id, updatedFields) => {
    try {
      const updated = await updateCategory(id, updatedFields);
      setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c).sort((a, b) => a.name.localeCompare(b.name)));
    } catch (e) {
      console.error(e);
      alert("Error al actualizar categoría");
    }
  };

  const handleDeleteCategory = async (id) => {
    const catToDelete = categories.find(c => c.id === id);
    if (catToDelete) {
      const hasProducts = products.some(p => p.category === catToDelete.name);
      if (hasProducts) {
        alert(`No puedes eliminar la categoría "${catToDelete.name}" porque tiene productos asociados en el catálogo. Cambia la categoría de esos productos antes de eliminarla.`);
        return;
      }
    }

    if (!window.confirm("¿Seguro que deseas eliminar esta categoría?")) return;
    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (e) {
      console.error(e);
      alert("Error al eliminar categoría");
    }
  };

  // --- HANDLERS BORRADORES ---
  const handleSaveDraft = async (draftId, items, supplierName = "") => {
    try {
      const updatedDraft = await saveDraft(draftId, items, supplierName);
      setDrafts(prev => {
        const index = prev.findIndex(d => d.id === draftId);
        if (index !== -1) {
          return prev.map(d => d.id === draftId ? updatedDraft : d);
        }
        return [...prev, updatedDraft];
      });
    } catch (e) {
      console.error("Error al guardar borrador:", e);
    }
  };

  const handleDeleteDraft = async (draftId) => {
    try {
      await deleteDraft(draftId);
      setDrafts(prev => prev.filter(d => d.id !== draftId));
    } catch (e) {
      console.error("Error al eliminar borrador:", e);
    }
  };

  // --- HANDLERS BACKUP ---
  const handleExportBackup = () => {
    try {
      const backupData = {
        products,
        suppliers,
        exportedAt: new Date().toISOString()
      };
      
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(backupData, null, 2)
      )}`;
      
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      
      const dateStr = new Date().toISOString().split("T")[0];
      downloadAnchor.setAttribute("download", `backup-gestor-pedidos-${dateStr}.json`);
      
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error(e);
      alert("Error al exportar la copia de seguridad");
    }
  };

  const handleImportBackup = async (e) => {
    const fileReader = new FileReader();
    const file = e.target.files[0];
    if (!file) return;

    fileReader.onload = async (event) => {
      try {
        const backupData = JSON.parse(event.target.result);
        if (!backupData.products && !backupData.suppliers) {
          alert("El archivo de respaldo no es válido. Debe contener la lista de productos o proveedores.");
          return;
        }

        setLoading(true);
        await importBackupData(backupData);
        alert("¡Copia de seguridad importada con éxito! Los productos y proveedores nuevos se han sincronizado.");
      } catch (err) {
        console.error(err);
        alert("Error al procesar el archivo de respaldo. Asegúrate de seleccionar un archivo .json válido.");
      } finally {
        setLoading(false);
      }
    };
    fileReader.readAsText(file);
  };

  const handleMigrateData = async () => {
    if (window.confirm("¿Deseas copiar tus productos y proveedores locales a la nube de Firebase? No se borrarán los datos que ya estén en la nube.")) {
      setLoading(true);
      try {
        const result = await migrateLocalToCloud();
        if (result.success) {
          alert(`¡Migración completada! Se copiaron ${result.migratedProducts} productos y ${result.migratedSuppliers} proveedores a la nube de Firebase.`);
          // Limpiar localstorage localmente para que no vuelva a aparecer el cartel de migración
          localStorage.removeItem("fastfood_products");
          localStorage.removeItem("fastfood_suppliers");
        } else {
          alert(`Error al migrar: ${result.error}\n\nSugerencias de solución:\n1. Asegúrate de haber entrado a tu consola de Firebase y haber creado la base de datos "Cloud Firestore" (en la pestaña "Build" -> "Firestore Database").\n2. En tu pestaña "Rules" de Firestore, asegúrate de que las Reglas de Seguridad permitan la lectura y escritura temporalmente para pruebas. Por ejemplo:\n   allow read, write: if true;`);
        }
      } catch (err) {
        console.error(err);
        alert(`Ocurrió un error inesperado al migrar: ${err.message || err}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const [showRawLocalModal, setShowRawLocalModal] = useState(false);
  const [rawLocalDataText, setRawLocalDataText] = useState("");

  const handleShowRawLocalData = () => {
    try {
      const localProductsText = localStorage.getItem("fastfood_products");
      const localSuppliersText = localStorage.getItem("fastfood_suppliers");
      
      const combined = {
        products: localProductsText ? JSON.parse(localProductsText) : [],
        suppliers: localSuppliersText ? JSON.parse(localSuppliersText) : []
      };
      
      setRawLocalDataText(JSON.stringify(combined, null, 2));
      setShowRawLocalModal(true);
    } catch (e) {
      alert("Error al leer datos locales: " + e.message);
    }
  };

  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteJsonText, setPasteJsonText] = useState("");

  const handleImportPasteJson = async () => {
    try {
      const backupData = JSON.parse(pasteJsonText);
      if (!backupData.products && !backupData.suppliers) {
        alert("El texto no es válido. Debe contener una lista de productos o proveedores.");
        return;
      }
      setLoading(true);
      await importBackupData(backupData);
      alert("¡Datos importados y sincronizados con éxito!");
      setShowPasteModal(false);
      setPasteJsonText("");
    } catch (e) {
      alert("Error al procesar el texto JSON: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRebuildCatalog = async () => {
    if (window.confirm("¿Deseas reconstruir automáticamente tu catálogo de productos extrayéndolos de las órdenes en tu historial?")) {
      setLoading(true);
      try {
        const result = await rebuildCatalogFromHistory();
        if (result.success) {
          alert(`¡Catálogo reconstruido con éxito! Se recuperaron y agregaron ${result.addedCount} productos desde el historial.`);
        } else {
          alert(`Error al reconstruir catálogo: ${result.error}`);
        }
      } catch (err) {
        console.error(err);
        alert("Ocurrió un error inesperado al intentar reconstruir el catálogo.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClaimLegacyData = async () => {
    if (window.confirm("¿Deseas recuperar los datos antiguos y asignarlos a tu cuenta actual? (Solo los que no tienen dueño asignado)")) {
      setLoading(true);
      try {
        const result = await claimLegacyData();
        if (result.success) {
          alert(`¡Datos recuperados con éxito! Se vincularon ${result.count} elementos a tu cuenta.`);
        } else {
          alert(`Error al reclamar datos: ${result.error}`);
        }
      } catch (err) {
        console.error(err);
        alert("Ocurrió un error inesperado al intentar recuperar los datos antiguos.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteAllData = async () => {
    if (window.confirm("⚠️ ¡ADVERTENCIA! ¿Estás completamente seguro de que deseas ELIMINAR TODOS TUS DATOS? Esta acción borrará todo tu catálogo, proveedores y órdenes de forma irreversible.")) {
      if (window.confirm("Esta es tu última oportunidad. ¿De verdad quieres borrar todo?")) {
        setLoading(true);
        try {
          const result = await deleteAllUserData();
          if (result.success) {
            alert(`¡Datos eliminados permanentemente! Se borraron ${result.count} documentos de tu cuenta.`);
          } else {
            alert(`Error al borrar datos: ${result.error}`);
          }
        } catch (err) {
          console.error(err);
          alert("Ocurrió un error inesperado al intentar borrar los datos.");
        } finally {
          setLoading(false);
        }
      }
    }
  };

  // --- HANDLERS ÓRDENES ---
  const handleCreateOrder = async (orderData) => {
    try {
      const newOrder = await createOrder({
        ...orderData,
        businessName
      });
      setOrders(prev => [newOrder, ...prev]);
    } catch (e) {
      console.error(e);
      alert("Error al crear la orden de compra");
    }
  };

  const handleUpdateOrderStatus = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (e) {
      console.error(e);
      alert("Error al actualizar el estado de la orden");
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: "1rem" }}>
          <div style={{ width: "50px", height: "50px", border: "5px solid rgba(255,159,28,0.1)", borderTop: "5px solid var(--primary)", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
          <p style={{ color: "var(--text-muted)", fontWeight: 500 }}>Sincronizando datos...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      );
    }

    switch (activeTab) {
      case "lista-activa":
        return (
          <ActiveList
            products={products}
            suppliers={suppliers}
            drafts={drafts}
            onSaveDraft={handleSaveDraft}
            onDeleteDraft={handleDeleteDraft}
            onCreateOrder={handleCreateOrder}
            navigateToHistory={() => setActiveTab("historial")}
          />
        );
      case "historial":
        return (
          <OrderHistory
            orders={orders}
            suppliers={suppliers}
            onUpdateStatus={handleUpdateOrderStatus}
          />
        );
      case "catalogo":
        return (
          <Catalog
            products={products}
            categories={categories}
            suppliers={suppliers}
            onAdd={handleAddProduct}
            onUpdate={handleUpdateProduct}
            onDelete={handleDeleteProduct}
            onAddCategory={handleAddCategory}
            onUpdateCategory={handleUpdateCategory}
            onDeleteCategory={handleDeleteCategory}
          />
        );
      case "proveedores":
        return (
          <Suppliers
            suppliers={suppliers}
            onAdd={handleAddSupplier}
            onUpdate={handleUpdateSupplier}
            onDelete={handleDeleteSupplier}
          />
        );
      case "settings":
        return (
          <div className="settings-container">
            <h1 className="page-title">Configuración</h1>
            <p className="page-subtitle">Gestiona tu perfil y copias de seguridad</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginTop: "2rem" }}>
              
              {/* Card de Perfil de Usuario */}
              <div className="card">
                <h3 style={{ fontFamily: "var(--font-title)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem" }}>
                  Perfil de Usuario
                </h3>
                
                <div style={{ marginBottom: "1.5rem" }}>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Correo Electrónico</p>
                  <p style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "1.05rem" }}>{user?.email}</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Nombre Comercial de tu Negocio</label>
                  <input
                    type="text"
                    className="form-input"
                    value={businessName}
                    onChange={(e) => handleSaveBusinessName(e.target.value)}
                    placeholder="Ej. Burger Station"
                  />
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem", display: "block" }}>
                    Este nombre aparecerá en los encabezados de tus mensajes de WhatsApp.
                  </span>
                </div>
              </div>

              {/* Card de Copia de Seguridad (Backup) */}
              <div className="card">
                <h3 style={{ fontFamily: "var(--font-title)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1rem" }}>
                  Copia de Seguridad (Backup)
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
                  Descarga un respaldo con todos tus productos y proveedores registrados, o restaura tus datos desde un archivo guardado previamente.
                </p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <button className="btn btn-primary" onClick={handleExportBackup}>
                    Exportar Datos (.json)
                  </button>
                  <label className="btn btn-secondary" style={{ display: "inline-flex", cursor: "pointer", margin: 0 }}>
                    Importar Datos (.json)
                    <input 
                      type="file" 
                      accept=".json" 
                      onChange={handleImportBackup} 
                      style={{ display: "none" }} 
                    />
                  </label>
                </div>
              </div>

              {/* Card de Conexión al Ecosistema */}
              <div className="card" style={{ borderColor: "var(--primary)", backgroundColor: "rgba(10, 132, 255, 0.02)" }}>
                <h3 style={{ fontFamily: "var(--font-title)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                  Ecosistema Connect Done
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0" }}>
                  Tus insumos están conectados en tiempo real con Connect Done mediante Firebase. <br/>
                  <span style={{color: "var(--text-main)", fontWeight: 500}}>Estado: Sincronización Automática Activa.</span>
                </p>
              </div>

              {/* Card de Borrar Datos de Prueba */}
              <div className="card" style={{ borderColor: "#ef4444", backgroundColor: "rgba(239,68,68,0.02)" }}>
                <h3 style={{ fontFamily: "var(--font-title)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.5rem", color: "#ef4444" }}>
                  Borrar Todo Mi Catálogo y Pedidos (Peligro)
                </h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
                  Usa esta opción si creaste datos de prueba y deseas empezar desde cero. <strong>Esta acción es irreversible y borrará absolutamente todo lo que tienes guardado en esta cuenta.</strong>
                </p>
                <button className="btn btn-primary" style={{ backgroundColor: "#ef4444", color: "white", border: "none" }} onClick={handleDeleteAllData}>
                  Eliminar Todos mis Datos
                </button>
              </div>

            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (authLoading) {
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem'}}>
        <div style={{width: 40, height: 40, border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
        <p style={{color: 'var(--text-muted)'}}>Verificando sesión...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return showLogin ? 
      <Login onSwitchToRegister={() => setShowLogin(false)} /> : 
      <Register onSwitchToLogin={() => setShowLogin(true)} />;
  }

  if (loading) {
    return (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem'}}>
        <div style={{width: 40, height: 40, border: '4px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
        <p style={{color: 'var(--text-muted)'}}>Cargando catálogo...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* MENÚ LATERAL (ESCRITORIO) */}
      <aside className="sidebar">
        <div className="brand-section">
          <span className="brand-icon">🍔</span>
          <div>
            <h1 className="brand-name">Gestor de Pedidos</h1>
            <span style={{ fontSize: "0.7rem", color: "var(--primary)", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>
              Órdenes de Compra
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div 
            className={`nav-item ${activeTab === "lista-activa" ? "active" : ""}`}
            onClick={() => setActiveTab("lista-activa")}
          >
            <ClipboardList />
            Lista Activa
          </div>
          <div 
            className={`nav-item ${activeTab === "historial" ? "active" : ""}`}
            onClick={() => setActiveTab("historial")}
          >
            <History />
            Historial de OC
          </div>
          <div 
            className={`nav-item ${activeTab === "catalogo" ? "active" : ""}`}
            onClick={() => setActiveTab("catalogo")}
          >
            <Package />
            Catálogo Base
          </div>
          <div 
            className={`nav-item ${activeTab === "proveedores" ? "active" : ""}`}
            onClick={() => setActiveTab("proveedores")}
          >
            <Users />
            Proveedores
          </div>
          <div 
            className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings />
            Configuración
          </div>
        </nav>

        {/* Estado de Conexión y Usuario */}
        <div className="sidebar-footer" style={{ padding: "1rem", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", overflow: "hidden" }}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" style={{ width: 24, height: 24, borderRadius: "50%" }} />
            ) : (
              <div style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", flexShrink: 0 }}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <span style={{ fontSize: "0.8rem", color: "var(--text)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
              {user?.email}
            </span>
          </div>
          <button 
            className="btn btn-secondary" 
            style={{ padding: "0.4rem", fontSize: "0.8rem", width: "100%", borderColor: "#ef4444", color: "#ef4444", marginTop: "0.5rem" }}
            onClick={() => signOut(auth)}
          >
            Cerrar Sesión
          </button>
          <div className="firebase-status-badge" style={{ marginTop: "0.5rem" }}>
            <div className={`status-dot ${firebaseActive ? "active" : ""}`}></div>
            <span>{firebaseActive ? "Nube" : "Local"}</span>
          </div>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO */}
      <main className="main-content">
        {renderContent()}
      </main>

      {/* NAVEGACIÓN MÓVIL (BOTTOM BAR) */}
      <nav className="mobile-nav">
        <div 
          className={`mobile-nav-item ${activeTab === "lista-activa" ? "active" : ""}`}
          onClick={() => setActiveTab("lista-activa")}
        >
          <ClipboardList />
          <span>Lista</span>
        </div>
        <div 
          className={`mobile-nav-item ${activeTab === "historial" ? "active" : ""}`}
          onClick={() => setActiveTab("historial")}
        >
          <History />
          <span>Historial</span>
        </div>
        <div 
          className={`mobile-nav-item ${activeTab === "catalogo" ? "active" : ""}`}
          onClick={() => setActiveTab("catalogo")}
        >
          <Package />
          <span>Catálogo</span>
        </div>
        <div 
          className={`mobile-nav-item ${activeTab === "proveedores" ? "active" : ""}`}
          onClick={() => setActiveTab("proveedores")}
        >
          <Users />
          <span>Proveedores</span>
        </div>
        <div 
          className={`mobile-nav-item ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          <Settings />
          <span>Ajustes</span>
        </div>
      </nav>

      {/* MODAL DE EMERGENCIA PARA MOSTRAR JSON LOCAL */}
      {showRawLocalModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "1rem"
        }}>
          <div className="card" style={{
            maxWidth: "600px",
            width: "100%",
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--info)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}>
            <h3 style={{ fontFamily: "var(--font-title)", fontWeight: 700, color: "var(--info)", margin: 0 }}>
              Copia de Seguridad de Emergencia (Datos Locales)
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
              Aquí tienes el JSON de tus productos y proveedores guardados en la memoria de este navegador. Puedes copiarlo y pegarlo en un bloc de notas.
            </p>
            <textarea
              readOnly
              value={rawLocalDataText}
              style={{
                width: "100%",
                height: "250px",
                backgroundColor: "var(--bg-app)",
                color: "var(--text-main)",
                border: "1px solid var(--border-color)",
                borderRadius: "6px",
                padding: "0.75rem",
                fontFamily: "monospace",
                fontSize: "0.8rem",
                resize: "none"
              }}
              onClick={(e) => e.target.select()}
            />
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  navigator.clipboard.writeText(rawLocalDataText);
                  alert("¡Texto copiado al portapapeles!");
                }}
              >
                Copiar al Portapapeles
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => setShowRawLocalModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL DE EMERGENCIA PARA IMPORTAR PEGA DE JSON */}
      {showPasteModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.85)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "1rem"
        }}>
          <div className="card" style={{
            maxWidth: "600px",
            width: "100%",
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--primary)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}>
            <h3 style={{ fontFamily: "var(--font-title)", fontWeight: 700, color: "var(--primary)", margin: 0 }}>
              Importar Datos Pegando Texto
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
              Pega aquí el código de respaldo (JSON) que copiaste de tu versión local para cargarlo en este navegador y sincronizarlo.
            </p>
            <textarea
              value={pasteJsonText}
              onChange={(e) => setPasteJsonText(e.target.value)}
              placeholder='Pega tu JSON aquí, por ejemplo: {"products": [...], "suppliers": [...]}'
              style={{
                width: "100%",
                height: "250px",
                backgroundColor: "var(--bg-app)",
                color: "var(--text-main)",
                border: "1px solid var(--border-color)",
                borderRadius: "6px",
                padding: "0.75rem",
                fontFamily: "monospace",
                fontSize: "0.8rem"
              }}
            />
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowPasteModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-primary" 
                disabled={!pasteJsonText.trim()}
                onClick={handleImportPasteJson}
              >
                Procesar e Importar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
