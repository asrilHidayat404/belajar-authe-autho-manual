export type User = {
    username: string,
    email: string,
    password: string
    role_id: number
    role?: Role
}

export type Role = {
    id_role: number,
    role_name: string
}