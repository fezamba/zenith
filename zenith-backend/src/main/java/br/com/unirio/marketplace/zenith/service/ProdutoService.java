package br.com.unirio.marketplace.zenith.service;

import br.com.unirio.marketplace.zenith.exception.ResourceNotFoundException;
import br.com.unirio.marketplace.zenith.model.Categoria;
import br.com.unirio.marketplace.zenith.model.Produto;
import br.com.unirio.marketplace.zenith.repository.CategoriaRepository;
import br.com.unirio.marketplace.zenith.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final CategoriaRepository categoriaRepository;

    public ProdutoService(ProdutoRepository produtoRepository, CategoriaRepository categoriaRepository) {
        this.produtoRepository = produtoRepository;
        this.categoriaRepository = categoriaRepository;
    }


    public List<Produto> listarTodosProdutos() {
        return produtoRepository.findAll();
    }

    public Produto buscarProdutoPorId(Integer id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + id + " não encontrado."));
    }

    public List<Produto> listarProdutosPorCategoria(Integer categoriaId) {
        if (!categoriaRepository.existsById(categoriaId)) {
            throw new ResourceNotFoundException("Categoria com ID " + categoriaId + " não encontrada.");
        }
        return produtoRepository.findByCategoriaId(categoriaId);
    }
    
    public List<Categoria> listarCategorias() {
        return categoriaRepository.findAll();
    }

   //FIXME: Falta adicionar os metodos do Vendedor/Admin (criarProduto, atualizarProduto...)
}