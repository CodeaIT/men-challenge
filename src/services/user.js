import models from '../models';

const { User } = models;

const findByEmail = (email) => User.findOne({ email });

const create = (user) => User.create(user);

export default { findByEmail, create };
