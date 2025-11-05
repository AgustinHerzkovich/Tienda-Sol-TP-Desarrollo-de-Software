import { createContext, useContext } from 'react';

const CurrencyContext = createContext();

// Tasas de cambio (podrían venir de una API)
const EXCHANGE_RATES = {
  PESO_ARG: 1,
  DOLAR_USA: 1500,
  REAL: 250,
};

// Símbolos de moneda
const CURRENCY_SYMBOLS = {
  PESO_ARG: 'AR$',
  DOLAR_USA: 'US$',
  REAL: 'R$',
};

// Nombres completos de moneda
const CURRENCY_NAMES = {
  PESO_ARG: 'Pesos Argentinos',
  DOLAR_USA: 'Dólares Estadounidenses',
  REAL: 'Reales Brasileños',
};

export function CurrencyProvider({ children }) {
  /**
   * Obtiene el símbolo de una moneda
   * @param {string} moneda - PESO_ARG, DOLAR_USA, REAL
   * @returns {string} Símbolo de la moneda
   */
  const obtenerSimboloMoneda = (moneda) => {
    return CURRENCY_SYMBOLS[moneda] || '$';
  };

  /**
   * Obtiene el nombre completo de una moneda
   * @param {string} moneda - PESO_ARG, DOLAR_USA, REAL
   * @returns {string} Nombre completo de la moneda
   */
  const obtenerNombreMoneda = (moneda) => {
    return CURRENCY_NAMES[moneda] || moneda;
  };

  /**
   * Convierte un monto de una moneda a otra
   * @param {number} monto - Monto a convertir
   * @param {string} monedaOrigen - Moneda origen
   * @param {string} monedaDestino - Moneda destino
   * @returns {number} Monto convertido
   */
  const convertirMoneda = (monto, monedaOrigen, monedaDestino) => {
    if (monedaOrigen === monedaDestino) {
      return monto;
    }

    // Convertir primero a pesos argentinos (moneda base)
    const montoEnPesos = monto * EXCHANGE_RATES[monedaOrigen];

    // Luego convertir de pesos a la moneda destino
    const montoConvertido = montoEnPesos / EXCHANGE_RATES[monedaDestino];

    return montoConvertido;
  };

  /**
   * Determina la moneda predominante en un array de items
   * La moneda predominante es la que tiene mayor valor total
   * @param {Array} items - Array de items con estructura { producto: { precio, moneda }, cantidad }
   * @returns {string} Moneda predominante
   */
  const obtenerMonedaPredominante = (items) => {
    if (!items || items.length === 0) {
      return 'PESO_ARG';
    }

    // Si todos los items tienen la misma moneda, retornarla
    const primeraMoneda = items[0]?.producto?.moneda || items[0]?.moneda;
    const todasIguales = items.every((item) => {
      const monedaItem = item?.producto?.moneda || item?.moneda;
      return monedaItem === primeraMoneda;
    });

    if (todasIguales) {
      return primeraMoneda;
    }

    // Calcular el valor total por moneda (convertido a pesos para comparar)
    const totalPorMoneda = {};

    items.forEach((item) => {
      const producto = item.producto || item;
      const moneda = producto.moneda;
      const precio = producto.precio || 0;
      const cantidad = item.cantidad || 1;

      // Convertir a pesos para comparar
      const valorEnPesos = convertirMoneda(
        precio * cantidad,
        moneda,
        'PESO_ARG'
      );

      if (!totalPorMoneda[moneda]) {
        totalPorMoneda[moneda] = 0;
      }
      totalPorMoneda[moneda] += valorEnPesos;
    });

    // Encontrar la moneda con mayor valor total
    let monedaPredominante = 'PESO_ARG';
    let mayorValor = 0;

    Object.entries(totalPorMoneda).forEach(([moneda, valor]) => {
      if (valor > mayorValor) {
        mayorValor = valor;
        monedaPredominante = moneda;
      }
    });

    return monedaPredominante;
  };

  /**
   * Calcula el total de items en una moneda específica
   * @param {Array} items - Array de items con estructura { producto: { precio, moneda }, cantidad }
   * @param {string} monedaDestino - Moneda en la que se quiere el total (opcional)
   * @returns {Object} { total, moneda, desglosePorMoneda }
   */
  const calcularTotal = (items, monedaDestino = null) => {
    if (!items || items.length === 0) {
      return {
        total: 0,
        moneda: 'PESO_ARG',
        desglosePorMoneda: {},
      };
    }

    // Si no se especifica moneda destino, usar la predominante
    const moneda = monedaDestino || obtenerMonedaPredominante(items);

    // Desglose por moneda original
    const desglosePorMoneda = {};

    // Calcular total
    let total = 0;

    items.forEach((item) => {
      const producto = item.producto || item;
      const monedaItem = producto.moneda;
      const precio = producto.precio || 0;
      const cantidad = item.cantidad || 1;
      const subtotal = precio * cantidad;

      // Agregar al desglose
      if (!desglosePorMoneda[monedaItem]) {
        desglosePorMoneda[monedaItem] = 0;
      }
      desglosePorMoneda[monedaItem] += subtotal;

      // Convertir a la moneda destino y sumar
      const subtotalConvertido = convertirMoneda(subtotal, monedaItem, moneda);
      total += subtotalConvertido;
    });

    return {
      total: Math.round(total * 100) / 100, // Redondear a 2 decimales
      moneda,
      desglosePorMoneda,
    };
  };

  /**
   * Formatea un precio con su símbolo de moneda
   * @param {number} precio - Precio a formatear
   * @param {string} moneda - Moneda del precio
   * @returns {string} Precio formateado con símbolo
   */
  const formatearPrecio = (precio, moneda) => {
    const simbolo = obtenerSimboloMoneda(moneda);
    const precioFormateado = precio.toLocaleString('es-AR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return `${simbolo}${precioFormateado}`;
  };

  const value = {
    obtenerSimboloMoneda,
    obtenerNombreMoneda,
    convertirMoneda,
    obtenerMonedaPredominante,
    calcularTotal,
    formatearPrecio,
    EXCHANGE_RATES,
    CURRENCY_SYMBOLS,
    CURRENCY_NAMES,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

// Hook personalizado para usar el contexto
export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency debe ser usado dentro de un CurrencyProvider');
  }
  return context;
}

export default CurrencyContext;
