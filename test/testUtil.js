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
    const apiSpecv2 = await instance.get('/api-spec');
    fs.writeFileSync('./api-docs.json', JSON.stringify(apiSpecv2.data));

    const apiSpecv3 = await instance.get('/api-spec/v3');
    fs.writeFileSync('./api-docs_v3.json', JSON.stringify(apiSpecv3.data));
  } catch (err) {
    logger.error(err.response.data);
  }
};

export const buildAuthorizationHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export default {
  assertHasFieldErrors,
  updateApiDocs,
  buildAuthorizationHeader,
};
