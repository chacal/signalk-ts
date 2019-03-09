import { SKContext } from './SKContext'
import { SKUpdate, SKUpdateJSON } from './SKUpdate'

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
  constructor(
    readonly updates: SKUpdate[] = [],
    readonly context: SKContext | null = null
  ) {}

  static fromJSON(json: string | SKDeltaJSON): SKDelta {
    const jsonObj: SKDeltaJSON = typeof json === 'string' ? JSON.parse(json) : json
    const updates = jsonObj.updates.map(u => SKUpdate.fromJSON(u))

    return new SKDelta(updates, jsonObj.context)
  }
}
