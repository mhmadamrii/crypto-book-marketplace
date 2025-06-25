import { UploadFile } from '@/components/upload-file';

export default function Publish() {
  return (
    <main className='h-screen flex flex-col items-center justify-center'>
      <div className='text-lg font-bold'>
        <h1>Publish your crypto book here!</h1>
      </div>
      <UploadFile />
    </main>
  );
}
