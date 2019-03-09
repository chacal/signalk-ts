import { SKSource } from "../src/SKSource";

it('can unmarshall a SKSource', () => {
  const s = SKSource.fromJSON('{ "label": "nmea2000", "pgn": 223 }')
  expect(s.label).toEqual('nmea2000')
})