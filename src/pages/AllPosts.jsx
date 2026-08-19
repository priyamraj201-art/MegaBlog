import React, {useState, useEffect} from 'react'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/config";
import { Link } from 'react-router-dom';

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        appwriteService.getPosts([]).then((res) => {
            if (res) {
                setPosts(res.documents)
            }
        }).finally(() => setLoading(false))
    }, [])

    return (
        <div className="w-full py-8 bg-[#FAF7EE] min-h-[70vh]">
            <Container className="max-w-6xl">
                <div className="mb-8 pb-4 border-b border-[#E0DCD0]">
                    <h1 className="font-display text-4xl sm:text-6xl font-black text-[#121212] uppercase tracking-tight">
                        ALL POSTS
                    </h1>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-[#666359] font-medium">
                        Loading posts...
                    </div>
                ) : posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <div key={post.$id} className="h-full">
                                <PostCard {...post} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-[#F2EFE5] rounded-3xl border border-[#E0DCD0] p-8">
                        <h2 className="text-2xl font-bold text-[#121212] mb-2 uppercase">No Posts Found</h2>
                        <p className="text-[#666359] mb-6 font-medium">There are no posts published by users yet.</p>
                        <Link
                            to="/add-post"
                            className="inline-block bg-[#B5FF00] text-[#121212] font-black text-xs uppercase tracking-wider px-6 py-3 rounded-full hover:opacity-90 transition-all shadow-sm"
                        >
                            Create First Post
                        </Link>
                    </div>
                )}
            </Container>
        </div>
    )
}

export default AllPosts