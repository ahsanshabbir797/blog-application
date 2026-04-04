import { faker } from '@faker-js/faker';

export const completeUser = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: 'Password123!',
};

export const firstNameMissing = {
  lastName: faker.person.lastName(),
  email: faker.internet.email(),
  password: 'Password123',
};

export const emailMissing = {
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  password: 'Password123',
};

export const passwordMissing = {
  firstName: faker.person.firstName(),
  email: faker.internet.email(),
  lastName: faker.person.lastName(),
};
