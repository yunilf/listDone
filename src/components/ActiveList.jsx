import React, { useState, useEffect } from "react";
import { Search, ShoppingBag, Plus, Minus, UserCheck, Trash2, CloudLightning, RefreshCw } from "lucide-react";

const CATEGORY_COLORS = [
  "#ff9f1c", "#e71d36", "#2ec4b6", "#ffd166", "#00b4d8",
  "#a8dadc", "#e63946", "#b5e2fa", "#edede9", "#9b5de5", "#f15bb5"
];

const getCategoryColor = (name) => {
  if (!name) return CATEGORY_COLORS[8];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CATEGORY_COLORS.length;
  return CATEGORY_COLORS[index];
};

export default function ActiveList({ 
  products, 
  suppliers, 
  drafts = [], 
  onSaveDraft, 
  onDeleteDraft, 
  onCreateOrder, 
  navigateToHistory 
}) {
  const [currentDraftId, setCurrentDraftId] = useState("general");
  const [quantities, setQuantities] = useState({});
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showOnlySelected, setShowOnlySelected] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Categorías de productos para los filtros de la lista activa
  const categories = ["Todos", ...new Set(products.map(p => p.category))].filter(Boolean);

  // 1. Cargar borrador inicial "general" al iniciar la app
  useEffect(() => {
    if (!isInitialized && drafts.length > 0) {
      const generalDraft = drafts.find(d => d.id === "general");
      if (generalDraft && generalDraft.items) {
        const newQties = {};
        generalDraft.items.forEach(item => {
          newQties[item.productId] = item.quantity;
        });
        setQuantities(newQties);
      }
      setIsInitialized(true);
    }
  }, [drafts, isInitialized]);

  // 2. Cambiar de borrador / proveedor en el selector
  const handleSwitchDraft = (draftId) => {
    setCurrentDraftId(draftId);
    
    // Si entramos a la lista de un proveedor específico, auto-seleccionamos ese proveedor
    if (draftId !== "general") {
      setSelectedSupplierId(draftId);
    } else {
      setSelectedSupplierId("");
    }

    // Cargar los items correspondientes a ese borrador si existen
    const activeDraft = drafts.find(d => d.id === draftId);
    if (activeDraft && activeDraft.items) {
      const newQties = {};
      activeDraft.items.forEach(item => {
        newQties[item.productId] = item.quantity;
      });
      setQuantities(newQties);
    } else {
      setQuantities({});
    }
  };

  // 3. Sincronizar cambios en la base de datos (con indicador visual breve)
  const saveCurrentDraft = (updatedQuantities) => {
    setIsSaving(true);
    
    // Convertir el estado local de cantidades en un arreglo de items completo
    const items = Object.entries(updatedQuantities).map(([id, qty]) => {
      const product = products.find(p => p.id === id);
      return {
        productId: id,
        name: product ? product.name : "Producto desconocido",
        category: product ? product.category : "Otros",
        unit: product ? product.unit : "unidad",
        price: product ? product.estimatedPrice || 0 : 0,
        quantity: qty
      };
    }).filter(item => item.quantity > 0);

    const supplier = suppliers.find(s => s.id === currentDraftId);
    const supplierName = supplier ? supplier.name : "General";

    // Guardar borrador en Firebase / LocalStorage
    onSaveDraft(currentDraftId, items, supplierName);
    
    // Falso retraso visual para simular la confirmación de la sincronización en la nube
    setTimeout(() => {
      setIsSaving(false);
    }, 400);
  };

  // 4. Cambiar cantidades
  const handleQtyChange = (productId, delta) => {
    setQuantities(prev => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      
      const newQty = { ...prev };
      if (next === 0) {
        delete newQty[productId];
      } else {
        newQty[productId] = next;
      }
      
      saveCurrentDraft(newQty);
      return newQty;
    });
  };

  // 5. Vaciar lista activa (borrar borrador)
  const handleReset = () => {
    if (window.confirm("¿Seguro que deseas vaciar esta lista de compras? Se eliminarán los datos guardados en la nube para esta lista.")) {
      setQuantities({});
      onDeleteDraft(currentDraftId);
    }
  };

  // Obtener productos activos de la vista seleccionada
  const activeItems = Object.entries(quantities).map(([id, qty]) => {
    const product = products.find(p => p.id === id);
    return {
      productId: id,
      name: product ? product.name : "Producto desconocido",
      category: product ? product.category : "Otros",
      unit: product ? product.unit : "unidad",
      price: product ? product.estimatedPrice || 0 : 0,
      quantity: qty
    };
  }).filter(item => item.quantity > 0);

  // Calcular totales
  const totalItemsCount = activeItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalEstimatedCost = activeItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // Filtrar catálogo base
  const displayedProducts = products.filter(product => {
    // 1. Filtrar por proveedor
    if (currentDraftId !== "general" && product.supplierId !== currentDraftId) {
      return false;
    }

    const qty = quantities[product.id] || 0;
    
    if (showOnlySelected && qty === 0) return false;
    
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || 
      (product.category && selectedCategory && 
       product.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim());
    
    return matchesSearch && matchesCategory;
  });

  // Finalizar pedido y convertirlo en Orden de Compra formal
  const handleFinalizeOrder = () => {
    if (activeItems.length === 0) {
      alert("Debes agregar al menos un producto a la lista.");
      return;
    }
    if (!selectedSupplierId) {
      alert("Por favor, selecciona un proveedor para asignar a esta orden de compra.");
      return;
    }

    const supplier = suppliers.find(s => s.id === selectedSupplierId);
    if (!supplier) return;

    const orderData = {
      supplierId: supplier.id,
      supplierName: supplier.name,
      supplierPhone: supplier.phone,
      totalEstimated: totalEstimatedCost,
      items: activeItems
    };

    // Crear la orden de compra
    onCreateOrder(orderData);
    
    // Eliminar el borrador actual de la base de datos (limpieza)
    onDeleteDraft(currentDraftId);
    
    // Limpiar estado local
    setQuantities({});
    if (currentDraftId === "general") {
      setSelectedSupplierId("");
    }
    
    alert(`¡Orden creada con éxito para ${supplier.name}!`);
    navigateToHistory();
  };

  // Texto amigable para el selector de borradores que muestra las cantidades acumuladas
  const getDraftSummaryText = (draftId, supplierName) => {
    const draft = drafts.find(d => d.id === draftId);
    const count = draft && draft.items ? draft.items.reduce((acc, item) => acc + item.quantity, 0) : 0;
    if (count > 0) {
      return `📋 ${supplierName} (${count} u. cargadas)`;
    }
    return `📄 ${supplierName} (vacía)`;
  };

  return (
    <div className="active-list-page">
      {/* SECCIÓN CABECERA */}
      <div className="page-header" style={{ flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 className="page-title">Listas de Compras</h1>
          <p className="page-subtitle">Arma tus pedidos por proveedor en tiempo real</p>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          {/* Indicador de Sincronización */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: isSaving ? "var(--primary)" : "var(--text-muted)", transition: "var(--transition-fast)" }}>
            <RefreshCw size={14} className={isSaving ? "spin" : ""} style={{ animation: isSaving ? "spin 1s linear infinite" : "none" }} />
            <span>{isSaving ? "Guardando en la nube..." : "Sincronizado"}</span>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>

          {activeItems.length > 0 && (
            <button className="btn btn-danger" onClick={handleReset}>
              <Trash2 size={16} />
              Vaciar Lista
            </button>
          )}
        </div>
      </div>

      {/* COMPONENTE SELECTOR DE BORRADOR / PROVEEDOR */}
      <div className="card" style={{ marginTop: "1rem", padding: "1.25rem", borderLeft: "4px solid var(--primary)" }}>
        <div className="form-group" style={{ maxWidth: "450px", marginBottom: "0" }}>
          <label className="form-label" style={{ fontWeight: 700 }}>Selecciona la lista sobre la que deseas trabajar:</label>
          <select 
            className="form-input" 
            value={currentDraftId} 
            onChange={(e) => handleSwitchDraft(e.target.value)}
            style={{ 
              appearance: "none", 
              backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%238a99ad%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')", 
              backgroundRepeat: "no-repeat", 
              backgroundPosition: "right 12px top 50%", 
              backgroundSize: "12px auto", 
              paddingRight: "30px",
              fontWeight: 600
            }}
          >
            <option value="general">{getDraftSummaryText("general", "Lista General (Sin Proveedor)")}</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>
                {getDraftSummaryText(s.id, s.name)}
              </option>
            ))}
          </select>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.4rem", display: "block" }}>
            Los productos que añadas a esta lista se guardarán específicamente para el proveedor o lista seleccionada.
          </span>
        </div>
      </div>

      <div className="active-list-container" style={{ marginTop: "1.5rem" }}>
        {/* COLUMNA IZQUIERDA: BUSCADOR Y LISTADO DE PRODUCTOS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", minWidth: 0, width: "100%" }}>
          <div className="search-filter-bar" style={{ marginBottom: "0" }}>
            <div className="search-input-wrapper">
              <Search />
              <input
                type="text"
                className="form-input"
                placeholder="Buscar insumos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button 
              className={`btn ${showOnlySelected ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setShowOnlySelected(!showOnlySelected)}
              style={{ whiteSpace: "nowrap" }}
            >
              <ShoppingBag size={16} />
              {showOnlySelected ? "Mostrar Todos" : `Ver Seleccionados (${activeItems.length})`}
            </button>
          </div>

          {/* Filtros de Categoría */}
          {!showOnlySelected && (
            <div className="category-filter-scroll">
              {categories.map((cat) => (
                <div
                  key={cat}
                  className={`filter-badge ${selectedCategory === cat ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === "Todos" ? "🍔 Todos" : cat}
                </div>
              ))}
            </div>
          )}

          {displayedProducts.length === 0 ? (
            <div className="empty-state">
              <ShoppingBag size={48} />
              <h3>No hay productos para mostrar</h3>
              <p>
                {showOnlySelected 
                  ? "Aún no has agregado cantidades a esta lista de compras." 
                  : "Prueba ajustando los filtros de búsqueda."}
              </p>
            </div>
          ) : (
            <div className="active-list-items">
              {displayedProducts.map((product) => {
                const qty = quantities[product.id] || 0;
                const isSelected = qty > 0;
                
                return (
                  <div 
                    key={product.id} 
                    className="active-item-card"
                    style={{ 
                      borderColor: isSelected ? "rgba(255, 159, 28, 0.4)" : "var(--border-color)",
                      backgroundColor: isSelected ? "rgba(255, 159, 28, 0.02)" : "var(--bg-card)"
                    }}
                  >
                    <div className="product-info">
                      <span 
                        className="product-name"
                        style={{ color: isSelected ? "var(--text-main)" : "var(--text-muted)" }}
                      >
                        {product.name}
                      </span>
                      <div className="product-meta">
                        <span className="category-tag" style={{ color: getCategoryColor(product.category), fontWeight: 700, paddingLeft: 0 }}>
                          {product.category}
                        </span>
                        <span className="meta-dot"></span>
                        <span>{product.unit}</span>
                        {product.estimatedPrice > 0 && (
                          <>
                            <span className="meta-dot"></span>
                            <span>${product.estimatedPrice.toFixed(2)}</span>
                            {qty > 0 && (
                              <span style={{ color: "var(--primary)", marginLeft: "0.25rem", fontWeight: 700 }}>
                                (Subt: ${(product.estimatedPrice * qty).toFixed(2)})
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="quantity-control">
                      <button className="qty-btn" onClick={() => handleQtyChange(product.id, -1)}>
                        <Minus size={16} />
                      </button>
                      <span className="qty-value" style={{ color: isSelected ? "var(--primary)" : "var(--text-muted)" }}>
                        {qty}
                      </span>
                      <button className="qty-btn" onClick={() => handleQtyChange(product.id, 1)}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: RESUMEN Y FINALIZACIÓN DE ORDEN */}
        <div className="summary-panel">
          <h2 className="summary-title">Resumen del Pedido</h2>
          
          <div className="form-group">
            <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <UserCheck size={14} />
              Proveedor Asignado
            </label>
            
            {currentDraftId !== "general" ? (
              // Si ya estamos dentro de un borrador de proveedor específico, el proveedor está pre-asignado
              <div 
                className="form-input" 
                style={{ 
                  backgroundColor: "rgba(255, 159, 28, 0.05)", 
                  borderColor: "rgba(255, 159, 28, 0.2)",
                  fontWeight: 600,
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                {suppliers.find(s => s.id === currentDraftId)?.name || "Proveedor Específico"}
              </div>
            ) : (
              // Si estamos en la Lista General, obligamos a seleccionar el proveedor aquí al finalizar
              suppliers.length === 0 ? (
                <div style={{ fontSize: "0.85rem", color: "var(--secondary)", marginTop: "0.25rem" }}>
                  ⚠️ No hay proveedores registrados. Ve a la pestaña de Proveedores para añadir uno.
                </div>
              ) : (
                <select
                  className="form-input"
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  style={{ appearance: "none", backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%238a99ad%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px top 50%", backgroundSize: "12px auto", paddingRight: "30px" }}
                >
                  <option value="">-- Seleccionar Proveedor --</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.contactName || "Sin contacto"})
                    </option>
                  ))}
                </select>
              )
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
            <div className="summary-row">
              <span style={{ color: "var(--text-muted)" }}>Productos en lista:</span>
              <span style={{ fontWeight: 600 }}>{activeItems.length} tipos</span>
            </div>
            <div className="summary-row">
              <span style={{ color: "var(--text-muted)" }}>Cantidad total:</span>
              <span style={{ fontWeight: 600 }}>{totalItemsCount} bultos/u.</span>
            </div>
            <div className="summary-total">
              <span>Total Estimado:</span>
              <span>${totalEstimatedCost.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleFinalizeOrder}
            disabled={activeItems.length === 0 || !selectedSupplierId}
            style={{ 
              marginTop: "1rem", 
              width: "100%", 
              opacity: (activeItems.length === 0 || !selectedSupplierId) ? 0.5 : 1,
              cursor: (activeItems.length === 0 || !selectedSupplierId) ? "not-allowed" : "pointer"
            }}
          >
            Finalizar y Crear Orden
          </button>
        </div>
      </div>
    </div>
  );
}
