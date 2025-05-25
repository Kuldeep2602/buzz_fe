


import React, { useEffect, useState } from 'react';

interface CardProps {
  title: string;
  link: string;
  type: "twitter" | "youtube";
  contentId?: string;
  onDelete?: (contentId: string) => void;
  isDeleting?: boolean;
}




import { ShareIcon } from "../icons/ShareIcon";
import { DeleteIcon } from "../icons/DeleteIcon";
import { BACKEND_URL } from "../config";

const Card: React.FC<CardProps> = ({ title, link, type, contentId, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // const [embedHtml, setEmbedHtml] = useState<string | null>(null);
  const [embedHtml /* , setEmbedHtml */] = useState("");

  const [error, setError] = useState<string | null>(null);

 
  // Check if link is an embed code
  const isEmbedCode = link.includes('<blockquote') || link.includes('</blockquote>');

  // Helper to generate proper YouTube embed URL
  const getYouTubeEmbedUrl = (url: string): string | null => {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
        if (u.pathname.startsWith("/shorts/")) {
          const id = u.pathname.split("/shorts/")[1];
          return `https://www.youtube.com/embed/${id}`;
        }

        if (u.searchParams.has("v")) {
          return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
        }

        if (u.hostname === "youtu.be") {
          return `https://www.youtube.com/embed${u.pathname}`;
        }
      }
      return null;
    } catch {
      return null;
    }
  };

  // Helper to detect if URL is a Twitter/X URL
  const isTwitterUrl = (url: string): boolean => {
    try {
      const u = new URL(url);
      return u.hostname.includes('twitter.com') || u.hostname.includes('x.com');
    } catch {
      return false;
    }
  };

  // Process YouTube URLs only if type is explicitly YouTube
  const embedSrc = type === "youtube" ? getYouTubeEmbedUrl(link) : null;
  
  // Get the tweet URL from either direct link or embed code
  const getTweetUrl = () => {
    if (isEmbedCode) {
      // Try to find the tweet URL in the embed code
      const urlMatch = link.match(/href="(https:\/\/(?:twitter|x)\.com\/[^"]+\/status\/[^"?]+)/);
      return urlMatch ? urlMatch[1] : link;
    }
    // Convert x.com to twitter.com for better compatibility
    return link.replace('x.com', 'twitter.com');
  };

  const tweetUrl = getTweetUrl();

  // Load Twitter widget script
  useEffect(() => {
    // If URL is a Twitter URL, treat it as Twitter regardless of specified type
    const shouldHandleAsTwitter = type === "twitter" || isTwitterUrl(link);
    
    if (!shouldHandleAsTwitter) return;
    
    // Check if script is already loaded
    if (!document.getElementById('twitter-widget')) {
      try {
        const script = document.createElement('script');
        script.id = 'twitter-widget';
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.charset = 'utf-8';
        
        // Setup onload handler before appending to document
        script.onload = () => {
          // Initialize widgets
          if (window.twttr) {
            window.twttr.widgets.load();
            setTimeout(() => setIsLoading(false), 800); // Give widgets time to load
          } else {
            setError("Twitter widgets API not available");
            setIsLoading(false);
          }
        };
        
        // Setup error handler
        script.onerror = () => {
          setError("Failed to load Twitter script");
          setIsLoading(false);
        };
        
        document.body.appendChild(script);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError("Error loading Twitter script");
        setIsLoading(false);
      }
    } else {
      // If script already exists, just load widgets
      if (window.twttr) {
        window.twttr.widgets.load();
        setTimeout(() => setIsLoading(false), 800); // Give widgets time to load
      } else {
        setError("Twitter widgets API not available");
        setIsLoading(false);
      }
    }
  }, [link]);

  // Determine actual content type based on URL
  const actualType = isTwitterUrl(link) ? "twitter" : type;

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!contentId || isDeleting) return;
    
    setIsDeleting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${BACKEND_URL}/api/v1/content`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({ contentId })
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Delete failed: ${response.status} ${errorData}`);
      }
      
      // Call the onDelete callback if provided
      if (onDelete && contentId) {
        onDelete(contentId);
      }
    } catch (err) {
      console.error('Error deleting content:', err);
      // You might want to show an error toast/notification here
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 w-72 h-80 overflow-hidden flex flex-col transition-shadow duration-200 hover:shadow-md">
      <div className="px-4 py-3 flex justify-between items-center border-b border-gray-50">
        <div className="flex items-center text-md">
          {contentId && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1 rounded-full hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Delete card"
              title="Delete"
            >
              {isDeleting ? (
                <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <DeleteIcon className="h-4 w-4" />
              )}
            </button>
          )}
          <span className="truncate">{title}</span>
        </div>

        <div className="flex items-center">
          <div className="pr-2 text-gray-500">
            <a 
              href={actualType === "twitter" ? tweetUrl : link} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {/* Replace with your imported ShareIcon component */}
             
              <ShareIcon />
            </a>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex-grow relative">
        {/* Twitter Content */}
        {isTwitterUrl(link) && (
          <div className="w-full h-full flex items-center justify-center p-2">
            {isLoading && (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded">
                <div className="flex flex-col items-center">
                  <svg className="animate-spin h-6 w-6 text-blue-400 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="text-sm text-gray-500">Loading tweet</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="w-full h-full p-4 bg-red-50 rounded flex flex-col items-center justify-center">
                <p className="text-red-500 font-medium mb-2">Unable to load tweet</p>
                <p className="text-sm text-gray-500">Please check the URL and try again</p>
              </div>
            )}
            
            {embedHtml ? (
              <div className="w-full h-full overflow-hidden" dangerouslySetInnerHTML={{ __html: embedHtml }} />
            ) : (
              <div className="w-full h-full overflow-hidden">
                <blockquote 
                  className="twitter-tweet" 
                  data-dnt="true"
                  data-theme="light"
                  data-align="center"
                >
                  <a 
                    href={tweetUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    View Tweet
                  </a>
                </blockquote>
              </div>
            )}
          </div>
        )}

        {/* YouTube Content */}
        {actualType === "youtube" && !isTwitterUrl(link) && (
          <div className="w-full h-full">
            {embedSrc ? (
              <iframe
                className="w-full h-full"
                src={embedSrc}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded">
                <div className="flex flex-col items-center text-center p-4">
                  <svg className="w-10 h-10 text-gray-300 mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                  </svg>
                  <p className="text-gray-500 font-medium">Invalid YouTube URL</p>
                  <p className="text-xs text-gray-400 mt-1">Please check the link and try again</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Add TypeScript interface for Twitter widgets
declare global {
  interface Window {
    twttr: {
      widgets: {
        load: () => void;
        createTweet: (
          tweetId: string, 
          element: HTMLElement, 
          options?: object
        ) => Promise<HTMLElement | null>;
      };
    };
  }
}

export default Card;