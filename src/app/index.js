import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import colors from "../constants/colors";
import TokenInput from "../components/TokenInput";

export default function HomeScreen() {
  const [token, setToken] = useState("");

  function handleValidateToken() {
    const tokenLimpo = token.trim();

    if (!/^\d{6}$/.test(tokenLimpo)) {
      alert("Digite o token numérico de 6 dígitos.");
      return;
    }

    router.push({
      pathname: "/validar-token",
      params: { token: tokenLimpo },
    });
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.brandName}>TechCampus</Text>
          <Text style={styles.brandSubtitle}>
            SISTEMA DE RETIRADA INTELIGENTE
          </Text>
          <View style={styles.headerDivider} />
          <Text style={styles.stepText}>ETAPA 2 DE 2</Text>
        </View>

        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Token de retirada</Text>
          <Text style={styles.description}>
            Digite o código de 6 números para liberar a retirada do seu item.
          </Text>
        </View>

        {/* Componente reutilizável com seis quadrados de digitação. */}
        <TokenInput value={token} onChangeText={setToken} />

        <TouchableOpacity
          style={[styles.button, token.length !== 6 && styles.buttonDisabled]}
          onPress={handleValidateToken}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>VALIDAR TOKEN</Text>
        </TouchableOpacity>

        <View style={styles.securityContainer}>
          <Text style={styles.securityText}>
            Seu token é validado pelo sistema TechCampus.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>TechCampus IoT • SENAI</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 25,
    paddingTop: 38,
  },
  header: {
    alignItems: "center",
    marginBottom: 34,
  },
  brandName: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "bold",
  },
  brandSubtitle: {
    color: colors.textSecondary,
    fontSize: 9,
    letterSpacing: 1.5,
    marginTop: 5,
  },
  headerDivider: {
    width: "100%",
    height: 1,
    backgroundColor: colors.border,
    marginTop: 22,
    marginBottom: 13,
  },
  stepText: {
    color: colors.textSecondary,
    fontSize: 12,
    letterSpacing: 1,
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  welcomeTitle: {
    color: colors.text,
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  button: {
    backgroundColor: colors.primary,
    height: 54,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.75,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  securityContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  securityText: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: "center",
  },
  footer: {
    paddingVertical: 18,
    alignItems: "center",
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 11,
  },
});
