import { Web } from "sip.js";




export const registerRequest = async (aor,username,password) => {
    return new Promise(async (resolve, reject) => {
        const server = process.env.NEXT_PUBLIC_FREESWITCH_WEBSOCKER_SERVER;
        const options = {
            aor,
            userAgentOptions: {
                authorizationPassword: password,
                authorizationUsername: username,
            }
        };

        const simpleUser = new Web.SimpleUser(server, options);

        simpleUser.delegate = {
            onRegistered: () => {
                resolve("Register Successfully")
                simpleUser.unregister();
            },
            onUnregistered: () => {
               reject("Invalid Credentials")
            }
        };

        try {
            await simpleUser.connect();
            await simpleUser.register();
        } catch (error) {
            console.error("Registration Failed", error);
            reject("Invalid Credentials")
        }
    })
}