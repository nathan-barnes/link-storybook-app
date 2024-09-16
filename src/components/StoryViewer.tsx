import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Story } from '../types/Story';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

const StoryViewer: React.FC<StoryViewerProps> = ({ story, onBack }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageWidth, setPageWidth] = useState<number>(400);
  const containerRef = useRef<HTMLDivElement>(null); // Reference to the container

  // Adjust page width dynamically based on screen height
  useEffect(() => {
    const updatePageWidth = () => {
      const windowHeight = window.innerHeight;
      const maxPageHeight = windowHeight * 0.75;
      const aspectRatio = 1.414;
      setPageWidth(maxPageHeight / aspectRatio);
    };

    updatePageWidth();
    window.addEventListener('resize', updatePageWidth);

    return () => window.removeEventListener('resize', updatePageWidth);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // Preserve scroll position when navigating between pages
  const preserveScroll = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0; // Reset to top
    }
  };

  const goToPrevPage = () => {
    setPageNumber((prevPage) => Math.max(prevPage - 2, 1));
    preserveScroll();
  };

  const goToNextPage = () => {
    setPageNumber((prevPage) => Math.min(prevPage + 2, numPages ?? prevPage));
    preserveScroll();
  };

  // Memoize the pages to avoid re-renders
  const memoizedPages = useMemo(
    () => (
      <div className="relative flex justify-center">
        {pageNumber === 1 ? (
          <div className="flex flex-col items-center">
            <Page pageNumber={pageNumber} width={pageWidth} />
            <p className="text-sm font-minecraft mt-2">Page {pageNumber}</p>
          </div>
        ) : (
          <div className="flex">
            {pageNumber === numPages ? (
              <div className="flex flex-col items-center">
                <Page pageNumber={pageNumber} width={pageWidth} />
                <p className="text-sm font-minecraft mt-2">Page {pageNumber}</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col items-center">
                  <Page pageNumber={pageNumber} width={pageWidth} />
                  <p className="text-sm font-minecraft mt-2">Page {pageNumber}</p>
                </div>
                {numPages !== null && pageNumber + 1 <= numPages && (
                  <div className="flex flex-col items-center">
                    <Page pageNumber={pageNumber + 1} width={pageWidth} />
                    <p className="text-sm font-minecraft mt-2">Page {pageNumber + 1}</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    ),
    [pageNumber, numPages, pageWidth]
  );

  return (
    <div className="min-h-screen bg-minecraftGreen text-white p-6">
      <button
        onClick={onBack}
        className="bg-minecraftBrown hover:bg-green-700 text-white font-minecraft p-3 rounded-lg mb-6"
      >
        Back to Stories
      </button>

      {/* <h1 className="text-4xl font-minecraft text-center mb-4">{story.title}</h1> */}

      <div
        className="bg-white text-black p-4 rounded-lg shadow-lg mb-8 max-h-screen overflow-auto relative"
        ref={containerRef} // Assign the ref to the container
      >
        <Document file={story.pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
          {memoizedPages}
        </Document>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={goToPrevPage}
            className="bg-minecraftBrown hover:bg-green-700 text-white font-minecraft p-3 rounded-lg"
          >
            Previous Pages
          </button>
          <p className="text-xl font-minecraft">
            Page {pageNumber} of {numPages ?? 'Unknown'}
          </p>
          <button
            onClick={goToNextPage}
            className="bg-minecraftBrown hover:bg-green-700 text-white font-minecraft p-3 rounded-lg"
          >
            Next Pages
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
