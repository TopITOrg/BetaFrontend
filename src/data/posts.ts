export interface Post {
    id: number;
    date: string;
    title: string;
    content: string;
    author: string;
    category: 'historical' | 'organizational' | 'achievements';
    color: string;
}

export interface PostsData {
    posts: Post[];
}