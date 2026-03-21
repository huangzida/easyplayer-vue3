export interface EasyPlayerAssetUrls {
  lib: string;
  pro: string;
  wasm: string;
}

let loaded = false;

export const defaultAssetUrls: EasyPlayerAssetUrls = {
  lib: 'EasyPlayer-lib.js',
  pro: 'EasyPlayer-pro.js',
  wasm: 'EasyPlayer-pro.wasm',
};

const getBasePath = (): string => {
  if (typeof window === 'undefined') {
    return '/assets/easyplayer/';
  }

  const base = document.querySelector('base');
  if (base) {
    const href = base.getAttribute('href');
    if (href) {
      return `${href.replace(/\/$/, '')}/assets/easyplayer/`;
    }
  }

  const origin = window.location.origin;
  const pathname = window.location.pathname;
  const pathParts = pathname.split('/').filter(Boolean);

  const isGitHubPages = origin.includes('.github.io');
  
  if (pathParts.length > 0) {
    const repoName = pathParts[0];
    
    if (isGitHubPages) {
      return `${origin}/${repoName}/assets/easyplayer/`;
    }
    
    return '/assets/easyplayer/';
  }

  return '/assets/easyplayer/';
};

export const ensureEasyPlayerRuntime = async (
  assetBaseUrl?: string,
): Promise<EasyPlayerAssetUrls> => {
  if (loaded && typeof window !== 'undefined' && (window as any).EasyPlayerPro) {
    return defaultAssetUrls;
  }

  const baseUrl = assetBaseUrl
    ? `${assetBaseUrl.replace(/\/$/, '')}/`
    : getBasePath();

  const assetUrls: EasyPlayerAssetUrls = {
    lib: `${baseUrl}${defaultAssetUrls.lib}`,
    pro: `${baseUrl}${defaultAssetUrls.pro}`,
    wasm: `${baseUrl}${defaultAssetUrls.wasm}`,
  };

  console.log(`[EasyPlayer Vue3] Loading from: ${assetUrls.lib}`);

  const loadScript = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = (e) => {
        console.error(`[EasyPlayer Vue3] Failed to load script: ${src}`);
        reject(e);
      };
      document.head.appendChild(script);
    });
  };

  try {
    // await loadScript(assetUrls.lib);
    await loadScript(assetUrls.pro);
    loaded = true;
  } catch (error) {
    console.error('[EasyPlayer Vue3] Failed to load runtime:', error);
    throw error;
  }

  return assetUrls;
};
