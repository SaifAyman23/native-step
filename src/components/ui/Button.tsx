import {
  cloneElement,
  isValidElement,
  useEffect,
  type ReactElement,
  type ReactNode,
} from "react";
import { Pressable, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { tapImpact } from "@/lib/haptics";
import { cn } from "@/lib/utils";

import type { IconWeight, QootIconProps } from "./Icon";
import { useQootIcon } from "./Icon";
import { PressEdge, pressRadius } from "./PressEdge";
import { Spinner } from "./Spinner";
import { Txt as Text } from "./Txt";

/*
 * HOW TO STYLE THIS BUTTON
 *
 *   Change every button of a size    -> edit a row in SIZES.
 *   Change every button of a variant -> edit a row in VARIANTS.
 *   Change one button                -> pass className / textClassName /
 *                                       containerClassName where you use it.
 *
 * The final look is built in one place, in this order, and later classes win:
 *   size  ->  variant  ->  disabled  ->  your className
 * so a className like `h-14 px-4` on a single button overrides the size.
 */

export type ButtonVariant =
  "primary" | "green" | "secondary" | "tonal" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";
/** @deprecated Use `secondary`. */
export type LegacyButtonVariant = "outline";

// ── Sizes ────────────────────────────────────────────────────────────────────
// height + padding of the button, the label text size, and the icon size in px.
const SIZES: Record<
  ButtonSize,
  { height: string; padding: string; text: string; icon: number }
> = {
  sm: { height: "h-[34px]", padding: "px-s5", text: "text-sm", icon: 16 },
  md: { height: "h-[52px]", padding: "px-s7", text: "text-base", icon: 20 },
  lg: { height: "h-[60px]", padding: "px-s7", text: "text-lg", icon: 22 },
};

// ── Variants ─────────────────────────────────────────────────────────────────
interface VariantStyle {
  /** Background and border of the button. */
  box: string;
  /** Label colour. */
  text: string;
  /** Label font. */
  font: string;
  /** Icon colour token (used when no `iconTone` is passed). */
  icon: "on-primary" | "primary-text";
  /** Colour of the 3D edge under the button. Leave out for a flat button. */
  edge?: string;
  /** How many px the button sinks while pressed. */
  sink: number;
  /** Overrides the size's height (ghost keeps a 44px touch target at every size). */
  height?: string;
}

const VARIANTS: Record<ButtonVariant, VariantStyle> = {
  primary: {
    box: "bg-primary",
    text: "text-on-primary",
    font: "font-rubik-bold",
    icon: "on-primary",
    edge: "bg-primary-edge",
    sink: 3,
  },
  green: {
    box: "bg-success",
    text: "text-success-knob",
    font: "font-rubik-bold",
    icon: "on-primary",
    edge: "bg-success-edge",
    sink: 3,
  },
  danger: {
    box: "bg-error",
    text: "text-black",
    font: "font-rubik-bold",
    icon: "on-primary",
    edge: "bg-error-edge",
    sink: 3,
  },
  secondary: {
    box: "border-2 border-border-strong bg-surface",
    text: "text-text",
    font: "font-rubik-bold",
    icon: "primary-text",
    edge: "bg-border-strong",
    sink: 2,
  },
  tonal: {
    box: "bg-primary-tint",
    text: "text-primary-text",
    font: "font-rubik-bold",
    icon: "primary-text",
    // The face is a tint, so the edge behind it shows through. A bright brand
    // colour under a pale tint reads as a soft shelf, where a darker one would
    // turn the bottom of the button muddy.
    edge: "bg-primary-tint",
    sink: 2,
  },
  ghost: {
    box: "bg-transparent",
    text: "text-primary-text",
    font: "font-rubik-semibold",
    icon: "primary-text",
    // Nothing to sit on, so the button stays flat.
    sink: 1,
    height: "h-[44px]",
  },
};

// Disabled replaces the variant's box and label colour entirely (no border).
const DISABLED_BOX = "bg-surface-3";
const DISABLED_TEXT = "text-text-3";
// The edge follows the face when it is off, so a disabled button is never a
// grey slab with a live brand colour still showing underneath it.
const DISABLED_EDGE = "bg-border-strong";

/** The variants that commit something, and so answer with a tap. */
const COMMITTING_VARIANTS = new Set<ButtonVariant>([
  "primary",
  "green",
  "danger",
]);

interface ButtonProps {
  /** Children go inside a `<Text>` automatically. Pass your own element to take over the label. */
  children?: ReactNode;
  /** Shorthand for a plain string label. */
  title?: string;
  /** Cross-fades the label when `title` changes, without moving the button. */
  animateTitle?: boolean;
  onPress?: () => void;
  variant?: ButtonVariant | LegacyButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  /** Shows a spinner, marks the button busy, and blocks repeat presses. */
  loading?: boolean;
  /** Full width. Otherwise the button is only as wide as its content. */
  block?: boolean;
  /** Shown before the label; its colour, size and weight are set for you. */
  icon?: ReactElement;
  iconTone?: Parameters<typeof useQootIcon>[0];
  iconWeight?: IconWeight;
  accessibilityLabel?: string;
  /** Extra classes for the button itself (size, padding, radius, colours). */
  className?: string;
  /** Extra classes for the label text. */
  textClassName?: string;
  /** Extra classes for the wrapper around the button (margin, alignment, width). */
  containerClassName?: string;
}

/**
 * The press edge is a separate rounded `View` behind the button, not a border on
 * it. A border paints square corners on Android no matter what radius the box
 * has; an element with its own radius never can. The button sits on top and sinks
 * on press, so the edge shows at rest and thins out under the finger.
 */
export function Button({
  children,
  title,
  animateTitle = false,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  block = false,
  icon,
  iconTone,
  iconWeight = "bold",
  accessibilityLabel,
  className,
  textClassName,
  containerClassName,
}: ButtonProps) {
  // `outline` is the old name for `secondary`.
  const style = VARIANTS[variant === "outline" ? "secondary" : variant];
  const dimensions = SIZES[size];
  const hasEdge = !!style.edge;
  const inert = disabled || loading;

  // 0 = resting, 1 = fully pressed. Drives how far the button sinks.
  const pressed = useSharedValue(0);

  useEffect(() => {
    if (inert) pressed.set(0);
  }, [inert, pressed]);

  const sinkStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pressed.get() * style.sink }],
  }));

  const iconProps = useQootIcon(
    inert ? "text-3" : (iconTone ?? style.icon),
    dimensions.icon,
    iconWeight,
  );

  const handlePress = () => {
    if (COMMITTING_VARIANTS.has(variant === "outline" ? "secondary" : variant))
      tapImpact();
    onPress?.();
  };

  const button = (
    <Pressable
      onPress={handlePress}
      disabled={inert}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ disabled: inert, busy: loading }}
      onPressIn={() => pressed.set(1)}
      onPressOut={() => pressed.set(0)}
      pressRetentionOffset={12}
      className={cn(
        // layout
        "w-fit flex-row items-center justify-center gap-s2",
        // size
        style.height ?? dimensions.height,
        dimensions.padding,
        pressRadius[size],
        // variant (or the disabled look)
        inert ? DISABLED_BOX : style.box,
        // per-use overrides always win
        className,
      )}
    >
      {loading ? (
        <Spinner size={dimensions.icon + 4} color={style.icon} />
      ) : icon && isValidElement(icon) ? (
        cloneElement(icon as ReactElement<QootIconProps>, iconProps)
      ) : null}

      {typeof children === "string" || typeof children === "number" ? (
        <Text
          className={cn(
            "text-center",
            dimensions.text,
            style.font,
            inert ? DISABLED_TEXT : style.text,
            textClassName,
          )}
        >
          {children}
        </Text>
      ) : (
        (children ??
        (animateTitle ? (
          <Animated.View key={title} entering={FadeIn.duration(160)}>
            <Text
              className={cn(
                "text-center",
                dimensions.text,
                style.font,
                inert ? DISABLED_TEXT : style.text,
                textClassName,
              )}
            >
              {title}
            </Text>
          </Animated.View>
        ) : (
          <Text
            className={cn(
              "text-center",
              dimensions.text,
              style.font,
              inert ? DISABLED_TEXT : style.text,
              textClassName,
            )}
          >
            {title}
          </Text>
        )))
      )}
    </Pressable>
  );

  return (
    <View
      className={cn(hasEdge && "pb-s2", containerClassName)}
      // Inline, because `w-fit` is not compiled by NativeWind on native — the
      // wrapper fell back to column-stretch, so `PressEdge` (absolute,
      // inset-x-0) spanned the parent instead of the button body and read as
      // a shadow spread past the face. `width: 'fit-content'` shrink-wraps the
      // wrapper to its content natively, and `alignSelf: 'center'` keeps it
      // centred in column and row parents.
      style={
        block
          ? undefined
          : { width: 'fit-content' as const, alignSelf: 'center' as const }
      }
    >
      {hasEdge ? (
        <PressEdge
          size={size}
          tone={inert ? DISABLED_EDGE : (style.edge ?? '')}
        />
      ) : null}
      <Animated.View
        style={[hasEdge ? sinkStyle : undefined, block ? undefined : { alignSelf: 'center' as const }]}
      >
        {button}
      </Animated.View>
    </View>
  );
}
