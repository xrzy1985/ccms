import { access } from './access';

export interface customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  access: access;
  date: Date;
  comment: string;
}

export const defaultCustomer = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  access: { right: 'Guest' },
  date: new Date(),
  comment: ``,
};
