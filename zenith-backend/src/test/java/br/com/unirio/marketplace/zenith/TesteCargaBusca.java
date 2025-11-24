package br.com.unirio.marketplace.zenith;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class TesteCargaBusca {

    private static final int NUMERO_USUARIOS = 50;
    private static final int REQUISICOES_POR_USUARIO = 20;
    private static final String URL_ALVO = "http://localhost:8080/api/produtos?termo=produto";

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== INICIANDO TESTE DE CARGA (BUSCA) ===");
        System.out.println("Simulando " + NUMERO_USUARIOS + " usuários simultâneos...");

        ExecutorService executor = Executors.newFixedThreadPool(NUMERO_USUARIOS);
        HttpClient client = HttpClient.newHttpClient();
        
        AtomicInteger sucessos = new AtomicInteger(0);
        AtomicInteger erros = new AtomicInteger(0);
        AtomicLong tempoTotalAcumulado = new AtomicLong(0);

        long inicioTeste = System.currentTimeMillis();

        for (int i = 0; i < NUMERO_USUARIOS; i++) {
            executor.submit(() -> {
                for (int j = 0; j < REQUISICOES_POR_USUARIO; j++) {
                    long inicioReq = System.currentTimeMillis();
                    try {
                        HttpRequest request = HttpRequest.newBuilder()
                                .uri(URI.create(URL_ALVO))
                                .GET()
                                .timeout(Duration.ofSeconds(10))
                                .build();

                        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
                        
                        if (response.statusCode() == 200) {
                            sucessos.incrementAndGet();
                        } else {
                            erros.incrementAndGet();
                            System.out.println("Erro: " + response.statusCode());
                        }
                    } catch (Exception e) {
                        erros.incrementAndGet();
                        System.out.println("Falha: " + e.getMessage());
                    }
                    long fimReq = System.currentTimeMillis();
                    tempoTotalAcumulado.addAndGet(fimReq - inicioReq);
                }
            });
        }

        executor.shutdown();
        while (!executor.isTerminated()) {
            Thread.sleep(100);
        }

        long fimTeste = System.currentTimeMillis();
        long duracaoTotal = fimTeste - inicioTeste;
        int totalRequisicoes = sucessos.get() + erros.get();

        System.out.println("\n=== RESULTADOS DO TESTE ===");
        System.out.println("Tempo Total do Teste: " + duracaoTotal + " ms (" + (duracaoTotal/1000) + "s)");
        System.out.println("Total de Requisições: " + totalRequisicoes);
        System.out.println("Sucessos (200 OK): " + sucessos.get());
        System.out.println("Erros: " + erros.get());
        
        double mediaLatencia = (double) tempoTotalAcumulado.get() / totalRequisicoes;
        double vazao = (double) totalRequisicoes / (duracaoTotal / 1000.0);

        System.out.println("\n--> LATÊNCIA MÉDIA: " + String.format("%.2f", mediaLatencia) + " ms");
        System.out.println("--> VAZÃO (RPS): " + String.format("%.2f", vazao) + " req/segundo");
    }
}