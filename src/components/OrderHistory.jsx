import React, { useState } from "react";
import { MessageSquare, Calendar, User, ShoppingBag, CheckCircle2, Clock, Send, Edit , Share2} from "lucide-react";

export default function OrderHistory({ orders, suppliers, onUpdateStatus, onUpdateOrder, onReturnToActiveList, showDecimals = true }) {
  const [editingOrder, setEditingOrder] = useState(null);
  const [editItems, setEditItems] = useState([]);
  const formatPrice = (val) => {
    if (!val && val !== 0) return "";
    return showDecimals ? val.toFixed(2) : Math.round(val).toString();
  };


  

  const handleToggleItemCheck = (order, itemIndex) => {
    if (!onUpdateOrder) return;
    const updatedItems = [...order.items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      checked: !updatedItems[itemIndex].checked
    };
    onUpdateOrder(order.id, { items: updatedItems });
  };
// Formatear la fecha legible
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return dateString;
    }
  };

  // Filtrar Órdenes
  const filteredOrders = orders; // All orders shown

  const handleEditClick = (order) => {
    setEditingOrder(order);
    setEditItems([...order.items]);
  };

  const handleEditItemQuantity = (index, newQuantity) => {
    const updated = [...editItems];
    updated[index].quantity = newQuantity;
    setEditItems(updated);
  };

  const handleRemoveEditItem = (index) => {
    const updated = [...editItems];
    updated.splice(index, 1);
    setEditItems(updated);
  };

  const handleSaveEditOrder = async () => {
    if (editItems.length === 0) {
      alert("La orden no puede estar vaca.");
      return;
    }
    const totalEstimated = editItems.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 0)), 0);
    await onUpdateOrder(editingOrder.id, { items: editItems, totalEstimated });
    setEditingOrder(null);
  };

  // Formatear y envíar Mensaje por WhatsApp
  const handleNativeShare = async (order) => {
    let message = `Saludos, cotizame esto porfavor;\n\n`;
    order.items.forEach((item) => {
      message += ` ${item.quantity} ${item.unit} de ${item.name}\n`;
    });
    message += `\nincluye el precio del delivery, \nGracias`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cotizacin',
          text: message
        });
      } catch (err) {
        console.error("Error compartiendo nativamente:", err);
      }
    } else {
      navigator.clipboard.writeText(message).then(() => {
        alert("Texto copiado al portapapeles! (Compartir nativo no soportado aquí)");
      }).catch(err => {
        console.error("Error copiando:", err);
        alert("No se pudo copiar el texto.");
      });
    }
  };

  const handleSendWhatsApp = (order, appType = "personal") => {
    // Buscar teléfono del proveedor (por si cambió o para asegurar que lo tenemás)
    let phone = order.supplierPhone;
    if (!phone) {
      const supplier = suppliers.find(s => s.id === order.supplierId);
      phone = supplier ? supplier.phone : "";
    }

    if (!phone) {
      alert("Este proveedor no tiene un número de WhatsApp registrado. Edita el proveedor antes de envíar.");
      return;
    }

    // Armar el mensaje con el nuevo formato de cotización solicitado
    let message = `Saludos, cotizame esto porfavor;\n\n`;
    
    order.items.forEach((item) => {
      message += `• ${item.quantity} ${item.unit} de ${item.name}\n`;
    });

    message += `\nincluye el precio del delivery, \nGracias`;

    // Codificar el texto para URL
    const encodedText = encodeURIComponent(message);
    
    let whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`;
    
    if (appType === "business") {
      const isAndroid = /Android/i.test(navigator.userAgent);
      if (isAndroid) {
        // Usar Intent de Android para forzar WhatsApp Business
        whatsappUrl = `intent://send?phone=${phone}&text=${encodedText}#Intent;package=com.whatsapp.w4b;scheme=whatsapp;end`;
      } else {
        // Fallback en iOS / PC a enlace universal
        whatsappUrl = `https://wa.me/${phone}?text=${encodedText}`;
      }
    }

    // Abrir en nueva pestaña
    window.open(whatsappUrl, "_blank");

    // Marcar automáticamente el estado como "envíado" si estaba en "borrador"
    if (order.status === "borrador") {
      onUpdateStatus(order.id, "envíado");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "borrador":
        return "badge-draft";
      case "envíado":
        return "badge-sent";
      case "recibido":
        return "badge-received";
      default:
        return "";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "borrador":
        return <Clock size={14} />;
      case "envíado":
        return <Send size={14} />;
      case "recibido":
        return <CheckCircle2 size={14} />;
      default:
        return null;
    }
  };

  return (
    <div className="order-history-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Historial de Órdenes</h1>
          <p className="page-subtitle">Visualiza, actualiza y envía por WhatsApp tus órdenes de compra generadas</p>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>

        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag size={48} />
            <h3>No hay órdenes de compra</h3>
            <p>
              "Aún no has generado Ningúna orden de compra. Ve a la pestaña 'Lista Activa' para empezar."
            </p>
          </div>
        ) : (
          <div className="orders-timeline">
            {filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                {/* Cabecera de la Orden */}
                <div className="order-header">
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                      <h2 style={{ fontFamily: "var(--font-title)", fontWeight: 800, fontSize: "1.3rem", color: "var(--primary)" }}>
                        {order.orderNumber}
                      </h2>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginTop: "0.5rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <Calendar size={14} />
                        {formatDate(order.createdAt)}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        <User size={14} />
                        Proveedor: {order.supplierName}
                      </span>
                    </div>
                  </div>
                  
                  
                    <div style={{ display: "flex", gap: "1.5rem", marginLeft: "auto", flexWrap: "wrap", justifyContent: "flex-end" }}>
                      {(() => {
                        const checkedTotal = order.items.reduce((acc, item) => item.checked ? acc + ((item.quantity || 0) * (item.price || 0)) : acc, 0);
                        return checkedTotal > 0 ? (
                          <div style={{ textAlign: "right" }}>
                            <span style={{ fontSize: "0.75rem", color: "var(--primary)", display: "block", fontWeight: 700 }}>REVISADO</span>
                            <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--primary)" }}>
                              ${formatPrice(checkedTotal)}
                            </span>
                          </div>
                        ) : null;
                      })()}
                      {order.totalEstimated > 0 && (
                        <div style={{ textAlign: "right" }}>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>TOTAL ESTIMADO</span>
                          <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-main)" }}>
                            ${formatPrice(order.totalEstimated)}
                          </span>
                        </div>
                      )}
                    </div>
                </div>

                {/* Detalle de Productos */}
                <div className="order-body">
                  <div className="order-items-list">
                    <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.5rem" }}>
                      Artículos Solicitados
                    </h4>
                    {order.items.map((item, idx) => (
                      <div 
                          key={idx} 
                          className="order-item-row" 
                          onClick={() => handleToggleItemCheck(order, idx)}
                          style={{ 
                            cursor: "pointer", 
                            opacity: item.checked ? 0.5 : 1,
                            textDecoration: item.checked ? "line-through" : "none",
                            transition: "all 0.2s ease"
                          }}
                        >
                          <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <div style={{
                              width: "16px", 
                              height: "16px", 
                              borderRadius: "4px", 
                              border: "2px solid var(--primary)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: item.checked ? "var(--primary)" : "transparent",
                              flexShrink: 0
                            }}>
                              {item.checked && <CheckCircle2 size={12} color="white" />}
                            </div>
                            {item.name}
                          </span>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.2rem" }}>
                              <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                                {item.quantity} {item.unit}
                                {item.price > 0 && ` x ${formatPrice(item.price)}`}
                              </span>
                              {item.price > 0 && (
                                <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-main)" }}>
                                  ${formatPrice((item.quantity || 0) * (item.price || 0))}
                                </span>
                              )}
                            </div>
                        </div>
                    ))}
                  </div>
                </div>

                {/* acciónes principales */}
                <div className="order-actions" style={{ display: "flex", width: "100%", borderRadius: "8px", overflow: "hidden", marginTop: "1rem" }}>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => onReturnToActiveList ? onReturnToActiveList(order) : handleEditClick(order)} 
                      style={{ flex: 1, borderRadius: 0, border: "none", borderRight: "1px solid rgba(255,255,255,0.1)", justifyContent: "center" }}
                    >
                      <Edit size={16} />
                      Modificar
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleNativeShare(order)} 
                      style={{ flex: 1, borderRadius: 0, border: "none", backgroundColor: "#25D366", color: "white", justifyContent: "center" }}
                    >
                      <Share2 size={16} />
                      Compartir
                    </button>
                  </div>
                </div>
              ))}
            </div>
        )}
      </div>

      {editingOrder && (
        <div className="modal-overlay" onClick={() => setEditingOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px" }}>
            <h2 style={{ marginBottom: "1rem" }}>Editar Orden {editingOrder.orderNumber}</h2>
            <div style={{ maxHeight: "60vh", overflowY: "auto", marginBottom: "1.5rem" }}>
              {editItems.map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.8rem", backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "8px", marginBottom: "0.5rem" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{item.unit} {item.price > 0 && `(${formatPrice(item.price)})`}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <input 
                      type="number" 
                      className="form-input" 
                      style={{ width: "80px", padding: "0.4rem" }} 
                      value={item.quantity} 
                      onChange={(e) => handleEditItemQuantity(idx, Number(e.target.value))}
                      min="0.1"
                      step="any"
                    />
                    <button className="btn btn-danger" style={{ padding: "0.4rem" }} onClick={() => handleRemoveEditItem(idx)}>X</button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button className="btn btn-outline" onClick={() => setEditingOrder(null)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSaveEditOrder}>Guardar Cambios</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
