'use client'
import { loginRequest } from '@/http/authHttp';
import { useUser } from '@/providers/UserProvider';
import { registerRequest } from '@/services/SIPService';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Page = () => {
  const [loading, setLoading] = useState(false);
  const { user, isAuth, setIsAuth, setUser } = useUser();
  const router = useRouter();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formdata = new FormData(e.target);

      


      const res = await loginRequest(formdata);
      setIsAuth(true);
      setUser(res.data.user);
      const {extension_number,extension_password,pbx} = res.data.user;
      const user = res.data.user;
      const username = extension_number;
      const password = extension_password;
      const SIP = `sip:${username}@${pbx?.SIP_HOST}` + (pbx?.SIP_PORT ? pbx?.SIP_PORT : "");
      const wss = `wss://${pbx?.SIP_HOST}:${pbx?.WSS_PORT || ""}`;
      await registerRequest(SIP, username, password, wss);
    
      if (user?.role == "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }

      toast.success("Login Successfully")
    } catch (error) {
      toast.error("Login UnSuccessfully")
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">PBX Login</h2>

        <div className='space-y-2'>
          <label htmlFor='email'>Email</label>
          <input
            name="email"
            id='email'
            required
            placeholder="Username"
            className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className='space-y-2'>
          <label htmlFor='password'>Password</label>
          <input
            id='password'
            name="password"
            type="password"
            required
            placeholder="Password"
            className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-400 text-white py-3 rounded hover:bg-blue-600 transition-colors cursor-pointer"
        >
          {loading ? "Loading...." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Page;
