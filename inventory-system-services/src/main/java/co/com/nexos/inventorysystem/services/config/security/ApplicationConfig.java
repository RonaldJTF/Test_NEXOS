package co.com.nexos.inventorysystem.services.config.security;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import jakarta.servlet.Filter;

@Configuration
public class ApplicationConfig {
    @Bean
    public FilterRegistrationBean<Filter> registerFilter() {
        FilterRegistrationBean<Filter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new RegisterFilter());
        registrationBean.addUrlPatterns("/api/*"); 
        registrationBean.setOrder(1);
        return registrationBean;
    }
}

