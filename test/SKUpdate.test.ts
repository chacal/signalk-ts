import { SKUpdate } from '../src/SKUpdate'
import { expectValidationFailure } from './helpers'

const signalkUpdate = `{
  "source": {
    "label": "N2000-01",
    "type": "NMEA2000",
    "src": "017",
    "pgn": 127488
  },
  "$source": "myboat.017",
  "timestamp": "2010-01-07T07:18:44Z",
  "values": [
    {
      "path": "navigation.speedOverGround",
      "value": 16.341667
    },
    {
      "path": "navigation.courseOverGround",
      "value": 3.1
    }
  ]
}`

export const n2kSource = `{
  "label": "N2000-01",
  "type": "NMEA2000",
  "src": "017",
  "pgn": 127488
}`
export const nmea0183Source = `{
  "label": "NMEA0183-0",
  "type": "NMEA0183",
  "sentence": "RMC",
  "talker": "GP"
}`

export const i2cSource = `{
  "label": "I2C-0",
  "type": "I2C",
  "src": "14"
}`

export const oneWireSource = `{
  "label": "1W-0",
  "type": "1W",
  "id": "28FF8C9560163C3"
}`

describe('SKUpdate', () => {
  it('can load from json', () => {
    const v = SKUpdate.fromJSON(signalkUpdate)
    expect(v.$source).toEqual('myboat.017')
    expect(v.source).toBeDefined()
    if (v.source) {
      expect(v.source.label).toEqual('N2000-01')
    }
    expect(v.timestamp).toEqual(new Date('2010-01-07T07:18:44Z'))
    expect(v.values).toHaveLength(2)
    expect(v.values[0].path).toEqual('navigation.speedOverGround')
    expect(v.values[0].value).toEqual(16.341667)
  })

  it('derives N2k $source correctly from source', () => {
    assert$sourceDerivation(n2kSource, 'N2000-01.017')
  })

  it('derives NMEA0183 $source correctly from source', () => {
    assert$sourceDerivation(nmea0183Source, 'NMEA0183-0.GP')
  })

  it('derives I2C $source correctly from source', () => {
    assert$sourceDerivation(i2cSource, 'I2C-0.14')
  })

  it('derives 1W $source correctly from source', () => {
    assert$sourceDerivation(oneWireSource, '1W-0.28FF8C9560163C3')
  })

  it('fails validation if date is wrong', () => {
    const wrongTsInput = [
      undefined,
      null,
      '',
      'test',
      new Date().getMilliseconds(),
      '2010-01-07 10:00:00',
      '2010-01-07T10:00:00',
    ]
    const json = JSON.parse(signalkUpdate)
    wrongTsInput.forEach(v => {
      json.timestamp = v
      expectValidationFailure(() => SKUpdate.fromJSON(json))
    })
  })
})

function assert$sourceDerivation(sourceJson: string, expected$source: string) {
  const json = JSON.parse(signalkUpdate)
  json.$source = undefined // Clear $source to force generating based on .source
  json.source = JSON.parse(sourceJson)
  const v = SKUpdate.fromJSON(json)
  expect(v.$source).toEqual(expected$source)
  expect(v.source).toEqual(json.source)
}
