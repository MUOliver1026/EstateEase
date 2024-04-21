import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import React from 'react'
import { app } from '../firebase';
import { useAppDispatch } from '@/lib/hooks';
import { signInSuccess } from '@/lib/user/userSlice';
import { useRouter } from 'next/navigation'

export default function oauth() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);

            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ name: result.user.displayName, email: result.user.email, photo: result.user.photoURL})
            })
            const data = await res.json()
            dispatch(signInSuccess(data));
            router.push('/');
        } catch (error) {
            console.log('error signing in with Google: ', error);
        }
    }
  return (
    <button onClick={handleGoogleClick} type='button'
    className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
        Continue with Google
    </button>
  )
}
