"use client";
import { RootState } from '@/lib/store';
import { redirect } from 'next/navigation';
import { useLayoutEffect, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRef } from 'react';
import Image from 'next/image';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

const Profile = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [file, setFile] = useState<File | null>(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({ avatar: null });
  const UploadStatus = {
    ERROR: 'Error uploading image (image must be less than 2MB)',
    UPLOADING: 'Uploading',
  };

    useLayoutEffect(() => {
      const isAuth = currentUser !== null;
      if(!isAuth){
        redirect("/sign-in")
      }
    }, [])
   
    // firebase storage
    // allow read;
    //   allow write: if 
    //   request.resource.size < 2 * 1024 * 1024 && 
    //   request.resource.contentType.matches('image/.*');

    useEffect(() => {
      if (file) {
        handleFileUpload(file);
      }
    }, [file])

    const handleFileUpload = async (file: any) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred /
          snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress))
      },

      (error) => {
        setFileUploadError(true)
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL })
        });
      }
    );
    }
  return (
      <div className='p-3 max-w-lg mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
        <form className='flex flex-col gap-4'>
        <input 
          onChange={(e) => {
            const files = e.target.files;
            if(files && files.length > 0){
              setFile(files[0]);
            }
          }} 
          type='file' 
          ref={fileRef} 
          hidden 
          accept='image/*' 
        />
          <Image 
            onClick={() => fileRef.current?.click()} 
            src={formData?.avatar || currentUser?.avatar} 
            alt="profile" 
            width={200} 
            height={200} 
            className="rounded-full self-center h-24 w-24 object-cover cursor-pointer mt-2" 
          />
          <p className='text-sm self-center'>
            {fileUploadError
              ? <span className="text-red-700">{UploadStatus.ERROR}</span>
              : filePerc === 100
              ? <span className="text-green-700">Image successfully uploaded!</span>
              : filePerc > 0
              ? <span className="text-green-700">{`${UploadStatus.UPLOADING} ${filePerc}%`}</span>
              : <span></span>
            }
          </p>
          <input type='text' placeholder='username' className='border p-3 rounded-lg' id='username' />
          <input type='email' placeholder='email' className='border p-3 rounded-lg' id='email' />
          <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password' />
          <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>uodate</button>
        </form>
        <div className='flex justify-between mt-5'>
          <span className='text-red-700 cursor-pointer'>Delete Account</span>
          <span className='text-red-700 cursor-pointer'>Sign Out</span>
        </div>
      </div>
  );
};


export default Profile;