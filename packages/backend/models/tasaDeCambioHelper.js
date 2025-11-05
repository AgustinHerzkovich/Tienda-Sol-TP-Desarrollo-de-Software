import { Moneda } from './moneda.js';

const TasaDeCambioHelper = Object.freeze({
    // Valor fijo hardcodeado. Seria ideal que se pueda modificar
    valores:  {
        [Moneda.PESO_ARG]: 1,
        [Moneda.DOLAR_USA]: 1500,
        [Moneda.REAL]: 250,
    }, 


    getTasaDeCambio(origen, destino) {
        const valorOrigen = this.valores[origen];
        const valorDestino = this.valores[destino];
        if (valorOrigen === undefined || valorDestino === undefined) {
            throw new Error(`Moneda no reconocida: ${origen} o ${destino}`);
        }
        return valorOrigen / valorDestino;
    },

    convertir(monto, origen, destino) {
        const tasa = this.getTasaDeCambio(origen, destino);
        return monto * tasa;
    }
});

export default TasaDeCambioHelper;