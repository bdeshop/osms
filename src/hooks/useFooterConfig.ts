import { useState, useEffect } from "react";
import { publicAPI } from "@/services/api";

export interface FooterLink {
  label: string;
  labelEn: string;
  labelBn: string;
  href: string;
}

export interface FooterSection {
  title: string;
  titleEn: string;
  titleBn: string;
  links: FooterLink[];
}

export interface FooterSocial {
  name: string;
  url: string;
  icon: string;
}

export interface FooterCompany {
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

export interface FooterConfig {
  company: FooterCompany;
  sections: FooterSection[];
  socials: FooterSocial[];
  isActive: boolean;
}

export const useFooterConfig = () => {
  const [config, setConfig] = useState<FooterConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const response = (await publicAPI.getFooterConfig()) as any;
        if (response.success) {
          setConfig(response.data);
        } else {
          setError(response.message || "Failed to fetch footer config");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch footer config",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading, error };
};
