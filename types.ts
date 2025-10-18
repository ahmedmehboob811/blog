
export interface User {
    id: string;
    username: string;
    imageUrl: string;
}

export interface Post {
    id: string;
    title: string;
    content: string;
    author: User;
    createdAt: string;
}

export interface Comment {
    id: string;
    text: string;
    author: User;
    postId: string;
    createdAt: string;
}
