import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Define the StoryViewerProps interface
interface StoryViewerProps {
  story: {
    pdfUrl: string;
    title: string;
  };
  onBack: () => void;
}

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

const StoryViewer: React.FC<StoryViewerProps> = ({ story, onBack }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageWidth, setPageWidth] = useState<number>(400);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Adjusts the page width and detect if the screen size is small (mobile)
  useEffect(() => {
    const updatePageWidth = () => {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const maxPageHeight = windowHeight * 0.75;
      const aspectRatio = 1.414;
      setPageWidth(maxPageHeight / aspectRatio);

      // Check if the screen width is below a certain threshold (e.g., 768px for mobile)
      setIsMobile(windowWidth < 768);
    };

    updatePageWidth();
    window.addEventListener('resize', updatePageWidth);

    return () => window.removeEventListener('resize', updatePageWidth);
  }, []);

  const onDocumentLoadSuccess = async (pdf: any) => {
    setNumPages(pdf.numPages);
  };

  const goToPrevPage = () => {
    setPageNumber((prevPage) => Math.max(prevPage - (isMobile ? 1 : 2), 1));
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  const goToNextPage = () => {
    setPageNumber((prevPage) => Math.min(prevPage + (isMobile ? 1 : 2), numPages ?? prevPage));
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  const memoizedPages = useMemo(
    () => (
      <div className="relative flex justify-center">
        {pageNumber === 1 ? (
          <div className="flex flex-col items-center">
            <Page pageNumber={pageNumber} width={pageWidth} />
            <p className="text-sm font-minecraft mt-2">Page {pageNumber}</p>
          </div>
        ) : (
          <div className={`flex ${isMobile ? 'flex-col' : ''}`}>
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
                {!isMobile && numPages !== null && pageNumber + 1 <= numPages && (
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
    [pageNumber, numPages, pageWidth, isMobile]
  );

  return (
    <div className="min-h-screen bg-minecraftGreen text-white p-6">
      <button
        onClick={onBack}
        className="bg-minecraftBrown hover:bg-green-700 text-white font-minecraft p-3 rounded-lg mb-6"
      >
        Back to Stories
      </button>

      <h1 className="text-4xl font-minecraft text-center mb-4">{story.title}</h1>

      <div
        className="bg-white text-black p-4 rounded-lg shadow-lg mb-8 max-h-screen overflow-auto relative"
        ref={containerRef}
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
