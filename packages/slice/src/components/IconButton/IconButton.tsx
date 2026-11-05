'use client';
import React from 'react';
import { ActionButton } from './ActionButton';
import type { IconButtonProps } from './_types';

export const IconButton = React.memo(function IconButton(props: IconButtonProps) {
	return <ActionButton {...props} />;
});
