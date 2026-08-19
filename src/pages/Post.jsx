import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [bookmarked, setBookmarked] = useState(false);
    const [following, setFollowing] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    const { slug } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const currentUser = userData?.userData || userData;
    const postUserId = post?.userId || post?.userid || post?.user_id || post?.authorId || post?.user;
    const postAuthorName = post?.author || post?.username || post?.authorName || post?.name;
    const isAuthor = post && currentUser ? postUserId === currentUser?.$id : false;

    // Display original author real name
    const rawName = (isAuthor && currentUser?.name)
        ? currentUser.name
        : postAuthorName
        ? postAuthorName
        : (currentUser?.name ? currentUser.name : null);

    const authorHandle = rawName
        ? `@${rawName.toUpperCase().replace(/\s+/g, '_')}`
        : postUserId
        ? `@AUTHOR_${postUserId.substring(0, 6).toUpperCase()}`
        : "@COMMUNITY_USER";

    const authorInitial = rawName
        ? rawName.charAt(0).toUpperCase()
        : "U";

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((postData) => {
                if (postData) setPost(postData);
                else setPost(null);
            });
        }
    }, [slug]);

    const deletePost = () => {
        if (!post) return;
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                const imgId = post.featuredImage || post.featuredimage || post.featured_image || post.image;
                if (imgId) appwriteService.deleteFile(imgId);
                navigate("/");
            }
        });
    };

    const handleLike = () => {
        if (liked) {
            setLikeCount(prev => Math.max(0, prev - 1));
            setLiked(false);
        } else {
            setLikeCount(prev => prev + 1);
            setLiked(true);
        }
    };

    const handleAddComment = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const commentObj = {
            id: Date.now(),
            author: currentUser?.name ? `@${currentUser.name.toUpperCase().replace(/\s+/g, '_')}` : "@GUEST_USER",
            time: "Just now",
            avatarBg: "bg-[#121212] text-[#B5FF00]",
            text: newComment.trim()
        };

        setComments([commentObj, ...comments]);
        setNewComment("");
    };

    const displayTitle = post?.title || "UNTITLED POST";
    const imageId = post?.featuredImage || post?.featuredimage || post?.featured_image || post?.image;
    const imageUrl = imageId ? appwriteService.getFilePreview(imageId) : null;

    return (
        <div className="py-8 bg-[#FAF7EE] min-h-screen">
            <Container className="max-w-4xl">
                {/* Author Header Bar */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#E8E4D8]">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#121212] flex items-center justify-center font-bold text-base bg-[#B5FF00] text-[#121212]">
                            {authorInitial}
                        </div>
                        <div>
                            <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#121212]">
                                {authorHandle}
                            </div>
                            <div className="text-[11px] font-semibold text-[#88857B] tracking-wide">
                                Active Author
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {isAuthor && (
                            <div className="flex items-center gap-2">
                                <Link to={`/edit-post/${post.$id}`}>
                                    <button className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border border-[#121212] bg-[#121212] text-[#B5FF00] hover:bg-black transition-colors">
                                        Edit
                                    </button>
                                </Link>
                                <button
                                    onClick={deletePost}
                                    className="text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full border border-red-600 bg-red-600 text-white hover:bg-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => setFollowing(!following)}
                            className={`text-xs font-black uppercase tracking-wider px-6 py-2 rounded-full transition-all duration-200 shadow-sm ${
                                following
                                    ? "bg-[#121212] text-[#B5FF00]"
                                    : "bg-[#B5FF00] hover:bg-[#a3e600] text-[#121212]"
                            }`}
                        >
                            {following ? "FOLLOWING" : "FOLLOW"}
                        </button>
                    </div>
                </div>

                {/* Hero Title */}
                <div className="relative mb-8 pt-2">
                    <h1 className="font-display text-5xl sm:text-7xl font-black text-[#121212] uppercase tracking-tighter leading-tight max-w-3xl">
                        {displayTitle}
                    </h1>
                </div>

                {/* Featured Image Card Frame */}
                {imageUrl && (
                    <div className="w-full bg-[#F2EFE5] border border-[#E0DCD0] rounded-3xl p-4 sm:p-6 mb-10 shadow-sm">
                        <div className="w-full rounded-2xl overflow-hidden bg-[#E5E1D4] max-h-[550px] flex items-center justify-center">
                            <img
                                src={imageUrl}
                                alt={displayTitle}
                                className="w-full h-auto max-h-[550px] object-contain"
                            />
                        </div>
                    </div>
                )}

                {/* Article Body Content */}
                <article className="space-y-6 text-[#1A1A1A] font-sans text-base sm:text-lg leading-relaxed max-w-3xl">
                    {post?.content && (
                        <div className="browser-css">
                            {parse(post.content)}
                        </div>
                    )}
                </article>

                {/* Social Stats & Action Bar */}
                <div className="my-10 py-3 border-y border-[#E0DCD0] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#121212]">
                    <div className="flex items-center gap-3">
                        {/* Likes Pill */}
                        <button
                            onClick={handleLike}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border border-[#D5D1C4] transition-all ${
                                liked
                                    ? "bg-[#121212] text-[#B5FF00] border-[#121212]"
                                    : "bg-[#FAF7EE] hover:bg-[#F2EFE5] text-[#121212]"
                            }`}
                        >
                            <svg className="w-4 h-4" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span>{likeCount}</span>
                        </button>

                        {/* Comments Count Pill */}
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#D5D1C4] bg-[#FAF7EE]">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>{comments.length}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Share */}
                        <button className="p-2.5 rounded-full border border-[#D5D1C4] hover:bg-[#F2EFE5] text-[#121212] transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-2.684 3 3 0 000 2.684zm0 9a3 3 0 100-2.684 3 3 0 000 2.684z" />
                            </svg>
                        </button>

                        {/* Bookmark */}
                        <button
                            onClick={() => setBookmarked(!bookmarked)}
                            className={`p-2.5 rounded-full border border-[#D5D1C4] transition-all ${
                                bookmarked
                                    ? "bg-[#121212] text-[#B5FF00] border-[#121212]"
                                    : "hover:bg-[#F2EFE5] text-[#121212]"
                            }`}
                        >
                            <svg className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* JOIN THE CONVERSATION (Comments Section) */}
                <section className="mt-12">
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="font-display text-3xl sm:text-4xl font-black text-[#121212] uppercase tracking-tight shrink-0">
                            JOIN THE CONVERSATION
                        </h2>
                        <div className="h-[1px] bg-[#E0DCD0] w-full" />
                    </div>

                    {/* New Comment Input Card */}
                    <form onSubmit={handleAddComment} className="mb-8">
                        <div className="bg-[#F5F1E6] border border-[#E0DCD0] rounded-2xl p-4 focus-within:border-[#121212] transition-colors">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Drop your thoughts..."
                                rows="3"
                                className="w-full bg-transparent text-[#121212] placeholder-[#999488] text-sm focus:outline-none resize-none font-sans"
                            />
                            <div className="flex justify-end pt-2 border-t border-[#E5E1D4]">
                                <button
                                    type="submit"
                                    className="bg-[#B5FF00] hover:bg-[#a3e600] text-[#121212] font-black text-xs uppercase tracking-wider px-6 py-2 rounded-full transition-all shadow-sm"
                                >
                                    POST COMMENT
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Comments Feed */}
                    <div className="space-y-4">
                        {comments.map((item, idx) => (
                            <div
                                key={item.id}
                                className={`rounded-2xl p-4 sm:p-5 transition-all ${
                                    idx === 1
                                        ? "bg-[#FAF7EE] border border-dashed border-[#DCD8CB] ml-4 sm:ml-8"
                                        : "bg-[#F2EFE5] border border-[#E0DCD0]"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-7 h-7 rounded-full ${item.avatarBg} font-mono font-bold text-[10px] flex items-center justify-center`}>
                                            {item.author.charAt(1)}
                                        </div>
                                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#121212]">
                                            {item.author}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-semibold uppercase text-[#88857B] tracking-wider">
                                        {item.time}
                                    </span>
                                </div>
                                <p className="text-sm text-[#2D2B26] leading-relaxed mb-3">
                                    {item.text}
                                </p>
                                <button className="text-[10px] font-black uppercase tracking-widest text-[#121212] hover:text-[#B5FF00] transition-colors">
                                    REPLY
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </Container>
        </div>
    );
}
