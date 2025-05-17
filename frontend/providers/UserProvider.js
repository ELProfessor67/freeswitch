'use client'
import { loadRequest } from "@/http/authHttp";
import { registerRequest } from "@/services/SIPService";
import {createContext, useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";

const UserContext = createContext();



export const UserProvier = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(undefined);
    const router = useRouter();

    const fetchUser = async () => {
        try {
            const res = await loadRequest();
            const user = res.data.user
            setUser(user);
            setIsAuth(true);
            await registerRequest(user.SIP, user.username, user.password);
            router.push("/dashboard")
        } catch (error) {
            setIsAuth(false);
            setUser(null);
            router.push("/");
        }
    }

    useEffect(() => {
        fetchUser();
    },[])




    return <UserContext.Provider value={{user,isAuth,setIsAuth,setUser}}>
        {children}
    </UserContext.Provider>
}


export const useUser = () => {
    const user = useContext(UserContext);
    return user
}