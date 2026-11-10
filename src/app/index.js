import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import colors from "../constants/colors";

export default function HomeScreen() {
  const [token, setToken] = useState("");
  const [focused, setFocused] = useState(false);

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
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>TC</Text>
          </View>
          <Text style={styles.brandName}>TechCampus</Text>
          <Text style={styles.brandSubtitle}>
            SISTEMA DE RETIRADA INTELIGENTE
          </Text>
        </View>

        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Olá, aluno!</Text>
          <Text style={styles.description}>
            Insira seu token de retirada para acessar o sistema de liberação.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>TOKEN DE RETIRADA</Text>

          <TextInput
            style={[styles.input, focused && styles.inputFocused]}
            placeholder="Digite os 6 números"
            placeholderTextColor={colors.placeholder}
            value={token}
            onChangeText={(value) => setToken(value.replace(/\D/g, "").slice(0, 6))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            keyboardType="number-pad"
            maxLength={6}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleValidateToken}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>VALIDAR TOKEN</Text>
          </TouchableOpacity>
        </View>

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
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 45,
  },
  logo: {
    width: 75,
    height: 75,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  logoText: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "bold",
  },
  brandName: {
    color: colors.text,
    fontSize: 29,
    fontWeight: "bold",
  },
  brandSubtitle: {
    color: colors.textSecondary,
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 7,
  },
  welcomeContainer: {
    marginBottom: 25,
  },
  welcomeTitle: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 23,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 12,
  },
  input: {
    backgroundColor: colors.inputBackground,
    color: colors.text,
    height: 55,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  button: {
    backgroundColor: colors.primary,
    height: 55,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 14,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  securityContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  securityText: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: "center",
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 11,
  },
});
