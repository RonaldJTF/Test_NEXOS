package co.com.nexos.inventorysystem.services.model.service;

import java.util.List;

import co.com.nexos.inventorysystem.services.exception.NexosException;

public interface CommonService<T> {
    T findById(Long id) throws NexosException;
    List<T> findAll();
    T save (T entity);
    void deleteByProcedure(Long id, String register);
    List<T> findAllFilteredBy(T filter);
}
