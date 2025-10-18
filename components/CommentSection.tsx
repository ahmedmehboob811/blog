
import React, { useState } from 'react';
import { useUser, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import type { Comment } from '../types';
import { createComment } from '../services/supabaseService';
import { Send, User } from 'lucide-react';
import Spinner from './Spinner';

interface CommentSectionProps {
    comments: Comment[];
    postId: string;
    onCommentAdded: (newComment: Comment) => void;
}

const CommentCard: React.FC<{ comment: Comment }> = ({ comment }) => (
    <div className="flex space-x-4 py-4">
        <img className="h-10 w-10 rounded-full" src={comment.author.imageUrl} alt={comment.author.username} />
        <div className="flex-1">
            <div className="flex items-baseline space-x-2">
                <p className="font-semibold text-white">{comment.author.username}</p>
                <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
            </div>
            <p className="text-gray-300 mt-1">{comment.text}</p>
        </div>
    </div>
);


const CommentSection: React.FC<CommentSectionProps> = ({ comments, postId, onCommentAdded }) => {
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;
        
        setIsSubmitting(true);
        try {
            const author = { id: user.id, username: user.fullName || 'Anonymous', imageUrl: user.imageUrl };
            const addedComment = await createComment(newComment, postId, author);
            onCommentAdded(addedComment);
            setNewComment('');
        } catch (error) {
            console.error("Failed to add comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-12">
            <h3 className="text-2xl font-bold text-white mb-6">Comments ({comments.length})</h3>
            
            <div className="space-y-4 divide-y divide-gray-700">
                {comments.length > 0 ? (
                    comments.map(comment => <CommentCard key={comment.id} comment={comment} />)
                ) : (
                    <p className="text-gray-500 py-4">Be the first to leave a comment.</p>
                )}
            </div>

            <div className="mt-8">
                <SignedIn>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                            rows={3}
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            disabled={isSubmitting}
                        ></textarea>
                        <button
                            type="submit"
                            disabled={isSubmitting || !newComment.trim()}
                            className="mt-3 flex items-center justify-center px-4 py-2 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-200"
                        >
                            {isSubmitting ? <Spinner size="sm" /> : <Send className="w-4 h-4 mr-2" />}
                            Post Comment
                        </button>
                    </form>
                </SignedIn>
                <SignedOut>
                    <div className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                        <p className="text-gray-400 mb-4">You must be signed in to leave a comment.</p>
                        <SignInButton mode="modal">
                           <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                                Sign in
                            </button>
                        </SignInButton>
                    </div>
                </SignedOut>
            </div>
        </div>
    );
};

export default CommentSection;
