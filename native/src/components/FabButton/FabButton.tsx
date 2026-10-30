import { StyleSheet, View } from 'react-native';
import { borderRadiusToNumber } from '../../utils';
import { controlCorners } from '../../utils/styles/controlStyles';
import { Button } from '../Button';
import type { FabButtonProps } from './_types';

/**
 * Floating button with an unclipped shadow wrapper that sizes to its content.
 * Always uses regular rendering; Liquid Glass is not supported.
 */
export function FabButton(props: Readonly<FabButtonProps>) {
	const { viewStyle, liquidGlassBackground: _liquidGlassBackground, ...buttonProps } = props;
	const styleCorners = controlCorners(StyleSheet.flatten(props.style) ?? {});
	let corners = { ...styleCorners, borderRadius: styleCorners.borderRadius ?? 1000 };
	if (props.borderRadius !== undefined) {
		corners = { borderRadius: borderRadiusToNumber(props.borderRadius) };
	}
	return (
		<View style={[styles.shadowWrapper, viewStyle, corners, styles.unclipped]}>
			<Button icon="plus" size={56} {...buttonProps} liquidGlassBackground={false} />
		</View>
	);
}

const styles = StyleSheet.create({
	shadowWrapper: {
		// grow with a labeled button.
		alignSelf: 'flex-start',
		alignItems: 'flex-start',
		// Android native shadow uses the wrapper's rounded outline.
		elevation: 6,
		// iOS native shadow stays outside the button's ripple-clipping surface.
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.27,
		shadowRadius: 4.65,
	},
	unclipped: {
		overflow: 'visible',
	},
});
