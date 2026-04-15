import { useState, useEffect } from "react";
import { publicAPI } from "@/services/api";

export interface NavbarMenuItem {
  type: 'link' | 'dropdown';
  titleEn: string;
  titleBn: string;
  href?: string;
  items?: NavbarSubMenuItem[];
}

export interface NavbarSubMenuItem {
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  href: string;
  icon: string;
}

export interface NavbarConfig {
  logoTextEn: string;
  logoTextBn: string;
  logoImage?: string;
  menu: NavbarMenuItem[];
  isActive: boolean;
}

export const useNavbarConfig = () => {
  const [config, setConfig] = useState<NavbarConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        const response = (await publicAPI.getNavbarConfig()) as any;
        if (response.success) {
          setConfig(response.data);
        } else {
          setError(response.message || "Failed to fetch navbar config");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch navbar config",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading, error };
};
