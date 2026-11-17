import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Animated,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../constants/colors";
import { validarToken } from "../services/tokenService";
import { verificarConexao } from "../services/api";
import Header from "../components/Header";
import PrimaryButton from "../components/PrimaryButton";
import FadeIn from "../components/FadeIn";

// Quadrados somente leitura que mostram o token informado.
function TokenPreview({ token, tone }) {
  const digits = String(token || "").split("");
  return (
    <View style={styles.previewRow}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View
          key={i}
          style={[styles.previewBox, { borderColor: tone }]}
        >
          <Text style={styles.previewDigit}>{digits[i] || "–"}</Text>
        </View>
      ))}
    </View>
  );
}

export default function ValidarTokenScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const token = Array.isArray(params.token) ? params.token[0] : params.token;

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  // Indica que o erro foi falta de comunicação (e não token recusado).
  const [semServidor, setSemServidor] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [pedidoInfo, setPedidoInfo] = useState(null);

  const successScale = useRef(new Animated.Value(0.4)).current;
  const navTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (navTimer.current) clearTimeout(navTimer.current);
    };
  }, []);

  useEffect(() => {
    if (sucesso) {
      successScale.setValue(0.4);
      Animated.spring(successScale, {
        toValue: 1,
        friction: 5,
        tension: 120,
        useNativeDriver: true,
      }).start();
    }
  }, [sucesso, successScale]);

  async function handleValidate() {
    if (loading || sucesso) return;

    if (!token || !/^\d{6}$/.test(String(token))) {
      setSemServidor(false);
      setErro("Token inválido. Informe os 6 números.");
      return;
    }

    setLoading(true);
    setErro("");
    setSemServidor(false);

    try {
      const resposta = await validarToken(String(token));

      if (!resposta.autorizado) {
        setErro(resposta.mensagem || "Token inválido ou não autorizado.");
        return;
      }

      // Só avança depois que o backend confirmar que o token é válido.
      // A validação não confirma a entrega nem consome o token.
      setSucesso(true);
      setPedidoInfo({
        pedidoId: resposta.pedidoId ? String(resposta.pedidoId) : "",
        produtos: resposta.produtos || "",
      });

      // Curta pausa para o usuário ver a confirmação antes da tela de status.
      navTimer.current = setTimeout(() => {
        router.replace({
          pathname: "/status",
          params: {
            token: String(token),
            autorizado: "true",
            pedidoId: resposta.pedidoId ? String(resposta.pedidoId) : "",
            produtos: resposta.produtos || "",
          },
        });
      }, 1100);
    } catch (error) {
      // Diferencia "servidor indisponível" de "token recusado" consultando a
      // rota de saúde já existente do backend. Nenhum resultado é simulado.
      let online = false;
      try {
        const saude = await verificarConexao();
        online = saude.online === true;
      } catch {
        online = false;
      }

      if (!online) {
        setSemServidor(true);
        setErro("Não foi possível conectar ao servidor.");
      } else {
        setErro(error.message || "Token inválido ou não autorizado.");
      }
    } finally {
      setLoading(false);
    }
  }

  const tone = sucesso
    ? colors.success
    : erro
    ? colors.error
    : loading
    ? colors.primary
    : colors.borderLight;

  return (
    <View style={styles.container}>
      <View style={styles.glow} pointerEvents="none" />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <FadeIn>
          <Header
            showBack={!loading && !sucesso}
            connected={sucesso ? true : semServidor ? false : undefined}
          />
        </FadeIn>

        <FadeIn delay={120} style={styles.hero}>
          <View style={styles.eyebrowRow}>
            <View style={styles.eyebrowLine} />
            <Text style={styles.eyebrow}>VALIDAÇÃO DE ACESSO</Text>
          </View>
          <Text style={styles.title}>Confirmar token</Text>
          <Text style={styles.description}>
            O token será verificado no servidor TechCampus.
          </Text>
        </FadeIn>

        <FadeIn delay={220}>
          <View style={[styles.card, { borderColor: sucesso ? colors.success : erro ? colors.error : colors.border }]}>
            <Text style={styles.tokenLabel}>SEU TOKEN</Text>
            {token ? (
              <TokenPreview token={token} tone={tone} />
            ) : (
              <Text style={styles.notInformed}>Não informado</Text>
            )}

            {/* Estado: validando */}
            {loading && (
              <View style={styles.stateBox}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Validando seu token...</Text>
              </View>
            )}

            {/* Estado: autorizado */}
            {sucesso && !loading && (
              <View style={[styles.stateBox, styles.successBox]}>
                <Animated.View style={[styles.successIcon, { transform: [{ scale: successScale }] }]}>
                  <Text style={styles.successIconText}>✓</Text>
                </Animated.View>
                <Text style={styles.successTitle}>Token validado com sucesso!</Text>
                <Text style={styles.successText}>
                  Liberação autorizada. Abrindo o status da retirada...
                </Text>
                {pedidoInfo?.pedidoId ? (
                  <Text style={styles.successMeta}>Pedido #{pedidoInfo.pedidoId}</Text>
                ) : null}
              </View>
            )}

            {/* Estado: erro (token inválido ou servidor indisponível) */}
            {!!erro && !loading && !sucesso && (
              <View style={[styles.stateBox, styles.errorBox]}>
                <View style={styles.errorIcon}>
                  <Text style={styles.errorIconText}>{semServidor ? "⚠" : "✕"}</Text>
                </View>
                <Text style={styles.errorTitle}>
                  {semServidor ? "Servidor indisponível" : "Token não autorizado"}
                </Text>
                <Text style={styles.errorText}>{erro}</Text>
              </View>
            )}

            {!sucesso && (
              <View style={styles.actions}>
                <PrimaryButton
                  title={semServidor ? "TENTAR NOVAMENTE" : "VALIDAR TOKEN"}
                  icon={semServidor ? "↻" : "✓"}
                  onPress={handleValidate}
                  loading={loading}
                />
                <PrimaryButton
                  title="VOLTAR"
                  variant="outline"
                  onPress={() => router.back()}
                  disabled={loading}
                />
              </View>
            )}
          </View>
        </FadeIn>

        <Text style={styles.footer}>TechCampus IoT • SENAI</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  glow: {
    position: "absolute",
    top: -140,
    alignSelf: "center",
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: colors.primarySoft,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
  },
  hero: {
    marginTop: 30,
    marginBottom: 24,
  },
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  eyebrowLine: {
    width: 22,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.primary,
  },
  eyebrow: {
    color: colors.primaryLight,
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 3,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "bold",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  card: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
  },
  tokenLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 2,
    marginBottom: 14,
    textAlign: "center",
  },
  notInformed: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: "center",
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  previewBox: {
    flex: 1,
    maxWidth: 52,
    height: 62,
    borderRadius: 13,
    borderWidth: 1.5,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  previewDigit: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "bold",
  },
  stateBox: {
    marginTop: 20,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 12,
  },
  successBox: {
    backgroundColor: colors.successSoft,
    borderWidth: 1,
    borderColor: colors.success,
  },
  successIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.success,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: colors.success,
    shadowOpacity: 0.6,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  successIconText: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "bold",
  },
  successTitle: {
    color: colors.success,
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
  successText: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  successMeta: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 8,
  },
  errorBox: {
    backgroundColor: colors.errorSoft,
    borderWidth: 1,
    borderColor: colors.error,
  },
  errorIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: colors.error,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  errorIconText: {
    color: colors.error,
    fontSize: 20,
    fontWeight: "bold",
  },
  errorTitle: {
    color: colors.error,
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
  },
  errorText: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  actions: {
    marginTop: 20,
    gap: 12,
  },
  footer: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: "center",
    marginTop: 28,
    letterSpacing: 0.5,
  },
});
