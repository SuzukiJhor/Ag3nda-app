import { useRouter } from "expo-router";
import React from "react";

type Options = {
  fallbackRoute?: string;
};

export function useHandleGoBack({ fallbackRoute = "/(tabs)" }: Options = {}) {
  const router = useRouter();

  const goBack = React.useCallback(() => {
    try {
      router.back();
    } catch {
      router.replace(fallbackRoute as any);
    }
  }, [router, fallbackRoute]);

  return goBack;
}
