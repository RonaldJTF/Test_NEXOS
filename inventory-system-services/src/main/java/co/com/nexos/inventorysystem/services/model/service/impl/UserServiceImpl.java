package co.com.nexos.inventorysystem.services.model.service.impl;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.com.nexos.inventorysystem.services.config.specification.OrderBy;
import co.com.nexos.inventorysystem.services.config.specification.SpecificationNEXOS;
import co.com.nexos.inventorysystem.services.exception.NexosException;
import co.com.nexos.inventorysystem.services.model.dao.UserDAO;
import co.com.nexos.inventorysystem.services.model.entity.UserEntity;
import co.com.nexos.inventorysystem.services.model.service.UserService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService{
    private final UserDAO userDAO;

    @Override
    public UserEntity findById(Long id) throws NexosException {
       return userDAO.findById(id).orElseThrow(() -> new NexosException("User not found", 404));
    }

    @Override
    public List<UserEntity> findAll() {
        return userDAO.findAll();
    }

    @Override
    @Transactional(rollbackFor = {Exception.class, RuntimeException.class})
    public UserEntity save(UserEntity entity) {
        if (entity.getUserId() != null){
            entity.onUpdate();
            userDAO.update(
                entity.getAppointmentId(), 
                entity.getName(), 
                entity.getAge(), 
                entity.getHireDate(), 
                entity.getAction(), 
                entity.getUserId());
            return entity;
        }
        return userDAO.save(entity);
    }

    @Override
    @Transactional(rollbackFor = {Exception.class, RuntimeException.class})
    public void deleteByProcedure(Long id, String register) {
        Integer rows = userDAO.deleteByProcedure(id, register);
        if (1 != rows) {
            throw new RuntimeException("A total of " + rows + " rows have been affected.");
        }
    }

    @Override
    public List<UserEntity> findAllFilteredBy(UserEntity filter) {
        OrderBy orderBy = new OrderBy("name", true);
        Specification<UserEntity> specification = new SpecificationNEXOS<>(filter, orderBy);
        return userDAO.findAll(specification);
    }
}
