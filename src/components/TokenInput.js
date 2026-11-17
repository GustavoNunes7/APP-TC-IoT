import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Animated,
  StyleSheet,
} from "react-native";
import colors from "../constants/colors";

const TOKEN_LENGTH = 6;
const GAP = 9;
const MAX_BOX = 58;

// Um único quadrado do token.
function TokenBox({ digit, size, active, error, success }) {
  const scale = useRef(new Animated.Value(1)).current;
  const cursor = useRef(new Animated.Value(1)).current;
  const previous = useRef(digit);

  // Pequeno "pulso" quando um dígito é inserido.
  useEffect(() => {
    if (digit && digit !== previous.current) {
      scale.setValue(0.86);
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 160,
        useNativeDriver: true,
      }).start();
    }
    previous.current = digit;
  }, [digit, scale]);

  // Cursor piscando no quadrado ativo e vazio.
  useEffect(() => {
    if (active && !digit) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(cursor, { toValue: 0.15, duration: 520, useNativeDriver: true }),
          Animated.timing(cursor, { toValue: 1, duration: 520, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
    cursor.setValue(1);
    return undefined;
  }, [active, digit, cursor]);

  const accent = success
    ? colors.success
    : error
    ? colors.error
    : active
    ? colors.primary
    : digit
    ? colors.borderLight
    : colors.border;

  return (
    <Animated.View
      style={[
        styles.box,
        {
          width: size,
          height: Math.round(size * 1.22),
          borderColor: accent,
          borderWidth: active || success || error ? 2 : 1,
          transform: [{ scale }],
        },
        active && styles.boxActive,
        success && styles.boxSuccess,
        error && styles.boxError,
      ]}
    >
      {digit ? (
        <Text style={[styles.digit, { fontSize: Math.round(size * 0.58) }]}>
          {digit}
        </Text>
      ) : active ? (
        <Animated.View style={[styles.caret, { opacity: cursor }]} />
      ) : (
        <View style={styles.placeholderDash} />
      )}
    </Animated.View>
  );
}

// Painel de token com seis quadrados individuais.
//
// Por baixo existe UM campo de entrada real (invisível). Isso garante:
// teclado numérico, colar os seis números de uma vez, apagar com o
// backspace e limite de seis dígitos — mantendo a mesma API do componente
// original: value, onChangeText e disabled.
export default function TokenInput({
  value = "",
  onChangeText,
  disabled = false,
  error = false,
  success = false,
  autoFocus = false,
  label = "TOKEN DE RETIRADA",
}) {
  const inputRef = useRef(null);
  const shake = useRef(new Animated.Value(0)).current;
  const [focused, setFocused] = useState(false);
  const [rowWidth, setRowWidth] = useState(0);

  // Tamanho dos quadrados se adapta à largura disponível (sem rolagem lateral).
  const available = rowWidth || 300;
  const size = Math.max(
    38,
    Math.min(MAX_BOX, Math.floor((available - GAP * (TOKEN_LENGTH - 1)) / TOKEN_LENGTH))
  );

  // Balanço horizontal quando houver erro.
  useEffect(() => {
    if (error) {
      shake.setValue(0);
      Animated.sequence([
        Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: -1, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
        Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
    }
  }, [error, shake]);

  function handleChange(text) {
    // Somente números, no máximo seis (inclui texto colado).
    const digits = String(text || "").replace(/\D/g, "").slice(0, TOKEN_LENGTH);
    onChangeText?.(digits);
  }

  // Tocar em um quadrado já preenchido permite corrigir a partir dele.
  function handleBoxPress(index) {
    if (disabled) return;
    if (index < value.length) {
      onChangeText?.(value.slice(0, index));
    }
    inputRef.current?.focus();
  }

  const activeIndex = focused && !disabled ? Math.min(value.length, TOKEN_LENGTH - 1) : -1;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Animated.View
        onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}
        style={[
          styles.row,
          {
            transform: [
              {
                translateX: shake.interpolate({
                  inputRange: [-1, 1],
                  outputRange: [-9, 9],
                }),
              },
            ],
          },
        ]}
      >
        {Array.from({ length: TOKEN_LENGTH }).map((_, index) => (
          <Pressable
            key={index}
            onPress={() => handleBoxPress(index)}
            accessibilityLabel={`Dígito ${index + 1} do token`}
          >
            <TokenBox
              digit={value[index] || ""}
              size={size}
              active={activeIndex === index}
              error={error}
              success={success}
            />
          </Pressable>
        ))}
      </Animated.View>

      {/* Campo real, invisível, que recebe a digitação e o "colar". */}
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={value}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        inputMode="numeric"
        maxLength={TOKEN_LENGTH}
        autoComplete="sms-otp"
        textContentType="oneTimeCode"
        autoFocus={autoFocus}
        caretHidden
        editable={!disabled}
        contextMenuHidden={false}
        accessibilityLabel="Token de seis dígitos"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  label: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 14,
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: GAP,
  },
  box: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  boxActive: {
    backgroundColor: "#1A0B0C",
    shadowColor: colors.primary,
    shadowOpacity: 0.7,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  boxSuccess: {
    backgroundColor: colors.successSoft,
    shadowColor: colors.success,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  boxError: {
    backgroundColor: colors.errorSoft,
  },
  digit: {
    color: colors.white,
    fontWeight: "bold",
  },
  caret: {
    width: 2,
    height: "38%",
    borderRadius: 1,
    backgroundColor: colors.primary,
  },
  placeholderDash: {
    width: 12,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.border,
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
});
