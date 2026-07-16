import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Post } from '../../types';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPublishedPosts() {
      try {
        const q = query(
          collection(db, 'posts'),
          where('status', '==', 'published'),
          orderBy('publishedAt', 'desc'),
          limit(20)
        );
        const snapshot = await getDocs(q);
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)));
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPublishedPosts();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading stories...</div>;
  }

  return (
    <div className="space-y-16">
      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No posts published yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="flex flex-col group">
              <Link to={`/post/${post.slug}`} className="block overflow-hidden rounded-xl mb-4 aspect-[4/3] bg-gray-100">
                {post.featureImage ? (
                  <img 
                    src={post.featureImage} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </Link>
              <div className="flex flex-col flex-1">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                  <Link to={`/post/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-gray-600 line-clamp-3 mb-4 flex-1">
                  {post.excerpt || post.content.substring(0, 150) + '...'}
                </p>
                <div className="flex items-center text-sm text-gray-500 mt-auto">
                  <time dateTime={post.publishedAt?.toDate().toISOString()}>
                    {post.publishedAt ? format(post.publishedAt.toDate(), 'MMMM d, yyyy') : ''}
                  </time>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
