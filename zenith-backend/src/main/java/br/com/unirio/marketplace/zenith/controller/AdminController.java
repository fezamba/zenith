package br.com.unirio.marketplace.zenith.controller;

import br.com.unirio.marketplace.zenith.dto.*;
import br.com.unirio.marketplace.zenith.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/vendedores/pendentes")
    public ResponseEntity<List<VendedorDTO>> listarVendedoresPendentes() {
        List<VendedorDTO> vendedores = adminService.listarVendedoresPendentes();
        return ResponseEntity.ok(vendedores);
    }

    @PatchMapping("/vendedores/{id}/status")
    public ResponseEntity<VendedorDTO> atualizarStatusVendedor(
            @PathVariable Integer id,
            @Valid @RequestBody AtualizarStatusVendedorDTO statusDTO) {
        
        VendedorDTO vendedor = adminService.atualizarStatusVendedor(id, statusDTO.getNovoStatus());
        return ResponseEntity.ok(vendedor);
    }


    @GetMapping("/selos/pendentes")
    public ResponseEntity<List<ProdutoDTO>> listarSelosPendentes() {
        List<ProdutoDTO> produtos = adminService.listarSelosPendentes();
        return ResponseEntity.ok(produtos);
    }

    @PatchMapping("/selos/produtos/{id}/status")
    public ResponseEntity<ProdutoDTO> atualizarStatusSelo(
            @PathVariable Integer id,
            @Valid @RequestBody AtualizarStatusSeloDTO statusDTO) {
        
        ProdutoDTO produto = adminService.atualizarStatusSelo(id, statusDTO.getNovoStatus());
        return ResponseEntity.ok(produto);
    }

    @GetMapping("/categorias")
    public ResponseEntity<List<CategoriaDTO>> listarTodasCategorias() {
        List<CategoriaDTO> categorias = adminService.listarTodasCategorias();
        return ResponseEntity.ok(categorias);
    }

    @PostMapping("/categorias")
    public ResponseEntity<CategoriaDTO> criarCategoria(@Valid @RequestBody CategoriaInputDTO categoriaInputDTO) {
        CategoriaDTO novaCategoria = adminService.criarCategoria(categoriaInputDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaCategoria);
    }

    @PutMapping("/categorias/{id}")
    public ResponseEntity<CategoriaDTO> atualizarCategoria(
            @PathVariable Integer id,
            @Valid @RequestBody CategoriaInputDTO categoriaInputDTO) {
        
        CategoriaDTO categoria = adminService.atualizarCategoria(id, categoriaInputDTO);
        return ResponseEntity.ok(categoria);
    }

    @DeleteMapping("/categorias/{id}")
    public ResponseEntity<Void> desativarCategoria(@PathVariable Integer id) {
        adminService.desativarCategoria(id);
        return ResponseEntity.noContent().build();
    }
}