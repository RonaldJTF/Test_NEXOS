package co.com.nexos.inventorysystem.services.model.dao;

import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import co.com.nexos.inventorysystem.services.model.entity.UserEntity;

@Repository
public interface UserDAO extends JpaRepository<UserEntity, Long>, JpaSpecificationExecutor<UserEntity>{
    @Modifying
    @Query(value = """
        update UserEntity u 
        set u.appointmentId = :appointmentId, u.name = :name, u.age = :age, 
            u.hireDate = :hireDate, u.action = :action 
        where u.userId = :userId 
    """)
    int update(@Param("appointmentId") Long appointmentId,
               @Param("name") String name,
               @Param("age") Integer age,
               @Param("hireDate") Date hireDate,
               @Param("action") String action,
               @Param("userId") Long userId);

    @Query(value = "SELECT INVENTORY_SYSTEM.PR_D_USER(?1, ?2)", nativeQuery = true)
    Integer deleteByProcedure(Long userId, String action);

}
