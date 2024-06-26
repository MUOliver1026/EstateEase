'use client'

import Link from 'next/link'
import {FaSearch} from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { RootState } from '../../lib/store'
import Image from 'next/image'

export default function header() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link href='/'>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
          <span className='text-slate-500'>Estate</span>
          <span className='text-slate-700'>Ease</span>
        </h1>
        </Link>
      <form className='bg-slate-100 p-3 rounded-lg flex items-center'>
        <input type='text' placeholder='Search...' 
        className='bg-transparent focus:outline-none w-24 sm:w-64' />
        <FaSearch className='text-slate-600' />
      </form>
      <ul className='flex gap-4'>
        <Link href='/'>
        <li 
          className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
        </Link>
        <Link href='/about'>
        <li 
          className='hidden sm:inline text-slate-700 hover:underline'>About</li>
        </Link>
        <Link href={currentUser ? '/profile' : 'sign-in'}>
          {currentUser ? (
            <Image 
              className='rounded-full h-7 w-7 object-cover'
              width={50} 
              height={50} 
              src={currentUser.avatar} 
              alt='profile' 
            />
          ) : (
            <li className='text-slate-700 hover:underline'>Sign in</li>
          )}
        </Link>
      </ul>
      </div>
    </header>
  )
}
