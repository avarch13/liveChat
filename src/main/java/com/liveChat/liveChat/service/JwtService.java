package com.liveChat.liveChat.service;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.liveChat.liveChat.config.JwtConfig;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwt;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;

import lombok.extern.slf4j.Slf4j;
import java.util.function.Function;

import javax.crypto.SecretKey;

@Service
@Slf4j
public class JwtService {
    
    @Autowired
    private JwtConfig jwtConfig;
    private String secretKey;
    private String jwtExpiration;

    @PostConstruct
    public void validateConfiguration() {
        secretKey = jwtConfig.getSecretKey();
        jwtExpiration = String.valueOf(jwtConfig.getExpiration());

        if (secretKey == null || secretKey.isEmpty()) {
            throw new IllegalStateException("JWT secret key is not configured.");
        }
        if (jwtExpiration == null || jwtExpiration.isEmpty()) {
            throw new IllegalStateException("JWT expiration time is not configured.");
        }
        log.info("JWT configuration validated successfully");
    }

    /**
     * Generates a JWT token for the given user details.
     * The token includes the username as the subject, the issued at time, and the expiration time.
     * The token is signed using HS256 algorithm and the application's secret key.
     *
     * @param userDetails the user details for which to generate the token
     * @return a signed JWT token string
     */
    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
            .subject(userDetails.getUsername())
            .issuedAt(new Date(System.currentTimeMillis()))
            .expiration(new Date(System.currentTimeMillis() + Long.parseLong(jwtExpiration)))
            .signWith(getSignInKey())
            .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()
                .verifyWith((SecretKey) getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
        } catch (io.jsonwebtoken.ExpiredJwtException e) {
            log.error("JWT token has expired", e);
            throw e;
        } catch (io.jsonwebtoken.UnsupportedJwtException e) {
            log.error("JWT token format is unsupported", e);
            throw e;
        } catch (io.jsonwebtoken.MalformedJwtException e) {
            log.error("Invalid JWT token format", e);
            throw e;
        } catch (io.jsonwebtoken.security.SignatureException e) {
            log.error("JWT signature validation failed. Ensure the secret key is correct.", e);
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error while parsing JWT token", e);
            throw new IllegalStateException("Error parsing JWT token", e);
        }
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private Key getSignInKey() {
        try {
            byte[] keyBytes = java.util.Base64.getDecoder().decode(secretKey);
            if (keyBytes.length < 32) {
                log.warn("JWT secret key is shorter than 256 bits (32 bytes). This may cause issues with HS256. Current length: {} bytes", keyBytes.length);
            }
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (IllegalArgumentException e) {
            log.error("Failed to decode JWT secret key. Ensure it is a valid Base64-encoded string of at least 256 bits.", e);
            throw new IllegalStateException("Invalid JWT secret key: not a valid Base64-encoded string.", e);
        } catch (Exception e) {
            log.error("Unexpected error while generating signing key", e);
            throw new IllegalStateException("Error generating JWT signing key", e);
        }
    }
}
