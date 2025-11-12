package br.com.unirio.marketplace.zenith.dto;

import lombok.Data;
import java.time.Instant;

@Data
public class ErrorResponseDTO {
    
    private int status;
    private String error;
    private String message;
    private Instant timestamp;
    private String path;

    public ErrorResponseDTO(int status, String error, String message, String path) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
        this.timestamp = Instant.now();
    }
}