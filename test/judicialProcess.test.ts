import isJudicialProcess, {
  dv,
  fake,
  mask,
  validate,
  validateOrFail,
  _getSubCourt,
} from '../src/judicialProcess'

import * as _judicialProcess from '../src/judicialProcess'

describe('JudicialProcess', () => {
  test('isJudicialProcess() - Números válidos', () => {
    const list = [
      '20802520125150049',
      '61052838320098130024',
      '00110060720168200100',
      '08002785520134058400',
      '08002732820164058400',
    ]

    list.forEach((judicialProcess) => {
      expect(isJudicialProcess(judicialProcess)).toBeTruthy()
      expect(_judicialProcess.validate(judicialProcess)).toBeTruthy()
    })
  })

  test('validate() - Números válidos', () => {
    const list = [
      '20802520125150049',
      '61052838320098130024',
      '00110060720168200100',
      '08002785520134058400',
      '08002732820164058400',
    ]

    list.forEach((judicialProcess) => {
      expect(validate(judicialProcess)).toBeTruthy()
    })
  })

  test('validate() - Números inválidos', () => {
    const list = [
      '20802520125150044',
      '61052838320098130023',
      '00110060720168200102',
      '08002785520134058401',
      '08002732820164058406',
      '08002732820160058400', // Órgão judiciário igual a 0
    ]

    list.forEach((judicialProcess) => {
      expect(validate(judicialProcess)).toBeFalsy()
    })
  })

  test('validateOrFail() - Números inválidos', () => {
    const list = [
      '20802520125150044',
      '61052838320098130023',
      '00110060720168200102',
      '08002785520134058401',
      '08002732820164058406',
      '08002732820160058400', // Órgão judiciário igual a 0
    ]

    list.forEach((judicialProcess) => {
      expect(() => validateOrFail(judicialProcess)).toThrow()
    })
  })

  test('Parâmetro não informado', () => {
    expect(isJudicialProcess('')).toBeFalsy()
    expect(validate('')).toBeFalsy()
    expect(() => validateOrFail('')).toThrow()
    expect(() => dv('')).toThrow()
  })

  test('fake() - Gera fakes sem máscara', () => {
    for (let i = 0; i < 500; i += 1) {
      const judicialProcess = fake()
      expect(validate(judicialProcess)).toBeTruthy()
      expect(judicialProcess).toHaveLength(20)
    }
  })

  test('fake() - Gera fakes com máscara', () => {
    for (let i = 0; i < 500; i += 1) {
      const judicialProcess = fake(true)
      expect(validate(judicialProcess)).toBeTruthy()
      expect(judicialProcess).toHaveLength(25)
    }
  })

  test('dv() - Verificando se o DV gerado está correto', () => {
    const list = [
      { num: '000208020125150049', expected: '25' },
      { num: '610528320098130024', expected: '83' },
      { num: '001100620168200100', expected: '07' },
      { num: '080027820134058400', expected: '55' },
      { num: '080027320164058400', expected: '28' },
    ]

    list.forEach((item) => {
      const calcDv = dv(item.num)

      expect(calcDv).toBe(item.expected)
      expect(typeof calcDv).toBe('string')
    })
  })

  test('mask() - Testando se a máscara foi gerada corretamente', () => {
    const list = [
      { num: '20802520125150049', expected: '0002080-25.2012.5.15.0049' },
      { num: '61052838320098130024', expected: '6105283-83.2009.8.13.0024' },
      { num: '00110060720168200100', expected: '0011006-07.2016.8.20.0100' },
      { num: '08002785520134058400', expected: '0800278-55.2013.4.05.8400' },
      { num: '08002732820164058400', expected: '0800273-28.2016.4.05.8400' },
    ]

    list.forEach((item) => {
      const masked = mask(item.num)

      expect(masked).toBe(item.expected)
      expect(masked).toHaveLength(25)
    })
  })

  test('_getSubCourt() - Valor diferente de zero', () => {
    expect(_getSubCourt('01')).toBe('01')
    expect(_getSubCourt('02')).toBe('02')
    expect(_getSubCourt('03')).toBe('03')
    expect(_getSubCourt('04')).toBe('04')
    expect(_getSubCourt('05')).toBe('05')
    expect(_getSubCourt('06')).toBe('06')
    expect(_getSubCourt('07')).toBe('07')
    expect(_getSubCourt('08')).toBe('08')
    expect(_getSubCourt('09')).toBe('09')
  })

  test('_getSubCourt() - Valor igual a zero', () => {
    expect(_getSubCourt('00')).toBe('01')
    expect(_getSubCourt('0')).toBe('01')
  })

  test('_getSubCourt() - Valor vazio', () => {
    expect(_getSubCourt().length).toBe(2)
  })
})
