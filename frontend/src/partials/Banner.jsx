import React, { useState } from 'react';

function Banner() {

  const [bannerOpen, setBannerOpen] = useState(true);

  return (
    <>
    { bannerOpen && (
      <div className="fixed bottom-0 right-0 w-full md:bottom-8 md:right-12 md:w-auto z-50">
        <div className="bg-gray-800 border border-transparent dark:border-gray-700/60 text-gray-50 text-sm p-3 md:rounded-sm shadow-lg flex justify-between items-center">
          <span className="text-gray-200">Operations dashboard</span>
          <button className="text-gray-500 hover:text-gray-400 pl-2 ml-3 border-l border-gray-700/60" onClick={() => setBannerOpen(false) }>
            <span className="sr-only">Close</span>
            <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 16 16">
              <path d="M12.72 3.293a1 1 0 00-1.415 0L8.012 6.586 4.72 3.293a1 1 0 00-1.414 1.414L6.598 8l-3.293 3.293a1 1 0 101.414 1.414l3.293-3.293 3.293 3.293a1 1 0 001.414-1.414L9.426 8l3.293-3.293a1 1 0 000-1.414z" />
            </svg>
          </button>
        </div>
      </div>
    )}
    </>
  );
}

export default Banner;