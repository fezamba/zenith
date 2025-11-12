package br.com.unirio.marketplace.zenith.service;

import br.com.unirio.marketplace.zenith.dto.RegistroDTO;
import br.com.unirio.marketplace.zenith.dto.RegistroVendedorDTO;
import br.com.unirio.marketplace.zenith.exception.RegistroDuplicadoException;
import br.com.unirio.marketplace.zenith.model.Cliente;
import br.com.unirio.marketplace.zenith.model.Vendedor;
import br.com.unirio.marketplace.zenith.repository.ClienteRepository;
import br.com.unirio.marketplace.zenith.repository.UsuarioRepository;
import br.com.unirio.marketplace.zenith.repository.VendedorRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final VendedorRepository vendedorRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, ClienteRepository clienteRepository, VendedorRepository vendedorRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.clienteRepository = clienteRepository;
        this.vendedorRepository = vendedorRepository;
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

    @Transactional
    public Vendedor registrarVendedor(RegistroVendedorDTO registroDTO) {
        if (usuarioRepository.findByEmail(registroDTO.getEmail()).isPresent()) {
            throw new RegistroDuplicadoException("Email já cadastrado.");
        }
        if (vendedorRepository.findByCnpj(registroDTO.getCnpj()).isPresent()) {
            throw new RegistroDuplicadoException("CNPJ já cadastrado.");
        }

        Vendedor vendedor = new Vendedor();
        vendedor.setNome(registroDTO.getNome());
        vendedor.setEmail(registroDTO.getEmail());
        vendedor.setSenhaHash(passwordEncoder.encode(registroDTO.getSenha()));
        vendedor.setTipoUsuario("VENDEDOR");
        vendedor.setCnpj(registroDTO.getCnpj());
        
        vendedor.setStatus("PENDENTE"); 

        return vendedorRepository.save(vendedor);
    }
}