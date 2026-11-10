import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import colors from "../constants/colors";

// Campo de token numérico de 6 dígitos.
export default function TokenInput({
  value,
  onChangeText,
  placeholder = "Digite os 6 números",
  disabled = false,
}) {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>TOKEN DE RETIRADA</Text>
      <View style={[styles.inputContainer, focused && styles.inputFocused, disabled && styles.inputDisabled]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(text) => onChangeText(text.replace(/\\D/g, "").slice(0, 6))}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          keyboardType="number-pad"
          maxLength={6}
          autoCorrect={false}
          secureTextEntry={!visible}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={!disabled}
        />
        <TouchableOpacity
          onPress={() => setVisible((current) => !current)}
          style={styles.visibilityButton}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text style={styles.visibilityText}>{visible ? "OCULTAR" : "MOSTRAR"}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.helperText}>Digite o código numérico recebido após a confirmação do pedido.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", marginBottom: 20 },
  label: { color: colors.text, fontSize: 12, fontWeight: "bold", letterSpacing: 1, marginBottom: 10 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.border, borderRadius: 10, minHeight: 55, paddingHorizontal: 14 },
  inputFocused: { borderColor: colors.primary, borderWidth: 1.5 },
  inputDisabled: { opacity: 0.5 },
  input: { flex: 1, color: colors.text, fontSize: 16, paddingVertical: 12 },
  visibilityButton: { paddingVertical: 10, paddingLeft: 10 },
  visibilityText: { color: colors.primary, fontSize: 10, fontWeight: "bold" },
  helperText: { color: colors.textMuted, fontSize: 11, marginTop: 9, lineHeight: 16 },
});
