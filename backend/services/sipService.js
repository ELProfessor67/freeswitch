import fs from "fs";
import path from "path";
import "dotenv/config";
import {exec} from "child_process"
const __dirname = path.resolve()
const SIP_DIR = process.env.NODE_ENV === "development" ? path.join(__dirname, "/etc/freeswitch/directory/default") : path.join("/etc/freeswitch/directory/default");


export const reloadXml = () => {
    return new Promise((resolve, reject) => {
        if(process.env.NODE_ENV == "development") return resolve()
        exec(`fs_cli -x "reloadxml"`, (error, stdout, stderr) => {
          if (error) {
            reject(error);
            return;
          }
          if (stderr) {
            reject(new Error(stderr));
            return;
          }
          resolve(stdout);
        });
      });
}
export const isUserExists = async (username) => {
    const userFile = path.join(SIP_DIR, `${username}.xml`);    
    return fs.existsSync(userFile);
}

export const createUser = async (username, password) => {
    const userFile = path.join(SIP_DIR, `${username}.xml`);
    const userContent = `
        <include>
            <user id="${username}">
                <params>
                <param name="password" value="${password}"/>
                <param name="vm-password" value="${username}"/>
                </params>
                <variables>
                <variable name="toll_allow" value="domestic,international,local"/>
                <variable name="accountcode" value="${username}"/>
                <variable name="user_context" value="default"/>
                <variable name="effective_caller_id_name" value="Extension ${username}"/>
                <variable name="effective_caller_id_number" value="${username}"/>
                <variable name="outbound_caller_id_name" value="${"$${outbound_caller_name}"}"/>
                <variable name="outbound_caller_id_number" value="${"$${outbound_caller_id}"}"/>
                <variable name="callgroup" value="techsupport"/>
                </variables>
            </user>
            </include>
    `;

    fs.writeFileSync(userFile, userContent);
    await reloadXml()
}

export const deleteUser = async (username) => {
    const userFile = path.join(SIP_DIR, `${username}.xml`);

    if(fs.existsSync(userFile)){
        fs.unlinkSync(userFile);

        return true;
    }
    await reloadXml()
    return false;
}

export const updateUser = async (username, password,username1) => {
    await deleteUser(username1)
    await createUser(username,password)
    await reloadXml()
    return true;
}

export const getUsers = async () => {
    const users = [];
    const usersFiles = fs.readdirSync(SIP_DIR);

    usersFiles.forEach(file => {
        const xmlData = fs.readFileSync(path.join(SIP_DIR, file), "utf8");
        const username = file.replace('.xml', '');
        const passwordMatch = xmlData.match(/<param\s+name="password"\s+value="([^"]+)"/);
        const password = passwordMatch ? passwordMatch[1] : null;
        users.push({ username, password });

    });

    return users;
}




