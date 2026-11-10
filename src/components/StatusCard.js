import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../constants/colors";

// Cartão informativo para apresentar estados do sistema.
// type pode ser: success, error, warning ou info.
export default function StatusCard({
  title = "Status",
  description = "",
  status = "Não informado",
  type = "info",
}) {
  const tones = {
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
  };
  const tone = tones[type] || tones.info;

  return (
    <View style={styles.card}>
      <View style={[styles.indicator, { backgroundColor: tone }]} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {!!description && <Text style={styles.description}>{description}</Text>}
      </View>
      <Text style={[styles.status, { color: tone }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 15,
    gap: 11,
  },
  indicator: { width: 10, height: 10, borderRadius: 5 },
  content: { flex: 1 },
  title: { color: colors.text, fontSize: 13, fontWeight: "bold" },
  description: { color: colors.textMuted, fontSize: 11, marginTop: 4 },
  status: { fontSize: 11, fontWeight: "bold", maxWidth: 100, textAlign: "right" },
});
