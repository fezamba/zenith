package br.com.unirio.marketplace.zenith.controller;

import br.com.unirio.marketplace.zenith.dto.ClienteDTO;
import br.com.unirio.marketplace.zenith.dto.LoginDTO;
import br.com.unirio.marketplace.zenith.dto.RegistroDTO;
import br.com.unirio.marketplace.zenith.dto.TokenDTO;
import br.com.unirio.marketplace.zenith.dto.RegistroVendedorDTO;
import br.com.unirio.marketplace.zenith.dto.VendedorDTO;
import br.com.unirio.marketplace.zenith.model.Cliente;
import br.com.unirio.marketplace.zenith.model.Vendedor;
import br.com.unirio.marketplace.zenith.security.TokenService;
import br.com.unirio.marketplace.zenith.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuarioService;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public AuthController(UsuarioService usuarioService, AuthenticationManager authenticationManager, TokenService tokenService) {
        this.usuarioService = usuarioService;
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    @PostMapping("/registrar")
    public ResponseEntity<ClienteDTO> registarCliente(@Valid @RequestBody RegistroDTO registroDTO) {
        Cliente cliente = usuarioService.registarCliente(registroDTO);
        ClienteDTO clienteDTO = new ClienteDTO(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteDTO);
    }

    @PostMapping("/registrar-vendedor")
    public ResponseEntity<VendedorDTO> registarVendedor(@Valid @RequestBody RegistroVendedorDTO registroDTO) {
        Vendedor vendedor = usuarioService.registrarVendedor(registroDTO);
        VendedorDTO vendedorDTO = new VendedorDTO(vendedor);
        return ResponseEntity.status(HttpStatus.CREATED).body(vendedorDTO);
    }

    @PostMapping("/login")
    public ResponseEntity<TokenDTO> autenticarUsuario(@Valid @RequestBody LoginDTO loginDTO) {
        
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getEmail(),
                        loginDTO.getSenha()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String tokenJwt = tokenService.gerarToken(authentication);
        
        TokenDTO tokenDTO = new TokenDTO(loginDTO.getEmail(), tokenJwt);
        
        return ResponseEntity.ok(tokenDTO);
    }
}