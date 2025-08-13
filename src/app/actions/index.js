"use server"

import { signIn, signOut } from "@/auth"

export  async function doSocialLogin(formData) {
        const action = formData.get('action')
        await signIn (action, {redirectTo  : "/dashboard"})
        // console.log(action)
}

export async function doLogout(){
    await signOut ({redirectTo : "/"})
}

export async function doCredLogin(formData){
    try {
        const response = await signIn("credentials", {
            email : formData.get('email'),
            password : formData.get('password'),
            redirect : false
        })
        return response;
    } catch (error) {
        console.log(error)
        return { error: "Invalid credentials. Please try again." };
    }
}