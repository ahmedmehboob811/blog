
import React, { useState, useEffect, useCallback } from 'react';
import { getPosts } from '../../services/supabaseService';
import type { Post } from '../../types';
import PostCard from '../PostCard';
import Spinner from '../Spinner';
import { Search } from 'lucide-react';

const Home: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getPosts(searchTerm);
            setPosts(data);
        } catch (err) {
            setError('Failed to fetch posts. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchPosts();
        }, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [fetchPosts]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white">The AI-Powered Blog</h1>
                <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
                    Explore articles on modern web development, and see the power of AI with instant summaries.
                </p>
            </div>
            
            <div className="mb-8 max-w-lg mx-auto">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-full text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                       <Search className="h-5 w-5 text-gray-500" />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner size="lg" />
                </div>
            ) : error ? (
                <div className="text-center text-red-500 bg-red-900/20 p-4 rounded-md">{error}</div>
            ) : posts.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 py-16">
                    <h2 className="text-2xl font-semibold">No posts found</h2>
                    <p className="mt-2">Try adjusting your search or check back later.</p>
                </div>
            )}
        </div>
    );
};

export default Home;
