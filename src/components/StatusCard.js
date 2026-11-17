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
  // Glifo opcional exibido no ícone lateral.
  icon,
}) {
  const tones = {
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
  };
  const softs = {
    success: colors.successSoft,
    error: colors.errorSoft,
    warning: colors.warningSoft,
    info: "rgba(59, 130, 246, 0.12)",
  };
  const tone = tones[type] || tones.info;
  const soft = softs[type] || softs.info;

  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: soft, borderColor: tone }]}>
        {icon ? (
          <Text style={[styles.iconText, { color: tone }]}>{icon}</Text>
        ) : (
          <View style={[styles.dot, { backgroundColor: tone }]} />
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {!!description && <Text style={styles.description}>{description}</Text>}
      </View>

      <View style={[styles.badge, { backgroundColor: soft }]}>
        <Text style={[styles.status, { color: tone }]}>{status}</Text>
      </View>
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
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: { fontSize: 16, fontWeight: "bold" },
  dot: { width: 10, height: 10, borderRadius: 5 },
  content: { flex: 1 },
  title: { color: colors.text, fontSize: 14, fontWeight: "bold" },
  description: { color: colors.textMuted, fontSize: 11, marginTop: 4, lineHeight: 16 },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
    maxWidth: 110,
  },
  status: { fontSize: 10, fontWeight: "bold", letterSpacing: 0.5, textAlign: "center" },
});
