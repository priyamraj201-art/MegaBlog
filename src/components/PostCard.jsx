import React from 'react'
import appwriteService from "../appwrite/config"
import {Link} from 'react-router-dom'

function PostCard({ $id, title, featuredImage, featuredimage, featured_image, image, userId, userid, user_id, authorId, user, username, authorName, category = "POST", date = "RECENT", author }) {
  const imageId = featuredImage || featuredimage || featured_image || image;
  const imageUrl = imageId ? appwriteService.getFilePreview(imageId) : null;
  const postUserId = userId || userid || user_id || authorId || user;
  const postAuthor = author || username || authorName;

  const displayAuthor = postAuthor
    ? `@${postAuthor.toUpperCase().replace(/\s+/g, '_')}`
    : postUserId
    ? `@AUTHOR_${postUserId.substring(0, 6).toUpperCase()}`
    : "@CREATOR";

  return (
    <Link to={`/post/${$id}`} className="block group">
      <div className="w-full bg-[#F2EFE5] hover:bg-[#ECE8DC] border border-[#E2DFD4] rounded-2xl p-4 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between h-full">
        <div>
          {/* Card Image Container */}
          <div className="w-full aspect-[4/3] relative mb-4 rounded-xl overflow-hidden bg-[#E6E2D5]">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#999488] font-display text-xl uppercase tracking-widest">
                MEGABLOG
              </div>
            )}
            
            {/* Category Tag Pill */}
            <span className="absolute top-3 left-3 bg-[#B5FF00] text-[#121212] font-black text-[10px] tracking-widest uppercase px-3 py-1 rounded-full shadow-sm">
              {category}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-display text-2xl sm:text-3xl font-black text-[#121212] uppercase tracking-tight leading-none group-hover:text-[#000000] transition-colors mb-3 line-clamp-2">
            {title}
          </h2>
        </div>

        {/* Metadata */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E2DFD4] text-[11px] font-bold uppercase tracking-wider text-[#777368]">
          <span>{displayAuthor}</span>
          <span>{date}</span>
        </div>
      </div>
    </Link>
  )
}


export default PostCard