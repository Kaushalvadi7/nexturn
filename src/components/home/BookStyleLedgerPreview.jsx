import React, { useEffect, useState, useRef, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./BookStyleLedgerPreview.css";

// Set PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const FlipBook = HTMLFlipBook;

const BookStyleLedgerPreview = ({ 
    isModal = false, 
    pdfUrl = "/api/download-leads/file?asset=company_profile" 
}) => {
    const flipBookRef = useRef(null);
    const [numPages, setNumPages] = useState(null);
    const [bookDimensions, setBookDimensions] = useState({ width: 500, height: 700 });
    
    // Defaulting to true for visual theme consistency
    const isDarkTheme = true;

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [loadError, setLoadError] = useState(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setLoadError(null);
    };

    const onDocumentLoadError = (error) => {
        console.error("PDF load error:", error);
        setLoadError(`Failed to load PDF (${pdfUrl}). Please check the file path.`);
    };

    const calculateBookDimensions = useCallback(() => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const isMobileView = viewportWidth < 768;
        
        // Modal container dimensions - give more space on mobile
        const containerWidth = isModal ? (isMobileView ? viewportWidth * 0.95 : viewportWidth * 0.98) : viewportWidth;
        const containerHeight = isModal ? viewportHeight * 0.95 : viewportHeight;

        // Use the precise A4 aspect ratio (1.414) to prevent content being cut
        const a4Ratio = 1.414;
        
        // Target width: single page if mobile, half container if desktop
        // Subtract more padding on desktop for the double-page spread
        const targetWidth = isMobileView 
            ? Math.min(viewportWidth - 32, 500) // Single page on mobile
            : Math.min(900, containerWidth / 2 - 60); // Double page on desktop

        const targetHeight = targetWidth * a4Ratio; 

        // Enforce max height constraints
        const verticalPadding = isMobileView ? 120 : 80;
        const maxHeight = containerHeight - verticalPadding;
        
        let finalWidth = targetWidth;
        let finalHeight = targetHeight;

        if (finalHeight > maxHeight) {
            finalHeight = maxHeight;
            finalWidth = finalHeight / a4Ratio;
        }

        return {
            width: Math.max(280, finalWidth),
            height: Math.max(400, finalHeight)
        };
    }, [isModal]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            setBookDimensions(calculateBookDimensions());
        };
        window.addEventListener('resize', handleResize);
        handleResize(); // Initial
        return () => window.removeEventListener('resize', handleResize);
    }, [calculateBookDimensions]);

    return (
        <section className={isModal ? "p-4 pb-8 bg-transparent flex flex-col items-center justify-center min-h-screen overflow-hidden" : "py-20 bg-white overflow-hidden flex flex-col items-center min-h-screen"}>
            {!isModal && (
                <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold text-zinc-900 mb-6 uppercase tracking-tighter">Company Profile</h2>
                    <p className="text-zinc-600 max-w-2xl mx-auto font-mono text-xs uppercase tracking-widest">
                        Interactive digital showcase of Nexturn's legacy and capabilities
                    </p>
                </div>
            )}

            <div className={`book-calendar-page relative group/book ${isDarkTheme ? 'dark-theme' : ''}`} style={{ minHeight: isModal ? 'auto' : 'auto', padding: isModal ? '0' : '' }}>
                {bookDimensions.width > 0 && (
                  <div className="relative flex items-center justify-center">
                    {/* Navigation Buttons */}
                    {numPages && (
                      <>
                        <button 
                          onClick={() => flipBookRef.current?.pageFlip().flipPrev()}
                          className="absolute -left-4 sm:-left-16 lg:-left-24 z-[60] w-12 h-12 rounded-full bg-primary/20 hover:bg-primary border border-white/20 text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all active:scale-90 cursor-pointer pointer-events-auto"
                          aria-label="Previous page"
                        >
                          <span className="material-symbols-outlined font-black">chevron_left</span>
                        </button>
                        <button 
                          onClick={() => flipBookRef.current?.pageFlip().flipNext()}
                          className="absolute -right-4 sm:-right-16 lg:-right-24 z-[60] w-12 h-12 rounded-full bg-primary/20 hover:bg-primary border border-white/20 text-white flex items-center justify-center shadow-2xl backdrop-blur-md transition-all active:scale-90 cursor-pointer pointer-events-auto"
                          aria-label="Next page"
                        >
                          <span className="material-symbols-outlined font-black">chevron_right</span>
                        </button>
                      </>
                    )}

                    <Document
                        file={pdfUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={
                            <div className="flex flex-col items-center justify-center space-y-4 py-20">
                                <div className="w-10 h-10 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
                                <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Preparing Profile...</p>
                            </div>
                        }
                        className="flex flex-col items-center"
                    >
                        {loadError && (
                            <div className="text-red-500 font-mono text-sm p-10 bg-red-50 rounded-xl">
                                {loadError}
                            </div>
                        )}
                        
                        {numPages && (
                            <FlipBook
                                ref={flipBookRef}
                                width={bookDimensions.width}
                                height={bookDimensions.height}
                                showCover={true}
                                mobileScrollSupport={true}
                                className="flipbook"
                                flippingTime={800}
                                useMouseEvents={true}
                                clickEventForward={true}
                                swipeDistance={30}
                                showPageCorners={true}
                                startPage={0}
                                size="fixed"
                                maxShadowOpacity={0.6}
                                usePortrait={isMobile}
                                autoSize={true}
                                drawShadow={true}
                                minWidth={isMobile ? 280 : 300}
                                maxWidth={isMobile ? 500 : 1000}
                                minHeight={isMobile ? 400 : 400}
                                maxHeight={isMobile ? 800 : 1200}
                            >
                                {/* PDF PAGES */}
                                {Array.from(new Array(numPages), (el, index) => (
                                    <div className="page bg-white border-zinc-800" key={`page_${index + 1}`}>
                                        <Page 
                                            pageNumber={index + 1} 
                                            width={bookDimensions.width}
                                            renderTextLayer={false}
                                            renderAnnotationLayer={false}
                                            className="pdf-page-container"
                                        />
                                        <div className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-zinc-400 opacity-30 font-mono">
                                            {index + 1} / {numPages}
                                        </div>
                                    </div>
                                ))}
                            </FlipBook>
                        )}
                    </Document>
                  </div>
                )}
            </div>
        </section>
    );
};

export default BookStyleLedgerPreview;
