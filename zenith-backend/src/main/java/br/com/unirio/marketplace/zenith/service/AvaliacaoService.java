package br.com.unirio.marketplace.zenith.service;

import br.com.unirio.marketplace.zenith.dto.AvaliacaoDTO;
import br.com.unirio.marketplace.zenith.dto.AvaliacaoInputDTO;
import br.com.unirio.marketplace.zenith.dto.AvaliacaoStatsDTO;
import br.com.unirio.marketplace.zenith.exception.ResourceNotFoundException;
import br.com.unirio.marketplace.zenith.model.Cliente;
import br.com.unirio.marketplace.zenith.model.mongo.Avaliacao;
import br.com.unirio.marketplace.zenith.repository.AvaliacaoRepository;
import br.com.unirio.marketplace.zenith.repository.ClienteRepository;
import br.com.unirio.marketplace.zenith.repository.PedidoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AvaliacaoService {

    private static final int PONTOS_POR_AVALIACAO = 10;

    private final AvaliacaoRepository avaliacaoRepository; // MongoDB
    private final PedidoRepository pedidoRepository;       // MySQL
    private final ClienteRepository clienteRepository;     // MySQL

    public AvaliacaoService(AvaliacaoRepository avaliacaoRepository, 
                            PedidoRepository pedidoRepository, 
                            ClienteRepository clienteRepository) {
        this.avaliacaoRepository = avaliacaoRepository;
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
    }

    @Transactional
    public AvaliacaoDTO criarAvaliacao(Integer clienteId, String nomeCliente, AvaliacaoInputDTO dto) {

        boolean comprouErecebeu = pedidoRepository.clienteComprouERecebeu(clienteId, dto.getProdutoId());

        if (!comprouErecebeu) {
            throw new SecurityException("A avaliação só é permitida para produtos comprados e já entregues.");
        }

        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setProdutoId(dto.getProdutoId());
        avaliacao.setClienteId(clienteId);
        avaliacao.setNomeCliente(nomeCliente);
        avaliacao.setNota(dto.getNota());
        avaliacao.setComentario(dto.getComentario());
        avaliacao.setData(LocalDate.now());

        Avaliacao avaliacaoSalva = avaliacaoRepository.save(avaliacao);

        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado durante a atribuição de pontos."));
        
        cliente.setZenithPoints(cliente.getZenithPoints() + PONTOS_POR_AVALIACAO);
        clienteRepository.save(cliente);

        return new AvaliacaoDTO(avaliacaoSalva);
    }

    public AvaliacaoStatsDTO buscarAvaliacoesPorProduto(Integer produtoId) {
        List<Avaliacao> avaliacoes = avaliacaoRepository.findByProdutoId(produtoId);

        if (avaliacoes.isEmpty()) {
            return new AvaliacaoStatsDTO(0.0, 0, new ArrayList<>());
        }

        List<AvaliacaoDTO> dtos = avaliacoes.stream()
                .map(AvaliacaoDTO::new)
                .collect(Collectors.toList());

        double media = avaliacoes.stream()
                .mapToInt(Avaliacao::getNota)
                .average()
                .orElse(0.0);

        return new AvaliacaoStatsDTO(media, dtos.size(), dtos);
    }
}