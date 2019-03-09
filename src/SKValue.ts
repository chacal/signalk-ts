import { SKPosition, SKPositionJSON } from "./SKPosition";

/**
 * SignalK specifies that timestamps should be serialized as ISO8601 timestamps.
 */
export type Timestamp = string

export type SKValueType = number|string|SKPosition|Date
export type SKValueTypeJSON = number|string|SKPositionJSON

export interface SKValueJSON {
  path: string
  value: SKValueTypeJSON
}

/**
 * One generic signalk value.
 */
export class SKValue {
  path: string
  value: SKValueType

  constructor(path: string, value: SKValueType) {
    this.path = path
    this.value = value
  }

  static fromJSON(json: string|SKValueJSON): SKValue {
    if (typeof json === 'string') {
      return JSON.parse(json, SKValue.reviver)
    }
    else {
      let v : SKValue = Object.create(SKValue.prototype)
      v.path = json.path
      if (v.path === 'navigation.position' && typeof json.value === 'object'
          && 'latitude' in json.value && 'longitude' in json.value) {
        v.value = SKPosition.fromJSON(json.value)
      }
      else if (v.path === 'navigation.datetime' && typeof json.value === 'string') {
        v.value = new Date(json.value)
      }
      else if (typeof json.value === 'number' || typeof json.value === 'string') {
        v.value = json.value
      }
      return v
    }
  }

  static reviver(key: string, value: any): any {
    return key === "" ? SKValue.fromJSON(value) : value;
  }
}