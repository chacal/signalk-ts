import * as Joi from 'joi'

export function parseAndValidate<T>(json: string | T, schema: Joi.SchemaLike): T {
  const jsonObj: T = typeof json === 'string' ? JSON.parse(json) : json
  const { error } = Joi.validate(jsonObj, schema)
  if (error) {
    throw error
  }
  return jsonObj
}

