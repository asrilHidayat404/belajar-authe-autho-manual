export type Role = {
    id_role: number,
    role_name: string
}

export type User = {
    full_name?: string;
    email: string;
    role: Role;
    nim: string;
    faculty: string;
    field_of_study: string;
    semester: string;
    class: string;
    gender: string;
};

