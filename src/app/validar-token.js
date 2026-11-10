import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import colors from "../constants/colors";
import { validarToken } from "../services/tokenService";

export default function ValidarTokenScreen() {
  const params = useLocalSearchParams();
  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleValidate() {
    if (loading) return;

    if (!token || !/^\d{6}$/.test(String(token))) {
      setErro("Token inválido. Informe os 6 números.");
      return;
    }

    setLoading(true);
    setErro("");

    try {
      const resposta = await validarToken(String(token));

      if (!resposta.autorizado) {
        setErro(resposta.mensagem || "Token inválido ou não autorizado.");
        return;
      }

      // Só avança depois que o backend confirmar que o token é válido.
      // A validação não confirma a entrega nem consome o token.
      router.replace({
        pathname: "/status",
        params: {
          token: String(token),
          autorizado: "true",
          pedidoId: resposta.pedidoId ? String(resposta.pedidoId) : "",
          produtos: resposta.produtos || "",
        },
      });
    } catch (error) {
      setErro(error.message || "Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>TechCampus</Text>
        <Text style={styles.subtitle}>VALIDAÇÃO DE ACESSO</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Confirmar token</Text>
        <Text style={styles.description}>
          O token será verificado no servidor TechCampus.
        </Text>

        <View style={styles.tokenBox}>
          <Text style={styles.tokenLabel}>SEU TOKEN</Text>
          <Text style={styles.tokenValue}>{token || "Não informado"}</Text>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Validando token...</Text>
          </View>
        )}

        {!!erro && !loading && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{erro}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleValidate}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {loading ? "AGUARDE..." : "VALIDAR TOKEN"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>VOLTAR</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>TechCampus IoT • SENAI</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 35,
  },
  brand: {
    color: colors.text,
    fontSize: 29,
    fontWeight: "bold",
  },
  subtitle: {
    color: colors.primary,
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 7,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 23,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 22,
  },
  tokenBox: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  tokenLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 8,
  },
  tokenValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  loadingContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 12,
  },
  errorBox: {
    backgroundColor: "#351719",
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 10,
    padding: 13,
    marginBottom: 18,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    textAlign: "center",
  },
  button: {
    height: 54,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  backButton: {
    alignItems: "center",
    padding: 16,
    marginTop: 5,
  },
  backButtonText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "bold",
  },
  footer: {
    color: colors.textMuted,
    fontSize: 10,
    textAlign: "center",
    marginTop: 35,
  },
});
