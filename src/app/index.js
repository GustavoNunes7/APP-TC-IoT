
import React, { useState } from "react";

// Componentes do React Native
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";

// Navegação do Expo Router
import { router } from "expo-router";

// Importa as cores do TechCampus
import colors from "../constants/colors";

export default function HomeScreen() {
  // Guarda o token digitado pelo aluno
  const [token, setToken] = useState("");

  // Guarda se o campo está sendo utilizado
  const [focused, setFocused] = useState(false);

  // Função executada ao clicar no botão
  function handleValidateToken() {
    // Impede o envio de um campo vazio
    if (!token.trim()) {
      alert("Digite seu token para continuar.");
      return;
    }

    // Encaminha o aluno para a tela de validação
    // O token é enviado como parâmetro da navegação
    router.push({
      pathname: "/validar-token",
      params: { token: token.trim() },
    });
  }

  return (
    // Ajusta a tela quando o teclado aparece
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>

        {/* Identidade visual do aplicativo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>TC</Text>
          </View>

          <Text style={styles.brandName}>
            TechCampus
          </Text>

          <Text style={styles.brandSubtitle}>
            SISTEMA DE RETIRADA INTELIGENTE
          </Text>
        </View>

        {/* Área principal de apresentação */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>
            Olá, aluno!
          </Text>

          <Text style={styles.description}>
            Insira seu token de retirada para
            acessar o sistema de liberação.
          </Text>
        </View>

        {/* Cartão de inserção do token */}
        <View style={styles.card}>

          <Text style={styles.label}>
            TOKEN DE RETIRADA
          </Text>

          {/* Campo onde o aluno digita o token */}
          <TextInput
            style={[
              styles.input,
              focused && styles.inputFocused,
            ]}
            placeholder="Digite seu token"
            placeholderTextColor={colors.placeholder}
            value={token}
            onChangeText={setToken}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoCapitalize="characters"
            autoCorrect={false}
          />

          {/* Botão para avançar */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleValidateToken}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              VALIDAR TOKEN
            </Text>
          </TouchableOpacity>

        </View>

        {/* Informação de segurança */}
        <View style={styles.securityContainer}>
          <Text style={styles.securityText}>
            Seu token é validado pelo sistema TechCampus.
          </Text>
        </View>

      </View>

      {/* Rodapé do aplicativo */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          TechCampus IoT • SENAI
        </Text>
      </View>

    </KeyboardAvoidingView>
  );
}

// Estilização da tela
const styles = StyleSheet.create({

  // Fundo principal
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Conteúdo centralizado
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
  },

  // Área da identidade visual
  logoContainer: {
    alignItems: "center",
    marginBottom: 45,
  },

  // Símbolo TC
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

  // Apresentação
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

  // Cartão principal
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

  // Campo de token
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

  // Destaque quando o campo recebe foco
  inputFocused: {
    borderColor: colors.primary,
  },

  // Botão vermelho
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

  // Segurança
  securityContainer: {
    marginTop: 20,
    alignItems: "center",
  },

  securityText: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: "center",
  },

  // Rodapé
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },

  footerText: {
    color: colors.textMuted,
    fontSize: 11,
  },

});
