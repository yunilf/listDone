import React, { useState } from "react";
import { Plus, Trash2, Edit2, Search, Package, Tag, Check, X, Folder } from "lucide-react";

// Colores consistentes para Categorías dinámicas
const CATEGORY_COLORS = [
  "#ff9f1c", // Naranja / Queso
  "#e71d36", // Rojo / CAúnes
  "#2ec4b6", // Verde azulado / Fresco
  "#ffd166", // Amarillo / Lácteos
  "#00b4d8", // Celeste / Bebidas
  "#a8dadc", // Azul claro
  "#e63946", // Salsas
  "#b5e2fa", // Desechables
  "#edede9", // Otros
  "#9b5de5", // Morado
  "#f15bb5"  // Rosa
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

export default function Catalog({ 
  products, 
  categories = [], 
  onAdd, 
  onDelete, 
  onUpdate,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
  suppliers = [],
  showDecimals = true
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("unidad");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [supplierPrices, setSupplierPrices] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const formatPrice = (val) => {
    if (!val && val !== 0) return "";
    return showDecimals ? val.toFixed(2) : Math.round(val).toString();
  };


  // Estado para gestión de Categorías en el sub-modal
  const [newCatName, setNewCatName] = useState("");
  const [editingCatId, setEditingCatId] = useState(null);
  const [editingCatName, setEditingCatName] = useState("");

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setCategory(categories[0]?.name || "Otros");
    setUnit("unidad");
    setEstimatedPrice("");
    setSupplierId("");
    setSupplierPrices({});
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategory(product.category || categories[0]?.name || "Otros");
    setUnit(product.unit || "unidad");
    setEstimatedPrice(product.estimatedPrice || "");
    setSupplierId(product.supplierId || "");
    let initPrices = {};
    if (product.supplierPrices) {
      initPrices = { ...product.supplierPrices };
    } else if (product.supplierId) {
      initPrices[product.supplierId] = product.estimatedPrice || 0;
    }
    setSupplierPrices(initPrices);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;

    const productData = {
      name,
      category: category || categories[0]?.name || "Otros",
      unit,
      estimatedPrice: estimatedPrice ? parseFloat(estimatedPrice) : 0,
      supplierId: supplierId || "",
      supplierPrices: supplierPrices
    };

    if (editingProduct) {
      onUpdate(editingProduct.id, productData);
    } else {
      onAdd(productData);
    }

    setIsModalOpen(false);
  };

  const handleAddCatSubmit = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    // Evitar nombres duplicados
    const exists = categories.some(c => c.name.toLowerCase() === newCatName.trim().toLowerCase());
    if (exists) {
      alert("Ya existe una Categoría con ese nombre.");
      return;
    }

    onAddCategory({ name: newCatName.trim() });
    setNewCatName("");
  };

  const handleStartEditCat = (cat) => {
    setEditingCatId(cat.id);
    setEditingCatName(cat.name);
  };

  const handleSaveCatName = (id) => {
    if (!editingCatName.trim()) return;

    // Evitar duplicados con otros ids
    const exists = categories.some(c => c.id !== id && c.name.toLowerCase() === editingCatName.trim().toLowerCase());
    if (exists) {
      alert("Ya existe otra Categoría con ese nombre.");
      return;
    }

    // Actualizar nombre
    onUpdateCategory(id, { name: editingCatName.trim() });
    setEditingCatId(null);
  };

  // Filtrado y búsqueDía de productos
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || 
      (product.category && selectedCategory && 
       product.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="catalog-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Productos</h1>
          <p className="page-subtitle">Gestiona la lista base de insumás para armar tus compras</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button className="btn btn-secondary" onClick={() => setIsCatModalOpen(true)}>
            <Folder size={18} />
            Categorías
          </button>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={18} />
            Nuevo Insumo
          </button>
        </div>
      </div>

      <div style={{ marginTop: "2rem", minWidth: 0, width: "100%" }}>
        {/* Barra de búsqueDía */}
        <div className="search-filter-bar" style={{ marginBottom: "1rem" }}>
          <div className="search-input-wrapper">
            <Search />
            <input
              type="text"
              className="form-input"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filtro rápido de Categorías en scroll horizontal */}
        <div className="category-filter-scroll">
          <div
            className={`filter-badge ${selectedCategory === "Todos" ? "active" : ""}`}
            onClick={() => setSelectedCategory("Todos")}
          >
            🍔 Todos
          </div>
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`filter-badge ${selectedCategory === cat.name ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.name)}
            >
              {cat.name}
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-state" style={{ marginTop: "1.5rem" }}>
            <Package size={48} />
            <h3>No se encontraron insumás</h3>
            <p>Prueba buscando con otro término o agrega un nuevo producto al Catálogo.</p>
          </div>
        ) : (
          <div className="catalog-list" style={{ marginTop: "1.5rem" }}>
            {filteredProducts.map((product) => {
              const borderCol = getCategoryColor(product.category);
              const productSuppliers = suppliers.filter(s => 
                  (product.supplierPrices && product.supplierPrices.hasOwnProperty(s.id)) || 
                  product.supplierId === s.id
                );
                
                return (
                  <div 
                    key={product.id} 
                    className="catalog-card"
                    style={{ borderLeft: `4px solid ${borderCol}` }}
                  >
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--text-main)", marginBottom: "0.2rem" }}>
                        {product.name}
                      </h3>
                      <div className="catalog-meta">
                        <span>{product.category}</span>
                        <span className="meta-dot"></span>
                        <span>{product.unit}</span>
                        <span className="meta-dot"></span>
                        <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
                          ${product.estimatedPrice} (Ref)
                        </span>
                      </div>
                      
                      {productSuppliers.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.6rem' }}>
                          {productSuppliers.map(assignedSupplier => {
                            const price = product.supplierPrices?.[assignedSupplier.id] ?? product.estimatedPrice;
                            return (
                              <span key={assignedSupplier.id} style={{ fontSize: "0.75rem", backgroundColor: "rgba(46, 196, 182, 0.1)", color: "var(--success)", padding: "2px 6px", borderRadius: "4px", fontWeight: 600 }}>
                                {assignedSupplier.name} (${price})
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button className="btn btn-secondary btn-icon-only" onClick={() => openEditModal(product)} title="Editar">
                      <Edit2 size={13} />
                    </button>
                    <button className="btn btn-danger btn-icon-only" onClick={() => onDelete(product.id)} title="Eliminar">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL GESTIONAR CategoríaS */}
      {isCatModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: "450px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 className="modal-header" style={{ marginBottom: 0 }}>Gestionar Categorías</h2>
              <button className="btn btn-secondary btn-icon-only" onClick={() => setIsCatModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Formulario rápido para añadir */}
            <form onSubmit={handleAddCatSubmit} style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <input
                type="text"
                className="form-input"
                placeholder="Nueva Categoría (Ej: Postres)"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                style={{ flexGrow: 1 }}
                required
              />
              <button type="submit" className="btn btn-primary">
                <Plus size={18} />
                Añadir
              </button>
            </form>

            {/* Listado de Categorías */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "300px", overflowY: "auto", paddingRight: "0.25rem" }}>
              {categories.map((cat) => {
                const isEditing = editingCatId === cat.id;
                const catColor = getCategoryColor(cat.name);
                
                return (
                  <div 
                    key={cat.id} 
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between", 
                      padding: "0.6rem 0.8rem", 
                      backgroundColor: "var(--bg-input)", 
                      borderRadius: "8px",
                      borderLeft: `3px solid ${catColor}`
                    }}
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        className="form-input"
                        value={editingCatName}
                        onChange={(e) => setEditingCatName(e.target.value)}
                        style={{ flexGrow: 1, padding: "0.25rem 0.5rem", fontSize: "0.9rem" }}
                        autoFocus
                      />
                    ) : (
                      <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>{cat.name}</span>
                    )}

                    <div style={{ display: "flex", gap: "0.25rem", marginLeft: "0.5rem" }}>
                      {isEditing ? (
                        <>
                          <button 
                            className="btn btn-secondary btn-icon-only" 
                            style={{ width: "30px", height: "30px", backgroundColor: "rgba(46,196,182,0.15)", color: "var(--success)" }}
                            onClick={() => handleSaveCatName(cat.id)}
                            type="button"
                          >
                            <Check size={14} />
                          </button>
                          <button 
                            className="btn btn-secondary btn-icon-only" 
                            style={{ width: "30px", height: "30px" }}
                            onClick={() => setEditingCatId(null)}
                            type="button"
                          >
                            <X size={14} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            className="btn btn-secondary btn-icon-only" 
                            style={{ width: "30px", height: "30px" }}
                            onClick={() => handleStartEditCat(cat)}
                            type="button"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button 
                            className="btn btn-danger btn-icon-only" 
                            style={{ width: "30px", height: "30px" }}
                            onClick={() => onDeleteCategory(cat.id)}
                            type="button"
                          >
                            <Trash2 size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL PRODUCTO AGREGAR / EDITAR */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-header">{editingProduct ? "Editar Insumo" : "Nuevo Insumo"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre del Producto</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej. Cheddar en Fetas"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Categoría</label>
                  {categories.length === 0 ? (
                    <div style={{ color: "var(--secondary)", fontSize: "0.85rem" }}>
                      ⚠️ Debes crear al menos una Categoría primero.
                    </div>
                  ) : (
                    <select
                      className="form-input"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      style={{ appearance: "none", backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%238a99ad%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px top 50%", backgroundSize: "12px auto", paddingRight: "30px" }}
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Unidad de Compra</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej. kg, unidad, pq, caja"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Precio Referencial Est. ($) - opciónal</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  placeholder="Ej. 12.50"
                  value={estimatedPrice}
                  onChange={(e) => setEstimatedPrice(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Proveedores Asignados y Precios</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', padding: '0.5rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px' }}>
                    {suppliers.length === 0 && <span style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>No hay proveedores registrados.</span>}
                    {suppliers.map(s => {
                      const isSelected = supplierPrices.hasOwnProperty(s.id);
                      return (
                        <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={(e) => {
                               const newPrices = { ...supplierPrices };
                               if (e.target.checked) {
                                  newPrices[s.id] = estimatedPrice ? parseFloat(estimatedPrice) : 0;
                               } else {
                                  delete newPrices[s.id];
                               }
                               setSupplierPrices(newPrices);
                            }}
                            style={{ accentColor: 'var(--primary)', width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                          <span style={{ flex: 1, fontSize: '0.9rem', color: isSelected ? 'var(--text-main)' : 'var(--text-muted)' }}>{s.name}</span>
                          {isSelected && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>$</span>
                              <input 
                                type="number"
                                className="form-input"
                                style={{ width: '80px', padding: '0.3rem 0.5rem', height: 'auto', fontSize: '0.9rem' }}
                                value={supplierPrices[s.id] === 0 ? '' : supplierPrices[s.id]}
                                onChange={(e) => {
                                   const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                   setSupplierPrices({ ...supplierPrices, [s.id]: val });
                                }}
                                placeholder="Precio"
                                min="0"
                                step="0.01"
                              />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem", display: "block" }}>
                  Asocia este producto a un proveedor para que sólo aparezca en su lista de compras.
                </span>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={categories.length === 0}>
                  {editingProduct ? "Guardar Cambios" : "Agregar Insumo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
