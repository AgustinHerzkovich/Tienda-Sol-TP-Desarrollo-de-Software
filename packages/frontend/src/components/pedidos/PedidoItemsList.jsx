import './PedidosPage.css';

export default function PedidoItemsList({ items = [], obtenerSimboloMoneda }) {
  return (
    <div className="pedido-items">
      <h2>Productos ({items.length})</h2>
      <ul>
        {items.map((item, i) => (
          <li key={i} className="pedido-item">
            <div className="item-info">
              <span className="item-cantidad">{item.cantidad}x</span>
              <span className="item-titulo">
                {item.producto?.titulo || 'Producto'}
              </span>
            </div>
            <span className="item-precio">
              {obtenerSimboloMoneda(item.producto?.moneda)}
              {(item.precioUnitario * item.cantidad)?.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
