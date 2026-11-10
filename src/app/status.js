import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import colors from "../constants/colors";
import useConnection from "../hooks/useConnection";

export default function StatusScreen() {
  const params = useLocalSearchParams();
  const token = Array.isArray(params.token) ? params.token[0] : params.token;
  const produtos = Array.isArray(params.produtos) ? params.produtos[0] : params.produtos;
  const pedidoId = Array.isArray(params.pedidoId) ? params.pedidoId[0] : params.pedidoId;
  const autorizado = params.autorizado === "true";

  // Esta verificação é do backend, não do ESP8266.
  const { connected, checking, message, checkConnection } = useConnection();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>TechCampus</Text>
        <Text style={styles.headerSubtitle}>STATUS DA RETIRADA</Text>
      </View>

      <View style={styles.mainCard}>
        <View style={[styles.statusIcon, { backgroundColor: autorizado ? colors.success : colors.error }]}>
          <Text style={styles.statusIconText}>{autorizado ? "✓" : "!"}</Text>
        </View>
        <Text style={styles.mainTitle}>
          {autorizado ? "Token validado!" : "Retirada não autorizada"}
        </Text>
        <Text style={styles.mainDescription}>
          {autorizado
            ? "O backend confirmou que o token é válido. Aguarde a liberação pelo equipamento."
            : "O token não foi autorizado pelo servidor."}
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.sectionTitle}>COMUNICAÇÃO</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Servidor TechCampus</Text>
            <Text style={styles.infoSubtitle}>{message}</Text>
          </View>
          <View style={styles.statusContainer}>
            <View style={[styles.dot, { backgroundColor: checking ? colors.warning : connected ? colors.success : colors.error }]} />
            <Text style={styles.statusText}>
              {checking ? "Verificando" : connected ? "Conectado" : "Offline"}
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>ESP8266</Text>
            <Text style={styles.infoSubtitle}>
              O backend atual ainda não fornece telemetria do dispositivo.
            </Text>
          </View>
          <Text style={styles.pendingText}>Não verificado</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>LED indicador</Text>
            <Text style={styles.infoSubtitle}>
              O aplicativo ainda não recebe confirmação do estado do LED.
            </Text>
          </View>
          <Text style={styles.pendingText}>Aguardando ESP</Text>
        </View>
      </View>

      <View style={styles.tokenCard}>
        <Text style={styles.tokenLabel}>TOKEN VALIDADO</Text>
        <Text style={styles.tokenValue}>{token || "Não informado"}</Text>
        {pedidoId ? <Text style={styles.detailText}>Pedido #{pedidoId}</Text> : null}
        {produtos ? <Text style={styles.detailText}>Itens: {produtos}</Text> : null}
      </View>

      <TouchableOpacity
        style={[styles.secondaryButton, checking && styles.disabledButton]}
        onPress={checkConnection}
        disabled={checking}
      >
        <Text style={styles.secondaryButtonText}>
          {checking ? "VERIFICANDO..." : "VERIFICAR SERVIDOR"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.replace("/")}>
        <Text style={styles.buttonText}>VOLTAR AO INÍCIO</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>TechCampus IoT • SENAI</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 48, paddingBottom: 24 },
  header: { marginBottom: 26 },
  headerTitle: { color: colors.text, fontSize: 25, fontWeight: "bold" },
  headerSubtitle: { color: colors.primary, fontSize: 11, letterSpacing: 2, marginTop: 5, fontWeight: "bold" },
  mainCard: { backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 24, alignItems: "center", marginBottom: 18 },
  statusIcon: { width: 62, height: 62, borderRadius: 31, justifyContent: "center", alignItems: "center", marginBottom: 16 },
  statusIconText: { color: colors.white, fontSize: 34, fontWeight: "bold" },
  mainTitle: { color: colors.text, fontSize: 21, fontWeight: "bold", textAlign: "center", marginBottom: 9 },
  mainDescription: { color: colors.textSecondary, fontSize: 13, textAlign: "center", lineHeight: 20 },
  infoCard: { backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border, padding: 18, marginBottom: 16 },
  sectionTitle: { color: colors.textSecondary, fontSize: 11, fontWeight: "bold", letterSpacing: 1.5, marginBottom: 15 },
  infoRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 54, gap: 10 },
  infoTextContainer: { flex: 1 },
  infoTitle: { color: colors.text, fontSize: 13, fontWeight: "bold" },
  infoSubtitle: { color: colors.textMuted, fontSize: 10, marginTop: 4, lineHeight: 15 },
  statusContainer: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 9, height: 9, borderRadius: 5 },
  statusText: { color: colors.text, fontSize: 11, fontWeight: "bold" },
  pendingText: { color: colors.warning, fontSize: 10, fontWeight: "bold", textAlign: "right", maxWidth: 90 },
  separator: { height: 1, backgroundColor: colors.border, marginVertical: 10 },
  tokenCard: { backgroundColor: colors.backgroundSecondary, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 16 },
  tokenLabel: { color: colors.textMuted, fontSize: 10, fontWeight: "bold", letterSpacing: 1, marginBottom: 8 },
  tokenValue: { color: colors.text, fontSize: 19, fontWeight: "bold", letterSpacing: 2 },
  detailText: { color: colors.textSecondary, fontSize: 11, marginTop: 7 },
  secondaryButton: { height: 48, borderRadius: 10, borderWidth: 1, borderColor: colors.primary, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  secondaryButtonText: { color: colors.primaryLight, fontSize: 12, fontWeight: "bold", letterSpacing: 1 },
  disabledButton: { opacity: 0.5 },
  button: { height: 52, backgroundColor: colors.primary, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  buttonText: { color: colors.white, fontSize: 13, fontWeight: "bold", letterSpacing: 1 },
  footer: { color: colors.textMuted, fontSize: 10, textAlign: "center", marginTop: 22 },
});
