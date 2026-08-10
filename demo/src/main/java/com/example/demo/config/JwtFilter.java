package com.example.demo.config;

import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.example.demo.services.JWTservice;
import com.example.demo.services.MyUserDetailService;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JWTservice JWTservice;
    private final ApplicationContext context;

    public JwtFilter(JWTservice JWTservice, ApplicationContext context) {
        this.JWTservice = JWTservice;
        this.context = context;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
            
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                username = JWTservice.extractUserName(token);
                System.out.println("DEBUG: Extracted username: " + username);
            } catch (Exception e) {
                System.err.println("DEBUG: JWT Parsing Error -> " + e.getMessage());
            }
        } else {
            System.out.println("DEBUG: No Bearer header on request to: " + request.getRequestURI());
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = context.getBean(MyUserDetailService.class).loadUserByUsername(username);

                if (JWTservice.validateToken(token, userDetails)) {
                    // Load user authorities
                    Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();

                    // Fallback: If DB UserDetails returned empty authorities, extract them from JWT claims
                    if (authorities == null || authorities.isEmpty()) {
                        List<String> rolesFromToken = JWTservice.extractRoles(token);
                        if (rolesFromToken != null) {
                            authorities = rolesFromToken.stream()
                                    .map(SimpleGrantedAuthority::new)
                                    .collect(Collectors.toList());
                        }
                    }

                    UsernamePasswordAuthenticationToken authtoken = 
                        new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
                    
                    authtoken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authtoken);

                    System.out.println("DEBUG: Successfully authenticated user: " + username + " | Granted Authorities: " + authorities);
                } else {
                    System.err.println("DEBUG: Token validation returned false for: " + username);
                }
            } catch (Exception e) {
                System.err.println("DEBUG: User loading or validation exception: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return path.startsWith("/public/") || "OPTIONS".equalsIgnoreCase(request.getMethod()); 
    }
}