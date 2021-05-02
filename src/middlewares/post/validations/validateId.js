import { check } from 'express-validator';

const validateId = check('id').isString();

export default validateId;
