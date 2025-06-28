import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export function PDFViewer({ url }: { url: string }) {
  return (
    <div className='h-[600px] overflow-auto border rounded-lg'>
      <Document file={url}>
        <Page pageNumber={1} />
        {/* You can add multiple pages, zoom, etc. */}
      </Document>
    </div>
  );
}
