import React, { useState } from "react";
import { MessageSquare, Calendar, User, ShoppingBag, CheckCircle2, Clock, Send } from "lucide-react";

export default function OrderHistory({ orders, suppliers, onUpdateStatus }) {
  const [statusFilter, setStatusFilter] = useState("Todos");

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

  // Filtrar órdenes
  const filteredOrders = orders.filter((order) => {
    if (statusFilter === "Todos") return true;
    return order.status === statusFilter.toLowerCase();
  });

  // Formatear y Enviar Mensaje por WhatsApp
  const handleSendWhatsApp = (order, appType = "personal") => {
    // Buscar teléfono del proveedor (por si cambió o para asegurar que lo tenemos)
    let phone = order.supplierPhone;
    if (!phone) {
      const supplier = suppliers.find(s => s.id === order.supplierId);
      phone = supplier ? supplier.phone : "";
    }

    if (!phone) {
      alert("Este proveedor no tiene un número de WhatsApp registrado. Edita el proveedor antes de enviar.");
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

    // Marcar automáticamente el estado como "enviado" si estaba en "borrador"
    if (order.status === "borrador") {
      onUpdateStatus(order.id, "enviado");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "borrador":
        return "badge-draft";
      case "enviado":
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
      case "enviado":
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
        {/* Barra de Filtros de Estado */}
        <div className="category-filter-scroll" style={{ marginBottom: "1.5rem" }}>
          {["Todos", "Borrador", "Enviado", "Recibido"].map((status) => (
            <div
              key={status}
              className={`filter-badge ${statusFilter === status ? "active" : ""}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <ShoppingBag size={48} />
            <h3>No hay órdenes de compra</h3>
            <p>
              {statusFilter === "Todos"
                ? "Aún no has generado ninguna orden de compra. Ve a la pestaña 'Lista Activa' para empezar."
                : `No tienes órdenes con el estado '${statusFilter}'.`}
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
                      <div className="order-badge-group">
                        <span className={`badge ${getStatusBadgeClass(order.status)}`} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", flexWrap: "wrap", fontSize: "0.85rem", color: "var(--text-muted)" }}>
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
                  
                  {order.totalEstimated > 0 && (
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>TOTAL ESTIMADO</span>
                      <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-main)" }}>
                        ${order.totalEstimated.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Detalle de Productos */}
                <div className="order-body">
                  <div className="order-items-list">
                    <h4 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.5rem" }}>
                      Artículos Solicitados
                    </h4>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-item-row">
                        <span>{item.name}</span>
                        <span>
                          {item.quantity} {item.unit}
                          {item.price > 0 && ` x $${item.price.toFixed(2)}`}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Acciones Rápidas del Estado */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", backgroundColor: "rgba(255, 255, 255, 0.02)", padding: "1rem", borderRadius: "10px", border: "1px solid var(--border-color)", alignSelf: "start" }}>
                    <h4 style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                      Actualizar Estado
                    </h4>
                    <select
                      className="form-input"
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                      style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem", appearance: "none", backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%238a99ad%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: "no-repeat", backgroundPosition: "right 10px top 50%", backgroundSize: "10px auto", paddingRight: "25px" }}
                    >
                      <option value="borrador">⏱️ Borrador</option>
                      <option value="enviado">✉️ Enviado</option>
                      <option value="recibido">✅ Recibido</option>
                    </select>
                  </div>
                </div>

                {/* Acciones principales */}
                <div className="order-actions" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <button className="btn btn-primary" onClick={() => handleSendWhatsApp(order, "personal")} style={{ backgroundColor: "#25D366", color: "white", width: "100%" }}>
                    <MessageSquare size={16} />
                    WhatsApp Personal
                  </button>
                  <button className="btn btn-primary" onClick={() => handleSendWhatsApp(order, "business")} style={{ backgroundColor: "#128C7E", color: "white", width: "100%" }}>
                    <MessageSquare size={16} />
                    WhatsApp Business
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
