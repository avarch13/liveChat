package com.liveChat.liveChat.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@Data
@ConfigurationProperties(prefix = "application.security.jwt")
public class JwtConfig {
    
    private String secretKey;
    private long expiration;

}
