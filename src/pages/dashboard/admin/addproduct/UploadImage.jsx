import axios from 'axios';
import React, { useState } from 'react'
import { getBaseUrl } from '../../../../utils/getBaseUrl';

const UploadImage = ({name, setImage, label, id, value}) => {
    const [loading, setLoading] = useState(false);
    const [url, setUrl] = useState("");

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload= () => {
                resolve(fileReader.result)
            };

            fileReader.onerror = (error) => {
                reject(error)
            }

        })
    };

    const uploadSingleImage = async(base64) => {
        // call api to upload the image to cloudinary server
        setLoading(true)
    
            await axios.post(`${getBaseUrl()}/uploadImage`, {image: base64})
            .then((res) => {
                const imageUrl = res.data;
                setUrl(imageUrl);
                console.log("Image URL:", res.data);
                setImage(imageUrl);
            }).then(() => setLoading(false)).catch((error) => {
                console.error("Failed to upload image", error);
                setLoading(false);
                alert("Failed to upload image, please try again!")
            })
        
    }

    const uploadImage = async (event) => {
        const files = event.target.files;
        
        if(files.length === 1) {
            const base64 = await convertBase64(files[0]); // result
            uploadSingleImage(base64);
            return;
        }

        const base64s = [];
        for(let i = 0; i < files.length; i++) {
            const base = await convertBase64(files[i]);
            base64s.push(base);
        }
    };
  return (
    <div>
         <label htmlFor={name} className='block text-sm font-medium text-gray-600'>{label}</label>
         <input type="file"
         onChange={uploadImage}
         name={name} id={name} className="mt-6 flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1.5 text-sm text-slate-600 transition-all
           file:mr-5 file:rounded-md file:border-0 file:bg-black file:px-4 file:py-1 file:text-sm file:font-medium file:text-white 
           hover:file:bg-gray-600 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600
           disabled:cursor-not-allowed disabled:opacity-50 
           dark:border-slate-700 dark:text-slate-400 dark:file:bg-blue-500 dark:placeholder:text-white/30" />
         {
            loading && (
            <div className='mt-2 text-sm text-blue-600'>
                <p>Uplading...</p>
            </div>)
         }
         {
            url && (
                <div>
                    <p>Image uploaded successfully!</p>
                    <img style={{ width: '450px', height: 'auto' }} src={url} alt="uploaded image" />
                </div>
            )
         }
    </div>
  )
}

export default UploadImage