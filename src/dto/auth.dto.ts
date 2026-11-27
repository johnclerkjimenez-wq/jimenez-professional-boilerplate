import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Name must be at least 2 characters',
            'string.max': 'Name must be at most 100 characters',
            'any.required': 'Name is required',
        }),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required',
        }),

    password: Joi.string()
        .min(8)
        .max(50)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters',
            'string.max': 'Password must be at most 50 characters',
            'any.required': 'Password is required',
        }),
});

export const loginSchema = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } })
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required',
        }),

    password: Joi.string()
        .min(8)
        .max(50)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters',
            'any.required': 'Password is required',
        }),
});