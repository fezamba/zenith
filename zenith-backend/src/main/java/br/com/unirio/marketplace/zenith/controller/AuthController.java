package br.com.unirio.marketplace.zenith.controller;

import br.com.unirio.marketplace.zenith.dto.ClienteDTO;
import br.com.unirio.marketplace.zenith.dto.LoginDTO;
import br.com.unirio.marketplace.zenith.dto.RegistroDTO;
import br.com.unirio.marketplace.zenith.dto.TokenDTO;
import br.com.unirio.marketplace.zenith.model.Cliente;
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

    public AuthController(UsuarioService usuarioService, AuthenticationManager authenticationManager) {
        this.usuarioService = usuarioService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/registar")
    public ResponseEntity<ClienteDTO> registarCliente(@Valid @RequestBody RegistroDTO registroDTO) {
        Cliente cliente = usuarioService.registarCliente(registroDTO);
        
        ClienteDTO clienteDTO = new ClienteDTO(cliente);

        return ResponseEntity.status(HttpStatus.CREATED).body(clienteDTO);
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

        // FIXME: GERAÇÃO DO TOKEN JWT NAO FOI IMPLEMENTADA

        String tokenJwtFalso = "token_jwt_falso_implementar_depois"; 
        
        TokenDTO tokenDTO = new TokenDTO(loginDTO.getEmail(), tokenJwtFalso);
        
        return ResponseEntity.ok(tokenDTO);
    }
}