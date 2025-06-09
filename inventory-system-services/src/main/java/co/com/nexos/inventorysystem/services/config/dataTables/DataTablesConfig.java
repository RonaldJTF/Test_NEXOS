package co.com.nexos.inventorysystem.services.config.dataTables;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.datatables.repository.DataTablesRepositoryFactoryBean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(
        repositoryFactoryBeanClass = DataTablesRepositoryFactoryBean.class,
        basePackages = "co.com.nexos.inventorysystem.services.model.dao"
)
public class DataTablesConfig {
}
