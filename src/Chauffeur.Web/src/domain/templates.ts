import type { TenantTemplateId, TenantTheme } from './models';

export interface TemplateDefinition {
  id: TenantTemplateId;
  translationKey: string;
  descriptionKey: string;
  previewGradient: string;
  defaultTheme: TenantTheme;
}

export const templateThemePresets: Record<TenantTemplateId, TenantTheme> = {
  'classic-luxury': {
    templateId: 'classic-luxury',
    primaryColor: '#d4a457',
    secondaryColor: '#6f543a',
    accentColor: '#f1c27d',
    surfaceColor: '#171310',
    surfaceSoftColor: '#201b16',
    headingFont: "'Cormorant Garamond', serif",
    bodyFont: "'Manrope', sans-serif",
    radiusScale: 'rounded',
    density: 'comfortable',
  },
  'modern-minimal': {
    templateId: 'modern-minimal',
    primaryColor: '#d3b18a',
    secondaryColor: '#6d7384',
    accentColor: '#f0e1d2',
    surfaceColor: '#111216',
    surfaceSoftColor: '#1a1d24',
    headingFont: "'Cormorant Garamond', serif",
    bodyFont: "'Manrope', sans-serif",
    radiusScale: 'soft',
    density: 'comfortable',
  },
  'cinematic-exotic': {
    templateId: 'cinematic-exotic',
    primaryColor: '#d74c3c',
    secondaryColor: '#5b1f19',
    accentColor: '#ffb39e',
    surfaceColor: '#120c0b',
    surfaceSoftColor: '#1d1210',
    headingFont: "'Cormorant Garamond', serif",
    bodyFont: "'Manrope', sans-serif",
    radiusScale: 'dramatic',
    density: 'comfortable',
  },
  'romantic-wedding': {
    templateId: 'romantic-wedding',
    primaryColor: '#d8a9a0',
    secondaryColor: '#8f625e',
    accentColor: '#f5dfda',
    surfaceColor: '#181212',
    surfaceSoftColor: '#241a1a',
    headingFont: "'Cormorant Garamond', serif",
    bodyFont: "'Manrope', sans-serif",
    radiusScale: 'rounded',
    density: 'comfortable',
  },
};

export const tenantTemplates: TemplateDefinition[] = [
  {
    id: 'classic-luxury',
    translationKey: 'templates.classicLuxury.title',
    descriptionKey: 'templates.classicLuxury.description',
    previewGradient: 'linear-gradient(135deg, #e0b46f, #6f543a)',
    defaultTheme: templateThemePresets['classic-luxury'],
  },
  {
    id: 'modern-minimal',
    translationKey: 'templates.modernMinimal.title',
    descriptionKey: 'templates.modernMinimal.description',
    previewGradient: 'linear-gradient(135deg, #d7d9de, #737885)',
    defaultTheme: templateThemePresets['modern-minimal'],
  },
  {
    id: 'cinematic-exotic',
    translationKey: 'templates.cinematicExotic.title',
    descriptionKey: 'templates.cinematicExotic.description',
    previewGradient: 'linear-gradient(135deg, #d74c3c, #171310)',
    defaultTheme: templateThemePresets['cinematic-exotic'],
  },
  {
    id: 'romantic-wedding',
    translationKey: 'templates.romanticWedding.title',
    descriptionKey: 'templates.romanticWedding.description',
    previewGradient: 'linear-gradient(135deg, #f0d7d2, #a66d66)',
    defaultTheme: templateThemePresets['romantic-wedding'],
  },
];

export const getTemplateDefinition = (templateId: TenantTemplateId): TemplateDefinition =>
  tenantTemplates.find((template) => template.id === templateId) ?? tenantTemplates[0];

export const getTemplateThemePreset = (templateId: TenantTemplateId): TenantTheme => ({
  ...(templateThemePresets[templateId] ?? templateThemePresets['classic-luxury']),
});
