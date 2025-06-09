package co.com.nexos.inventorysystem.services.model.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.datatables.mapping.DataTablesInput;
import org.springframework.data.jpa.datatables.mapping.DataTablesOutput;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.com.nexos.inventorysystem.services.config.specification.OrderBy;
import co.com.nexos.inventorysystem.services.config.specification.SpecificationNEXOS;
import co.com.nexos.inventorysystem.services.exception.NexosException;
import co.com.nexos.inventorysystem.services.model.dao.ProductDAO;
import co.com.nexos.inventorysystem.services.model.entity.ProductEntity;
import co.com.nexos.inventorysystem.services.model.service.ProductService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ProductServiceImpl implements ProductService{
    private final ProductDAO productDAO;

    @Override
    @Transactional(readOnly = true)
    public ProductEntity findById(Long id) throws NexosException {
       return productDAO.findById(id).orElseThrow(() -> new NexosException("Product not found", 404));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductEntity> findAll() {
        return productDAO.findAll();
    }

    @Override
    @Transactional(rollbackFor = {Exception.class, RuntimeException.class})
    public ProductEntity save(ProductEntity entity) {
        if (entity.getProductId() != null){
            entity.onUpdate();
            productDAO.update(
                entity.getUserId(), 
                entity.getName(), 
                entity.getStock(), 
                entity.getEntryDate(), 
                entity.getAction(), 
                entity.getProductId());
            return entity;
        }
        return productDAO.save(entity);
    }

    @Override
    @Transactional(rollbackFor = {Exception.class, RuntimeException.class})
    public void deleteByProcedure(Long id, String register) {
        Integer rows = productDAO.deleteByProcedure(id, register);
        if (1 != rows) {
            throw new RuntimeException("A total of " + rows + " rows have been affected.");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductEntity> findAllFilteredBy(ProductEntity filter) {
        OrderBy orderBy = new OrderBy("name", true);
        Specification<ProductEntity> specification = new SpecificationNEXOS<>(filter, orderBy);
        return productDAO.findAll(specification);
    }

    @Override
    @Transactional(readOnly = true)
    public DataTablesOutput<ProductEntity> findAll(DataTablesInput dataTablesInput) {
        return productDAO.findAll(dataTablesInput);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProductEntity> findAll(Pageable pageable) {
        return productDAO.findAll(pageable);
    }
}
