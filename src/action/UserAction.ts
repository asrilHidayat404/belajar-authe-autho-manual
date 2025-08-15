"use server"

export const store = async (formData: FormData) => {
    const username = formData.get("username") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role_id = formData.get("role_id") as string

    const data = { username, email, password, role_id }
    console.log(data);

}