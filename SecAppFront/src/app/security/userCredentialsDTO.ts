export interface UserCredentialsDTO {
    email: string;
    password: string;
}

export interface AuthResponseDTO {
    token: string;
    tokenExpiration: Date;
}

export interface UserProfileDTO {
    emai: string;
}