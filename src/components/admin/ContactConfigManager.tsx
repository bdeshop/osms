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
  MapPin,
  Image as ImageIcon,
  MessageSquare,
  Mail,
  Phone,
  Monitor,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface Contact {
  type: string;
  icon: string;
  value: string;
}

interface InfoCard {
  id: string;
  title: string;
  description: string;
  contacts: Contact[];
}

interface Location {
  name: string;
  type: string;
  address: string;
  image: string;
}

interface ContactPageConfig {
  titleEn: string;
  titleBn: string;
  locations: Location[];
  infoCards?: InfoCard[];
  isActive: boolean;
}

export default function ContactConfigManager() {
  const [config, setConfig] = useState<ContactPageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editingLocation, setEditingLocation] = useState<{ index: number; data: Location } | null>(null);
  const [editingInfoCard, setEditingInfoCard] = useState<{ index: number; data: InfoCard } | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showInfoCardModal, setShowInfoCardModal] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = (await adminAPI.getContactPageConfig()) as any;
      if (response.success) {
        setConfig(response.data);
      } else setError(response.message || "Failed to load configuration");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!config) return;
    try {
      setSaving(true);
      setError("");
      const response = (await adminAPI.updateContactPageConfig(config)) as any;
      if (response.success) {
        setSuccess("Configuration saved successfully");
        setConfig(response.data);
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

      <div className="grid grid-cols-1 gap-8">
        <Card className="bg-gray-900 border-white/5">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin size={18} className="text-amber-500" />
              Contact Page Header
            </CardTitle>
            <CardDescription>Manage the main title for locations section.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Title (English)</label>
                <Input
                  value={config.titleEn}
                  onChange={(e) => setConfig({ ...config, titleEn: e.target.value })}
                  className="bg-black/20 border-white/5 text-white"
                  placeholder="Based in Singapore, Reaching Globally"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Title (Bangla)</label>
                <Input
                  value={config.titleBn}
                  onChange={(e) => setConfig({ ...config, titleBn: e.target.value })}
                  className="bg-black/20 border-white/5 text-white"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveConfig} className="bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold" disabled={saving}>
              {saving ? <Loader className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
              Save Header Settings
            </Button>
          </CardFooter>
        </Card>

        {/* Info Cards Management */}
        <Card className="bg-gray-900 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare size={18} className="text-amber-500" />
                Support Info Cards
              </CardTitle>
              <CardDescription>Manage support channels and contact information blocks.</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setEditingInfoCard(null); setShowInfoCardModal(true); }}
              className="border-white/10 text-white hover:bg-white/5"
            >
              <Plus size={16} className="mr-2" /> Add Card
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(config.infoCards || []).map((card, idx) => (
                <div key={idx} className="bg-white/5 rounded-xl border border-white/5 p-6 space-y-4 group relative">
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setEditingInfoCard({ index: idx, data: card }); setShowInfoCardModal(true); }}
                        className="h-8 w-8 bg-black/50 text-white hover:bg-amber-500"
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm("Are you sure?")) {
                            setConfig({ ...config, infoCards: (config.infoCards || []).filter((_, i) => i !== idx) });
                          }
                        }}
                        className="h-8 w-8 bg-black/50 text-white hover:bg-red-500"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                    <h4 className="font-bold text-white text-lg">{card.title}</h4>
                    <p className="text-sm text-gray-400 line-clamp-2">{card.description}</p>
                    <div className="flex flex-wrap gap-2">
                        {card.contacts.map((c, ci) => (
                            <div key={ci} className="px-3 py-1 bg-black/40 text-xs text-amber-500 rounded-full border border-amber-500/20">
                                {c.icon} {c.value}
                            </div>
                        ))}
                    </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Global Locations Management */}
        <Card className="bg-gray-900 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-white">Global Locations</CardTitle>
              <CardDescription>Configure office locations and division details.</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setEditingLocation(null); setShowLocationModal(true); }}
              className="border-white/10 text-white hover:bg-white/5"
            >
              <Plus size={16} className="mr-2" /> Add Location
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {config.locations.map((loc, idx) => (
                <div key={idx} className="bg-white/5 rounded-xl border border-white/5 overflow-hidden group">
                  <div className="relative aspect-video">
                    <img src={loc.image} alt={loc.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setEditingLocation({ index: idx, data: loc }); setShowLocationModal(true); }}
                        className="h-8 w-8 bg-black/50 text-white hover:bg-amber-500 hover:text-gray-950"
                      >
                        <Edit2 size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm("Are you sure?")) {
                            setConfig({ ...config, locations: config.locations.filter((_, i) => i !== idx) });
                          }
                        }}
                        className="h-8 w-8 bg-black/50 text-white hover:bg-red-500"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <h4 className="font-bold text-white text-lg">{loc.name}</h4>
                      <p className="text-xs text-amber-500 font-medium">{loc.type}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{loc.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
             <Button onClick={handleSaveConfig} className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold" disabled={saving}>
              {saving ? <Loader className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
              Save All Settings
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Location Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLocationModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-2xl bg-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <LocationForm
                location={editingLocation?.data || null}
                onSave={(location) => {
                  if (editingLocation !== null) {
                    const updated = [...config.locations];
                    updated[editingLocation.index] = location;
                    setConfig({ ...config, locations: updated });
                  } else {
                    setConfig({ ...config, locations: [...config.locations, location] });
                  }
                  setShowLocationModal(false);
                }}
                onCancel={() => setShowLocationModal(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Info Card Modal */}
      <AnimatePresence>
        {showInfoCardModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowInfoCardModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-2xl bg-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <InfoCardForm
                card={editingInfoCard?.data || null}
                onSave={(card) => {
                  const currentCards = config.infoCards || [];
                  if (editingInfoCard !== null) {
                    const updated = [...currentCards];
                    updated[editingInfoCard.index] = card;
                    setConfig({ ...config, infoCards: updated });
                  } else {
                    setConfig({ ...config, infoCards: [...currentCards, card] });
                  }
                  setShowInfoCardModal(false);
                }}
                onCancel={() => setShowInfoCardModal(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// LocationForm component (unchanged essentially, but I'll make sure it's here)
function LocationForm({ location, onSave, onCancel }: { location: Location | null; onSave: (l: Location) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<Location>(location || { name: "", type: "", address: "", image: "" });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const data = new FormData();
      data.append("image", file);
      const response = (await adminAPI.uploadLocationImage(data)) as any;
      if (response.success) {
        setFormData({ ...formData, image: `${API_BASE}${response.data.url}` });
      }
    } catch (err) {
      console.error("Image upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
          <MapPin size={20} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{location ? "Edit Location" : "Add New Location"}</h3>
          <p className="text-sm text-gray-500">Enter office and division details.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Country/City Name</label>
          <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-black/20 border-white/5 text-white" />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Division Type</label>
          <Input value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="bg-black/20 border-white/5 text-white" placeholder="e.g. Headquarters" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Full Address</label>
        <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="bg-black/20 border-white/5 text-white" />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Cover Image</label>
        <div className="flex gap-4">
          <div className="flex-1">
            <Input 
              placeholder="https://..." 
              value={formData.image} 
              onChange={(e) => setFormData({ ...formData, image: e.target.value })} 
              className="bg-black/20 border-white/5 text-white h-10 mb-2" 
            />
            <div className="relative">
              <Button variant="outline" className="w-full border-white/10 text-gray-400 hover:bg-white/5 h-10 overflow-hidden relative">
                {uploading ? <Loader className="animate-spin mr-2" size={16} /> : <ImageIcon className="mr-2" size={16} />}
                Upload Custom Image
                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
              </Button>
            </div>
          </div>
          {formData.image && (
            <div className="w-32 aspect-video bg-black/40 rounded-lg border border-white/10 overflow-hidden shadow-inner">
              <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button onClick={() => onSave(formData)} className="flex-1 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold">Save Location</Button>
        <Button onClick={onCancel} variant="ghost" className="flex-1 text-gray-400 hover:text-white">Cancel</Button>
      </div>
    </div>
  );
}

// InfoCardForm component
function InfoCardForm({ card, onSave, onCancel }: { card: InfoCard | null; onSave: (c: InfoCard) => void; onCancel: () => void }) {
    const [formData, setFormData] = useState<InfoCard>(card || { id: Date.now().toString(), title: "", description: "", contacts: [] });
    const [newContact, setNewContact] = useState<Contact>({ type: "email", icon: "✉", value: "" });

    const addContact = () => {
        if (!newContact.value) return;
        setFormData({ ...formData, contacts: [...formData.contacts, newContact] });
        setNewContact({ type: "email", icon: "✉", value: "" });
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                    <MessageSquare size={20} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white">{card ? "Edit Info Card" : "Add Info Card"}</h3>
                    <p className="text-sm text-gray-500">Configure support channel details.</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Card Title</label>
                    <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="bg-black/20 border-white/5 text-white" />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                    <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-black/20 border-white/5 text-white resize-none" rows={3} />
                </div>
            </div>

            <Separator className="bg-white/5" />

            <div className="space-y-4">
                <label className="text-xs font-bold text-gray-500 uppercase">Contacts</label>
                <div className="space-y-2">
                    {formData.contacts.map((c, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5">
                            <div className="flex items-center gap-3">
                                <span className="text-amber-500">{c.icon}</span>
                                <span className="text-sm text-white">{c.value}</span>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setFormData({ ...formData, contacts: formData.contacts.filter((_, i) => i !== idx) })} className="h-6 w-6 text-gray-500 hover:text-red-500">
                                <Trash2 size={12} />
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 p-3 bg-white/5 rounded-xl border border-dashed border-white/10">
                    <div className="flex flex-col gap-2 flex-1">
                        <div className="flex gap-2">
                            <select 
                                value={newContact.type} 
                                onChange={(e) => {
                                    const type = e.target.value;
                                    const icon = type === 'email' ? '✉' : type === 'phone' ? '📞' : '@';
                                    setNewContact({ ...newContact, type, icon });
                                }}
                                className="bg-black/40 text-white text-xs rounded border border-white/5 px-2 outline-none"
                            >
                                <option value="email">Email</option>
                                <option value="phone">Phone</option>
                                <option value="social">Social</option>
                            </select>
                            <Input 
                                placeholder="Contact value..." 
                                value={newContact.value} 
                                onChange={(e) => setNewContact({ ...newContact, value: e.target.value })} 
                                className="bg-black/20 border-white/5 text-white h-8 text-xs" 
                            />
                        </div>
                    </div>
                    <Button size="sm" onClick={addContact} className="bg-amber-500 text-gray-950 h-8 font-bold">Add</Button>
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                <Button onClick={() => onSave(formData)} className="flex-1 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold">Save Card</Button>
                <Button onClick={onCancel} variant="ghost" className="flex-1 text-gray-400 hover:text-white">Cancel</Button>
            </div>
        </div>
    );
}
