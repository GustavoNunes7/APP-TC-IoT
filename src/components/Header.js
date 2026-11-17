import React, { useEffect, useRef } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { router } from "expo-router";
import colors from "../constants/colors";

// Indicador do estado REAL da comunicação com o backend.
// Recebe `connected` e `checking` (vindos do hook useConnection).
// Sem essas props, o indicador não é exibido.
function ConnectionPill({ connected, checking }) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (checking) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 0.3, duration: 600, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
    pulse.setValue(1);
    return undefined;
  }, [checking, pulse]);

  const tone = checking ? colors.warning : connected ? colors.success : colors.error;
  const label = checking ? "VERIFICANDO" : connected ? "ONLINE" : "OFFLINE";

  return (
    <View style={[styles.pill, { borderColor: tone }]}>
      <Animated.View style={[styles.pillDot, { backgroundColor: tone, opacity: pulse }]} />
      <Text style={[styles.pillText, { color: tone }]}>{label}</Text>
    </View>
  );
}

// Cabeçalho reutilizável: logotipo TC, nome TECHCAMPUS, identificação IoT
// e (opcionalmente) o indicador de conexão com o servidor.
export default function Header({
  title = "TECHCAMPUS",
  subtitle = "IoT",
  showBack = false,
  onBack,
  connected,
  checking,
}) {
  const showConnection = typeof connected === "boolean" || typeof checking === "boolean";

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {showBack && (
          <Pressable
            style={styles.backButton}
            onPress={onBack || (() => router.back())}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            hitSlop={8}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>
        )}

        <View style={styles.logo}>
          <Text style={styles.logoText}>TC</Text>
        </View>

        <View>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.subtitleRow}>
            <View style={styles.subtitleBar} />
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>
      </View>

      {showConnection && (
        <ConnectionPill connected={connected === true} checking={checking === true} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.primary,
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  logoText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  title: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "bold",
    letterSpacing: 2.5,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 3,
  },
  subtitleBar: {
    width: 14,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.primary,
  },
  subtitle: {
    color: colors.primaryLight,
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 3,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    color: colors.white,
    fontSize: 26,
    lineHeight: 28,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  pillDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  pillText: {
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
});
