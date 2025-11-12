package br.com.unirio.marketplace.zenith.controller;

import br.com.unirio.marketplace.zenith.dto.AtualizarQtdInputDTO;
import br.com.unirio.marketplace.zenith.dto.CarrinhoDTO;
import br.com.unirio.marketplace.zenith.dto.ItemCarrinhoInputDTO;
import br.com.unirio.marketplace.zenith.security.UserDetailsImpl;
import br.com.unirio.marketplace.zenith.service.CarrinhoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/carrinho")
public class CarrinhoController {

    private final CarrinhoService carrinhoService;

    public CarrinhoController(CarrinhoService carrinhoService) {
        this.carrinhoService = carrinhoService;
    }

    @GetMapping
    public ResponseEntity<CarrinhoDTO> buscarCarrinho(Authentication authentication) {
        Integer usuarioId = getUsuarioIdDoToken(authentication);
        CarrinhoDTO carrinho = carrinhoService.buscarCarrinho(usuarioId);
        return ResponseEntity.ok(carrinho);
    }

    @PostMapping("/adicionar")
    public ResponseEntity<CarrinhoDTO> adicionarAoCarrinho(
            Authentication authentication,
            @Valid @RequestBody ItemCarrinhoInputDTO itemDTO) {

        Integer usuarioId = getUsuarioIdDoToken(authentication);

        CarrinhoDTO carrinhoAtualizado = carrinhoService.adicionarAoCarrinho(
                usuarioId,
                itemDTO.getProdutoId(),
                itemDTO.getQuantidade()
        );
        return ResponseEntity.ok(carrinhoAtualizado);
    }

    @PutMapping("/atualizar")
    public ResponseEntity<CarrinhoDTO> atualizarQuantidade(
            Authentication authentication,
            @Valid @RequestBody AtualizarQtdInputDTO itemDTO) {
        
        Integer usuarioId = getUsuarioIdDoToken(authentication);

        CarrinhoDTO carrinhoAtualizado = carrinhoService.atualizarQuantidade(
                usuarioId,
                itemDTO.getProdutoId(),
                itemDTO.getQuantidade()
        );
        return ResponseEntity.ok(carrinhoAtualizado);
    }

    @DeleteMapping("/remover/{produtoId}")
    public ResponseEntity<CarrinhoDTO> removerDoCarrinho(
            Authentication authentication,
            @PathVariable Integer produtoId) {
        
        Integer usuarioId = getUsuarioIdDoToken(authentication);

        CarrinhoDTO carrinhoAtualizado = carrinhoService.removerDoCarrinho(
                usuarioId,
                produtoId
        );
        return ResponseEntity.ok(carrinhoAtualizado);
    }


    private Integer getUsuarioIdDoToken(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl)) {
            throw new SecurityException("Autenticação inválida ou não encontrada.");
        }

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }
}