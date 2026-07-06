"use client";
import { signOut } from "@/app/login/actions";

export default function LogoutButton(){

    return (
        <div onClick={() => signOut()} className="flex flex-row items-start justify-center rounded-lg border border-sidebar-border bg-card p-3 w-[50%] hover:bg-sidebar-accent hover:text-foreground cursor-pointer">
            <span className="flex items-start justify-center text-red-400  "> SAIR </span>  
        </div>
    )
}