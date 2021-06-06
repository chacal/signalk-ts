import * as Joi from 'joi'

import { SKContext } from './SKContext'
import { SKUpdate, SKUpdateJSON } from './SKUpdate'
import { parseAndValidate } from './validation'

export interface SKDeltaJSON {
  context?: string
  updates: SKUpdateJSON[]
}

/**
 * A list of updates that apply to a specific object defined by the context.
 *
 * Typically, the context is a vessel URN, empty context is converted to "self".
 */
export class SKDelta {
  private static schema = {
    context: Joi.string().default('self'),
    updates: Joi.array()
      .min(1)
      .required()
  }

  constructor(readonly context: SKContext, readonly updates: SKUpdate[]) {}

  static fromJSON(json: string | SKDeltaJSON): SKDelta {
    const obj = parseAndValidate(json, this.schema)
    const updates = obj.updates.map(u => SKUpdate.fromJSON(u))
    return new SKDelta(obj.context as string, updates) // context is already validated to exist
  }

  hasSelfContext(): boolean {
    return !this.context || this.context === 'self' || this.context === 'vessels.self'
  }
}
