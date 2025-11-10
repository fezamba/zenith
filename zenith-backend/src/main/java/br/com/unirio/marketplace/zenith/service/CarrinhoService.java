package br.com.unirio.marketplace.zenith.service;

import br.com.unirio.marketplace.zenith.exception.EstoqueInsuficienteException;
import br.com.unirio.marketplace.zenith.exception.ResourceNotFoundException;
import br.com.unirio.marketplace.zenith.model.Produto;
import br.com.unirio.marketplace.zenith.model.mongo.Carrinho;
import br.com.unirio.marketplace.zenith.repository.CarrinhoRepository;
import br.com.unirio.marketplace.zenith.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;

@Service
public class CarrinhoService {

    private final CarrinhoRepository carrinhoRepository;
    private final ProdutoRepository produtoRepository;

    public CarrinhoService(CarrinhoRepository carrinhoRepository, ProdutoRepository produtoRepository) {
        this.carrinhoRepository = carrinhoRepository;
        this.produtoRepository = produtoRepository;
    }

    public Carrinho buscarCarrinho(Integer usuarioId) {
        return carrinhoRepository.findByUsuarioId(usuarioId)
                .orElseGet(() -> criarCarrinhoVazio(usuarioId));
    }

    public Carrinho adicionarAoCarrinho(Integer usuarioId, Integer produtoId, int quantidade) {
        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + produtoId + " não encontrado."));

        if (produto.getEstoque() < quantidade) {
            throw new EstoqueInsuficienteException("Estoque insuficiente para o produto: " + produto.getNome());
        }

        Carrinho carrinho = buscarCarrinho(usuarioId);

        carrinho.adicionarOuAtualizarItem(produtoId, quantidade);
        
        return carrinhoRepository.save(carrinho);
    }

    //FIXME: Criar métodos (removerDoCarrinho, atualizarQuantidade...)

    private Carrinho criarCarrinhoVazio(Integer usuarioId) {
        Carrinho carrinho = new Carrinho();
        carrinho.setUsuarioId(usuarioId);
        carrinho.setItens(new ArrayList<>());
        carrinho.setDataModificado(Instant.now());
        return carrinhoRepository.save(carrinho);
    }
}