/**
 * Position in SignalK
 *
 * Altitude is optional
 */
export interface SKPositionJSON {
  latitude: number
  longitude: number
  altitude?: number
}

/**
 * Position in SignalK
 *
 * Altitude is optional
 */
export class SKPosition {
  latitude: number
  longitude: number
  altitude?: number

  constructor(latitude: number, longitude: number, altitude?: number) {
    this.latitude = latitude
    this.longitude = longitude
    this.altitude = altitude
  }

  public asArray(): [number, number] {
    return [this.longitude, this.latitude]
  }

  public asDMSString(): string {
    const latitude = toDegreesMinutesAndSeconds(this.latitude)
    const latitudeCardinal = Math.sign(this.latitude) >= 0 ? "N" : "S"
    const longitude = toDegreesMinutesAndSeconds(this.longitude)
    const longitudeCardinal = Math.sign(this.longitude) >= 0 ? "E" : "W"

    return `${latitudeCardinal} ${latitude} ${longitudeCardinal} ${longitude}`
  }

  static fromJSON(json:string|SKPositionJSON) {
    if (typeof json === 'string') {
      return JSON.parse(json, SKPosition.reviver)
    }
    else {
      const p = Object.create(SKPosition.prototype)
      p.latitude = json.latitude
      p.longitude = json.longitude
      p.altitude = json.altitude
      return p
    }
  }

  static reviver(key: string, value: any): any {
    return key === "" ? SKPosition.fromJSON(value) : value;
  }
}

function toDegreesMinutesAndSeconds(coordinate:number) {
  var absolute = Math.abs(coordinate);
  var degrees = Math.floor(absolute);
  var minutesNotTruncated = (absolute - degrees) * 60;
  var minutes = Math.floor(minutesNotTruncated);
  var seconds = (minutesNotTruncated - minutes) * 60;

  return `${degrees}º${minutes}'${seconds.toFixed(3)}"`;
}

