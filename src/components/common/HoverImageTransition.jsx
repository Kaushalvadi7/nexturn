import React from 'react';

/**
 * HoverImageTransition
 * transitions a monochrome/line-art image into a full-color image.
 * 
 * @param {string} lineArt - Path to the monochrome/line-art image
 * @param {string} colorImage - Path to the full-color image
 * @param {string} alt - Alt text for the images
 */
const HoverImageTransition = ({ lineArt, colorImage, alt = "Product Image" }) => {
  return (
    <div className="relative w-full h-full overflow-hidden group rounded-2xl cursor-pointer">
      {/* Container for the scaling effect */}
      <div className="w-full h-full transition-transform duration-[400ms] ease-out group-hover:scale-105">
        
        {/* Full Color Image (The Base Layer) */}
        <img
          src={colorImage}
          alt={`${alt} Colored`}
          className="absolute inset-0 w-full h-full object-contain p-4 md:p-8 z-10"
        />

        {/* Monochrome / Line-Art Image (The Top Layer) */}
        <img
          src={lineArt}
          alt={`${alt} Line Art`}
          className="absolute inset-0 w-full h-full object-contain p-4 md:p-8 z-20 transition-opacity duration-[400ms] ease-out opacity-100 group-hover:opacity-0 bg-black"
        />
        
      </div>
      
      {/* Decorative Border Overlay */}
      <div className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none z-30 group-hover:border-orange-500/30 transition-colors duration-400" />
    </div>
  );
};

export default HoverImageTransition;
