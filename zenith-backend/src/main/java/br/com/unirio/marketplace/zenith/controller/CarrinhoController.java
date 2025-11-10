package br.com.unirio.marketplace.zenith.controller;

import br.com.unirio.marketplace.zenith.dto.CarrinhoDTO;
import br.com.unirio.marketplace.zenith.dto.ItemCarrinhoInputDTO;
import br.com.unirio.marketplace.zenith.service.CarrinhoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carrinho")
public class CarrinhoController {

    private final CarrinhoService carrinhoService;

    public CarrinhoController(CarrinhoService carrinhoService) {
        this.carrinhoService = carrinhoService;
    }

    @GetMapping("/{usuarioId}")
    public ResponseEntity<CarrinhoDTO> buscarCarrinho(@PathVariable Integer usuarioId) {
        // FIXME: O 'usuarioId' viria da autenticação (Spring Security). Por agora, passei na URL para testar.
        CarrinhoDTO carrinho = carrinhoService.buscarCarrinho(usuarioId);
        return ResponseEntity.ok(carrinho);
    }

    @PostMapping("/adicionar/{usuarioId}")
    public ResponseEntity<CarrinhoDTO> adicionarAoCarrinho(
            @PathVariable Integer usuarioId,
            @Valid @RequestBody ItemCarrinhoInputDTO itemDTO) {
        
        CarrinhoDTO carrinhoAtualizado = carrinhoService.adicionarAoCarrinho(
                usuarioId,
                itemDTO.getProdutoId(),
                itemDTO.getQuantidade()
        );
        return ResponseEntity.ok(carrinhoAtualizado);
    }

    //FIXME: Adicionar outros endpoints (remover, atualizar...)
}