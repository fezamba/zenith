package br.com.unirio.marketplace.zenith.service;

import br.com.unirio.marketplace.zenith.dto.CategoriaDTO;
import br.com.unirio.marketplace.zenith.dto.CategoriaInputDTO;
import br.com.unirio.marketplace.zenith.dto.ProdutoDTO;
import br.com.unirio.marketplace.zenith.dto.VendedorDTO;
import br.com.unirio.marketplace.zenith.exception.ResourceNotFoundException;
import br.com.unirio.marketplace.zenith.model.Categoria;
import br.com.unirio.marketplace.zenith.model.Produto;
import br.com.unirio.marketplace.zenith.model.Vendedor;
import br.com.unirio.marketplace.zenith.repository.CategoriaRepository;
import br.com.unirio.marketplace.zenith.repository.ProdutoRepository;
import br.com.unirio.marketplace.zenith.repository.VendedorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final VendedorRepository vendedorRepository;
    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;

    public AdminService(VendedorRepository vendedorRepository, 
                        ProdutoRepository produtoRepository, 
                        CategoriaRepository categoriaRepository) {
        this.vendedorRepository = vendedorRepository;
        this.produtoRepository = produtoRepository;
        this.categoriaRepository = categoriaRepository;
    }


    @Transactional(readOnly = true)
    public List<VendedorDTO> listarVendedoresPendentes() {
        return vendedorRepository.findByStatus("PENDENTE")
                .stream()
                .map(VendedorDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public VendedorDTO atualizarStatusVendedor(Integer vendedorId, String novoStatus) {
        Vendedor vendedor = vendedorRepository.findById(vendedorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendedor com ID " + vendedorId + " não encontrado."));

        vendedor.setStatus(novoStatus);
        Vendedor vendedorSalvo = vendedorRepository.save(vendedor);
        return new VendedorDTO(vendedorSalvo);
    }

    @Transactional(readOnly = true)
    public List<ProdutoDTO> listarSelosPendentes() {
        return produtoRepository.findByStatusSelo("PENDENTE")
                .stream()
                .map(ProdutoDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProdutoDTO atualizarStatusSelo(Integer produtoId, String novoStatus) {
        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + produtoId + " não encontrado."));

        produto.setStatusSelo(novoStatus);

        if ("REJEITADO".equals(novoStatus)) {
            produto.setJustificativaSelo(null);
        }

        Produto produtoSalvo = produtoRepository.save(produto);
        return new ProdutoDTO(produtoSalvo);
    }


    @Transactional(readOnly = true)
    public List<CategoriaDTO> listarTodasCategorias() {
        // Admin vê todas, inclusive inativas
        return categoriaRepository.findAll()
                .stream()
                .map(CategoriaDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public CategoriaDTO criarCategoria(CategoriaInputDTO dto) {
        Categoria categoria = new Categoria();
        categoria.setNome(dto.getNome());
        categoria.setStatus("ATIVO");
        
        Categoria categoriaSalva = categoriaRepository.save(categoria);
        return new CategoriaDTO(categoriaSalva);
    }

    @Transactional
    public CategoriaDTO atualizarCategoria(Integer categoriaId, CategoriaInputDTO dto) {
        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria com ID " + categoriaId + " não encontrada."));
        
        categoria.setNome(dto.getNome());
        
        Categoria categoriaSalva = categoriaRepository.save(categoria);
        return new CategoriaDTO(categoriaSalva);
    }

    @Transactional
    public void desativarCategoria(Integer categoriaId) {
        Categoria categoria = categoriaRepository.findById(categoriaId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria com ID " + categoriaId + " não encontrada."));
        
        categoria.setStatus("INATIVO");
        categoriaRepository.save(categoria);
    }
}