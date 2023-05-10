import { nanoid } from 'nanoid';

export class Profile {
  constructor(user) {
    this.login = user.login;
    this.password = user.password;
    this.displayName = user.displayName;
    this.id = nanoid();
  }
}
