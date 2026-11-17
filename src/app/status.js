import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../constants/colors";
import useConnection from "../hooks/useConnection";
import Header from "../components/Header";
import StatusCard from "../components/StatusCard";
import PrimaryButton from "../components/PrimaryButton";
import FadeIn from "../components/FadeIn";

export default function StatusScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const token = Array.isArray(params.token) ? params.token[0] : params.token;
  const produtos = Array.isArray(params.produtos) ? params.produtos[0] : params.produtos;
  const pedidoId = Array.isArray(params.pedidoId) ? params.pedidoId[0] : params.pedidoId;
  const autorizado = params.autorizado === "true";

  // Esta verificação é do backend, não do ESP8266.
  const { connected, checking, message, checkConnection } = useConnection();

  const tone = autorizado ? colors.success : colors.error;
  const toneSoft = autorizado ? colors.successSoft : colors.errorSoft;
  const digits = String(token || "").split("");

  return (
    <View style={styles.container}>
      <View style={[styles.glow, { backgroundColor: toneSoft }]} pointerEvents="none" />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <FadeIn>
          <Header connected={connected} checking={checking} />
        </FadeIn>

        {/* Resultado da validação */}
        <FadeIn delay={120} style={[styles.mainCard, { borderColor: tone }]}>
          <View style={[styles.statusIcon, { backgroundColor: tone }]}>
            <Text style={styles.statusIconText}>{autorizado ? "✓" : "!"}</Text>
          </View>
          <Text style={[styles.eyebrow, { color: tone }]}>
            {autorizado ? "LIBERAÇÃO AUTORIZADA" : "ACESSO NEGADO"}
          </Text>
          <Text style={styles.mainTitle}>
            {autorizado ? "Token validado!" : "Retirada não autorizada"}
          </Text>
          <Text style={styles.mainDescription}>
            {autorizado
              ? "O backend confirmou que o token é válido. Aguarde a liberação pelo equipamento."
              : "O token não foi autorizado pelo servidor."}
          </Text>

          {!!token && (
            <View style={styles.tokenRow}>
              {Array.from({ length: 6 }).map((_, i) => (
                <View key={i} style={[styles.tokenBox, { borderColor: tone }]}>
                  <Text style={styles.tokenDigit}>{digits[i] || "–"}</Text>
                </View>
              ))}
            </View>
          )}
        </FadeIn>

        {/* Pedido e produtos: só aparecem quando o backend informou. */}
        {(!!pedidoId || !!produtos) && (
          <FadeIn delay={220} style={styles.card}>
            <Text style={styles.sectionTitle}>PEDIDO</Text>
            {!!pedidoId && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Identificação</Text>
                <Text style={styles.detailValue}>#{pedidoId}</Text>
              </View>
            )}
            {!!pedidoId && !!produtos && <View style={styles.separator} />}
            {!!produtos && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Produtos</Text>
                <Text style={[styles.detailValue, styles.detailValueWrap]}>{produtos}</Text>
              </View>
            )}
          </FadeIn>
        )}

        {/* Comunicação */}
        <FadeIn delay={320} style={styles.cardList}>
          <Text style={styles.sectionTitle}>COMUNICAÇÃO</Text>

          <StatusCard
            icon="⇄"
            title="Servidor TechCampus"
            description={message}
            status={checking ? "Verificando" : connected ? "Conectado" : "Offline"}
            type={checking ? "warning" : connected ? "success" : "error"}
          />

          {/* O backend atual não fornece telemetria do ESP8266 nem do LED,
              então nada é afirmado sobre eles. */}
          <StatusCard
            icon="◈"
            title="ESP8266"
            description="O backend atual ainda não fornece telemetria do dispositivo."
            status="Não verificado"
            type="warning"
          />
          <StatusCard
            icon="●"
            title="LED indicador"
            description="O aplicativo ainda não recebe confirmação do estado do LED."
            status="Aguardando ESP"
            type="warning"
          />
        </FadeIn>

        <FadeIn delay={420} style={styles.actions}>
          <PrimaryButton
            title={checking ? "VERIFICANDO..." : "VERIFICAR SERVIDOR"}
            icon="↻"
            variant="outline"
            onPress={checkConnection}
            disabled={checking}
          />
          <PrimaryButton
            title="VOLTAR AO INÍCIO"
            onPress={() => router.replace("/")}
          />
        </FadeIn>

        <Text style={styles.footer}>TechCampus IoT • SENAI</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  glow: {
    position: "absolute",
    top: -140,
    alignSelf: "center",
    width: 360,
    height: 360,
    borderRadius: 180,
  },
  content: { flexGrow: 1, paddingHorizontal: 22 },
  mainCard: {
    marginTop: 28,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
    alignItems: "center",
    marginBottom: 16,
  },
  statusIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  statusIconText: { color: colors.white, fontSize: 34, fontWeight: "bold" },
  eyebrow: { fontSize: 11, fontWeight: "bold", letterSpacing: 3, marginBottom: 8 },
  mainTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  mainDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
  tokenRow: { flexDirection: "row", justifyContent: "center", gap: 7, marginTop: 20 },
  tokenBox: {
    width: 40,
    height: 48,
    borderRadius: 11,
    borderWidth: 1.5,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  tokenDigit: { color: colors.white, fontSize: 20, fontWeight: "bold" },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    marginBottom: 16,
  },
  cardList: { gap: 10, marginBottom: 20 },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 6,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 14,
    paddingTop: 8,
  },
  detailLabel: { color: colors.textMuted, fontSize: 12 },
  detailValue: { color: colors.text, fontSize: 14, fontWeight: "bold" },
  detailValueWrap: { flex: 1, textAlign: "right" },
  separator: { height: 1, backgroundColor: colors.border, marginTop: 10 },
  actions: { gap: 12 },
  footer: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: "center",
    marginTop: 26,
    letterSpacing: 0.5,
  },
});
