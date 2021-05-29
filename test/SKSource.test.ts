import { SKN2KSource, SKSource } from '../src/SKSource'
import { n2kSource } from './SKUpdate.test'



it('can load n2k source from JSON', () => {
  const s = SKSource.fromJSON(n2kSource) as SKN2KSource
  expect(s.type).toEqual('NMEA2000')
  expect(s.label).toEqual('N2000-01')
  expect(s.src).toEqual('017')
  expect(s.pgn).toEqual(127488)
  expect(s.deviceInstance).toEqual(53)
})