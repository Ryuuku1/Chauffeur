import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { TenantTheme } from '@/domain/models';
import { useAppStore } from '@/state/AppStore';

const getRadiusValue = (radiusScale: 'soft' | 'rounded' | 'dramatic') => {
  switch (radiusScale) {
    case 'soft':
      return { lg: '24px', md: '16px', sm: '10px' };
    case 'dramatic':
      return { lg: '32px', md: '22px', sm: '14px' };
    default:
      return { lg: '28px', md: '18px', sm: '12px' };
  }
};

const normalizeHex = (value: string): string | null => {
  const candidate = value.trim();
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(candidate)) {
    return null;
  }

  if (candidate.length === 4) {
    return `#${candidate[1]}${candidate[1]}${candidate[2]}${candidate[2]}${candidate[3]}${candidate[3]}`;
  }

  return candidate;
};

const hexToRgb = (value: string): { r: number; g: number; b: number } | null => {
  const normalized = normalizeHex(value);
  if (!normalized) {
    return null;
  }

  const r = Number.parseInt(normalized.slice(1, 3), 16);
  const g = Number.parseInt(normalized.slice(3, 5), 16);
  const b = Number.parseInt(normalized.slice(5, 7), 16);
  return { r, g, b };
};

const mixHex = (left: string, right: string, weight = 0.5): string => {
  const leftRgb = hexToRgb(left);
  const rightRgb = hexToRgb(right);
  if (!leftRgb || !rightRgb) {
    return left;
  }

  const clamped = Math.min(1, Math.max(0, weight));
  const mixChannel = (start: number, end: number) => Math.round(start * clamped + end * (1 - clamped));
  const r = mixChannel(leftRgb.r, rightRgb.r);
  const g = mixChannel(leftRgb.g, rightRgb.g);
  const b = mixChannel(leftRgb.b, rightRgb.b);
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
};

const rgba = (value: string, alpha: number): string => {
  const rgb = hexToRgb(value);
  if (!rgb) {
    return value;
  }

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
};

const toLinear = (channel: number) => {
  const normalized = channel / 255;
  return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
};

const getLuminance = (value: string) => {
  const rgb = hexToRgb(value);
  if (!rgb) {
    return 0;
  }

  return 0.2126 * toLinear(rgb.r) + 0.7152 * toLinear(rgb.g) + 0.0722 * toLinear(rgb.b);
};

const getReadableText = (background: string) => (getLuminance(background) > 0.42 ? '#171310' : '#f8f3ec');

const deriveSemanticTokens = (theme: TenantTheme) => {
  const shellSurface = mixHex(theme.surfaceColor, '#000000', 0.74);
  const shellSurfaceSoft = mixHex(theme.surfaceSoftColor, theme.surfaceColor, 0.58);
  const panelSurface = mixHex(theme.surfaceColor, theme.surfaceSoftColor, 0.64);
  const panelSurfaceAlt = mixHex(theme.surfaceSoftColor, theme.surfaceColor, 0.52);
  const elevatedSurface = mixHex(theme.surfaceColor, '#000000', 0.78);
  const floatingSurface = mixHex(theme.surfaceSoftColor, '#000000', 0.68);
  const sidebarSurface = mixHex(theme.surfaceColor, '#000000', 0.84);
  const text = getReadableText(panelSurface);
  const muted = mixHex(text, panelSurface, 0.74);
  const mutedStrong = mixHex(text, panelSurfaceAlt, 0.58);
  const borderBase = mixHex(text, panelSurfaceAlt, 0.24);
  const borderStrongBase = mixHex(text, floatingSurface, 0.34);
  const navActive = mixHex(theme.primaryColor, theme.surfaceSoftColor, 0.28);
  const navHover = mixHex(text, panelSurface, 0.08);
  const sidebarLinkActive = mixHex(theme.primaryColor, sidebarSurface, 0.24);
  const sidebarLinkHover = mixHex(text, sidebarSurface, 0.1);
  const accentStrong = mixHex(theme.accentColor, text, 0.84);
  const buttonPrimaryText = getReadableText(mixHex(theme.primaryColor, theme.secondaryColor, 0.52));

  const templateOverrides: Partial<{
    panelSurface: string;
    panelSurfaceAlt: string;
    floatingSurface: string;
    sidebarSurface: string;
    navActive: string;
    navHover: string;
    sidebarLinkActive: string;
    sidebarLinkHover: string;
    compareSurface: string;
    bgGlowPrimary: string;
    bgGlowSecondary: string;
  }> = {};

  switch (theme.templateId) {
    case 'modern-minimal':
      templateOverrides.panelSurfaceAlt = mixHex(theme.surfaceSoftColor, '#ffffff', 0.9);
      templateOverrides.floatingSurface = mixHex(theme.surfaceSoftColor, '#0a0b10', 0.76);
      templateOverrides.sidebarSurface = mixHex(theme.surfaceColor, '#050608', 0.86);
      templateOverrides.navActive = rgba(mixHex(theme.primaryColor, theme.surfaceSoftColor, 0.22), 0.34);
      templateOverrides.sidebarLinkActive = rgba(mixHex(theme.secondaryColor, theme.surfaceSoftColor, 0.24), 0.42);
      templateOverrides.bgGlowPrimary = rgba(theme.primaryColor, 0.12);
      templateOverrides.bgGlowSecondary = rgba(theme.secondaryColor, 0.18);
      break;
    case 'cinematic-exotic':
      templateOverrides.panelSurface = mixHex(theme.surfaceColor, theme.surfaceSoftColor, 0.72);
      templateOverrides.floatingSurface = mixHex(theme.surfaceSoftColor, '#000000', 0.62);
      templateOverrides.navActive = rgba(mixHex(theme.primaryColor, theme.surfaceSoftColor, 0.36), 0.46);
      templateOverrides.sidebarLinkActive = rgba(mixHex(theme.primaryColor, theme.surfaceSoftColor, 0.3), 0.48);
      templateOverrides.bgGlowPrimary = rgba(theme.primaryColor, 0.2);
      templateOverrides.bgGlowSecondary = rgba(theme.secondaryColor, 0.18);
      break;
    case 'romantic-wedding':
      templateOverrides.panelSurface = mixHex(theme.surfaceColor, theme.surfaceSoftColor, 0.58);
      templateOverrides.panelSurfaceAlt = mixHex(theme.surfaceSoftColor, '#ffffff', 0.88);
      templateOverrides.floatingSurface = mixHex(theme.surfaceSoftColor, '#120d0d', 0.78);
      templateOverrides.navHover = rgba(mixHex(theme.accentColor, theme.surfaceSoftColor, 0.12), 0.34);
      templateOverrides.sidebarLinkHover = rgba(mixHex(theme.accentColor, theme.surfaceSoftColor, 0.1), 0.3);
      templateOverrides.bgGlowPrimary = rgba(theme.primaryColor, 0.16);
      templateOverrides.bgGlowSecondary = rgba(theme.secondaryColor, 0.16);
      break;
    default:
      templateOverrides.bgGlowPrimary = rgba(theme.primaryColor, 0.18);
      templateOverrides.bgGlowSecondary = rgba(theme.secondaryColor, 0.18);
      break;
  }

  const resolvedPanelSurface = templateOverrides.panelSurface ?? panelSurface;
  const resolvedPanelSurfaceAlt = templateOverrides.panelSurfaceAlt ?? panelSurfaceAlt;
  const resolvedFloatingSurface = templateOverrides.floatingSurface ?? floatingSurface;
  const resolvedSidebarSurface = templateOverrides.sidebarSurface ?? sidebarSurface;
  const compareSurface = templateOverrides.compareSurface ?? mixHex(resolvedFloatingSurface, resolvedPanelSurface, 0.76);

  return {
    bg: shellSurface,
    shellSurface,
    shellSurfaceSoft,
    panelSurface: resolvedPanelSurface,
    panelSurfaceAlt: resolvedPanelSurfaceAlt,
    elevatedSurface,
    floatingSurface: resolvedFloatingSurface,
    sidebarSurface: resolvedSidebarSurface,
    text,
    muted,
    mutedStrong,
    border: rgba(borderBase, 0.16),
    borderStrong: rgba(borderStrongBase, 0.28),
    sidebarBorder: rgba(borderStrongBase, 0.2),
    floatingBorder: rgba(borderStrongBase, 0.32),
    navActive: templateOverrides.navActive ?? rgba(navActive, 0.4),
    navHover: templateOverrides.navHover ?? rgba(navHover, 0.3),
    sidebarLinkActive: templateOverrides.sidebarLinkActive ?? rgba(sidebarLinkActive, 0.42),
    sidebarLinkHover: templateOverrides.sidebarLinkHover ?? rgba(sidebarLinkHover, 0.28),
    accentSoft: rgba(theme.primaryColor, 0.18),
    accentStrong,
    secondarySoft: rgba(theme.surfaceSoftColor, 0.28),
    compareSurface: rgba(compareSurface, 0.96),
    overlayBackdrop: rgba('#000000', 0.58),
    buttonPrimaryText,
    buttonSecondaryBg: rgba(text, 0.04),
    buttonSecondaryBorder: rgba(borderStrongBase, 0.26),
    buttonGhostBg: rgba(text, 0.02),
    inputBg: rgba(resolvedFloatingSurface, 0.76),
    inputBorder: rgba(borderStrongBase, 0.2),
    iconButtonBg: rgba(text, 0.03),
    iconButtonBorder: rgba(borderStrongBase, 0.18),
    siteHeaderBg: `linear-gradient(180deg, ${rgba(resolvedFloatingSurface, 0.92)}, ${rgba(shellSurfaceSoft, 0.74)})`,
    siteHeaderBorder: rgba(borderStrongBase, 0.14),
    publicationPillBg: rgba(compareSurface, 0.4),
    modalBg: `linear-gradient(160deg, ${resolvedFloatingSurface}, ${resolvedPanelSurfaceAlt})`,
    menuBg: `linear-gradient(160deg, ${resolvedFloatingSurface}, ${resolvedPanelSurfaceAlt})`,
    toastBg: `linear-gradient(160deg, ${resolvedFloatingSurface}, ${resolvedPanelSurface})`,
    bgGlowPrimary: templateOverrides.bgGlowPrimary ?? rgba(theme.primaryColor, 0.18),
    bgGlowSecondary: templateOverrides.bgGlowSecondary ?? rgba(theme.secondaryColor, 0.18),
  };
};

export const TenantPresentationBridge = () => {
  const { i18n } = useTranslation();
  const { snapshot } = useAppStore();
  const { branding, theme, seo } = snapshot.tenant;

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const radius = getRadiusValue(theme.radiusScale);
    const semantic = deriveSemanticTokens(theme);

    root.style.setProperty('--brand-primary', theme.primaryColor);
    root.style.setProperty('--brand-secondary', theme.secondaryColor);
    root.style.setProperty('--brand-accent', theme.accentColor);
    root.style.setProperty('--brand-surface', theme.surfaceColor);
    root.style.setProperty('--brand-surface-soft', theme.surfaceSoftColor);
    root.style.setProperty('--font-heading', theme.headingFont);
    root.style.setProperty('--font-body', theme.bodyFont);
    root.style.setProperty('--radius-lg', radius.lg);
    root.style.setProperty('--radius-md', radius.md);
    root.style.setProperty('--radius-sm', radius.sm);
    root.style.setProperty('--bg', semantic.bg);
    root.style.setProperty('--surface', semantic.shellSurface);
    root.style.setProperty('--surface-soft', semantic.shellSurfaceSoft);
    root.style.setProperty('--surface-strong', semantic.elevatedSurface);
    root.style.setProperty('--surface-panel', semantic.panelSurface);
    root.style.setProperty('--surface-panel-alt', semantic.panelSurfaceAlt);
    root.style.setProperty('--surface-elevated', semantic.elevatedSurface);
    root.style.setProperty('--surface-floating', semantic.floatingSurface);
    root.style.setProperty('--text', semantic.text);
    root.style.setProperty('--muted', semantic.muted);
    root.style.setProperty('--muted-strong', semantic.mutedStrong);
    root.style.setProperty('--border', semantic.border);
    root.style.setProperty('--border-strong', semantic.borderStrong);
    root.style.setProperty('--sidebar-bg', semantic.sidebarSurface);
    root.style.setProperty('--sidebar-border', semantic.sidebarBorder);
    root.style.setProperty('--sidebar-link-bg-active', semantic.sidebarLinkActive);
    root.style.setProperty('--sidebar-link-bg-hover', semantic.sidebarLinkHover);
    root.style.setProperty('--floating-border', semantic.floatingBorder);
    root.style.setProperty('--nav-hover-bg', semantic.navHover);
    root.style.setProperty('--nav-active-bg', semantic.navActive);
    root.style.setProperty('--accent-soft', semantic.accentSoft);
    root.style.setProperty('--accent-strong', semantic.accentStrong);
    root.style.setProperty('--secondary-soft', semantic.secondarySoft);
    root.style.setProperty('--compare-bar-bg', semantic.compareSurface);
    root.style.setProperty('--compare-bar-border', semantic.floatingBorder);
    root.style.setProperty('--overlay-backdrop', semantic.overlayBackdrop);
    root.style.setProperty('--button-primary-text', semantic.buttonPrimaryText);
    root.style.setProperty('--button-secondary-bg', semantic.buttonSecondaryBg);
    root.style.setProperty('--button-secondary-border', semantic.buttonSecondaryBorder);
    root.style.setProperty('--button-ghost-bg', semantic.buttonGhostBg);
    root.style.setProperty('--input-bg', semantic.inputBg);
    root.style.setProperty('--input-border', semantic.inputBorder);
    root.style.setProperty('--icon-button-bg', semantic.iconButtonBg);
    root.style.setProperty('--icon-button-border', semantic.iconButtonBorder);
    root.style.setProperty('--site-header-bg', semantic.siteHeaderBg);
    root.style.setProperty('--site-header-border', semantic.siteHeaderBorder);
    root.style.setProperty('--publication-pill-bg', semantic.publicationPillBg);
    root.style.setProperty('--modal-bg', semantic.modalBg);
    root.style.setProperty('--menu-bg', semantic.menuBg);
    root.style.setProperty('--toast-bg', semantic.toastBg);
    root.style.setProperty('--bg-glow-primary', semantic.bgGlowPrimary);
    root.style.setProperty('--bg-glow-secondary', semantic.bgGlowSecondary);
    root.dataset.template = theme.templateId;
    root.dataset.density = theme.density;
    body.dataset.template = theme.templateId;
    document.title = seo.siteTitle || branding.brandName;

    let themeMeta = document.querySelector('meta[name="theme-color"]');
    if (!themeMeta) {
      themeMeta = document.createElement('meta');
      themeMeta.setAttribute('name', 'theme-color');
      document.head.appendChild(themeMeta);
    }
    themeMeta.setAttribute('content', seo.themeColor || theme.primaryColor);

    if (branding.faviconUrl) {
      let favicon = document.querySelector("link[rel='icon']");
      if (!favicon) {
        favicon = document.createElement('link');
        favicon.setAttribute('rel', 'icon');
        document.head.appendChild(favicon);
      }
      favicon.setAttribute('href', branding.faviconUrl);
    }

    if (!snapshot.tenant.localization.enabledLocales.includes(i18n.resolvedLanguage as never)) {
      void i18n.changeLanguage(snapshot.tenant.localization.defaultLocale);
    }
  }, [branding, i18n, seo, snapshot.tenant.localization, theme]);

  return null;
};
