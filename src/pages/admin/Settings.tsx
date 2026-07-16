import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Settings as SettingsType } from '../../types';
import { Save } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState<SettingsType>({
    siteTitle: '',
    siteDescription: '',
    coverImage: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const docRef = doc(db, 'settings', 'general');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as SettingsType);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'general'), settings);
      alert('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Settings</h1>

      <form onSubmit={handleSave} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Site Title</label>
          <input
            type="text"
            required
            value={settings.siteTitle}
            onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
            className="w-full max-w-md border border-gray-300 rounded-md px-4 py-2 focus:border-black focus:ring-black outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Site Description</label>
          <textarea
            required
            rows={3}
            value={settings.siteDescription}
            onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
            className="w-full max-w-lg border border-gray-300 rounded-md px-4 py-2 focus:border-black focus:ring-black outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
          <input
            type="text"
            value={settings.coverImage}
            onChange={(e) => setSettings({ ...settings, coverImage: e.target.value })}
            className="w-full max-w-lg border border-gray-300 rounded-md px-4 py-2 focus:border-black focus:ring-black outline-none"
            placeholder="https://..."
          />
          {settings.coverImage && (
            <img src={settings.coverImage} alt="Cover preview" className="mt-4 w-full max-w-lg h-48 object-cover rounded-lg border border-gray-200" />
          )}
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="bg-black text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
