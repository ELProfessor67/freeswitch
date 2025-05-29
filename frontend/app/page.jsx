'use client'
import { loginRequest } from '@/http/authHttp';
import { useUser } from '@/providers/UserProvider';
import { registerRequest } from '@/services/SIPService';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import {  toast } from 'react-toastify';

const Page = () => {
  const [loading,setLoading] = useState(false);
  const {user,isAuth,setIsAuth,setUser} = useUser();
  const router = useRouter();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formdata = new FormData(e.target);

      const username = formdata.get("username");
      const password = formdata.get("password");
      const SIP = `sip:${username}@161.35.57.104`;
      formdata.append("SIP",SIP);

      await registerRequest(SIP,username,password);

      const res = await loginRequest(formdata);
      setIsAuth(true);
      setUser(res.data.user);
      if(res.data.user?.role == "ADMIN"){
        router.push("/admin");
      }else{
        router.push("/dashboard");
      }

      toast.success("Login Successfully")
    } catch (error) {
      toast.error("Login UnSuccessfully")
      console.error(error);
    }finally{
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

        <input
          name="username"
          required
          placeholder="Username"
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* <input
          name="SIP"
          required
          placeholder="SIP"
          className="w-full p-3 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        /> */}

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 rounded hover:bg-orange-600 transition-colors"
        >
          {loading ? "Loading....": "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Page;
