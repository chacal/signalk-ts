import {SKDelta} from "./SKDelta"

const signalkdelta = `
{
  "context": "vessels.urn:mrn:imo:mmsi:234567890",
  "updates": [
    {
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
    }
  ]
}
`

describe("SKDelta Loading from JSON", () => {
  it('can load a signalk json and return it as a skdelta object', ()=> {
    const skdelta : SKDelta = SKDelta.fromJSON(signalkdelta)

    expect(skdelta.context).toEqual("vessels.urn:mrn:imo:mmsi:234567890")
    expect(skdelta.updates).toHaveLength(1)

    const update = skdelta.updates[0]

    expect(update.timestamp).toEqual(new Date("2010-01-07T07:18:44Z"))
    expect(update.source.label).toEqual('N2000-01')

    expect(update.values).toHaveLength(2)

    expect(update.values[0]).toHaveProperty('path', 'navigation.speedOverGround')
    expect(update.values[0]).toHaveProperty('value', 16.341667)

    expect(update.values[1]).toHaveProperty('path', 'navigation.courseOverGround')
    expect(update.values[1]).toHaveProperty('value', 3.1)
  })
})