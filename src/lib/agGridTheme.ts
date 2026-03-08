import { themeAlpine } from 'ag-grid-community'

/**
 * Shared AG Grid theme that uses shadcn CSS variables.
 * Adapts to light/dark mode automatically — no useIsDark() needed.
 */
export const agTheme = themeAlpine.withParams({
  backgroundColor:          'hsl(var(--background))',
  foregroundColor:          'hsl(var(--foreground))',
  headerBackgroundColor:    'hsl(var(--muted))',
  headerForegroundColor:    'hsl(var(--muted-foreground))',
  borderColor:              'hsl(var(--border))',
  rowHoverColor:            'hsl(var(--muted))',
  oddRowBackgroundColor:    'transparent',
  selectedRowBackgroundColor: 'hsl(var(--accent))',
  fontFamily:               'inherit',
  fontSize:                 12,
})
