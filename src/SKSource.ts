import { parseAndValidate } from './validation'
import * as Joi from 'joi'
import { ObjectSchema, SchemaLike } from 'joi'

/*
 *
 * Types for Signal K source JSON object
 *
 */
export interface SKBaseSourceJSON {
  label: string
  type: string
}

export interface SKN2KSourceJSON extends SKBaseSourceJSON {
  src: string
  pgn: number
  instance?: string
}

export interface SKNMEA0183SourceJSON extends SKBaseSourceJSON {
  sentence: string
  talker: number
}

export interface SKI2CSourceJSON extends SKBaseSourceJSON {
  src: string
}

export interface SK1WSourceJSON extends SKBaseSourceJSON {
  id: string
}

export type SKSourceJSON =
  | SKN2KSourceJSON
  | SKNMEA0183SourceJSON
  | SKI2CSourceJSON
  | SK1WSourceJSON

/*
 *
 * Type guards for Signal K source JSON types
 *
 */
export function isSKN2KSourceJSON(src: SKSourceJSON): src is SKN2KSource {
  return src.type === 'NMEA2000'
}

export function isSKNMEA0183KSourceJSON(src: SKSourceJSON): src is SKNMEA0183SourceJSON {
  return src.type === 'NMEA0183'
}

export function isSKI2CKSourceJSON(src: SKSourceJSON): src is SKI2CSourceJSON {
  return src.type === 'I2C'
}

export function isSK1WSourceJSON(src: SKSourceJSON): src is SK1WSourceJSON {
  return src.type === '1W'
}

/*
 *
 * Signal K source domain classes
 *
 */
type SKSourceType = 'NMEA2000' | 'NMEA0183' | 'I2C' | '1W'

export class SKBaseSource {
  static schema = Joi.object({
    type: Joi.string()
      .equal('NMEA2000', 'NMEA0183', 'I2C', '1W')
      .required(),
    label: Joi.string()
      .allow('')
      .required()
  })

  constructor(readonly type: SKSourceType, readonly label: string) {}
}

export class SKN2KSource extends SKBaseSource {
  static schema = Joi.object({
    src: Joi.string().required(),
    pgn: Joi.number()
      .positive()
      .integer()
      .required(),
    instance: Joi.string()
  })

  constructor(
    label: string,
    readonly src: string,
    readonly pgn: number,
    readonly instance?: string
  ) {
    super('NMEA2000', label)
  }
}

export class SKNMEA0183Source extends SKBaseSource {
  static schema = Joi.object({
    sentence: Joi.string().required(),
    talker: Joi.string().required()
  })

  constructor(label: string, readonly sentence: string, readonly talker: number) {
    super('NMEA0183', label)
  }
}

export class SKI2CSource extends SKBaseSource {
  static schema = Joi.object({
    src: Joi.string().required()
  })

  constructor(label: string, readonly src: string) {
    super('I2C', label)
  }
}

export class SK1WSource extends SKBaseSource {
  static schema = Joi.object({
    id: Joi.string().required()
  })

  constructor(label: string, readonly id: string) {
    super('1W', label)
  }
}

export type SKSource = SKN2KSource | SKNMEA0183Source | SKI2CSource | SK1WSource

/*
 *
 * Deserializer
 *
 */
export const SKSource = {
  fromJSON(json: string | SKSourceJSON): SKSource {
    // Must allow unknowns here as we are only validating the common parts of the source objects
    const obj = parseAndValidate(json, SKBaseSource.schema, { allowUnknown: true })

    if (isSKN2KSourceJSON(obj)) {
      const n2kObj = parseAndValidate(obj, withBase(SKN2KSource.schema))
      return new SKN2KSource(n2kObj.label, n2kObj.src, n2kObj.pgn, n2kObj.instance)
    } else if (isSKNMEA0183KSourceJSON(obj)) {
      const nmea = parseAndValidate(obj, withBase(SKNMEA0183Source.schema))
      return new SKNMEA0183Source(nmea.label, nmea.sentence, nmea.talker)
    } else if (isSKI2CKSourceJSON(obj)) {
      const i2cObj = parseAndValidate(obj, withBase(SKI2CSource.schema))
      return new SKI2CSource(i2cObj.label, i2cObj.src)
    } else if (isSK1WSourceJSON(obj)) {
      const oneWireObj = parseAndValidate(obj, withBase(SK1WSource.schema))
      return new SK1WSource(oneWireObj.label, oneWireObj.id)
    } else {
      // Let compiler warn us, if we have missed some "else if"
      // "obj" should be of type never here and if it is not, this won't compile
      return assertNever(obj)
    }

    function withBase(schema: ObjectSchema): SchemaLike {
      return SKBaseSource.schema.concat(schema)
    }

    function assertNever(x: never): never {
      throw new Error('Unexpected object: ' + x)
    }
  }
}

/*
 *
 * Type guards for Signal K source domain classes
 *
 */
export function isSKN2KSource(src: SKSource): src is SKN2KSource {
  return src.type === 'NMEA2000'
}

export function isSKNMEA0183KSource(src: SKSource): src is SKNMEA0183Source {
  return src.type === 'NMEA0183'
}

export function isSKI2CKSource(src: SKSource): src is SKI2CSource {
  return src.type === 'I2C'
}

export function isSK1WSource(src: SKSource): src is SK1WSource {
  return src.type === '1W'
}
