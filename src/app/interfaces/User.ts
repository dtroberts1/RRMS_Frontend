export interface User{
    Email : string;
    Password: string;
    FName: string,
    LName: string,
    ConfirmPassword: string,
    PhoneNumber: string,
}

export interface LoginUser{
    username : string;
    password: string;
    grant_type
}