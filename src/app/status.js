
// Importações do React
import React from "react";

// Componentes do React Native
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

// Navegação
import { router, useLocalSearchParams } from "expo-router";

// Importa as cores do TechCampus
import colors from "../constants/colors";

// Tela de status da retirada
export default function StatusScreen() {

  // Recebe os parâmetros enviados para esta tela
  const params = useLocalSearchParams();

  // Recupera o status recebido
  // Por enquanto, utilizamos valores de demonstração
  const conectado = true;
  const autorizado = true;

  // Função para voltar à tela inicial
  function handleBack() {
    router.replace("/");
  }

  return (
    <View style={styles.container}>

      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          TechCampus
        </Text>

        <Text style={styles.headerSubtitle}>
          STATUS DA RETIRADA
        </Text>
      </View>

      {/* Cartão principal */}
      <View style={styles.mainCard}>

        {/* Indicador de liberação */}
        <View
          style={[
            styles.statusIcon,
            {
              backgroundColor: autorizado
                ? colors.success
                : colors.error,
            },
          ]}
        >
          <Text style={styles.statusIconText}>
            {autorizado ? "✓" : "!"}
          </Text>
        </View>

        <Text style={styles.mainTitle}>
          {autorizado
            ? "Retirada autorizada!"
            : "Retirada não autorizada"}
        </Text>

        <Text style={styles.mainDescription}>
          {autorizado
            ? "O sistema autorizou sua retirada. Siga as orientações do equipamento."
            : "Não foi possível autorizar sua retirada. Verifique seu token."}
        </Text>

      </View>

      {/* Informações do dispositivo */}
      <View style={styles.infoCard}>

        <Text style={styles.sectionTitle}>
          DISPOSITIVO IoT
        </Text>

        {/* Status da conexão */}
        <View style={styles.infoRow}>

          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>
              Conexão ESP8266
            </Text>

            <Text style={styles.infoSubtitle}>
              Comunicação com o equipamento
            </Text>
          </View>

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: conectado
                    ? colors.success
                    : colors.error,
                },
              ]}
            />

            <Text style={styles.statusText}>
              {conectado ? "Conectado" : "Desconectado"}
            </Text>
          </View>

        </View>

        {/* Separador */}
        <View style={styles.separator} />

        {/* Status do LED */}
        <View style={styles.infoRow}>

          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>
              LED indicador
            </Text>

            <Text style={styles.infoSubtitle}>
              Sinalização da liberação
            </Text>
          </View>

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: autorizado
                    ? colors.ledOn
                    : colors.ledOff,
                },
              ]}
            />

            <Text style={styles.statusText}>
              {autorizado ? "Ativado" : "Desativado"}
            </Text>
          </View>

        </View>

        {/* Separador */}
        <View style={styles.separator} />

        {/* Status do acesso */}
        <View style={styles.infoRow}>

          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>
              Autorização
            </Text>

            <Text style={styles.infoSubtitle}>
              Resultado da validação
            </Text>
          </View>

          <Text
            style={[
              styles.authorizationText,
              {
                color: autorizado
                  ? colors.success
                  : colors.error,
              },
            ]}
          >
            {autorizado ? "Liberado" : "Bloqueado"}
          </Text>

        </View>

      </View>

      {/* Informações do token */}
      <View style={styles.tokenCard}>
        <Text style={styles.tokenLabel}>
          TOKEN UTILIZADO
        </Text>

        <Text style={styles.tokenValue}>
          {params.token || "Não informado"}
        </Text>
      </View>

      {/* Botão de retorno */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleBack}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          VOLTAR AO INÍCIO
        </Text>
      </TouchableOpacity>

      {/* Rodapé */}
      <Text style={styles.footer}>
        TechCampus IoT • SENAI
      </Text>

    </View>
  );
}

// Estilização da tela
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 20,
  },

  // Cabeçalho
  header: {
    marginBottom: 30,
  },

  headerTitle: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "bold",
  },

  headerSubtitle: {
    color: colors.primary,
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 5,
    fontWeight: "bold",
  },

  // Cartão de resultado
  mainCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 25,
    alignItems: "center",
    marginBottom: 22,
  },

  statusIcon: {
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  statusIconText: {
    color: colors.white,
    fontSize: 35,
    fontWeight: "bold",
  },

  mainTitle: {
    color: colors.text,
    fontSize: 21,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },

  mainDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },

  // Cartão de informações
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 18,
  },

  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1.5,
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 48,
  },

  infoTextContainer: {
    flex: 1,
  },

  infoTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "bold",
  },

  infoSubtitle: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 4,
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },

  statusText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "bold",
  },

  authorizationText: {
    fontSize: 12,
    fontWeight: "bold",
  },

  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 13,
  },

  // Cartão do token
  tokenCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
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
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 2,
  },

  // Botão de retorno
  button: {
    height: 53,
    backgroundColor: colors.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  // Rodapé
  footer: {
    color: colors.textMuted,
    fontSize: 10,
    textAlign: "center",
    marginTop: "auto",
    paddingTop: 20,
  },

});
