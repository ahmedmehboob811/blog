
import React from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../types';
import { MessageSquare, Calendar } from 'lucide-react';

interface PostCardProps {
    post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const snippet = post.content.substring(0, 150) + (post.content.length > 150 ? '...' : '');

    return (
        <article className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
            <div className="p-6">
                <div className="flex items-center mb-4">
                    <img className="h-10 w-10 rounded-full object-cover mr-4" src={post.author.imageUrl} alt={post.author.username} />
                    <div>
                        <p className="text-sm font-medium text-white">{post.author.username}</p>
                         <p className="text-xs text-gray-400 flex items-center">
                            <Calendar className="w-3 h-3 mr-1.5" />
                            {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                    <Link to={`/post/${post.id}`} className="hover:text-teal-400 transition-colors duration-200">
                        {post.title}
                    </Link>
                </h2>
                <p className="text-gray-400 mb-4">{snippet}</p>
                <Link
                    to={`/post/${post.id}`}
                    className="inline-flex items-center font-semibold text-teal-500 hover:text-teal-400 transition-colors duration-200"
                >
                    Read more &rarr;
                </Link>
            </div>
        </article>
    );
};

export default PostCard;
