import * as Joi from 'joi'
import validator = require('validator')

export function parseAndValidate<T>(
  json: string | T,
  schema: Joi.SchemaLike,
  options?: Joi.ValidationOptions
): T {
  const jsonObj: T = typeof json === 'string' ? JSON.parse(json) : json
  const { error, value } = Joi.validate(jsonObj, schema, options)
  if (error) {
    throw error
  }
  return value
}

// @types/validator don't contain isRFC3339() -> declare it manually
declare global {
  namespace ValidatorJS {
    interface ValidatorStatic {
      isRFC3339(str: string): boolean
    }
  }
}

// RFC3339 timestamp validator as custom Joi extension
export const RFC3339Validator: Joi.Extension = {
  base: Joi.string(),
  name: 'string',
  language: {
    rfc3339: 'needs to be a date string with RFC3339 format'
  },
  rules: [
    {
      name: 'rfc3339',
      validate(params, value, state, options): any {
        if (validator.isRFC3339(value)) {
          return value
        } else {
          return this.createError('string.rfc3339', { v: value }, state, options)
        }
      }
    }
  ]
}
