package br.com.unirio.marketplace.zenith.service;

import br.com.unirio.marketplace.zenith.model.Cliente;
import br.com.unirio.marketplace.zenith.repository.ClienteRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class AsyncPedidoService {

    private final ClienteRepository clienteRepository;

    public AsyncPedidoService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @Async
    @Transactional
    public void processarPontosFidelidade(Integer clienteId, BigDecimal valorTotal, boolean usarPontos) {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        Cliente cliente = clienteRepository.findById(clienteId).orElse(null);
        if (cliente != null) {
            if (!usarPontos) {
               int novosPontos = valorTotal.intValue(); 
               cliente.setZenithPoints(cliente.getZenithPoints() + novosPontos);
               clienteRepository.save(cliente);
               System.out.println("Async: Creditados " + novosPontos + " pontos para " + cliente.getNome());
            }
        }
    }
}