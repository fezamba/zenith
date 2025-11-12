package br.com.unirio.marketplace.zenith.service;

import br.com.unirio.marketplace.zenith.dto.RegistroDTO;
import br.com.unirio.marketplace.zenith.exception.RegistroDuplicadoException;
import br.com.unirio.marketplace.zenith.model.Cliente;
import br.com.unirio.marketplace.zenith.repository.ClienteRepository;
import br.com.unirio.marketplace.zenith.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, ClienteRepository clienteRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.clienteRepository = clienteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Cliente registarCliente(RegistroDTO registroDTO) {
        if (usuarioRepository.findByEmail(registroDTO.getEmail()).isPresent()) {
            throw new RegistroDuplicadoException("Email já cadastrado.");
        }
        if (clienteRepository.findByCpf(registroDTO.getCpf()).isPresent()) {
            throw new RegistroDuplicadoException("CPF já cadastrado.");
        }

        Cliente cliente = new Cliente();
        cliente.setNome(registroDTO.getNome());
        cliente.setEmail(registroDTO.getEmail());
        
        cliente.setSenhaHash(passwordEncoder.encode(registroDTO.getSenha()));
        
        cliente.setTipoUsuario("CLIENTE");
        cliente.setCpf(registroDTO.getCpf());
        cliente.setZenithPoints(0);

        return clienteRepository.save(cliente);
    }
}