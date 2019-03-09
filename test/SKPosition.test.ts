import { SKPosition } from "../src/SKPosition";

it("can load from JSON", () => {
  const pos = SKPosition.fromJSON('{ "latitude": 87.1, "longitude": -123.2, "altitude": -1}')
  expect(pos.latitude).toEqual(87.1)
  expect(pos.longitude).toEqual(-123.2)
  expect(pos.altitude).toEqual(-1)
})

it ("can ignore altitude", () => {
  const pos = SKPosition.fromJSON('{ "latitude": 87.1, "longitude": -123.2 }')
  expect(pos.latitude).toEqual(87.1)
  expect(pos.longitude).toEqual(-123.2)
  expect(pos.altitude).toBeUndefined()
})

it('can serialize in DMS format', () => {
  const pos = new SKPosition(17.00505555108625, -61.76250950023393)
  expect(pos.asDMSString()).toEqual('N 17º0\'18.200" W 61º45\'45.034"')
})