/**
 * isFederalProtocol()
 * Calcula se é um número válido de protocolo do Governo Federal Brasileiro
 *
 * @doc
 * O Número Unificado de Protocolo de processos do Governo Federal, também conhecido
 * como NUP17, deve ter 17 caracteres, incluindo o dígito verificador de 2 caracteres.
 *
 * 1) Partes do número
 *
 * - Os caracteres 1 a 5 são um código do órgão que gerou o protocolo.
 *
 * - Os caracteres 6 a 11 são o número sequencial do protocolo, sendo que
 * cada órgão emissor tem sua própria sequência e esta é reiniciada a cada ano.
 *
 * - Os caracteres 12 a 15 são referentes ao ano de protocolo
 *
 * - Os caracteres 16 a 17 são referentes ao Dígito Verificador
 *
 * 1.2) Exemplo
 * ---------------------------------------------------------------
 * |  Código do órgão |   Número Sequencial   |    Ano     | D  V
 *  2   3   0   3   7 . 0   0   1   4   6   2 / 2  0  2  1 - 6  5
 *
 * 2) Cálculo do primeiro DV.
 *
 *  - Soma-se o produto das algarismos 1 a 15 pelos números
 *    16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2
 *
 *    2   3   0   3   7   0   0   1   4   6   2   2   0   2   1
 *    x   x   x   x   x   x   x   x   x   x   x   x   x   x   x
 *   16  15  14  13  12  11  10   9   8   7   6   5   4   3   2
 * = 32 +45  +0 +39 +84  +0  +0  +9 +32 +42 +12 +10  +0  +6  +2 = 313
 *
 *  - O somatório encontrado é dividido por 11. O resto da divisão é subtraído de 11.
 *    313 / 11 tem resto 5. 11 - 5 = 6. DV1 é 6.
 *    Obs.: Caso o cálculo de DV1 retorne 10, o resultado será 0. Caso retorne 11, o DV
 *    será 1. Ou seja, se for maior ou igual a 10, desconsidere a casa das dezenas
 *
 * 3) Cálculo do segundo DV.
 *
 * - Acrescenta o valor do DV1 ao número e faz o somatório dos produtos pelos números
 *   17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2
 *
 *    2   3   0   3   7   0   0   1   4   6   2   2   0   2   1   6
 *    x   x   x   x   x   x   x   x   x   x   x   x   x   x   x   x
 *   17  16  15  14  13  12  11  10   9   8   7   6   5   4   3   2
 * = 34 +48  +0 +42 +91  +0  +0 +10 +36 +48 +14 +12  +0  +8  +3 +12 = 358
 *
 *  - O somatório encontrado é dividido por 11. O resto da divisão é subtraído de 11.
 *    358 / 11 tem resto 6. 11 - 6 = 1. DV1 é 5.
 *    Obs.: Caso o cálculo de DV1 retorne 10, o resultado será 0. Caso retorne 11, o DV
 *    será 1. Ou seja, se for maior ou igual a 10, desconsidere a casa das dezenas.
 *
 * = DV = 65
 *
 * Fonte: https://www.gov.br/compras/pt-br/acesso-a-informacao/legislacao/portarias/portaria-interministerial-no-11-de-25-de-novembro-de-2019
 *
 * @param {String} value Título eleitoral
 * @returns {Boolean}
 */

import ValidationBRError from './ValidationBRError'
import { sumElementsByMultipliers, clearValue, fakeNumber, applyMask } from './utils'

/**
 * dv()
 * Calcula o dígito verificador
 *
 * @param {String} value
 * @returns {String}
 */
export const dv = (value: string): string => {
  const nup = clearValue(value, 15, { rejectEmpty: true, trimAtRight: true })
  const nupReverse = nup.split('').reverse().join('')

  const sum1 = sumElementsByMultipliers(
    nupReverse,
    [...Array(15)].map((_, i) => i + 2),
  )

  const dv1 = _specificSumToDV(sum1)

  const sum2 = sumElementsByMultipliers(
    dv1 + nupReverse,
    [...Array(16)].map((_, i) => i + 2),
  )

  const dv2 = _specificSumToDV(sum2)

  return `${dv1}${dv2}`
}

/**
 * Aplica uma máscara ao número informado
 *
 * @param {String} value Número de Processo
 * @returns {String} Valor com a máscara
 */
export const mask = (value: string): string => applyMask(value, '00000.000000/0000-00')

/**
 * fake()
 * Gera um número válido
 *
 * @param {Boolean} withMask Define se o número deve ser gerado com ou sem máscara
 * @returns {String}
 */
export const fake = (withMask: boolean = false): string => {
  const num = fakeNumber(15, true)

  const nup = `${num}${dv(String(num))}`

  if (withMask) return mask(nup)
  return nup
}

/**
 * validateOrFail()
 * Valida se um número é válido e
 * retorna uma exceção se não estiver
 *
 * @param {String} value Número a ser validado
 * @returns {Boolean}
 */
export const validateOrFail = (value: string): boolean => {
  const nup = clearValue(value, 17, {
    rejectEmpty: true,
    rejectHigherLength: true,
  })

  if (dv(nup) !== nup.substring(15, 17)) {
    throw ValidationBRError.INVALID_DV
  }

  return true
}

/**
 * validate()
 * Valida se um número é válido
 *
 * @param {String} value Número a ser validado
 * @returns {Boolean}
 */
export const validate = (value: string): boolean => {
  try {
    return validateOrFail(value)
  } catch (error) {
    return false
  }
}

export default validate

function _specificSumToDV(sum: number): number {
  const rest = 11 - (sum % 11)
  const exceptions = [
    { rest: 11, dv: 1 },
    { rest: 10, dv: 0 },
  ]

  const inExceptions = exceptions.find((item) => item.rest === rest)

  return !inExceptions ? rest : inExceptions.dv
}
