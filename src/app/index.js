import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../constants/colors";
import TokenInput from "../components/TokenInput";
import Header from "../components/Header";
import PrimaryButton from "../components/PrimaryButton";
import FadeIn from "../components/FadeIn";
import useConnection from "../hooks/useConnection";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [token, setToken] = useState("");
  const [aviso, setAviso] = useState("");

  // Estado REAL da comunicação com o backend (GET /api/saude).
  const { connected, checking } = useConnection();

  function handleChangeToken(value) {
    setToken(value);
    if (aviso) setAviso("");
  }

  // Lógica original preservada: exige exatamente 6 números e segue para
  // /validar-token, onde a validação acontece no backend.
  function handleValidateToken() {
    const tokenLimpo = token.trim();

    if (!/^\d{6}$/.test(tokenLimpo)) {
      setAviso("Digite o token numérico de 6 dígitos.");
      return;
    }

    router.push({
      pathname: "/validar-token",
      params: { token: tokenLimpo },
    });
  }

  const incompleto = token.length !== 6;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Brilho vermelho decorativo, bem discreto. */}
      <View style={styles.glow} pointerEvents="none" />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FadeIn>
          <Header connected={connected} checking={checking} />
        </FadeIn>

        <FadeIn delay={120} style={styles.hero}>
          <View style={styles.eyebrowRow}>
            <View style={styles.eyebrowLine} />
            <Text style={styles.eyebrow}>LIBERAÇÃO INTELIGENTE</Text>
          </View>
          <Text style={styles.title}>Insira seu TOKEN</Text>
          <Text style={styles.description}>
            Digite o código de seis dígitos recebido após a confirmação do seu
            pedido para iniciar a retirada.
          </Text>
        </FadeIn>

        <FadeIn delay={240}>
          <View style={styles.panel}>
            <TokenInput
              value={token}
              onChangeText={handleChangeToken}
              error={!!aviso}
              autoFocus
            />

            <View style={styles.messageSlot}>
              {!!aviso && <Text style={styles.avisoText}>{aviso}</Text>}
              {!aviso && (
                <Text style={styles.counterText}>
                  {token.length} de 6 dígitos
                </Text>
              )}
            </View>

            <PrimaryButton
              title="VALIDAR TOKEN"
              icon="✓"
              onPress={handleValidateToken}
              disabled={incompleto}
            />
          </View>
        </FadeIn>

        <FadeIn delay={360} style={styles.securityContainer}>
          <View style={styles.securityRow}>
            <View style={styles.lockBadge}>
              <Text style={styles.lockText}>🔒</Text>
            </View>
            <Text style={styles.securityText}>
              Validação segura pelo sistema TechCampus.
            </Text>
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>TechCampus IoT • SENAI</Text>
            <View
              style={[
                styles.footerDot,
                {
                  backgroundColor: checking
                    ? colors.warning
                    : connected
                    ? colors.success
                    : colors.error,
                },
              ]}
            />
          </View>
        </FadeIn>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  glow: {
    position: "absolute",
    top: -140,
    alignSelf: "center",
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: colors.primarySoft,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
  },
  hero: {
    marginTop: 34,
    marginBottom: 28,
  },
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  eyebrowLine: {
    width: 22,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.primary,
  },
  eyebrow: {
    color: colors.primaryLight,
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 3,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "bold",
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  panel: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 18,
    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  messageSlot: {
    minHeight: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 6,
  },
  counterText: {
    color: colors.textMuted,
    fontSize: 12,
    letterSpacing: 1,
  },
  avisoText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },
  securityContainer: {
    marginTop: 26,
    alignItems: "center",
    gap: 16,
  },
  securityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  lockBadge: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: colors.primarySoft,
    justifyContent: "center",
    alignItems: "center",
  },
  lockText: {
    fontSize: 13,
  },
  securityText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 11,
    letterSpacing: 0.5,
  },
  footerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
