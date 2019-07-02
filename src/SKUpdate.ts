import * as Joi from 'joi'
import { RFC3339Validator } from './validation'
import {
  isSK1WSourceJSON,
  isSKI2CKSourceJSON,
  isSKN2KSourceJSON,
  isSKNMEA0183KSourceJSON,
  SKSource,
  SKSourceJSON
} from './SKSource'
import { SKValue, SKValueJSON } from './SKValue'
import { parseAndValidate } from './validation'

const CustomJoi = Joi.extend(RFC3339Validator)

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
    timestamp: CustomJoi.string()
      .rfc3339()
      .required(),
    $source: Joi.string().default(generate$source, '$source can be derived from source'),
    values: Joi.array()
      .items(Joi.object())
      .min(1)
      .required(),
    source: Joi.object()
  }

  constructor(
    readonly $source: string,
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

function generate$source(context: SKUpdateJSON): string {
  const src = context.source
  if (!src) {
    throw new Error('Can not derive $source from ' + JSON.stringify(context))
  }

  if (isSKN2KSourceJSON(src)) {
    return `${src.label}.${src.src}` + (src.instance ? '.' + src.instance : '')
  } else if (isSKNMEA0183KSourceJSON(src)) {
    return `${src.label}.${src.talker}`
  } else if (isSKI2CKSourceJSON(src)) {
    return `${src.label}.${src.src}`
  } else if (isSK1WSourceJSON(src)) {
    return `${src.label}.${src.id}`
  } else {
    return assertNever(src)
  }

  function assertNever(x: never): never {
    throw new Error('Unexpected object: ' + x)
  }
}
