import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, ExternalLink, X } from 'lucide-react';

const VideoCard = ({ video, index }) => {
  const [showEmbed, setShowEmbed] = useState(false);
  
  const handleVideoClick = () => {
    // Use video URL directly if available, otherwise construct
    let finalUrl = video.url;
    
    if (!finalUrl) {
      const videoId = video.videoId || 'KJgsSFOSQv0';
      const timeline = video.startTime || 0;
      finalUrl = timeline > 0 
        ? `https://www.youtube.com/watch?v=${videoId}&t=${timeline}`
        : `https://www.youtube.com/watch?v=${videoId}`;
    }
    
    console.log(`🎥 Opening: ${finalUrl}`);
    window.open(finalUrl, '_blank');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02 }}
        className="bg-white/10 rounded-lg overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer"
        onClick={handleVideoClick}
      >
      <div className="relative">
        <img
          src={video.thumbnail || `https://img.youtube.com/vi/${video.videoId || 'KJgsSFOSQv0'}/maxresdefault.jpg`}
          alt={video.title}
          className="w-full h-32 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=Programming+Tutorial';
          }}
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Play className="w-8 h-8 text-white" />
        </div>
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {video.duration || 'N/A'}
        </div>
        {video.viewCount && (
          <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {parseInt(video.viewCount).toLocaleString()} views
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2">
          {video.title}
        </h3>
        <p className="text-blue-200 text-xs mb-3">{video.channel}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-blue-300 text-xs">
            {video.embedUrl && video.embedUrl.includes('embed') ? 'Click to play' : 'Click to watch'}
          </span>
          <ExternalLink className="w-4 h-4 text-blue-300" />
        </div>
      </div>
      </motion.div>
      
      {/* Embedded Video Modal */}
      {showEmbed && video.embedUrl && video.embedUrl.includes('embed') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowEmbed(false)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 bg-gray-100">
              <h3 className="font-semibold text-gray-800 truncate">{video.title}</h3>
              <button
                onClick={() => setShowEmbed(false)}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="aspect-video">
              <iframe
                src={video.embedUrl}
                title={video.title}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-4 bg-gray-50">
              <p className="text-sm text-gray-600">{video.channel}</p>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-2"
              >
                Watch on YouTube <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
      

    </>
  );
};

export default VideoCard;
