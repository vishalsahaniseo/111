import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft, Save, Settings as SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PostEditor() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featureImage, setFeatureImage] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [loading, setLoading] = useState(postId ? true : false);
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        const docRef = doc(db, 'posts', postId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || '');
          setContent(data.content || '');
          setSlug(data.slug || '');
          setExcerpt(data.excerpt || '');
          setFeatureImage(data.featureImage || '');
          setStatus(data.status || 'draft');
        }
        setLoading(false);
      };
      fetchPost();
    }
  }, [postId]);

  // Auto-generate slug from title if slug is empty
  useEffect(() => {
    if (!postId && !slug && title) {
      setSlug(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
    }
  }, [title, postId, slug]);

  const handleSave = async (publish: boolean = false) => {
    if (!title) return alert('Title is required');
    setSaving(true);
    
    const postData = {
      title,
      content,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      excerpt,
      featureImage,
      status: publish ? 'published' : status,
      authorId: user?.uid,
      updatedAt: serverTimestamp(),
      ...(publish && status !== 'published' ? { publishedAt: serverTimestamp() } : {})
    };

    try {
      if (postId) {
        await updateDoc(doc(db, 'posts', postId), postData);
      } else {
        const newPostRef = doc(collection(db, 'posts'));
        await setDoc(newPostRef, {
          ...postData,
          createdAt: serverTimestamp(),
        });
        navigate(`/ghost/editor/${newPostRef.id}`, { replace: true });
      }
      if (publish) setStatus('published');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading editor...</div>;

  return (
    <div className="flex h-full bg-white relative">
      <div className={`flex-1 flex flex-col transition-all ${showSettings ? 'mr-80' : ''}`}>
        {/* Header */}
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Link to="/ghost/posts" className="text-gray-400 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="text-sm text-gray-500 font-medium">
              {status === 'published' ? 'Published' : 'Draft'}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="text-gray-600 hover:text-black font-medium text-sm px-3 py-2 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving || status === 'published'}
              className="bg-black text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:bg-gray-400"
            >
              Publish
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-400 hover:text-black rounded-lg hover:bg-gray-100 transition-colors"
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
          <input
            type="text"
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-5xl font-bold border-none outline-none placeholder-gray-300 mb-8 bg-transparent"
          />
          <textarea
            placeholder="Begin writing your post (Markdown supported)..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[500px] text-lg text-gray-800 border-none outline-none resize-none placeholder-gray-300 bg-transparent font-serif leading-relaxed"
          />
        </div>
      </div>

      {/* Settings Sidebar */}
      {showSettings && (
        <div className="w-80 border-l border-gray-200 bg-gray-50 h-full fixed right-0 top-0 pt-16 overflow-y-auto">
          <div className="p-6 space-y-6">
            <h3 className="font-semibold text-lg">Post Settings</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Post URL</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-black focus:ring-black outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-black focus:ring-black outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Feature Image URL</label>
              <input
                type="text"
                value={featureImage}
                onChange={(e) => setFeatureImage(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-black focus:ring-black outline-none"
                placeholder="https://..."
              />
              {featureImage && (
                <img src={featureImage} alt="Feature preview" className="mt-2 w-full h-32 object-cover rounded-md" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
