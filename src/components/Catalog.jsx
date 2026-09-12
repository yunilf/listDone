import React, { useState } from "react";
import { Plus, Trash2, Edit2, Search, Package, Tag, Check, X, Folder } from "lucide-react";

// Colores consistentes para categorías dinámicas
const CATEGORY_COLORS = [
  "#ff9f1c", // Naranja / Queso
  "#e71d36", // Rojo / Carnes
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
  suppliers = []
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("unidad");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [supplierId, setSupplierId] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // Estado para gestión de categorías en el sub-modal
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
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setCategory(product.category || categories[0]?.name || "Otros");
    setUnit(product.unit || "unidad");
    setEstimatedPrice(product.estimatedPrice || "");
    setSupplierId(product.supplierId || "");
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
      supplierId: supplierId || ""
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
      alert("Ya existe una categoría con ese nombre.");
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
      alert("Ya existe otra categoría con ese nombre.");
      return;
    }

    // Actualizar nombre
    onUpdateCategory(id, { name: editingCatName.trim() });
    setEditingCatId(null);
  };

  // Filtrado y búsqueda de productos
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
          <h1 className="page-title">Catálogo de Productos</h1>
          <p className="page-subtitle">Gestiona la lista base de insumos para armar tus compras</p>
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
        {/* Barra de búsqueda */}
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

        {/* Filtro rápido de categorías en scroll horizontal */}
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
            <h3>No se encontraron insumos</h3>
            <p>Prueba buscando con otro término o agrega un nuevo producto al catálogo.</p>
          </div>
        ) : (
          <div className="catalog-list" style={{ marginTop: "1.5rem" }}>
            {filteredProducts.map((product) => {
              const borderCol = getCategoryColor(product.category);
              const assignedSupplier = suppliers.find(s => s.id === product.supplierId);
              
              return (
                <div 
                  key={product.id} 
                  className="product-item"
                  style={{ borderLeft: `4px solid ${borderCol}` }}
                >
                  <div className="product-info">
                    <span className="product-name">{product.name}</span>
                    <div className="product-meta">
                      <span className="category-tag" style={{ borderLeft: `none`, paddingLeft: "0", color: borderCol, fontWeight: 700 }}>
                        {product.category}
                      </span>
                      <span className="meta-dot"></span>
                      <span>1 {product.unit}</span>
                      {product.estimatedPrice > 0 && (
                        <>
                          <span className="meta-dot"></span>
                          <span style={{ color: "var(--primary)", fontWeight: 600 }}>
                            ${product.estimatedPrice.toFixed(2)}
                          </span>
                        </>
                      )}
                      
                      {assignedSupplier && (
                        <>
                          <span className="meta-dot"></span>
                          <span style={{ fontSize: "0.75rem", backgroundColor: "rgba(46, 196, 182, 0.1)", color: "var(--success)", padding: "2px 6px", borderRadius: "4px", fontWeight: 600 }}>
                            🛒 {assignedSupplier.name}
                          </span>
                        </>
                      )}
                    </div>
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

      {/* MODAL GESTIONAR CATEGORÍAS */}
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

            {/* Listado de categorías */}
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
                      ⚠️ Debes crear al menos una categoría primero.
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
                <label className="form-label">Precio Referencial Est. ($) - Opcional</label>
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
                <label className="form-label">Proveedor Asignado</label>
                <select
                  className="form-input"
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  style={{ appearance: "none", backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%238a99ad%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px top 50%", backgroundSize: "12px auto", paddingRight: "30px" }}
                >
                  <option value="">Sin proveedor específico (General)</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem", display: "block" }}>
                  Asocia este producto a un proveedor para que solo aparezca en su lista de compras.
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
