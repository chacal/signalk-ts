import * as Joi from 'joi'
import { SKSource, SKSourceJSON } from './SKSource'
import { SKValue, SKValueJSON } from './SKValue'
import { parseAndValidate } from './validation'

export interface SKUpdateJSON {
  timestamp: string
  $source: string
  values: SKValueJSON[]
  source?: SKSourceJSON
}

/**
 * One update to the values of an object.
 *
 * This includes the time of the update, the source and a list of values
 * at the given timestamp.
 */
export class SKUpdate {
  private static schema = {
    timestamp: Joi.date()
      .iso()
      .required(),
    $source: Joi.string().default('n/a'), // TODO: remove default value
    values: Joi.array()
      .items(Joi.object())
      .min(1)
      .required(),
    source: Joi.object()
  }

  constructor(
    readonly sourceRef: string,
    readonly timestamp: Date,
    readonly values: SKValue[],
    readonly source?: SKSource
  ) {}

  static fromJSON(json: string | SKUpdateJSON): SKUpdate {
    const obj = parseAndValidate(json, this.schema)
    const source = obj.source ? SKSource.fromJSON(obj.source) : undefined
    const values = obj.values.map(u => SKValue.fromJSON(u))
    return new SKUpdate(obj.$source, new Date(obj.timestamp), values, source)
  }
}
