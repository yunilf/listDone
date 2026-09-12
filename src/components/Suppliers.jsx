import React, { useState } from "react";
import { Plus, Trash2, Edit2, Phone, User, Check, X } from "lucide-react";

export default function Suppliers({ suppliers, onAdd, onDelete, onUpdate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contactName, setContactName] = useState("");

  const openAddModal = () => {
    setEditingSupplier(null);
    setName("");
    setPhone("");
    setContactName("");
    setIsModalOpen(true);
  };

  const openEditModal = (supplier) => {
    setEditingSupplier(supplier);
    setName(supplier.name);
    setPhone(supplier.phone);
    setContactName(supplier.contactName || "");
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone) return;

    // Limpiar el número de teléfono para WhatsApp: solo números, sin +, espacios o guiones
    const cleanPhone = phone.replace(/\D/g, "");

    const supplierData = {
      name,
      phone: cleanPhone,
      contactName
    };

    if (editingSupplier) {
      onUpdate(editingSupplier.id, supplierData);
    } else {
      onAdd(supplierData);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="suppliers-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Directorio de Proveedores</h1>
          <p className="page-subtitle">Gestiona los contactos de WhatsApp para tus órdenes de compra</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} />
          Agregar Proveedor
        </button>
      </div>

      <div style={{ marginTop: "2rem" }}>
        {suppliers.length === 0 ? (
          <div className="empty-state">
            <User size={48} />
            <h3>No hay proveedores registrados</h3>
            <p>Registra tus proveedores para poder enviarles órdenes de compra por WhatsApp.</p>
            <button className="btn btn-secondary" onClick={openAddModal}>
              Agregar primer proveedor
            </button>
          </div>
        ) : (
          <div className="grid-container">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-title)", fontWeight: 700, fontSize: "1.2rem", marginBottom: "0.25rem" }}>
                      {supplier.name}
                    </h3>
                    {supplier.contactName && (
                      <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <User size={14} />
                        Contacto: {supplier.contactName}
                      </p>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button className="btn btn-secondary btn-icon-only" onClick={() => openEditModal(supplier)} title="Editar">
                      <Edit2 size={14} />
                    </button>
                    <button className="btn btn-danger btn-icon-only" onClick={() => onDelete(supplier.id)} title="Eliminar">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ padding: "0.4rem", borderRadius: "8px", backgroundColor: "rgba(46, 196, 182, 0.1)", color: "var(--success)" }}>
                    <Phone size={16} />
                  </div>
                  <div>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>WHATSAPP</p>
                    <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-main)" }}>+{supplier.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE AGREGAR / EDITAR */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-header">{editingSupplier ? "Editar Proveedor" : "Agregar Proveedor"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nombre de la Distribuidora / Empresa</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej. Frigocarnes Express"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nombre del Contacto (Opcional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej. Carlos Pérez"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Número de WhatsApp (con código de país)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej. 5491122334455 (código de país + número sin espacios ni +)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                  Asegúrate de incluir el código de país (ej. 54 para Argentina, 56 para Chile, 57 para Colombia) sin el símbolo "+".
                </span>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSupplier ? "Guardar Cambios" : "Agregar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
