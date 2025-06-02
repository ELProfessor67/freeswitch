import { Web } from "sip.js";




export const registerRequest = async (aor,username,password,server) => {
    return new Promise(async (resolve, reject) => {
        try {
            
            const options = {
                aor,
                userAgentOptions: {
                    authorizationPassword: password,
                    authorizationUsername: username,
                }
            };

            const simpleUser = new Web.SimpleUser(server, options);

            simpleUser.delegate = {
                onRegistered: async () => {
                    resolve("Register Successfully")
                    simpleUser.unregister();
                },
                onUnregistered: () => {
                    reject("Invalid Credentials")
                }
            };

        
            await simpleUser.connect();
            await simpleUser.register();
        } catch (error) {
            console.error("Registration Failed", error);
            reject("Invalid Credentials")
        }
    })
}