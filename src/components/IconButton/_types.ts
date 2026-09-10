import type { Transition, Variants } from 'motion/react';
import type React from 'react';
import type { ToolTip } from '../sharedTypes';

/**
 * Helper for quick popular animation effects
 */
export enum AnimationPreset {
	Rotate = 'rotate',
	Fade = 'fade',
	Scale = 'scale',
}

/**
 * Popular types
 */
export enum AnimationType {
	Rotate = 'rotate',
	Fade = 'opacity',
	Scale = 'scale',
}

/**
 * Motion value for initial, animate
 */
export type MotionValue = { off: number | string; on: number | string };

/**
 * Animation type and motion value
 */
export type AnimationValue = {
	type: AnimationType | string;
	value: MotionValue;
};

/**
 * Transition values for on and optionally off
 */
export type TransitionValue = { on: Transition; off?: Transition };

/**
 * Overall button animation definition
 */
export type ButtonAnimation = {
	animation: AnimationValue[] | AnimationValue;
	transition?: TransitionValue;
};

type IconButtonBaseProps = {
	round?: boolean;
	frameSize?: number;
	iconSize?: number;
	iconFill?: boolean;
	icon?: string;
	iconColor?: string;
	iconColorOn?: string;
	iconColorHover?: string;
	tooltip?: string;
	color?: string;
	colorOn?: string;
	fillColor?: number;
	disabled?: boolean;
	bgColor?: string;
	bgColorOn?: string;
	bgColorHover?: string;
	toggle?: boolean;
	hover?: boolean;
	toggleIcon?: boolean;
	isToggled?: boolean;
	showDot?: boolean;
	count?: number;
	transition?: Transition;
	label?: string;
	border?: boolean;
	variants?: Variants;
	initial?: string;
	animate?: string;
	exit?: string;
	borderRadius?: number;
	onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	onToolTip?: (tip: ToolTip | null) => void;
	buttonSize?: 's' | 'm' | 'l' | 'xl';
	presetAnimations?: AnimationPreset;
	customAnimations?: ButtonAnimation;
};

export type IconButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof IconButtonBaseProps> &
	IconButtonBaseProps;
