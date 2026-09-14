import type React from 'react';
import type { Type } from './types';

// base family
const fontFamily = `var(--slice-font-family, "Funnel Sans")`;

// base weights
export const fontWeights = {
	regular: 360,
	medium: 420,
	semi: 480,
	bold: 500,
	extra: 560,
};

// base sizes
export const fontSizes = {
	xs: '0.75rem',
	s: '0.875rem',
	m: '0.9375rem',
	l: '1rem',
	xl: '1.0625rem',
	h1: '4.25rem',
	h2: '3.5rem',
	h3: '2.75rem',
	h4: '2rem',
	h5: '1.5rem',
	h6: '1.0625rem',
};

// base line heights
export const lineHeights = {
	xs: '116.67%',
	s: '128.57%',
	m: '133.33%',
	l: '140%',
	xl: '142.86%',
	xxl: '162.5%',
};

// base letter spacing
export const letterSpacings = {
	xs: '0.00625em',
	s: '0.009375em',
	m: '0.0125em',
	l: '0.015625em',
};

// ** new styles aligned to lyra */
export const type: Type = {
	'body-xs-regular': `
      font-family: ${fontFamily};
      font-weight: ${fontWeights.regular};
      font-size: ${fontSizes.xs};
      line-height: ${lineHeights.m};
      text-decoration: none;
      letter-spacing: ${letterSpacings.m}`,
	'body-xs-medium': `
      font-family: ${fontFamily};
      font-weight: ${fontWeights.medium};
      font-size: ${fontSizes.xs};
      line-height: ${lineHeights.m};
      text-decoration: none;
      letter-spacing: ${letterSpacings.m}`,
	'body-xs-bold': `
      font-family: ${fontFamily};
      font-weight: ${fontWeights.bold};
      font-size: ${fontSizes.xs};
      line-height: ${lineHeights.m};
      text-decoration: none;
      letter-spacing: ${letterSpacings.l}`,
	'body-s-regular': `
      font-family: ${fontFamily};
      font-weight: ${fontWeights.regular};
      font-size: ${fontSizes.s};
      line-height: ${lineHeights.xl};
      text-decoration: none;
      letter-spacing: ${letterSpacings.s}`,
	'body-s-medium': `
      font-family: ${fontFamily};
      font-weight: ${fontWeights.medium};
      font-size: ${fontSizes.s};
      line-height: ${lineHeights.xl};
      text-decoration: none;
      letter-spacing: ${letterSpacings.s}`,
	'body-s-bold': `
      font-family: ${fontFamily};
      font-weight: ${fontWeights.bold};
      font-size: ${fontSizes.s};
      line-height: ${lineHeights.xl};
      text-decoration: none;
      letter-spacing: ${letterSpacings.m}`,
	'body-m-regular': `
      font-family: ${fontFamily};
      font-weight: ${fontWeights.regular};
      font-size: ${fontSizes.m};
      line-height: ${lineHeights.l};
      text-decoration: none;
      letter-spacing: ${letterSpacings.s}`,
	'body-m-medium': `
      font-family: ${fontFamily};
      font-weight: ${fontWeights.medium};
      font-size: ${fontSizes.m};
      line-height: ${lineHeights.l};
      text-decoration: none;
      letter-spacing: ${letterSpacings.s}`,
	'body-m-bold': `
      font-family: ${fontFamily};
      font-weight: ${fontWeights.bold};
      font-size: ${fontSizes.m};
      line-height: ${lineHeights.l};
      text-decoration: none;
      letter-spacing: ${letterSpacings.m}`,
	'body-l-regular': `
      font-family: ${fontFamily};
      font-weight: ${fontWeights.regular};
      font-size: ${fontSizes.l};
      line-height: ${lineHeights.xxl};
      text-decoration: none;
      letter-spacing: ${letterSpacings.xs}`,
	'body-l-medium': `
      font-family: ${fontFamily};
      font-weight: ${fontWeights.medium};
      font-size: ${fontSizes.l};
      line-height: ${lineHeights.xxl};
      text-decoration: none;
      letter-spacing: ${letterSpacings.xs}`,
	'body-l-bold': `
      font-family: ${fontFamily};
      font-weight: ${fontWeights.bold};
      font-size: ${fontSizes.l};
      line-height: ${lineHeights.xxl};
      text-decoration: none;
      letter-spacing: ${letterSpacings.s}`,
	'body-xl-regular': `
      font-family: ${fontFamily};
      font-weight: ${fontWeights.regular};
      font-size: ${fontSizes.xl};
      line-height: ${lineHeights.xxl};
      text-decoration: none;
      letter-spacing: ${letterSpacings.xs}`,
	'body-xl-medium': `
      font-family: ${fontFamily};
      font-weight: ${fontWeights.medium};
      font-size: ${fontSizes.xl};
      line-height: ${lineHeights.xxl};
      text-decoration: none;
      letter-spacing: ${letterSpacings.xs}`,
	'body-xl-bold': `
      font-family: ${fontFamily};
      font-weight: ${fontWeights.bold};
      font-size: ${fontSizes.xl};
      line-height: ${lineHeights.xxl};
      text-decoration: none;
      letter-spacing: ${letterSpacings.s}`,
	h1: `
      font-family: ${fontFamily};
      font-weight: ${fontWeights.extra};
      font-size: ${fontSizes.h1};
      line-height: ${lineHeights.xs};
      letter-spacing: ${letterSpacings.m}`,
	h2: `
      font-family: ${fontFamily};
      font-weight: ${fontWeights.bold};
      font-size: ${fontSizes.h2};
      line-height: ${lineHeights.xs};
      letter-spacing: ${letterSpacings.m}`,
	h3: `
      font-family: ${fontFamily};
      font-weight: ${fontWeights.bold};
      font-size: ${fontSizes.h3};
      line-height: ${lineHeights.xs};
      letter-spacing: ${letterSpacings.m}`,
	h4: `
      font-family: ${fontFamily};
      font-weight: ${fontWeights.bold};
      font-size: ${fontSizes.h4};
      line-height: ${lineHeights.xs};
      letter-spacing: ${letterSpacings.m}`,
	h5: `
      font-family: ${fontFamily};
      font-weight: ${fontWeights.bold};
      font-size: ${fontSizes.h5};
      line-height: ${lineHeights.xs};
      letter-spacing: ${letterSpacings.m}`,
	h6: `
      font-family: ${fontFamily};
      font-weight: ${fontWeights.bold};
      font-size: ${fontSizes.h6};
      line-height: ${lineHeights.xs};
      letter-spacing: ${letterSpacings.m}`,
};

export const typeCssClasses: Record<keyof Type, string> = {
	'body-xs-regular': 'body-xs-regular',
	'body-xs-medium': 'body-xs-medium',
	'body-xs-bold': 'body-xs-bold',
	'body-s-regular': 'body-s-regular',
	'body-s-medium': 'body-s-medium',
	'body-s-bold': 'body-s-bold',
	'body-m-regular': 'body-m-regular',
	'body-m-medium': 'body-m-medium',
	'body-m-bold': 'body-m-bold',
	'body-l-regular': 'body-l-regular',
	'body-l-medium': 'body-l-medium',
	'body-l-bold': 'body-l-bold',
	'body-xl-regular': 'body-xl-regular',
	'body-xl-medium': 'body-xl-medium',
	'body-xl-bold': 'body-xl-bold',
	h1: 'h1',
	h2: 'h2',
	h3: 'h3',
	h4: 'h4',
	h5: 'h5',
	h6: 'h6',
};

export const typeStyles: Record<keyof Type, React.CSSProperties> = {
	'body-xs-regular': {
		fontFamily: `${fontFamily}`,
		fontWeight: `${fontWeights.regular}`,
		fontSize: `${fontSizes.xs}`,
		lineHeight: `${lineHeights.m}`,
		textDecoration: 'none',
		letterSpacing: `${letterSpacings.m}`,
	},
	'body-xs-medium': {
		fontFamily: `${fontFamily}`,
		fontWeight: `${fontWeights.medium}`,
		fontSize: `${fontSizes.xs}`,
		lineHeight: `${lineHeights.m}`,
		textDecoration: 'none',
		letterSpacing: `${letterSpacings.m}`,
	},
	'body-xs-bold': {
		fontFamily: `${fontFamily}`,
		fontWeight: `${fontWeights.bold}`,
		fontSize: `${fontSizes.xs}`,
		lineHeight: `${lineHeights.m}`,
		textDecoration: 'none',
		letterSpacing: `${letterSpacings.l}`,
	},
	'body-s-regular': {
		fontFamily: `${fontFamily}`,
		fontWeight: `${fontWeights.regular}`,
		fontSize: `${fontSizes.s}`,
		lineHeight: `${lineHeights.xl}`,
		textDecoration: 'none',
		letterSpacing: `${letterSpacings.s}`,
	},
	'body-s-medium': {
		fontFamily: `${fontFamily}`,
		fontWeight: `${fontWeights.medium}`,
		fontSize: `${fontSizes.s}`,
		lineHeight: `${lineHeights.xl}`,
		textDecoration: 'none',
		letterSpacing: `${letterSpacings.s}`,
	},
	'body-s-bold': {
		fontFamily: `${fontFamily}`,
		fontWeight: `${fontWeights.bold}`,
		fontSize: `${fontSizes.s}`,
		lineHeight: `${lineHeights.xl}`,
		textDecoration: 'none',
		letterSpacing: `${letterSpacings.m}`,
	},
	'body-m-regular': {
		fontFamily: `${fontFamily}`,
		fontWeight: `${fontWeights.regular}`,
		fontSize: `${fontSizes.m}`,
		lineHeight: `${lineHeights.l}`,
		textDecoration: 'none',
		letterSpacing: `${letterSpacings.s}`,
	},
	'body-m-medium': {
		fontFamily: `${fontFamily}`,
		fontWeight: `${fontWeights.medium}`,
		fontSize: `${fontSizes.m}`,
		lineHeight: `${lineHeights.l}`,
		textDecoration: 'none',
		letterSpacing: `${letterSpacings.s}`,
	},
	'body-m-bold': {
		fontFamily: `${fontFamily}`,
		fontWeight: `${fontWeights.bold}`,
		fontSize: `${fontSizes.m}`,
		lineHeight: `${lineHeights.l}`,
		textDecoration: 'none',
		letterSpacing: `${letterSpacings.m}`,
	},
	'body-l-regular': {
		fontFamily: `${fontFamily}`,
		fontWeight: `${fontWeights.regular}`,
		fontSize: `${fontSizes.l}`,
		lineHeight: `${lineHeights.xxl}`,
		textDecoration: 'none',
		letterSpacing: `${letterSpacings.xs}`,
	},
	'body-l-medium': {
		fontFamily: `${fontFamily}`,
		fontWeight: `${fontWeights.medium}`,
		fontSize: `${fontSizes.l}`,
		lineHeight: `${lineHeights.xxl}`,
		textDecoration: 'none',
		letterSpacing: `${letterSpacings.xs}`,
	},
	'body-l-bold': {
		fontFamily: `${fontFamily}`,
		fontWeight: `${fontWeights.bold}`,
		fontSize: `${fontSizes.l}`,
		lineHeight: `${lineHeights.xxl}`,
		textDecoration: 'none',
		letterSpacing: `${letterSpacings.s}`,
	},
	'body-xl-regular': {
		fontFamily: `${fontFamily}`,
		fontWeight: `${fontWeights.regular}`,
		fontSize: `${fontSizes.xl}`,
		lineHeight: `${lineHeights.xxl}`,
		textDecoration: 'none',
		letterSpacing: `${letterSpacings.xs}`,
	},
	'body-xl-medium': {
		fontFamily: `${fontFamily}`,
		fontWeight: `${fontWeights.medium}`,
		fontSize: `${fontSizes.xl}`,
		lineHeight: `${lineHeights.xxl}`,
		textDecoration: 'none',
		letterSpacing: `${letterSpacings.xs}`,
	},
	'body-xl-bold': {
		fontFamily: `${fontFamily}`,
		fontWeight: `${fontWeights.bold}`,
		fontSize: `${fontSizes.xl}`,
		lineHeight: `${lineHeights.xxl}`,
		textDecoration: 'none',
		letterSpacing: `${letterSpacings.s}`,
	},
	h1: {
		fontFamily: `${fontFamily}`,
		fontWeight: `${fontWeights.extra}`,
		fontSize: `${fontSizes.h1}`,
		lineHeight: `${lineHeights.xs}`,
		letterSpacing: `${letterSpacings.m}`,
	},
	h2: {
		fontFamily: `${fontFamily}`,
		fontWeight: `${fontWeights.extra}`,
		fontSize: `${fontSizes.h2}`,
		lineHeight: `${lineHeights.xs}`,
		letterSpacing: `${letterSpacings.m}`,
	},
	h3: {
		fontFamily: `${fontFamily}`,
		fontWeight: `${fontWeights.extra}`,
		fontSize: `${fontSizes.h3}`,
		lineHeight: `${lineHeights.xs}`,
		letterSpacing: `${letterSpacings.m}`,
	},
	h4: {
		fontFamily: `${fontFamily}`,
		fontWeight: `${fontWeights.extra}`,
		fontSize: `${fontSizes.h4}`,
		lineHeight: `${lineHeights.xs}`,
		letterSpacing: `${letterSpacings.m}`,
	},
	h5: {
		fontFamily: `${fontFamily}`,
		fontWeight: `${fontWeights.extra}`,
		fontSize: `${fontSizes.h5}`,
		lineHeight: `${lineHeights.xs}`,
		letterSpacing: `${letterSpacings.m}`,
	},
	h6: {
		fontFamily: `${fontFamily}`,
		fontWeight: `${fontWeights.extra}`,
		fontSize: `${fontSizes.h6}`,
		lineHeight: `${lineHeights.xs}`,
		letterSpacing: `${letterSpacings.m}`,
	},
};
