package co.com.nexos.inventorysystem.services.config.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins(
                "http://localhost:4200"
            )
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders(
                "Origin",
                "Accept",
                "Enctype",
                "X-Requested-With",
                "X-UserId",
                "Content-Type",
                "Content-Disposition",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers",
                "Authorization"
            )
            .exposedHeaders(
                "Referer",
                "Content-Type",
                "Content-Disposition",
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Credentials"
            )
            .allowCredentials(true);
    }
}