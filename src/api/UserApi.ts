import type { User } from "../models/User";

const MOCK_USERS: User[] = [
    {
        id: "1",
        firstName: "Jan",
        lastName: "WSEIBOSS",
        role: "admin"
    },
    {
        id: "2",
        firstName: "Natalia",
        lastName: "Nowak",
        role: "devops"
    },
    {
        id: "3",
        firstName: "Czeslaw",
        lastName: "Brzytwa",
        role: "developer"
    }
];

export class UserApi {
  // wwraca aktualnie zalogowanego usera zawsze admin, id=1
  static getCurrentUser(): User {
    return MOCK_USERS[0];
  }

  // wraca listę wszystkich userow
  static getAllUsers(): User[] {
    return MOCK_USERS;
  }
}