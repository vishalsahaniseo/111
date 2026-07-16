import { useEffect, useState } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { FileText, Users, Eye } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalPosts: 0, publishedPosts: 0, drafts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const postsRef = collection(db, 'posts');
        const q = query(postsRef);
        const snapshot = await getDocs(q);
        
        let published = 0;
        let drafts = 0;
        
        snapshot.forEach(doc => {
          if (doc.data().status === 'published') published++;
          else drafts++;
        });

        setStats({
          totalPosts: snapshot.size,
          publishedPosts: published,
          drafts: drafts
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Total Posts</h3>
            <FileText className="text-gray-400 w-5 h-5" />
          </div>
          <p className="text-4xl font-semibold">{stats.totalPosts}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Published</h3>
            <Eye className="text-green-500 w-5 h-5" />
          </div>
          <p className="text-4xl font-semibold">{stats.publishedPosts}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Drafts</h3>
            <FileText className="text-amber-500 w-5 h-5" />
          </div>
          <p className="text-4xl font-semibold">{stats.drafts}</p>
        </div>
      </div>
    </div>
  );
}
