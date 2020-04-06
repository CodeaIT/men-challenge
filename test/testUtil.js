import chai from 'chai';
import fs from 'fs';
import logger from '../src/utils/logger';

const { assert } = chai;

export const assertHasFieldErrors = (err, field) => {
  const emailErrors = err.response.data.errors.filter((e) => e.param === field);
  assert.isNotEmpty(emailErrors);
};

export const updateApiDocs = async (instance) => {
  try {
    const apiSpec = await instance.get('/api-spec');
    fs.writeFileSync('./api-docs.json', JSON.stringify(apiSpec.data));
  } catch (err) {
    logger.error(err.response.data);
  }
};

export default { assertHasFieldErrors, updateApiDocs };
