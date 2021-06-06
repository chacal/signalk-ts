import * as Joi from 'joi'
import isRFC3339 from 'validator/lib/isRFC3339'

export function parseAndValidate<T>(
  json: string | T,
  schema: Joi.SchemaLike,
  options?: Joi.ValidationOptions
): T {
  const jsonObj: T = typeof json === 'string' ? JSON.parse(json) : json
  const { error, value } = Joi.compile(schema).validate(jsonObj, options)
  if (error) {
    throw error
  }
  return value
}

// RFC3339 timestamp validator as custom Joi extension
export const RFC3339Validator: Joi.Extension = {
  type: 'rfc3339',
  base: Joi.string(),
  messages: {
    'rfc3339.base': 'needs to be a date string with RFC3339 format'
  },
  validate(value: any, helpers: Joi.CustomHelpers) {
    if (isRFC3339(value)) {
      return { value }
    } else {
      return { errors: helpers.error('rfc3339.base') }
    }
  }
}
