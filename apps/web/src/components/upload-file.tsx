'use client';

import { useState } from 'react';

export function UploadFile() {
  const [file, setFile] = useState<File>();
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const uploadFile = async () => {
    try {
      if (!file) {
        alert('No file selected');
        return;
      }

      setUploading(true);
      const data = new FormData();
      data.set('file', file);
      const uploadRequest = await fetch('/api/files', {
        method: 'POST',
        body: data,
      });
      const signedUrl = await uploadRequest.json();
      console.log('signed url ipfs', signedUrl);
      setUrl(signedUrl);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert('Trouble uploading file');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target?.files?.[0]);
  };

  return (
    <section className='w-full flex flex-col justify-center items-center'>
      <input type='file' onChange={handleChange} />
      <button
        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md cursor-pointer'
        type='button'
        disabled={uploading}
        onClick={uploadFile}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </section>
  );
}
