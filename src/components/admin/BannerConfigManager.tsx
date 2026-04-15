"use client";

import { useState, useEffect } from "react";
import { adminAPI, API_BASE } from "@/services/api";
import { 
  Save, 
  Loader, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  Layout,
  Type,
  MousePointer2,
  BadgeInfo,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BannerConfig {
  title: string;
  subtitle: string;
  typingWords: string[];
  description: string;
  buttons: {
    label: string;
    variant: string;
    href: string;
  }[];
  images: {
    icon: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
    banner: {
      src: string;
      alt: string;
      width: number;
      height: number;
    };
  };
  badge: {
    text: string;
  };
}

export default function BannerConfigManager() {
  const [config, setConfig] = useState<BannerConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getBannerConfig() as any;
      if (response.success) {
        setConfig(response.data);
      }
    } catch (err) {
      setError("Failed to load banner configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const response = await adminAPI.updateBannerConfig(config) as any;
      if (response.success) {
        setSuccess("Banner configuration saved successfully!");
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError("Failed to save banner configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (type: 'icon' | 'banner', file: File) => {
    try {
      setSaving(true);
      const response = await adminAPI.uploadLocationImage(file) as any;
      if (response.success && config) {
        const newConfig = { ...config };
        if (type === 'icon') {
          newConfig.images.icon.src = response.data.url;
        } else {
          newConfig.images.banner.src = response.data.url;
        }
        setConfig(newConfig);
      }
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setSaving(false);
    }
  };

  const addTypingWord = () => {
    if (config) {
      setConfig({
        ...config,
        typingWords: [...config.typingWords, ""]
      });
    }
  };

  const updateTypingWord = (index: number, value: string) => {
    if (config) {
      const newWords = [...config.typingWords];
      newWords[index] = value;
      setConfig({ ...config, typingWords: newWords });
    }
  };

  const removeTypingWord = (index: number) => {
    if (config) {
      setConfig({
        ...config,
        typingWords: config.typingWords.filter((_, i) => i !== index)
      });
    }
  };

  const addButton = () => {
    if (config) {
      setConfig({
        ...config,
        buttons: [...config.buttons, { label: "New Button", variant: "primary", href: "/" }]
      });
    }
  };

  const updateButton = (index: number, field: string, value: string) => {
    if (config) {
      const newButtons = [...config.buttons];
      newButtons[index] = { ...newButtons[index], [field]: value };
      setConfig({ ...config, buttons: newButtons });
    }
  };

  const removeButton = (index: number) => {
    if (config) {
      setConfig({
        ...config,
        buttons: config.buttons.filter((_, i) => i !== index)
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader className="animate-spin text-amber-500" size={40} />
      </div>
    );
  }

  if (!config) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Banner Configuration</h2>
          <p className="text-gray-400">Manage your homepage hero section content</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold px-8"
        >
          {saving ? <Loader className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
          Save Changes
        </Button>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl text-green-400 font-medium">
          {success}
        </div>
      )}
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Content */}
        <Card className="bg-gray-900/40 border-gray-800 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="text-amber-500" size={20} />
              Main Content
            </CardTitle>
            <CardDescription className="text-gray-500">Titles, descriptions and typography</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Main Title</label>
              <Input 
                value={config.title} 
                onChange={(e) => setConfig({ ...config, title: e.target.value })}
                className="bg-gray-800/50 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Subtitle Prefix</label>
              <Input 
                value={config.subtitle} 
                onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                className="bg-gray-800/50 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Description</label>
              <Textarea 
                value={config.description} 
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                className="bg-gray-800/50 border-gray-700 text-white min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Typing Words */}
        <Card className="bg-gray-900/40 border-gray-800 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="text-blue-500" size={20} />
              Typing Animation Words
            </CardTitle>
            <CardDescription className="text-gray-500">Words that appear in the rotating animation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {config.typingWords.map((word, idx) => (
              <div key={idx} className="flex gap-2">
                <Input 
                  value={word} 
                  onChange={(e) => updateTypingWord(idx, e.target.value)}
                  className="bg-gray-800/50 border-gray-700 text-white"
                />
                <Button variant="destructive" size="icon" onClick={() => removeTypingWord(idx)}>
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addTypingWord} className="w-full border-dashed border-gray-700 hover:bg-gray-800 hover:text-white mt-4">
              <Plus className="mr-2" size={18} /> Add Word
            </Button>
          </CardContent>
        </Card>

        {/* CTA Buttons */}
        <Card className="bg-gray-900/40 border-gray-800 text-white lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer2 className="text-green-500" size={20} />
              Call to Action Buttons
            </CardTitle>
            <CardDescription className="text-gray-500">Button labels, variants and links</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {config.buttons.map((btn, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-gray-800/30 border border-gray-700/50 space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black uppercase text-gray-500 tracking-widest">Button {idx + 1}</span>
                    <Button variant="ghost" size="icon" onClick={() => removeButton(idx)} className="h-8 w-8 text-gray-500 hover:text-red-500">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Label</label>
                      <Input 
                        value={btn.label} 
                        onChange={(e) => updateButton(idx, 'label', e.target.value)}
                        className="bg-gray-900/50 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Href</label>
                      <Input 
                        value={btn.href} 
                        onChange={(e) => updateButton(idx, 'href', e.target.value)}
                        className="bg-gray-900/50 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Variant</label>
                    <div className="flex gap-2">
                      {['primary', 'outline'].map((v) => (
                        <button
                          key={v}
                          onClick={() => updateButton(idx, 'variant', v)}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                            btn.variant === v ? 'bg-amber-500 text-gray-950' : 'bg-gray-800 text-gray-500 border border-gray-700'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" onClick={addButton} className="w-full border-dashed border-gray-700 hover:bg-gray-800 hover:text-white mt-4">
              <Plus className="mr-2" size={18} /> Add Button
            </Button>
          </CardContent>
        </Card>

        {/* Visual Assets */}
        <Card className="bg-gray-900/40 border-gray-800 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="text-purple-500" size={20} />
              Visual Assets
            </CardTitle>
            <CardDescription className="text-gray-500">Icons and Banner images</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Icon Asset */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-300">Small Icon Asset</label>
                <span className="text-[10px] font-bold text-gray-500">Suggested: 100x100 SVG/PNG</span>
              </div>
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 bg-gray-800 rounded-xl border border-gray-700 flex items-center justify-center overflow-hidden shrink-0">
                    <img 
                      src={config.images.icon.src.startsWith('http') ? config.images.icon.src : `${API_BASE}${config.images.icon.src}`} 
                      alt="Icon Preview" 
                      className="max-w-full max-h-full object-contain"
                    />
                 </div>
                 <div className="flex-1 space-y-3">
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => e.target.files && handleImageUpload('icon', e.target.files[0])}
                      className="bg-gray-800/50 border-gray-700 text-xs"
                    />
                    <p className="text-xs text-gray-500">Upload a small logo or icon to appear in the text section.</p>
                 </div>
              </div>
            </div>

            <Separator className="bg-gray-800" />

            {/* Banner Asset */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-300">Main Banner Asset</label>
                <span className="text-[10px] font-bold text-gray-500">Suggested: 1440x1200 PNG</span>
              </div>
              <div className="space-y-4">
                 <div className="w-full h-48 bg-gray-800 rounded-2xl border border-gray-700 flex items-center justify-center overflow-hidden">
                    <img 
                      src={config.images.banner.src.startsWith('http') ? config.images.banner.src : `${API_BASE}${config.images.banner.src}`} 
                      alt="Banner Preview" 
                      className="w-full h-full object-cover"
                    />
                 </div>
                 <div className="space-y-3">
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => e.target.files && handleImageUpload('banner', e.target.files[0])}
                      className="bg-gray-800/50 border-gray-700"
                    />
                    <p className="text-xs text-gray-500">Upload the high-fidelity render for the right-hand hero section.</p>
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Global Branding */}
        <Card className="bg-gray-900/40 border-gray-800 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BadgeInfo className="text-pink-500" size={20} />
              Branding Extras
            </CardTitle>
            <CardDescription className="text-gray-500">Badges and floating content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">Floating Badge Text</label>
              <Input 
                value={config.badge.text} 
                onChange={(e) => setConfig({ ...config, badge: { text: e.target.value } })}
                className="bg-gray-800/50 border-gray-700 text-white"
              />
            </div>
            
            <Separator className="bg-gray-800 my-6" />
            
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
               <div className="flex gap-3">
                  <BadgeInfo className="text-amber-500 shrink-0" size={24} />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-amber-500">Pro Tip</h4>
                    <p className="text-xs text-gray-400">Keep your banner title concise and use strong, punchy action words in the typing animation to drive engagement.</p>
                  </div>
               </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Link href="/" target="_blank" className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors">
                View Changes in Real-time <ExternalLink size={14} />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
