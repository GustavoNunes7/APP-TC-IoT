import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";
import colors from "../constants/colors";

// Entrada de token com seis campos independentes.
// Cada campo recebe um número e avança automaticamente para o próximo.
export default function TokenInput({
  value = "",
  onChangeText,
  disabled = false,
}) {
  const inputs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(0);

  function handleChange(text, index) {
    const digits = text.replace(/\D/g, "");

    // Se o usuário colar/digitar vários números, distribui entre os campos.
    if (digits.length > 1) {
      const next = value.split("");
      for (let i = 0; i < digits.length && index + i < 6; i += 1) {
        next[index + i] = digits[i];
      }
      const result = next.join("").slice(0, 6);
      onChangeText(result);

      const nextIndex = Math.min(index + digits.length, 5);
      inputs.current[nextIndex]?.focus();
      setActiveIndex(nextIndex);
      return;
    }

    const next = value.split("");
    next[index] = digits;
    const result = next.join("").slice(0, 6);
    onChangeText(result);

    if (digits && index < 5) {
      inputs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  }

  function handleKeyPress(event, index) {
    if (event.nativeEvent.key === "Backspace" && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>TOKEN DE RETIRADA</Text>

      <View style={styles.tokenBoxes}>
        {Array.from({ length: 6 }).map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputs.current[index] = ref;
            }}
            style={[
              styles.tokenBox,
              activeIndex === index && styles.tokenBoxActive,
            ]}
            value={value[index] || ""}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(event) => handleKeyPress(event, index)}
            onFocus={() => setActiveIndex(index)}
            onBlur={() => setActiveIndex(-1)}
            keyboardType="number-pad"
            maxLength={6}
            autoComplete="off"
            textContentType="oneTimeCode"
            selectTextOnFocus
            editable={!disabled}
            accessibilityLabel={`Dígito ${index + 1} do token`}
          />
        ))}
      </View>

      <Text style={styles.helperText}>
        Digite os 6 números do código recebido após a confirmação do pedido.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 12,
  },
  tokenBoxes: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  tokenBox: {
    flex: 1,
    maxWidth: 52,
    height: 58,
    padding: 0,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
  },
  tokenBoxActive: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  helperText: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 10,
    lineHeight: 16,
    textAlign: "center",
  },
});
