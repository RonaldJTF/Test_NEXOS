package co.com.nexos.inventorysystem.services.model.service.impl;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.com.nexos.inventorysystem.services.config.specification.OrderBy;
import co.com.nexos.inventorysystem.services.config.specification.SpecificationNEXOS;
import co.com.nexos.inventorysystem.services.exception.NexosException;
import co.com.nexos.inventorysystem.services.model.dao.AppointmentDAO;
import co.com.nexos.inventorysystem.services.model.entity.AppointmentEntity;
import co.com.nexos.inventorysystem.services.model.service.AppointmentService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class AppointmentServiceImpl implements AppointmentService{
    private final AppointmentDAO appointmentDAO;

    @Override
    public AppointmentEntity findById(Long id) throws NexosException {
       return appointmentDAO.findById(id).orElseThrow(() -> new NexosException("Appointment not found", 404));
    }

    @Override
    public List<AppointmentEntity> findAll() {
        return appointmentDAO.findAll();
    }

    @Override
    @Transactional(rollbackFor = {Exception.class, RuntimeException.class})
    public AppointmentEntity save(AppointmentEntity entity) {
        if (entity.getAppointmentId() != null){
            entity.onUpdate();
            appointmentDAO.update(
                entity.getName(), 
                entity.getAction(),  
                entity.getAppointmentId());
            return entity;
        }
        return appointmentDAO.save(entity);
    }

    @Override
    @Transactional(rollbackFor = {Exception.class, RuntimeException.class})
    public void deleteByProcedure(Long id, String register) {
        Integer rows = appointmentDAO.deleteByProcedure(id, register);
        if (1 != rows) {
            throw new RuntimeException("A total of " + rows + " rows have been affected.");
        }
    }

    @Override
    public List<AppointmentEntity> findAllFilteredBy(AppointmentEntity filter) {
        OrderBy orderBy = new OrderBy("name", true);
        Specification<AppointmentEntity> specification = new SpecificationNEXOS<>(filter, orderBy);
        return appointmentDAO.findAll(specification);
    }
}
