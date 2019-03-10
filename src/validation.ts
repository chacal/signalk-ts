import * as Joi from 'joi'
import { ValidationOptions } from 'joi'

export function parseAndValidate<T>(json: string | T, schema: Joi.SchemaLike, options?: ValidationOptions): T {
  const jsonObj: T = typeof json === 'string' ? JSON.parse(json) : json
  const { error, value } = Joi.validate(jsonObj, schema, options)
  if (error) {
    throw error
  }
  return value
}
