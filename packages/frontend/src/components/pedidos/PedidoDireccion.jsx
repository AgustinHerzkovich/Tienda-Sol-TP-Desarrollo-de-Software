import './PedidosPage.css';

export default function PedidoDireccion({ direccion }) {
  const { calle, altura, piso, departamento, ciudad, provincia, codigoPostal } =
    direccion;

  return (
    <div className="pedido-direccion">
      <h3>Dirección de entrega</h3>
      <p>
        {calle} {altura}
        {piso && `, Piso ${piso}`}
        {departamento && `, Depto ${departamento}`}
        <br />
        {ciudad}, {provincia} {codigoPostal && `(${codigoPostal})`}
      </p>
    </div>
  );
}
