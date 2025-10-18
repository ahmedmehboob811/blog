import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createPost } from '../../services/supabaseService';
import Spinner from '../Spinner';
import { Bold, Italic, Code, Link as LinkIcon } from 'lucide-react';

const NewPost: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { user } = useUser();
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const handleFormat = (formatType: 'bold' | 'italic' | 'code' | 'link') => {
        const textarea = textAreaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);

        let markdown;
        let cursorPos = start;

        switch (formatType) {
            case 'bold':
                markdown = `**${selectedText || 'text'}**`;
                cursorPos += 2;
                break;
            case 'italic':
                markdown = `*${selectedText || 'text'}*`;
                cursorPos += 1;
                break;
            case 'code':
                markdown = `\`${selectedText || 'code'}\``;
                cursorPos += 1;
                break;
            case 'link':
                const url = prompt('Enter the URL:', 'https://');
                if (url === null) return; // User canceled
                markdown = `[${selectedText || 'link text'}](${url})`;
                cursorPos += 1;
                break;
        }

        const newContent = content.substring(0, start) + markdown + content.substring(end);
        setContent(newContent);

        // Restore focus and selection
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = selectedText ? start + markdown.length : cursorPos;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim() || !user) return;

        setIsSubmitting(true);
        try {
            const author = { id: user.id, username: user.fullName || 'Anonymous', imageUrl: user.imageUrl };
            const newPost = await createPost(title, content, author);
            navigate(`/post/${newPost.id}`);
        } catch (error) {
            console.error('Failed to create post:', error);
            // Here you would show an error message to the user
        } finally {
            setIsSubmitting(false);
        }
    };

    const ToolbarButton: React.FC<{ onClick: () => void; children: React.ReactNode; 'aria-label': string }> = ({ onClick, children, 'aria-label': ariaLabel }) => (
        <button
            type="button"
            onClick={onClick}
            aria-label={ariaLabel}
            className="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200"
        >
            {children}
        </button>
    );

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">Create a New Post</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Your post title"
                        required
                        className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                    />
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-400 mb-2">Content (Markdown)</label>
                        <div className="absolute top-[28px] left-2 bg-gray-800/80 backdrop-blur-sm p-1 rounded-md border border-gray-700 flex items-center space-x-1 z-10">
                            <ToolbarButton onClick={() => handleFormat('bold')} aria-label="Bold"><Bold className="w-4 h-4" /></ToolbarButton>
                            <ToolbarButton onClick={() => handleFormat('italic')} aria-label="Italic"><Italic className="w-4 h-4" /></ToolbarButton>
                            <ToolbarButton onClick={() => handleFormat('code')} aria-label="Code"><Code className="w-4 h-4" /></ToolbarButton>
                            <ToolbarButton onClick={() => handleFormat('link')} aria-label="Link"><LinkIcon className="w-4 h-4" /></ToolbarButton>
                        </div>
                        <textarea
                            id="content"
                            ref={textAreaRef}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your post content here... Supports Markdown!"
                            required
                            className="w-full h-96 bg-gray-800 border border-gray-700 rounded-md p-3 pt-12 text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Live Preview</label>
                         <div className="w-full h-96 bg-gray-800 border border-gray-700 rounded-md p-3 overflow-y-auto">
                           <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-teal-400 prose-strong:text-white prose-blockquote:text-gray-400 prose-code:text-teal-400 prose-pre:bg-gray-900">
                             <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "Start typing to see a preview..."}</ReactMarkdown>
                           </div>
                         </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button
                        type="submit"
                        disabled={isSubmitting || !title.trim() || !content.trim()}
                        className="flex items-center justify-center w-full md:w-auto px-6 py-3 bg-teal-600 text-white font-semibold rounded-md hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition duration-200"
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner size="sm" />
                                <span className="ml-2">Publishing...</span>
                            </>
                        ) : (
                            'Publish Post'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewPost;