"use client";

import { useState, useEffect } from "react";
import { adminAPI, API_BASE } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit2,
  Loader,
  AlertCircle,
  CheckCircle,
  Save,
  Image as ImageIcon,
  Link as LinkIcon,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface NavbarSubMenuItem {
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  href: string;
  icon: string;
}

interface NavbarMenuItem {
  type: 'link' | 'dropdown';
  titleEn: string;
  titleBn: string;
  href?: string;
  items?: NavbarSubMenuItem[];
}

interface NavbarConfig {
  logoTextEn: string;
  logoTextBn: string;
  logoImage?: string;
  favicon?: string;
  menu: NavbarMenuItem[];
  isActive: boolean;
}

export default function NavbarConfigManager() {
  const [config, setConfig] = useState<NavbarConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedFavicon, setSelectedFavicon] = useState<File | null>(null);
  const [faviconPreviewUrl, setFaviconPreviewUrl] = useState<string>("");

  const [editingMenu, setEditingMenu] = useState<{ index: number; data: NavbarMenuItem } | null>(null);
  const [showMenuModal, setShowMenuModal] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = (await adminAPI.getNavbarConfig()) as any;
      if (response.success) {
        setConfig(response.data);
        if (response.data.logoImage) {
          setPreviewUrl(response.data.logoImage.startsWith('http') ? response.data.logoImage : `${API_BASE}${response.data.logoImage}`);
        }
        if (response.data.favicon) {
          setFaviconPreviewUrl(response.data.favicon.startsWith('http') ? response.data.favicon : `${API_BASE}${response.data.favicon}`);
        }
      } else setError(response.message || "Failed to load configuration");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFavicon(file);
      const url = URL.createObjectURL(file);
      setFaviconPreviewUrl(url);
    }
  };

  const handleSaveConfig = async () => {
    if (!config) return;
    try {
      setSaving(true);
      setError("");

      let payload: any;
      if (selectedFile || selectedFavicon) {
        const formData = new FormData();
        if (selectedFile) formData.append("logo", selectedFile);
        if (selectedFavicon) formData.append("favicon", selectedFavicon);
        formData.append("config", JSON.stringify(config));
        payload = formData;
      } else {
        payload = config;
      }

      const response = (await adminAPI.updateNavbarConfig(payload)) as any;
      if (response.success) {
        setSuccess("Navbar configuration saved successfully");
        setConfig(response.data);
        setSelectedFile(null);
        setSelectedFavicon(null);
        if (response.data.logoImage) {
          setPreviewUrl(response.data.logoImage.startsWith('http') ? response.data.logoImage : `${API_BASE}${response.data.logoImage}`);
        }
        if (response.data.favicon) {
          setFaviconPreviewUrl(response.data.favicon.startsWith('http') ? response.data.favicon : `${API_BASE}${response.data.favicon}`);
        }
        setTimeout(() => setSuccess(""), 3000);
      } else setError(response.message || "Failed to save configuration");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader className="animate-spin text-amber-500 mr-3" size={24} />
        <span className="text-gray-400 font-medium">Loading configuration...</span>
      </div>
    );
  }

  if (!config) return null;

  return (
    <div className="space-y-8 pb-20">
      {/* Toast Notifications */}
      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-8 right-8 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 border ${error
                ? "bg-red-500/10 border-red-500/20 text-red-500"
                : "bg-amber-500/10 border-amber-500/20 text-amber-500"
              } backdrop-blur-md`}
          >
            {error ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
            <span className="text-sm font-semibold">{error || success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Branding Section */}
        <div className="xl:col-span-1 space-y-6">
          <Card className="bg-gray-900 border-white/5">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <ImageIcon size={18} className="text-amber-500" />
                Branding
              </CardTitle>
              <CardDescription>Manage your website logo and brand text.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Site Logo */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Site Logo</label>
                <div className="relative group">
                  <div className="w-full aspect-video bg-black/40 rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 overflow-hidden hover:border-amber-500/30 transition-colors">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Logo" className="max-h-16 object-contain" />
                    ) : (
                      <div className="text-center">
                        <Plus size={24} className="mx-auto text-gray-600 mb-2" />
                        <p className="text-xs text-gray-500">Upload Logo Image</p>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Favicon */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Favicon</label>
                <p className="text-[11px] text-gray-500">Recommended: .ico, .png or .svg (32×32 px)</p>
                <div className="relative group">
                  <div className="w-full h-24 bg-black/40 rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2 overflow-hidden hover:border-amber-500/30 transition-colors">
                    {faviconPreviewUrl ? (
                      <img src={faviconPreviewUrl} alt="Favicon" className="h-10 w-10 object-contain" />
                    ) : (
                      <div className="text-center">
                        <Plus size={20} className="mx-auto text-gray-600 mb-1" />
                        <p className="text-xs text-gray-500">Upload Favicon</p>
                      </div>
                    )}
                    <input type="file" accept="image/*,.ico" onChange={handleFaviconChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Logo Text (English)</label>
                  <Input
                    value={config.logoTextEn}
                    onChange={(e) => setConfig({ ...config, logoTextEn: e.target.value })}
                    className="bg-black/20 border-white/5 text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Logo Text (Bangla)</label>
                  <Input
                    value={config.logoTextBn}
                    onChange={(e) => setConfig({ ...config, logoTextBn: e.target.value })}
                    className="bg-black/20 border-white/5 text-white"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button
                onClick={handleSaveConfig}
                className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold"
                disabled={saving}
              >
                {saving ? <Loader className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
                Save Branding
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Menu Sections */}
        <div className="xl:col-span-2 space-y-6">
          <Card className="bg-gray-900 border-white/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-white">Navigation Menu</CardTitle>
                <CardDescription>Configure dynamic links and mega-menu dropdowns.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setEditingMenu(null); setShowMenuModal(true); }}
                className="border-white/10 text-white hover:bg-white/5"
              >
                <Plus size={16} className="mr-2" /> Add Menu Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.menu.map((item, idx) => (
                  <div key={idx} className="p-5 bg-white/5 rounded-xl border border-white/5 hover:border-amber-500/20 transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${item.type === 'dropdown' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                          {item.type === 'dropdown' ? <Layers size={18} /> : <LinkIcon size={18} />}
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-lg leading-tight">{item.titleEn}</h4>
                          <p className="text-xs text-gray-500 font-medium">{item.titleBn}</p>
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setEditingMenu({ index: idx, data: item }); setShowMenuModal(true); }}
                          className="h-8 w-8 text-gray-400 hover:text-white"
                        >
                          <Edit2 size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (confirm("Are you sure?")) {
                              setConfig({ ...config, menu: config.menu.filter((_, i) => i !== idx) });
                            }
                          }}
                          className="h-8 w-8 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    
                    {item.type === 'link' ? (
                      <div className="flex items-center gap-2 text-xs text-gray-500 bg-black/20 p-2 rounded-md border border-white/5">
                        <LinkIcon size={12} className="text-amber-500" />
                        <span className="truncate">{item.href}</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {item.items?.length ? (
                          item.items.map((sub, sidx) => (
                            <span key={sidx} className="px-2 py-1 bg-black/40 text-[10px] font-bold text-gray-400 rounded-md border border-white/5">
                              {sub.nameEn}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] italic text-gray-600">No items added yet</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Menu Modal */}
      <AnimatePresence>
        {showMenuModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMenuModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-4xl bg-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <MenuEntryForm
                item={editingMenu?.data || null}
                onSave={(item) => {
                  if (editingMenu !== null) {
                    const updated = [...config.menu];
                    updated[editingMenu.index] = item;
                    setConfig({ ...config, menu: updated });
                  } else {
                    setConfig({ ...config, menu: [...config.menu, item] });
                  }
                  setShowMenuModal(false);
                }}
                onCancel={() => setShowMenuModal(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuEntryForm({ item, onSave, onCancel }: { item: NavbarMenuItem | null; onSave: (i: NavbarMenuItem) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<NavbarMenuItem>(item || { type: 'link', titleEn: "", titleBn: "", href: "", items: [] });
  const [newItem, setNewItem] = useState<NavbarSubMenuItem>({ nameEn: "", nameBn: "", descriptionEn: "", descriptionBn: "", href: "", icon: "Zap" });

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{item ? "Edit Menu Item" : "New Menu Item"}</h3>
          <p className="text-sm text-gray-400">Configure top-level destination or dropdown group.</p>
        </div>
        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => setFormData({ ...formData, type: 'link' })}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${formData.type === 'link' ? 'bg-amber-500 text-gray-950' : 'text-gray-400 hover:text-white'}`}
          >
            Direct Link
          </button>
          <button
            onClick={() => setFormData({ ...formData, type: 'dropdown' })}
            className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${formData.type === 'dropdown' ? 'bg-amber-500 text-gray-950' : 'text-gray-400 hover:text-white'}`}
          >
            Dropdown Group
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title (English)</label>
          <Input value={formData.titleEn} onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })} className="bg-black/20 border-white/5 text-white" />
        </div>
        <div className="space-y-4">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Title (Bangla)</label>
          <Input value={formData.titleBn} onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })} className="bg-black/20 border-white/5 text-white" />
        </div>
      </div>

      {formData.type === 'link' ? (
        <div className="space-y-4">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Target URL</label>
          <Input placeholder="/example-page" value={formData.href} onChange={(e) => setFormData({ ...formData, href: e.target.value })} className="bg-black/20 border-white/5 text-white" />
        </div>
      ) : (
        <>
          <Separator className="bg-white/5" />
          <div className="space-y-6">
            <label className="text-sm font-bold text-white">Group Sub-Items</label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formData.items?.map((sub, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5">
                  <div>
                    <p className="font-bold text-sm text-white">{sub.nameEn}</p>
                    <p className="text-[10px] text-amber-500 italic">{sub.href}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFormData({ ...formData, items: formData.items?.filter((_, i) => i !== idx) })}
                    className="h-8 w-8 text-gray-500 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
            </div>

            <div className="p-6 bg-white/5 rounded-xl space-y-4 border border-white/5">
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Item Name (EN)" value={newItem.nameEn} onChange={(e) => setNewItem({ ...newItem, nameEn: e.target.value })} className="bg-black/20 border-white/5 text-white" />
                <Input placeholder="Item Name (BN)" value={newItem.nameBn} onChange={(e) => setNewItem({ ...newItem, nameBn: e.target.value })} className="bg-black/20 border-white/5 text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Route Link (/example)" value={newItem.href} onChange={(e) => setNewItem({ ...newItem, href: e.target.value })} className="bg-black/20 border-white/5 text-white" />
                <select
                  value={newItem.icon}
                  onChange={(e) => setNewItem({ ...newItem, icon: e.target.value })}
                  className="h-9 px-3 rounded-md bg-black/20 border border-white/5 text-sm text-white focus:outline-none focus:border-amber-500/50 appearance-none cursor-pointer"
                >
                  <option disabled value="">Select Icon</option>
                  {[
                    'Zap', 'MessageSquare', 'Phone', 'Globe', 'Shield', 
                    'BarChart', 'Users', 'Settings', 'Package', 'Mail', 
                    'Smartphone', 'Link', 'Layers', 'Box', 'Target', 'Cpu'
                  ].map(i => <option key={i} value={i} className="bg-gray-900">{i}</option>)}
                </select>
              </div>
              <Input placeholder="Short Description (English)" value={newItem.descriptionEn} onChange={(e) => setNewItem({ ...newItem, descriptionEn: e.target.value })} className="bg-black/20 border-white/5 text-white" />
              <Button
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold"
                onClick={() => {
                  if (newItem.nameEn && newItem.href) {
                    setFormData({ ...formData, items: [...(formData.items || []), newItem] });
                    setNewItem({ nameEn: "", nameBn: "", descriptionEn: "", descriptionBn: "", href: "", icon: "Zap" });
                  }
                }}
              >
                Add Sub-Item
              </Button>
            </div>
          </div>
        </>
      )}

      <div className="flex gap-4 pt-4">
        <Button onClick={() => onSave(formData)} className="flex-1 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold">Save Menu Item</Button>
        <Button onClick={onCancel} variant="ghost" className="text-gray-400 hover:text-white">Cancel</Button>
      </div>
    </div>
  );
}
