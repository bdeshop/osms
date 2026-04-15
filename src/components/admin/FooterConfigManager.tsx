"use client";

import { useState, useEffect } from "react";
import { adminAPI } from "@/services/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit2,
  Loader,
  AlertCircle,
  CheckCircle,
  Save,
  Globe,
  Settings,
  Link as LinkIcon,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface FooterLink {
  label: string;
  labelEn: string;
  labelBn: string;
  href: string;
}

interface FooterSection {
  title: string;
  titleEn: string;
  titleBn: string;
  links: FooterLink[];
}

interface FooterSocial {
  name: string;
  url: string;
  icon: string;
}

interface FooterCompany {
  name: string;
  nameEn: string;
  nameBn: string;
  tagline: string;
  taglineEn: string;
  taglineBn: string;
  copyright: string;
  copyrightEn: string;
  copyrightBn: string;
}

interface FooterConfig {
  company: FooterCompany;
  sections: FooterSection[];
  socials: FooterSocial[];
  isActive: boolean;
}

export default function FooterConfigManager() {
  const [config, setConfig] = useState<FooterConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<"brand" | "links" | "socials">("brand");
  
  const [editingSection, setEditingSection] = useState<{ index: number; data: FooterSection } | null>(null);
  const [showSectionModal, setShowSectionModal] = useState(false);
  
  const [editingSocial, setEditingSocial] = useState<{ index: number; data: FooterSocial } | null>(null);
  const [showSocialModal, setShowSocialModal] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = (await adminAPI.getFooterConfig()) as any;
      if (response.success) setConfig(response.data);
      else setError(response.message || "Failed to load footer configuration");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load footer configuration");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!config) return;
    try {
      setSaving(true);
      setError("");
      const response = (await adminAPI.updateFooterConfig(config)) as any;
      if (response.success) {
        setSuccess("Footer configuration saved successfully");
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
    <div className="space-y-8 pb-24">
      {/* Toast Notifications */}
      <AnimatePresence>
        {(error || success) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-8 right-8 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 border ${
              error 
                ? "bg-red-500/10 border-red-500/20 text-red-500" 
                : "bg-amber-500/10 border-amber-500/20 text-amber-500"
            } backdrop-blur-md`}
          >
            {error ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
            <span className="text-sm font-semibold">{error || success}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="xl:col-span-1 space-y-4">
          <Card className="bg-gray-900 border-white/5 p-2">
            {[
              { id: 'brand', label: 'Company Heritage', icon: <Settings size={18} /> },
              { id: 'links', label: 'Navigation Hub', icon: <LinkIcon size={18} /> },
              { id: 'socials', label: 'Social Presence', icon: <Globe size={18} /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                  activeTab === tab.id 
                  ? "bg-amber-500 text-gray-950" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </Card>

          <Button 
            onClick={handleSaveConfig}
            disabled={saving}
            className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold h-12 rounded-xl"
          >
            {saving ? <Loader className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
            Save Footer Config
          </Button>
        </div>

        {/* Content Area */}
        <div className="xl:col-span-3">
          <Card className="bg-gray-900 border-white/5 min-h-[500px]">
            <CardHeader>
              <CardTitle className="text-white">
                {activeTab === 'brand' && "Company Archetype"}
                {activeTab === 'links' && "Footer Sections"}
                {activeTab === 'socials' && "Social Links"}
              </CardTitle>
              <CardDescription>
                {activeTab === 'brand' && "Manage company name, tagline and copyright information."}
                {activeTab === 'links' && "Configure column-based links for the footer area."}
                {activeTab === 'socials' && "Link your official social media profiles."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeTab === 'brand' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Company Name (EN)</label>
                      <Input 
                        value={config.company.nameEn}
                        onChange={(e) => setConfig({ ...config, company: { ...config.company, nameEn: e.target.value } })}
                        className="bg-black/20 border-white/5 text-white h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Company Name (BN)</label>
                      <Input 
                        value={config.company.nameBn}
                        onChange={(e) => setConfig({ ...config, company: { ...config.company, nameBn: e.target.value } })}
                        className="bg-black/20 border-white/5 text-white h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Tagline (English)</label>
                    <Input 
                      value={config.company.taglineEn}
                      onChange={(e) => setConfig({ ...config, company: { ...config.company, taglineEn: e.target.value } })}
                      className="bg-black/20 border-white/5 text-white h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Copyright Notice (EN)</label>
                    <Input 
                      value={config.company.copyrightEn}
                      onChange={(e) => setConfig({ ...config, company: { ...config.company, copyrightEn: e.target.value } })}
                      className="bg-black/20 border-white/5 text-white h-11"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'links' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-1">Section Hierarchies</h4>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => { setEditingSection(null); setShowSectionModal(true); }}
                      className="border-white/10 text-white hover:bg-white/5 h-8"
                    >
                      <Plus size={14} className="mr-2" /> Add Section
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {config.sections.map((section, idx) => (
                      <div key={idx} className="p-6 bg-white/5 rounded-xl border border-white/5 hover:border-amber-500/20 transition-all group relative">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h5 className="font-bold text-white text-base">{section.titleEn}</h5>
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-tighter mt-1">{section.links.length} Links Synchronized</p>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => { setEditingSection({ index: idx, data: section }); setShowSectionModal(true); }}
                              className="h-8 w-8 text-gray-400 hover:text-white"
                            >
                              <Edit2 size={12} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => {
                                if(confirm("Are you sure?")) {
                                  setConfig({ ...config, sections: config.sections.filter((_, i) => i !== idx) });
                                }
                              }}
                              className="h-8 w-8 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 size={12} />
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {section.links.map((link, lidx) => (
                            <span key={lidx} className="px-2 py-1 bg-black/40 text-[9px] font-bold text-gray-500 rounded border border-white/5">
                              {link.labelEn}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'socials' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-1">Platform Presence</h4>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => { setEditingSocial(null); setShowSocialModal(true); }}
                      className="border-white/10 text-white hover:bg-white/5 h-8"
                    >
                      <Plus size={14} className="mr-2" /> Broadcast Social
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {config.socials.map((social, idx) => (
                      <div key={idx} className="p-5 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-black/40 rounded flex items-center justify-center text-xl grayscale group-hover:grayscale-0 transition-all border border-white/5">
                            {social.icon === 'Facebook' && 'fb'}
                            {social.icon === 'Twitter' && 'tw'}
                            {social.icon === 'Linkedin' && 'in'}
                            {social.icon === 'Youtube' && 'yt'}
                            {social.icon === 'Instagram' && 'ig'}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{social.name}</p>
                            <p className="text-[10px] text-gray-500 truncate max-w-[150px]">{social.url}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" onClick={() => { setEditingSocial({ index: idx, data: social }); setShowSocialModal(true); }} className="h-8 w-8 text-gray-400"><Edit2 size={12} /></Button>
                          <Button variant="ghost" size="icon" onClick={() => setConfig({ ...config, socials: config.socials.filter((_, i) => i !== idx) })} className="h-8 w-8 text-gray-400 hover:text-red-500"><Trash2 size={12} /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SECTION MODAL */}
      <AnimatePresence>
        {showSectionModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSectionModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-4xl bg-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <SectionForm
                section={editingSection?.data || null}
                onSave={(section) => {
                  if (editingSection !== null) {
                    const updated = [...config.sections];
                    updated[editingSection.index] = section;
                    setConfig({ ...config, sections: updated });
                  } else {
                    setConfig({ ...config, sections: [...config.sections, section] });
                  }
                  setShowSectionModal(false);
                }}
                onCancel={() => setShowSectionModal(false)}
              />
            </motion.div>
          </div>
        )}

        {showSocialModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSocialModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-xl bg-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <SocialForm
                social={editingSocial?.data || null}
                onSave={(social) => {
                  if (editingSocial !== null) {
                    const updated = [...config.socials];
                    updated[editingSocial.index] = social;
                    setConfig({ ...config, socials: updated });
                  } else {
                    setConfig({ ...config, socials: [...config.socials, social] });
                  }
                  setShowSocialModal(false);
                }}
                onCancel={() => setShowSocialModal(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionForm({ section, onSave, onCancel }: { section: FooterSection | null; onSave: (s: FooterSection) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<FooterSection>(section || { title: "", titleEn: "", titleBn: "", links: [] });
  const [newLink, setNewLink] = useState<FooterLink>({ label: "", labelEn: "", labelBn: "", href: "" });

  return (
    <div className="p-8 space-y-8">
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Navigation Column</h3>
        <p className="text-sm text-gray-400">Define the column heading and add appropriate redirect nodes.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Column Label (EN)</label>
          <Input value={formData.titleEn} onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })} className="bg-black/20 border-white/5 text-white h-11" />
        </div>
        <div className="space-y-4">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Column Label (BN)</label>
          <Input value={formData.titleBn} onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })} className="bg-black/20 border-white/5 text-white h-11" />
        </div>
      </div>

      <Separator className="bg-white/10" />

      <div className="space-y-6">
        <label className="text-sm font-bold text-white">Interactive Nodes (Links)</label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {formData.links.map((lnk, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/5">
              <div>
                <p className="font-bold text-sm text-white">{lnk.labelEn}</p>
                <p className="text-[10px] text-gray-600 font-mono">{lnk.href}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setFormData({ ...formData, links: formData.links.filter((_, i) => i !== idx) })}
                className="h-8 w-8 text-gray-500 hover:text-red-500"
              >
                <Trash2 size={12} />
              </Button>
            </div>
          ))}
        </div>

        <div className="p-6 bg-white/5 rounded-xl border border-white/5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <Input placeholder="Link Label (EN)" value={newLink.labelEn} onChange={(e) => setNewLink({ ...newLink, labelEn: e.target.value })} className="bg-black/20 border-white/5 text-white" />
             <Input placeholder="Routing / URL" value={newLink.href} onChange={(e) => setNewLink({ ...newLink, href: e.target.value })} className="bg-black/20 border-white/5 text-white" />
          </div>
          <Button 
            className="w-full bg-white/10 hover:bg-white/20 text-white font-bold h-11"
            onClick={() => {
              if (newLink.labelEn && newLink.href) {
                setFormData({ ...formData, links: [...formData.links, newLink] });
                setNewLink({ label: "", labelEn: "", labelBn: "", href: "" });
              }
            }}
          >
            Bridge node to column
          </Button>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button onClick={() => onSave(formData)} className="flex-1 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold h-11">Commit Column</Button>
        <Button onClick={onCancel} variant="ghost" className="text-gray-400 h-11">Abort protocol</Button>
      </div>
    </div>
  );
}

function SocialForm({ social, onSave, onCancel }: { social: FooterSocial | null; onSave: (s: FooterSocial) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<FooterSocial>(social || { name: "", url: "", icon: "Facebook" });

  return (
    <div className="p-8 space-y-8">
      <div>
        <h3 className="text-xl font-bold text-white mb-1">Signal Establishment</h3>
        <p className="text-sm text-gray-400">Configure your official platform presence links.</p>
      </div>
      <div className="space-y-6">
        <div className="space-y-4">
          <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-black/20 border-white/5 text-white h-11" placeholder="Platform Identity" />
          <Input value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} className="bg-black/20 border-white/5 text-white h-11" placeholder="Broadcast URL (https://...)" />
          <select value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="w-full h-11 px-4 rounded-md bg-black/20 border border-white/5 text-sm text-white focus:outline-none appearance-none font-bold">
            {['Facebook', 'Twitter', 'Linkedin', 'Youtube', 'Instagram'].map(i => <option key={i} value={i} className="bg-gray-900">{i.toUpperCase()}</option>)}
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-4">
        <Button onClick={() => onSave(formData)} className="w-full bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold h-11 transition-all active:scale-[0.98]">Confirm Signal</Button>
        <Button onClick={onCancel} variant="ghost" className="text-gray-400 h-11">Abort</Button>
      </div>
    </div>
  );
}
