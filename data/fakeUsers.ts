import { faker } from '@faker-js/faker';

faker.seed(123);

export type User = {
  firstName: string;
  lastName: string;
  zipCode: string;
};

export const generateFakeUser = (): User => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  zipCode: faker.location.zipCode(),
});
