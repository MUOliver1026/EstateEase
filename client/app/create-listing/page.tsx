'use client';

import React, { useLayoutEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

export default function page() {
    const router = useRouter();
    const { currentUser, loading, error } = useSelector((state: RootState) => state.user);
    
    useLayoutEffect(() => {
        const isAuth = currentUser !== null;
        if(!isAuth){
          router.push("/sign-in");
        }
      }, [])

    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
    });
    const [imageUploadError, setImageUploadError] = useState('');
    const [uploading, setUploading] = useState(false);
    
    const handleImageSubmit = (e: any) => {
        if (files.length > 0 && files.length + formData.imageUrls.length <= 6) {
            setUploading(true);
            setImageUploadError('');

            const promises = [];

            for (let i=0; i<files.length; i++) {
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises).then((urls: any) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls)});
                setImageUploadError('');
                setUploading(false);
            }).catch((error) => {
                setImageUploadError('Image upload failed (2 mb max per image)');
                setUploading(false);
            });
        } else {
            setImageUploadError('Max 6 images allowed');
            setUploading(false);
        }
    }

    const storeImage = async (file: any) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    // Handle unsuccessful uploads
                    reject(error);
                }, 
                () => {
                    // Handle successful uploads
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handleRemoveImage = (index: number) => () => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)
        })
    }
    return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
        <form className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type='text' placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength={62} minLength={10} required />
                <textarea placeholder='Description' className='border p-3 rounded-lg' id='description' required />
                <input type='text' placeholder='Address' className='border p-3 rounded-lg' id='address' required />
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='sale' className='w-5' />
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='rent' className='w-5' />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='parking' className='w-5' />
                        <span>Parking spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='furnish' className='w-5' />
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='offer' className='w-5' />
                        <span>Offer</span>
                    </div>
                </div>
                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input type='number' className='border p-3 border-gray-300 rounded-lg' id='bedrooms' min={1} max={10} required />
                        <p>Beds</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' className='border p-3 border-gray-300 rounded-lg' id='bathrooms' min={1} max={10} required />
                        <p>Baths</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' className='border p-3 border-gray-300 rounded-lg' id='regularPrice' min={1} max={10} required />
                        <div className='flex flex-col items-center'>
                            <p>Regular Price</p>
                            <span className='text-xs'>($ / Month)</span>
                        </div>
                        
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' className='border p-3 border-gray-300 rounded-lg' id='discountPrice' min={1} max={10} required />
                        <div className='flex flex-col items-center'>
                            <p>Discounted Price</p>
                            <span className='text-xs'>($ / Month)</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-4 flex-1'>
                <p className='font-semibold'>Images:&nbsp;
                    <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                </p>
                <div className='flex gap-4'>
                    <input onChange={(e: any) => setFiles(e.target.files)} className='p-3 border border-gray-300 rounded w-full' type='file' id='images' accept='image/*' multiple />
                    <button type='button' disabled={uploading} onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
                <p className='text-red-700 text-sm'>{imageUploadError && imageUploadError}</p>
                {formData.imageUrls.length > 0 && (
                    formData.imageUrls.map((url: string, index: number) => (
                        <div className='flex justify-between p-3 border items-center'>
                            <img key={index} src={url} alt='listing image' className='w-20 h-20 object-contain rounded-lg' />
                            <button onClick={handleRemoveImage(index)} type='button' className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>Delete</button>
                        </div>
                        
                ))
                )}
                <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
            </div>
        </form>
    </main>
  )
}
