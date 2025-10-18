
import type { Post, Comment, User } from '../types';

// --- MOCK DATA ---
const users: User[] = [
    { id: 'user_1', username: 'Jane Doe', imageUrl: 'https://i.pravatar.cc/150?u=user_1' },
    { id: 'user_2', username: 'John Smith', imageUrl: 'https://i.pravatar.cc/150?u=user_2' },
    { id: 'user_3', username: 'AI Enthusiast', imageUrl: 'https://i.pravatar.cc/150?u=user_3' },
];

let posts: Post[] = [
    {
        id: '1',
        title: 'Exploring the Frontiers of React 18',
        content: `React 18 introduced a new era of concurrent rendering, fundamentally changing how we build user interfaces. This post dives deep into the new features like Automatic Batching, `+"`startTransition`"+`, and the `+"`useDeferredValue`"+` hook.\n\n## Concurrent Features\n\nConcurrency is not a feature itself. It's a new behind-the-scenes mechanism that enables React to prepare multiple versions of your UI at the same time. You can think of it as an implementation detail — it's valuable because of the features that it unlocks.\n\n### Automatic Batching\n\nReact 18 features automatic batching. This means that multiple state updates inside of promises, timeouts, or native event handlers will be batched together into a single re-render. This improves performance out of the box.\n\n`+"```javascript\n// Before: two re-renders\nfetchData().then(() => {\n  setCount(c => c + 1);\n  setLoading(false);\n});\n\n// After: one re-render\nfetchData().then(() => {\n  setCount(c => c + 1);\n  setLoading(false);\n});\n```"+`\n\n## Conclusion\n\nReact 18 is a massive step forward for the library. By embracing concurrency, it allows developers to build more responsive and fluid applications without complex state management.`,
        author: users[0],
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: '2',
        title: 'A Guide to Modern CSS with Tailwind',
        content: `Tailwind CSS has taken the web development world by storm. It's a utility-first CSS framework that allows for rapid UI development without ever leaving your HTML.\n\n### Why Utility-First?\n\nThe main benefit is that you're not wasting energy inventing class names. You're not context-switching between HTML and CSS files. Everything is right there, in your markup.\n\n*   **Rapid Prototyping:** Build complex designs quickly.\n*   **Maintainability:** Styles are co-located with the markup, making them easier to manage.\n*   **Highly Customizable:** You can configure every aspect of the framework.\n\nHere is an example of a styled button:\n\n`+"`<button class=\"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded\">\n  Button\n</button>`"+``,
        author: users[1],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
];

let comments: Comment[] = [
    { id: 'c1', text: 'Great overview of React 18! Concurrency is a game-changer.', author: users[1], postId: '1', createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
    { id: 'c2', text: 'I love using Tailwind for my projects. It speeds up my workflow so much.', author: users[0], postId: '2', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'c3', text: 'Thanks for the clear explanation of automatic batching!', author: users[2], postId: '1', createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() },
];

const simulateDelay = <T,>(data: T): Promise<T> => 
    new Promise(resolve => setTimeout(() => resolve(data), 500));

// --- MOCK API ---

export const getPosts = async (searchTerm?: string): Promise<Post[]> => {
    let filteredPosts = posts;
    if (searchTerm && searchTerm.trim() !== '') {
        const lowercasedTerm = searchTerm.toLowerCase();
        filteredPosts = posts.filter(
            post =>
                post.title.toLowerCase().includes(lowercasedTerm) ||
                post.content.toLowerCase().includes(lowercasedTerm)
        );
    }
    return simulateDelay([...filteredPosts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
};

export const getPostById = async (id: string): Promise<Post | undefined> => {
    const post = posts.find(p => p.id === id);
    return simulateDelay(post);
};

export const createPost = async (title: string, content: string, author: User): Promise<Post> => {
    const newPost: Post = {
        id: String(Date.now()),
        title,
        content,
        author,
        createdAt: new Date().toISOString(),
    };
    posts = [newPost, ...posts];
    return simulateDelay(newPost);
};

export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
    const postComments = comments.filter(c => c.postId === postId);
    return simulateDelay([...postComments].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
};

export const createComment = async (text: string, postId: string, author: User): Promise<Comment> => {
    const newComment: Comment = {
        id: 'c' + Date.now(),
        text,
        postId,
        author,
        createdAt: new Date().toISOString(),
    };
    comments = [...comments, newComment];
    return simulateDelay(newComment);
};
