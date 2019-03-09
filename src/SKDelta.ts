import { SKContext } from "./SKContext";
import { SKUpdate, SKUpdateJSON } from "./SKUpdate";

export interface SKDeltaJSON {
  context?: any
  updates: SKUpdateJSON[]
}

/**
 * A list of updates that apply to a specific object defined by the context.
 *
 * Typically, the context is a vessel URN.
 */
export class SKDelta {
  context?: SKContext
  updates: SKUpdate[]

  constructor(updates: SKUpdate[] = [], context: SKContext|null = null) {
    this.updates = updates
    if (context) {
      this.context = context
    }
  }

  static fromJSON(json: string|SKDeltaJSON): SKDelta {
    if (typeof json === 'string') {
      return JSON.parse(json, SKDelta.reviver)
    }
    else {
      let delta : SKDelta = Object.create(SKDelta.prototype)
      delta.context = json.context
      delta.updates = json.updates.map(u => SKUpdate.fromJSON(u))
      return delta
    }
  }

  static reviver(key: string, value: any): any {
    return key === "" ? SKDelta.fromJSON(value) : value;
  }
}