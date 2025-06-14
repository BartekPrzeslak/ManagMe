import type { User } from "../models/User";

// zwraca zalogowanego uzytkownika bardziej udaje ze jest zalogowany
export class UserApi {
    static getCurrentUser(): User {
        return{
            id: "1",
            firstName: "Jan",
            lastName: "Kowalski"
        };
    }
}