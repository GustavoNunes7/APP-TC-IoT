import React, { useRef } from "react";
import {
  Pressable,
  Text,
  View,
  ActivityIndicator,
  Animated,
  StyleSheet,
} from "react-native";
import colors from "../constants/colors";

// Botão principal reutilizável, com animação ao pressionar.
export default function PrimaryButton({
  title = "CONTINUAR",
  onPress,
  loading = false,
  disabled = false,
  fullWidth = true,
  // Glifo opcional exibido antes do texto (ex.: "✓", "↻").
  icon,
  // "solid" (vermelho) ou "outline".
  variant = "solid",
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const isDisabled = disabled || loading;
  const outline = variant === "outline";

  function animateTo(value) {
    Animated.spring(scale, {
      toValue: value,
      friction: 7,
      tension: 200,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Animated.View
      style={[
        fullWidth && styles.fullWidth,
        { transform: [{ scale }] },
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        onPressIn={() => animateTo(0.97)}
        onPressOut={() => animateTo(1)}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled }}
        style={[
          styles.button,
          outline ? styles.outline : styles.solid,
          !outline && !isDisabled && styles.glow,
          isDisabled && !loading && (outline ? styles.disabledOutline : styles.disabledSolid),
        ]}
      >
        {/* Faixa superior clara simula um gradiente discreto, sem dependências. */}
        {!outline && !isDisabled && <View style={styles.sheen} pointerEvents="none" />}

        {loading ? (
          <ActivityIndicator color={colors.white} size="small" />
        ) : (
          <View style={styles.content}>
            {!!icon && <Text style={[styles.icon, isDisabled && styles.textDisabled]}>{icon}</Text>}
            <Text
              style={[
                styles.text,
                outline && styles.textOutline,
                isDisabled && styles.textDisabled,
              ]}
            >
              {title}
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fullWidth: { width: "100%" },
  button: {
    height: 58,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  solid: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  glow: {
    shadowColor: colors.primary,
    shadowOpacity: 0.55,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  sheen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "48%",
    backgroundColor: "rgba(255,255,255,0.09)",
  },
  disabledSolid: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  disabledOutline: {
    borderColor: colors.border,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  icon: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "bold",
  },
  text: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  textOutline: {
    color: colors.primaryLight,
  },
  textDisabled: {
    color: colors.textMuted,
  },
});
