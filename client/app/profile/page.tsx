"use client";
import { RootState } from '@/lib/store';
import { redirect } from 'next/navigation';
import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
    useLayoutEffect(() => {
      const isAuth = currentUser !== null;
      if(!isAuth){
        redirect("/sign-in")
      }
    }, [])
   
  return (
    <main className="text-center h-screen flex justify-center items-center">
      <div>
        <h1>Profile</h1>        
      </div>
    </main>
  );
};


export default Profile;