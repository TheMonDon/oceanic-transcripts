import type { CSSProperties } from 'react';
import { ButtonStyles } from 'oceanic.js';

// Container styles
export const containerStyle: CSSProperties = {
  display: 'grid',
  gap: '4px',
  width: '100%',
  maxWidth: '500px',
  borderRadius: '8px',
  overflow: 'hidden',
};

// Base image style
export const baseImageStyle: CSSProperties = {
  overflow: 'hidden',
  position: 'relative',
  background: '#2b2d31',
};

// Button style mapping
export const ButtonStyleMapping = {
  [ButtonStyles.PRIMARY]: 'primary',
  [ButtonStyles.SECONDARY]: 'secondary',
  [ButtonStyles.SUCCESS]: 'success',
  [ButtonStyles.DANGER]: 'destructive',
  [ButtonStyles.LINK]: 'secondary',
} as const;

// Get button style based on type
export const getButtonStyle = (type: string): CSSProperties => ({
  backgroundColor:
    type === 'primary'
      ? 'hsl(234.935 calc(1*85.556%) 64.706% /1)'
      : type === 'secondary'
      ? 'hsl(240 calc(1*4%) 60.784% /0.12156862745098039)'
      : type === 'success'
      ? 'hsl(145.97 calc(1*100%) 26.275% /1)'
      : type === 'destructive'
      ? 'hsl(355.636 calc(1*64.706%) 50% /1)'
      : '#2b2d31',
  color: '#ffffff',
  padding: '2px 16px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: '500',
  height: '32px',
  minHeight: '32px',
  minWidth: '60px',
  cursor: 'pointer',
  fontFamily: 'Whitney, "Helvetica Neue", Helvetica, Arial, sans-serif',
  textAlign: 'center',
  boxSizing: 'border-box',
  border: 'none',
  outline: 'none',
  transition: 'background-color 0.2s ease',
});

// Select menu styles
export const selectMenuStyle: CSSProperties = {
  marginTop: '2px',
  marginBottom: '2px',
  position: 'relative',
  width: '100%',
  maxWidth: '500px',
  height: '40px',
  backgroundColor: '#2b2d31',
  borderRadius: '4px',
  color: '#b5bac1',
  cursor: 'pointer',
  fontFamily: 'Whitney, "Helvetica Neue", Helvetica, Arial, sans-serif',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  padding: '0 8px',
  justifyContent: 'space-between',
  boxSizing: 'border-box',
  border: '1px solid #1e1f22',
};
