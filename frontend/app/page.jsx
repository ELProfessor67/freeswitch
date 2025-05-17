'use client'
import { loginRequest } from '@/http/authHttp';
import { useUser } from '@/providers/UserProvider';
import { registerRequest } from '@/services/SIPService';
import { useRouter } from 'next/navigation';
import React from 'react';

const Page = () => {
  const {user,isAuth,setIsAuth,setUser} = useUser();
  const router = useRouter()
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formdata = new FormData(e.target);

      const username = formdata.get("username");
      const password = formdata.get("password");
      const SIP = formdata.get("SIP");

      await registerRequest(SIP,username,password);

      const res = await loginRequest(formdata);
      setIsAuth(true);
      setUser(res.data.user);
      router.push("/dashboard");
    } catch (error) {
      alert(error.message)
      console.error(error);
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

        <input
          name="SIP"
          required
          placeholder="SIP"
          className="w-full p-3 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Page;
