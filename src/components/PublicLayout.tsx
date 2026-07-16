import { Outlet, Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export function PublicLayout() {
  const [settings, setSettings] = useState({ siteTitle: 'Ghost Clone', siteDescription: 'A headless CMS clone', coverImage: '' });
  const location = useLocation();

  useEffect(() => {
    async function fetchSettings() {
      try {
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as any);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchSettings();
  }, []);

  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col">
      <header className="w-full relative">
        {isHome && settings.coverImage ? (
          <div className="absolute inset-0 z-0 h-[400px]">
            <img src={settings.coverImage} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ) : null}
        
        <div className={`relative z-10 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full ${isHome && settings.coverImage ? 'h-[400px] flex flex-col justify-center text-white' : 'border-b border-gray-100'}`}>
          <nav className="absolute top-8 left-4 right-4 sm:left-6 sm:right-6 lg:left-8 lg:right-8 flex justify-between items-center max-w-5xl mx-auto">
            <Link to="/" className={`text-2xl font-bold tracking-tight transition-opacity hover:opacity-80 ${isHome && settings.coverImage ? 'text-white' : 'text-black'}`}>
              {settings.siteTitle}
            </Link>
          </nav>
          
          {isHome && (
            <div className="mt-12 text-center">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">{settings.siteTitle}</h1>
              <p className={`text-xl ${settings.coverImage ? 'text-gray-200' : 'text-gray-500'}`}>{settings.siteDescription}</p>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10 bg-white rounded-t-3xl -mt-8 sm:-mt-12">
        <Outlet />
      </main>

      <footer className="border-t border-gray-100 py-12 mt-12 text-center text-gray-500 text-sm">
        <div className="max-w-5xl mx-auto px-4">
          &copy; {new Date().getFullYear()} {settings.siteTitle}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
