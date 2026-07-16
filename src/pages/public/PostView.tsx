import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Post } from '../../types';
import { format } from 'date-fns';
import Markdown from 'react-markdown';

export default function PostView() {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      try {
        const q = query(
          collection(db, 'posts'),
          where('slug', '==', slug),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setPost({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Post);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading story...</div>;
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Post not found</h1>
        <Link to="/" className="text-blue-600 hover:underline">Return home</Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-xl text-gray-500 mb-6 font-serif">
            {post.excerpt}
          </p>
        )}
        <div className="flex items-center justify-center text-gray-500 text-sm font-medium">
          <time dateTime={post.publishedAt?.toDate().toISOString()}>
            {post.publishedAt ? format(post.publishedAt.toDate(), 'MMMM d, yyyy') : 'Draft'}
          </time>
        </div>
      </header>

      {post.featureImage && (
        <figure className="mb-16 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <img src={post.featureImage} alt={post.title} className="w-full h-auto aspect-video object-cover" />
        </figure>
      )}

      <div className="prose prose-lg prose-gray max-w-none font-serif leading-relaxed">
        <Markdown>{post.content}</Markdown>
      </div>
    </article>
  );
}
