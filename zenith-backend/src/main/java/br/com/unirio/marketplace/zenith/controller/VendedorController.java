package br.com.unirio.marketplace.zenith.controller;

import br.com.unirio.marketplace.zenith.dto.AtualizarStatusPedidoDTO;
import br.com.unirio.marketplace.zenith.dto.PedidoDTO;
import br.com.unirio.marketplace.zenith.dto.ProdutoDTO;
import br.com.unirio.marketplace.zenith.dto.ProdutoInputDTO;
import br.com.unirio.marketplace.zenith.dto.SolicitarSeloDTO;
import br.com.unirio.marketplace.zenith.security.UserDetailsImpl;
import br.com.unirio.marketplace.zenith.service.ProdutoService;
import br.com.unirio.marketplace.zenith.service.PedidoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendedor")
public class VendedorController {

    private final ProdutoService produtoService;
    private final PedidoService pedidoService;

    public VendedorController(ProdutoService produtoService, PedidoService pedidoService) {
        this.produtoService = produtoService;
        this.pedidoService = pedidoService;
    }

    @GetMapping("/produtos")
    public ResponseEntity<List<ProdutoDTO>> listarMeusProdutos(Authentication authentication) {
        Integer vendedorId = getVendedorIdDoToken(authentication);
        List<ProdutoDTO> produtos = produtoService.listarProdutosPorVendedor(vendedorId);
        return ResponseEntity.ok(produtos);
    }

    @PostMapping("/produtos")
    public ResponseEntity<ProdutoDTO> criarProduto(Authentication authentication,
                                                   @Valid @RequestBody ProdutoInputDTO produtoInputDTO) {
        Integer vendedorId = getVendedorIdDoToken(authentication);
        ProdutoDTO produtoCriado = produtoService.criarProduto(vendedorId, produtoInputDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(produtoCriado);
    }

    @PutMapping("/produtos/{id}")
    public ResponseEntity<ProdutoDTO> atualizarProduto(Authentication authentication,
                                                       @PathVariable Integer id,
                                                       @Valid @RequestBody ProdutoInputDTO produtoInputDTO) {
        Integer vendedorId = getVendedorIdDoToken(authentication);
        ProdutoDTO produtoAtualizado = produtoService.atualizarProduto(vendedorId, id, produtoInputDTO);
        return ResponseEntity.ok(produtoAtualizado);
    }

    @DeleteMapping("/produtos/{id}")
    public ResponseEntity<Void> desativarProduto(Authentication authentication,
                                                 @PathVariable Integer id) {
        Integer vendedorId = getVendedorIdDoToken(authentication);
        produtoService.desativarProduto(vendedorId, id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/pedidos")
    public ResponseEntity<List<PedidoDTO>> listarMeusPedidos(Authentication authentication) {
        Integer vendedorId = getVendedorIdDoToken(authentication);
        List<PedidoDTO> pedidos = pedidoService.listarPedidosPorVendedor(vendedorId);
        return ResponseEntity.ok(pedidos);
    }

    @PatchMapping("/pedidos/{id}/status")
    public ResponseEntity<PedidoDTO> atualizarStatusPedido(
            Authentication authentication,
            @PathVariable Integer id,
            @Valid @RequestBody AtualizarStatusPedidoDTO statusDTO) {
        
        Integer vendedorId = getVendedorIdDoToken(authentication);
        PedidoDTO pedidoAtualizado = pedidoService.atualizarStatusPedido(vendedorId, id, statusDTO.getNovoStatus());
        return ResponseEntity.ok(pedidoAtualizado);
    }

    @PostMapping("/produtos/{id}/solicitar-selo")
    public ResponseEntity<ProdutoDTO> solicitarSelo(
            Authentication authentication,
            @PathVariable Integer id,
            @Valid @RequestBody SolicitarSeloDTO solicitarSeloDTO) {
        
        Integer vendedorId = getVendedorIdDoToken(authentication);
        ProdutoDTO produtoAtualizado = produtoService.solicitarSelo(vendedorId, id, solicitarSeloDTO);
        return ResponseEntity.ok(produtoAtualizado);
    }

    private Integer getVendedorIdDoToken(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl)) {
            throw new SecurityException("Autenticação inválida ou não encontrada.");
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }
}