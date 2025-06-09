package co.com.nexos.inventorysystem.services.model.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import co.com.nexos.inventorysystem.services.model.entity.AppointmentEntity;

@Repository
public interface AppointmentDAO extends JpaRepository<AppointmentEntity, Long>, JpaSpecificationExecutor<AppointmentEntity>{
    @Modifying
    @Query(value = """
        update AppointmentEntity a
        set a.name = :name, a.action = :action 
        where a.appointmentId = :appointmentId 
    """)
    int update(@Param("name") String name,
               @Param("action") String action,
               @Param("appointmentId") Long appointmentId);

    @Query(value = "SELECT INVENTORY_SYSTEM.PR_D_APPOINTMENT(?1, ?2)", nativeQuery = true)
    Integer deleteByProcedure(Long appointmentId, String action);

}
