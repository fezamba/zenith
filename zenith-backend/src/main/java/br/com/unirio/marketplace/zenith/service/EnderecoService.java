package br.com.unirio.marketplace.zenith.service;

import br.com.unirio.marketplace.zenith.dto.EnderecoDTO;
import br.com.unirio.marketplace.zenith.exception.ResourceNotFoundException;
import br.com.unirio.marketplace.zenith.model.Cliente;
import br.com.unirio.marketplace.zenith.model.Endereco;
import br.com.unirio.marketplace.zenith.repository.ClienteRepository;
import br.com.unirio.marketplace.zenith.repository.EnderecoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;
    private final ClienteRepository clienteRepository;

    public EnderecoService(EnderecoRepository enderecoRepository, ClienteRepository clienteRepository) {
        this.enderecoRepository = enderecoRepository;
        this.clienteRepository = clienteRepository;
    }

    @Transactional
    public EnderecoDTO cadastrarEndereco(Integer clienteId, EnderecoDTO dto) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado."));

        Endereco endereco = new Endereco();
        endereco.setCliente(cliente);
        endereco.setLogradouro(dto.getLogradouro());
        endereco.setNumero(dto.getNumero());
        endereco.setCep(dto.getCep());
        endereco.setCidade(dto.getCidade());
        endereco.setEstado(dto.getEstado());

        Endereco salvo = enderecoRepository.save(endereco);
        return new EnderecoDTO(salvo); 
    }

    @Transactional(readOnly = true)
    public List<EnderecoDTO> listarEnderecos(Integer clienteId) {
        return enderecoRepository.findByClienteId(clienteId).stream()
                .map(EnderecoDTO::new)
                .collect(Collectors.toList());
    }
}