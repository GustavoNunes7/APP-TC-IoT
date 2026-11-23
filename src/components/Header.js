
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  Animated,
  StyleSheet,
} from "react-native";
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
          Animated.timing(pulse, {
            toValue: 0.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );

      loop.start();

      return () => loop.stop();
    }

    pulse.setValue(1);
    return undefined;
  }, [checking, pulse]);

  const tone = checking
    ? colors.warning
    : connected
    ? colors.success
    : colors.error;

  const label = checking
    ? "VERIFICANDO"
    : connected
    ? "ONLINE"
    : "OFFLINE";

  return (
    <View style={[styles.pill, { borderColor: tone }]}>
      <Animated.View
        style={[
          styles.pillDot,
          {
            backgroundColor: tone,
            opacity: pulse,
          },
        ]}
      />

      <Text style={[styles.pillText, { color: tone }]}>
        {label}
      </Text>
    </View>
  );
}

// Cabeçalho reutilizável com a logo oficial TechCampus.
export default function Header({
  showBack = false,
  onBack,
  connected,
  checking,
}) {
  const showConnection =
    typeof connected === "boolean" ||
    typeof checking === "boolean";

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

        {/* LOGO TECHCAMPUS */}
        <Image
          source={require("../../assets/images/logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
          accessibilityLabel="Logo TechCampus"
        />
      </View>

      {/* STATUS DA CONEXÃO COM O BACKEND */}
      {showConnection && (
        <ConnectionPill
          connected={connected === true}
          checking={checking === true}
        />
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

  // Dimensões da imagem da logo.
  logoImage: {
    width: 240,
    height: 95,
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
