'use client'
import { loadRequest } from "@/http/authHttp";
import { registerRequest } from "@/services/SIPService";
import {createContext, useContext, useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";

const UserContext = createContext();



export const UserProvier = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(undefined);
    const router = useRouter();
    const pathname = usePathname();

    const fetchUser = async () => {
        try {
            const res = await loadRequest();
            const user = res.data.user
            setUser(user);
            setIsAuth(true);
            const SIP = `sip:${user.username}@${user?.pbx?.SIP_HOST}` + (user?.pbx?.SIP_PORT ? user?.pbx?.SIP_PORT : "");
            const wss = `wss://${user?.pbx?.SIP_HOST}:${user?.pbx?.WSS_POST}`;
            await registerRequest(SIP, user.username, user.password,wss);
            if(pathname == "/"){
                if(user.role == "ADMIN"){
                    router.push("/admin")
                }else{
                    router.push("/dashboard")
                }
            }
        } catch (error) {
            console.log(error)
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