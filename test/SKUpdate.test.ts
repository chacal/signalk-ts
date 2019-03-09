import { SKUpdate } from "../src/SKUpdate";

it('can load from json', () => {
  const v = SKUpdate.fromJSON(`{
    "source": {
      "label": "N2000-01",
      "type": "NMEA2000",
      "src": "017",
      "pgn": 127488
    },
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
  }`)
  expect(v.source.label).toEqual('N2000-01')
  expect(v.timestamp).toEqual(new Date("2010-01-07T07:18:44Z"))
  expect(v.values).toHaveLength(2)
  expect(v.values[0].path).toEqual('navigation.speedOverGround')
  expect(v.values[0].value).toEqual(16.341667)
})