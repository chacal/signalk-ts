import { SKValue } from './SKValue';

it('can load from json', () => {
  const v = SKValue.fromJSON(`{
    "path": "propulsion.0.revolutions",
    "value": 16.341667
  }`)
  expect(v).toHaveProperty('path', "propulsion.0.revolutions")
  expect(v).toHaveProperty('value', 16.341667)
})

it('can load a position from json', () => {
  const v = SKValue.fromJSON(`{
    "path": "navigation.position",
    "value": {"latitude":35.04832,"longitude":-76.62011}
  }`)
  expect(v).toHaveProperty('path', "navigation.position")
  expect(v.value).toMatchObject({"latitude":35.04832,"longitude":-76.62011})
  expect(v.value).toHaveProperty('asDMSString')
})
