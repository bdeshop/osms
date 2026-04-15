"use client";

import { useState, useEffect } from "react";
import { publicAPI } from "@/services/api";

export interface BannerConfig {
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

export function useBannerConfig() {
  const [config, setConfig] = useState<BannerConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await publicAPI.getBannerConfig() as any;
      if (response.success) {
        setConfig(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch banner config");
      }
    } catch (err) {
      console.error("Error fetching banner config:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  return { config, loading, error, refetch: fetchConfig };
}
