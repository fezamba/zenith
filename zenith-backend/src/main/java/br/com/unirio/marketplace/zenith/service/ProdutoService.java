package br.com.unirio.marketplace.zenith.service;

import br.com.unirio.marketplace.zenith.dto.CategoriaDTO;
import br.com.unirio.marketplace.zenith.dto.ProdutoDTO;
import br.com.unirio.marketplace.zenith.dto.ProdutoInputDTO;
import br.com.unirio.marketplace.zenith.dto.SolicitarSeloDTO;
import br.com.unirio.marketplace.zenith.exception.ResourceNotFoundException;
import br.com.unirio.marketplace.zenith.model.Categoria;
import br.com.unirio.marketplace.zenith.model.Produto;
import br.com.unirio.marketplace.zenith.model.Vendedor; 
import br.com.unirio.marketplace.zenith.repository.CategoriaRepository;
import br.com.unirio.marketplace.zenith.repository.ProdutoRepository;
import br.com.unirio.marketplace.zenith.repository.VendedorRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service 
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;
    private final VendedorRepository vendedorRepository;

    public ProdutoService(ProdutoRepository produtoRepository, 
                          CategoriaRepository categoriaRepository,
                          VendedorRepository vendedorRepository) { 
        this.produtoRepository = produtoRepository;
        this.categoriaRepository = categoriaRepository;
        this.vendedorRepository = vendedorRepository;
    }


    @Transactional(readOnly = true)
    public List<ProdutoDTO> listarTodosProdutos(BigDecimal precoMin, BigDecimal precoMax, String statusSelo) {
        
        Specification<Produto> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.equal(root.get("status"), "ATIVO"));

            if (precoMin != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("preco"), precoMin));
            }
            if (precoMax != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("preco"), precoMax));
            }
            if (statusSelo != null && !statusSelo.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("statusSelo"), statusSelo.toUpperCase()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        return produtoRepository.findAll(spec)
                .stream()
                .map(ProdutoDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProdutoDTO buscarProdutoPorId(Integer id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + id + " não encontrado."));
        
        if (!"ATIVO".equals(produto.getStatus())) {
             throw new ResourceNotFoundException("Produto com ID " + id + " não encontrado.");
        }

        return new ProdutoDTO(produto);
    }
    
    @Transactional(readOnly = true)
    public List<ProdutoDTO> listarProdutosPorCategoria(Integer categoriaId) {
        if (!categoriaRepository.existsById(categoriaId)) {
            throw new ResourceNotFoundException("Categoria com ID " + categoriaId + " não encontrada.");
        }
        
        Specification<Produto> spec = (root, query, criteriaBuilder) -> {
            Predicate pCategoria = criteriaBuilder.equal(root.get("categoria").get("id"), categoriaId);
            Predicate pStatus = criteriaBuilder.equal(root.get("status"), "ATIVO");
            return criteriaBuilder.and(pCategoria, pStatus);
        };

        return produtoRepository.findAll(spec)
                .stream()
                .map(ProdutoDTO::new)
                .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<CategoriaDTO> listarCategorias() {
        return categoriaRepository.findAll()
                .stream()
                .map(CategoriaDTO::new)
                .collect(Collectors.toList());
    }

    public Produto findProdutoByIdInterno(Integer id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + id + " não encontrado."));
    }

    @Transactional(readOnly = true)
    public List<ProdutoDTO> listarProdutosPorVendedor(Integer vendedorId) {
        return produtoRepository.findByVendedorId(vendedorId)
                .stream()
                .map(ProdutoDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProdutoDTO criarProduto(Integer vendedorId, ProdutoInputDTO dto) {
        Vendedor vendedor = vendedorRepository.findById(vendedorId)
                .orElseThrow(() -> new ResourceNotFoundException("Vendedor não encontrado."));
        
        if (!"APROVADO".equals(vendedor.getStatus())) {
            throw new SecurityException("Vendedor não está aprovado para publicar produtos.");
        }

        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria com ID " + dto.getCategoriaId() + " não encontrada."));

        Produto produto = new Produto();
        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setPreco(dto.getPreco());
        produto.setEstoque(dto.getEstoque());
        produto.setCategoria(categoria);
        produto.setVendedor(vendedor);
        
        produto.setStatus("ATIVO");
        produto.setStatusSelo("NAO_SOLICITADO");

        Produto produtoSalvo = produtoRepository.save(produto);

        return new ProdutoDTO(produtoSalvo);
    }

    @Transactional
    public ProdutoDTO atualizarProduto(Integer vendedorId, Integer produtoId, ProdutoInputDTO dto) {
        Produto produto = validarDonoProduto(vendedorId, produtoId);

        if (!produto.getCategoria().getId().equals(dto.getCategoriaId())) {
            Categoria novaCategoria = categoriaRepository.findById(dto.getCategoriaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Categoria com ID " + dto.getCategoriaId() + " não encontrada."));
            produto.setCategoria(novaCategoria);
        }

        produto.setNome(dto.getNome());
        produto.setDescricao(dto.getDescricao());
        produto.setPreco(dto.getPreco());
        produto.setEstoque(dto.getEstoque());
        
        Produto produtoAtualizado = produtoRepository.save(produto);
        return new ProdutoDTO(produtoAtualizado);
    }

    @Transactional
    public void desativarProduto(Integer vendedorId, Integer produtoId) {
        Produto produto = validarDonoProduto(vendedorId, produtoId);

        produto.setStatus("INATIVO");
        produtoRepository.save(produto);
    }

    @Transactional
    public ProdutoDTO solicitarSelo(Integer vendedorId, Integer produtoId, SolicitarSeloDTO dto) {
        
        Produto produto = validarDonoProduto(vendedorId, produtoId);

        if ("PENDENTE".equals(produto.getStatusSelo()) || "APROVADO".equals(produto.getStatusSelo())) {
            throw new SecurityException("Este produto já possui um selo aprovado ou uma solicitação pendente.");
        }

        produto.setStatusSelo("PENDENTE");
        produto.setJustificativaSelo(dto.getJustificativa());

        Produto produtoSalvo = produtoRepository.save(produto);

        return new ProdutoDTO(produtoSalvo);
    }

    private Produto validarDonoProduto(Integer vendedorId, Integer produtoId) {
        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + produtoId + " não encontrado."));

        if (!produto.getVendedor().getId().equals(vendedorId)) {
            throw new SecurityException("Acesso negado: Este produto não pertence ao vendedor autenticado.");
        }
        
        return produto;
    }
}