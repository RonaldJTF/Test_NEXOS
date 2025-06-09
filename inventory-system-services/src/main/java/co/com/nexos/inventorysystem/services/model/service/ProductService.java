package co.com.nexos.inventorysystem.services.model.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.datatables.mapping.DataTablesInput;
import org.springframework.data.jpa.datatables.mapping.DataTablesOutput;

import co.com.nexos.inventorysystem.services.model.entity.ProductEntity;

public interface ProductService extends CommonService<ProductEntity>{
    DataTablesOutput<ProductEntity> findAll (DataTablesInput dataTablesInput);
    Page<ProductEntity> findAll(Pageable pageable);
}
