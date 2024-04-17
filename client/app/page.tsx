'use client';

import { RootState } from '@/lib/store';
import { redirect } from 'next/navigation';
import { useLayoutEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Home() {
  const { currentUser } = useSelector((state: RootState) => state.user);
    useLayoutEffect(() => {
      const isAuth = currentUser !== null;
      if(!isAuth){
        redirect("/sign-in")
      }
    }, [])
  return (
    <h1 className="">
      Home
    </h1>
  )
}