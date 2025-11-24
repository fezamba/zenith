package br.com.unirio.marketplace.zenith;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class TesteCargaCarrinho {
    
    private static final String TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJmZXBldGl0dEBnbWFpbC5jb20iLCJyb2xlIjoiQ0xJRU5URSIsImlhdCI6MTc2MzkzODUzOCwiZXhwIjoxNzYzOTQyMTM4fQ.YCciCO-Nn5ibZUTqlaS3e76NTgQc7h58HSyLVnnHjsDNxiKQy1p55IGHi7mu1Fb9PMBvIaX0OtRxxb7brCS7QQ";
    
    private static final int PRODUTO_ID = 11;
    private static final int NUMERO_USUARIOS = 20; 
    private static final int ADICOES_POR_USUARIO = 10;

    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== INICIANDO TESTE DE CARGA (CARRINHO) ===");
        
        ExecutorService executor = Executors.newFixedThreadPool(NUMERO_USUARIOS);
        HttpClient client = HttpClient.newHttpClient();
        
        AtomicInteger sucessos = new AtomicInteger(0);
        AtomicInteger erros = new AtomicInteger(0);
        AtomicLong tempoTotal = new AtomicLong(0);

        long inicioTeste = System.currentTimeMillis();

        for (int i = 0; i < NUMERO_USUARIOS; i++) {
            executor.submit(() -> {
                for (int j = 0; j < ADICOES_POR_USUARIO; j++) {
                    try {
                        String json = "{\"produtoId\": "+PRODUTO_ID+", \"quantidade\": 1}";
                        
                        HttpRequest request = HttpRequest.newBuilder()
                                .uri(URI.create("http://localhost:8080/api/carrinho/adicionar"))
                                .header("Content-Type", "application/json")
                                .header("Authorization", "Bearer " + TOKEN)
                                .POST(HttpRequest.BodyPublishers.ofString(json))
                                .build();

                        long inicioReq = System.currentTimeMillis();
                        HttpResponse<String> res = client.send(request, HttpResponse.BodyHandlers.ofString());
                        long fimReq = System.currentTimeMillis();

                        if (res.statusCode() == 200 || res.statusCode() == 201) {
                            sucessos.incrementAndGet();
                            tempoTotal.addAndGet(fimReq - inicioReq);
                            System.out.print(".");
                        } else {
                            erros.incrementAndGet();
                            System.out.print("x");
                        }
                    } catch (Exception e) {
                        erros.incrementAndGet();
                    }
                }
            });
        }

        executor.shutdown();
        while (!executor.isTerminated()) Thread.sleep(100);

        long fimTeste = System.currentTimeMillis();
        double duracaoSegundos = (fimTeste - inicioTeste) / 1000.0;
        int total = sucessos.get();

        System.out.println("\n\n=== RESULTADOS CARRINHO ===");
        System.out.println("Tempo Total: " + duracaoSegundos + "s");
        System.out.println("Sucessos: " + total + " | Erros: " + erros.get());
        
        System.out.println("--> LATÊNCIA MÉDIA: " + (total > 0 ? (tempoTotal.get() / total) : 0) + " ms");
        System.out.println("--> VAZÃO (RPS): " + String.format("%.2f", total / duracaoSegundos) + " req/seg");
    }
}