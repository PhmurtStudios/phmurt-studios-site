window.PHMURT_CONFIG = Object.assign({
  apiBaseUrl: localStorage.getItem('phmurt_api_base_url') || '',
  defaultTenantSlug: localStorage.getItem('phmurt_default_tenant_slug') || 'phmurt-studios',
  cloudEnabled: typeof window.PHMURT_CONFIG !== 'undefined' && !!window.PHMURT_CONFIG.cloudEnabled,
  supabaseUrl: typeof window.PHMURT_CONFIG !== 'undefined' ? window.PHMURT_CONFIG.supabaseUrl : '',
  supabaseAnonKey: typeof window.PHMURT_CONFIG !== 'undefined' ? window.PHMURT_CONFIG.supabaseAnonKey : ''
}, window.PHMURT_CONFIG || {});
