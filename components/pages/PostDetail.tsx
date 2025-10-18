import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPostById, getCommentsByPostId } from '../../services/supabaseService';
import { generateSummary } from '../../services/geminiService';
import type { Post, Comment } from '../../types';
import Spinner from '../Spinner';
import CommentSection from '../CommentSection';
import { Calendar, User, BrainCircuit } from 'lucide-react';

const PostDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const [loadingSummary, setLoadingSummary] = useState(false);

    useEffect(() => {
        const fetchPostAndComments = async () => {
            if (!id) return;
            setLoading(true);
            setError(null);
            try {
                const postData = await getPostById(id);
                if (!postData) {
                    setError('Post not found.');
                    return;
                }
                setPost(postData);
                const commentsData = await getCommentsByPostId(id);
                setComments(commentsData);
            } catch (err) {
                setError('Failed to fetch post details.');
            } finally {
                setLoading(false);
            }
        };
        fetchPostAndComments();
    }, [id]);

    const handleGenerateSummary = async () => {
        if (!post) return;
        setLoadingSummary(true);
        const result = await generateSummary(post.content);
        setSummary(result);
        setLoadingSummary(false);
    };

    const handleCommentAdded = (newComment: Comment) => {
        setComments(prevComments => [...prevComments, newComment]);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner size="lg" /></div>;
    }

    if (error) {
        return <div className="text-center text-red-500 bg-red-900/20 p-4 rounded-md">{error}</div>;
    }

    if (!post) {
        return <div className="text-center text-gray-500">Post not found.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto">
            <article>
                <header className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4">{post.title}</h1>
                    <div className="flex items-center space-x-6 text-gray-400 text-sm">
                        <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>{post.author.username}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </header>

                <div className="my-8">
                    {!summary && (
                        <button
                            onClick={handleGenerateSummary}
                            disabled={loadingSummary}
                            className="flex items-center justify-center w-full px-6 py-3 bg-gray-800 border-2 border-dashed border-gray-600 text-teal-400 font-semibold rounded-md hover:border-teal-500 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-wait transition duration-200"
                        >
                            {loadingSummary ? (
                                <>
                                    <Spinner size="sm" />
                                    <span className="ml-3">Generating Summary...</span>
                                </>
                            ) : (
                                <>
                                    <BrainCircuit className="w-5 h-5 mr-3" />
                                    Generate AI Summary
                                </>
                            )}
                        </button>
                    )}

                    {summary && (
                         <div className="bg-gray-800/50 border border-teal-500/30 rounded-lg p-6">
                            <h3 className="flex items-center text-xl font-bold text-teal-400 mb-3">
                               <BrainCircuit className="w-6 h-6 mr-3" />
                                AI-Generated Summary
                            </h3>
                            {/* FIX: The `className` prop is not supported on `ReactMarkdown`. Wrap it in a div to apply styles. */}
                            <div className="prose prose-invert prose-sm max-w-none prose-p:text-gray-300">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {summary}
                                </ReactMarkdown>
                            </div>
                         </div>
                    )}
                </div>

                <div className="prose prose-invert lg:prose-xl max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-teal-400 prose-strong:text-white prose-blockquote:text-gray-400 prose-code:text-teal-400 prose-pre:bg-gray-800">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
                </div>
            </article>

            <CommentSection comments={comments} postId={post.id} onCommentAdded={handleCommentAdded} />
        </div>
    );
};

export default PostDetail;