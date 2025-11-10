package br.com.unirio.marketplace.zenith.controller;

import br.com.unirio.marketplace.zenith.dto.CategoriaDTO;
import br.com.unirio.marketplace.zenith.dto.ProdutoDTO;
import br.com.unirio.marketplace.zenith.service.ProdutoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @GetMapping
    public ResponseEntity<List<ProdutoDTO>> listarTodos() {
        List<ProdutoDTO> produtos = produtoService.listarTodosProdutos();
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoDTO> buscarPorId(@PathVariable Integer id) {
        ProdutoDTO produto = produtoService.buscarProdutoPorId(id);
        return ResponseEntity.ok(produto);
    }
    
    @GetMapping("/categoria/{id}")
    public ResponseEntity<List<ProdutoDTO>> listarPorCategoria(@PathVariable Integer id) {
        List<ProdutoDTO> produtos = produtoService.listarProdutosPorCategoria(id);
        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaDTO>> listarCategorias() {
        List<CategoriaDTO> categorias = produtoService.listarCategorias();
        return ResponseEntity.ok(categorias);
    }
}