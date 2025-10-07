// Tasa de cambio configurable desde variable de entorno
const EXCHANGE_RATE =
  Number(process.env.EXPO_PUBLIC_EXCHANGE_RATE_CRC_TO_USD) || 500

/**
 * Convierte colones costarricenses (CRC) a dólares estadounidenses (USD)
 * @param amountInCRC Monto en colones
 * @returns Monto en dólares
 * @example convertCRCToUSD(5000) // returns 10 (= $10.00 USD)
 */
export const convertCRCToUSD = (amountInCRC: number): number => {
  return amountInCRC / EXCHANGE_RATE
}

/**
 * Convierte colones a céntimos para Stripe (con currency CRC)
 * Stripe requiere el monto en la unidad más pequeña (céntimos para CRC)
 * @param amountInColones Monto en colones
 * @returns Monto en céntimos (centavos de colón)
 * @example convertCRCToCentimos(5000) // returns 500000 (= ₡5000.00)
 */
export const convertCRCToCentimos = (amountInColones: number): number => {
  return Math.round(amountInColones * 100)
}

/**
 * Formatea un monto en colones con el símbolo ₡ y separadores de miles
 * @param amount Monto en colones
 * @returns String formateado (ej: "₡5,000")
 */
export const formatCRC = (amount: number): string => {
  return `₡${amount.toLocaleString('es-CR')}`
}

/**
 * Formatea un monto en dólares con el símbolo $ y decimales
 * @param amount Monto en dólares
 * @returns String formateado (ej: "$10.00")
 */
export const formatUSD = (amount: number): string => {
  return `$${amount.toFixed(2)}`
}
