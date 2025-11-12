package br.com.unirio.marketplace.zenith.controller;

import br.com.unirio.marketplace.zenith.dto.AvaliacaoDTO;
import br.com.unirio.marketplace.zenith.dto.AvaliacaoInputDTO;
import br.com.unirio.marketplace.zenith.dto.AvaliacaoStatsDTO;
import br.com.unirio.marketplace.zenith.security.UserDetailsImpl;
import br.com.unirio.marketplace.zenith.service.AvaliacaoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/avaliacoes")
public class AvaliacaoController {

    private final AvaliacaoService avaliacaoService;

    public AvaliacaoController(AvaliacaoService avaliacaoService) {
        this.avaliacaoService = avaliacaoService;
    }

    @PostMapping
    public ResponseEntity<AvaliacaoDTO> criarAvaliacao(
            Authentication authentication,
            @Valid @RequestBody AvaliacaoInputDTO avaliacaoInputDTO) {
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Integer clienteId = userDetails.getId();
        String nomeCliente = userDetails.getUsername();

        AvaliacaoDTO avaliacaoCriada = avaliacaoService.criarAvaliacao(
                clienteId,
                nomeCliente,
                avaliacaoInputDTO
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(avaliacaoCriada);
    }
    @GetMapping("/produto/{produtoId}")
    public ResponseEntity<AvaliacaoStatsDTO> buscarAvaliacoesPorProduto(@PathVariable Integer produtoId) {
        
        AvaliacaoStatsDTO stats = avaliacaoService.buscarAvaliacoesPorProduto(produtoId);
        return ResponseEntity.ok(stats);
    }
}