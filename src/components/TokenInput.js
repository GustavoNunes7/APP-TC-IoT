
// Importa o React
import React, { useState } from "react";

// Componentes do React Native
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

// Importa as cores do TechCampus
import colors from "../constants/colors";

// Componente reutilizável para digitação do token
export default function TokenInput({

  // Valor atual do campo
  value,

  // Função chamada quando o aluno digita
  onChangeText,

  // Texto exibido antes da digitação
  placeholder = "Digite seu token",

  // Define se o campo estará desativado
  disabled = false,

}) {

  // Controla se o campo está selecionado
  const [focused, setFocused] = useState(false);

  // Controla a exibição do token
  const [visible, setVisible] = useState(true);

  return (

    <View style={styles.container}>

      {/* Identificação do campo */}
      <Text style={styles.label}>
        TOKEN DE RETIRADA
      </Text>

      {/* Área de entrada do token */}
      <View
        style={[
          styles.inputContainer,

          // Adiciona destaque vermelho quando selecionado
          focused && styles.inputFocused,

          // Reduz a opacidade quando desativado
          disabled && styles.inputDisabled,
        ]}
      >

        {/* Campo de digitação */}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}

          // Permite apenas letras maiúsculas automaticamente
          autoCapitalize="characters"

          // Desativa correções automáticas
          autoCorrect={false}

          // Controla o foco
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}

          // Controla a visibilidade do texto
          secureTextEntry={!visible}

          // Desativa o campo quando necessário
          editable={!disabled}
        />

        {/* Botão para mostrar ou ocultar o token */}
        <TouchableOpacity
          onPress={() => setVisible(!visible)}
          style={styles.visibilityButton}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <Text style={styles.visibilityText}>
            {visible ? "OCULTAR" : "MOSTRAR"}
          </Text>
        </TouchableOpacity>

      </View>

      {/* Orientação para o aluno */}
      <Text style={styles.helperText}>
        Digite o código recebido após a confirmação do pedido.
      </Text>

    </View>
  );
}

// Estilização do componente
const styles = StyleSheet.create({

  // Estrutura principal
  container: {
    width: "100%",
    marginBottom: 20,
  },

  // Identificação
  label: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 10,
  },

  // Área do campo
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    minHeight: 55,
    paddingHorizontal: 14,
  },

  // Destaque ao selecionar
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },

  // Aparência desativada
  inputDisabled: {
    opacity: 0.5,
  },

  // Campo de texto
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    paddingVertical: 12,
  },

  // Botão de visibilidade
  visibilityButton: {
    paddingVertical: 10,
    paddingLeft: 10,
  },

  visibilityText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "bold",
  },

  // Texto auxiliar
  helperText: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 9,
    lineHeight: 16,
  },

});
