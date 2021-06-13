import { check } from 'express-validator';
import { ID_INVALID } from '../../../constants/errorCodes';

const validateId = check('id', ID_INVALID).isString();

export default validateId;
