package co.com.nexos.inventorysystem.services.model.dao;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.datatables.repository.DataTablesRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import co.com.nexos.inventorysystem.services.model.entity.ProductEntity;

@Repository
public interface ProductDAO extends DataTablesRepository<ProductEntity, Long>{
    @Modifying
    @Query(value = """
        update ProductEntity i 
        set i.userId = :userId, i.name = :name, i.stock = :stock, 
            i.entryDate = :entryDate, i.action = :action 
        where i.productId = :productId 
    """)
    int update(@Param("userId") Long userId,
               @Param("name") String name,
               @Param("stock") Long stock,
               @Param("entryDate") Date entryDate,
               @Param("action") String action,
               @Param("productId") Long productId);

    @Query(value = "SELECT INVENTORY_SYSTEM.PR_D_PRODUCT(?1, ?2)", nativeQuery = true)
    Integer deleteByProcedure(Long productId, String action);
}
