import { SKSource, SKSourceJSON } from "./SKSource";
import { SKValue, SKValueJSON } from "./SKValue";

export interface SKUpdateJSON {
  timestamp: string
  source: SKSourceJSON
  values: SKValueJSON[]
}

/**
 * One update to the values of an object.
 *
 * This includes the time of the update, the source and a list of values that
 * at the given timestamp.
 */
export class SKUpdate {
  timestamp: Date
  source: SKSource
  values: SKValue[]

  constructor(source : SKSource, timestamp: Date = new Date(), values: SKValue[] = []) {
    this.timestamp = timestamp
    this.source = source
    this.values = values
  }

  static fromJSON(json: string|SKUpdateJSON): SKUpdate {
    if (typeof json === 'string') {
      return JSON.parse(json, SKUpdate.reviver)
    }
    else {
      let update : SKUpdate = Object.create(SKUpdate.prototype)
      update.timestamp = new Date(json.timestamp)
      update.source = SKSource.fromJSON(json.source)
      update.values = json.values.map(v => SKValue.fromJSON(v))
      return update
    }
  }

  static reviver(key: string, value: any): any {
    return key === "" ? SKUpdate.fromJSON(value) : value;
  }
}