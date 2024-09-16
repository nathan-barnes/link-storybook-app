import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Story } from '../types/Story';

// Set the worker source for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

interface StoryViewerProps {
  story: Story;
  onBack: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ story, onBack }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageWidth, setPageWidth] = useState<number>(400); // Default width

  // Adjust page width based on screen height
  useEffect(() => {
    const updatePageWidth = () => {
      const windowHeight = window.innerHeight;
      const maxPageHeight = windowHeight * 0.75; // Leave some space for controls
      const aspectRatio = 1.414; // PDF pages typically have a 1.414 aspect ratio (A4 size)
      setPageWidth(maxPageHeight / aspectRatio);
    };

    updatePageWidth();
    window.addEventListener('resize', updatePageWidth);

    return () => window.removeEventListener('resize', updatePageWidth);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () => setPageNumber(prevPage => Math.max(prevPage - 2, 1));
  const goToNextPage = () => setPageNumber(prevPage => Math.min(prevPage + 2, numPages || prevPage));

  return (
    <div className="min-h-screen bg-minecraftGreen text-white p-6">
      <button
        onClick={onBack}
        className="bg-minecraftBrown hover:bg-green-700 text-white font-minecraft p-3 rounded-lg mb-6"
      >
        Back to Stories
      </button>

      <h1 className="text-4xl font-minecraft text-center mb-4">{story.title}</h1>

      <div className="bg-white text-black p-4 rounded-lg shadow-lg mb-8 max-h-screen overflow-auto">
        <Document file={story.pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
          <div className="flex justify-center">
            <Page pageNumber={pageNumber} width={pageWidth} />
            {pageNumber + 1 <= numPages && (
              <Page pageNumber={pageNumber + 1} width={pageWidth} />
            )}
          </div>
        </Document>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={goToPrevPage}
            className="bg-minecraftBrown hover:bg-green-700 text-white font-minecraft p-3 rounded-lg"
          >
            Previous Pages
          </button>
          <p className="text-xl font-minecraft">
            Page {pageNumber} of {numPages}
          </p>
          <button
            onClick={goToNextPage}
            className="bg-minecraftBrown hover:bg-green-700 text-white font-minecraft p-3 rounded-lg"
          >
            Next Pages
          </button>
        </div>
      </div>

      {story.audioUrl && (
        <div className="bg-minecraftBrown p-4 rounded-lg shadow-lg text-center">
          <h3 className="text-2xl font-minecraft text-white mb-4">Listen to the Story</h3>
          <audio controls className="w-full">
            <source src={story.audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default StoryViewer;
