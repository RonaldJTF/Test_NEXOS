package co.com.nexos.inventorysystem.services.model.service.impl;

import co.com.nexos.inventorysystem.services.exception.NexosException;
import co.com.nexos.inventorysystem.services.model.dao.AppointmentDAO;
import co.com.nexos.inventorysystem.services.model.entity.AppointmentEntity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AppointmentServiceImplTest {

    @Mock
    private AppointmentDAO appointmentDAO;

    @InjectMocks
    private AppointmentServiceImpl appointmentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void findById_shouldReturnEntity() throws NexosException {
        AppointmentEntity mockEntity = new AppointmentEntity();
        mockEntity.setAppointmentId(1L);

        when(appointmentDAO.findById(1L)).thenReturn(Optional.of(mockEntity));

        AppointmentEntity result = appointmentService.findById(1L);
        assertNotNull(result);
        assertEquals(1L, result.getAppointmentId());
    }

    @Test
    void findById_shouldThrowExceptionWhenNotFound() {
        when(appointmentDAO.findById(1L)).thenReturn(Optional.empty());

        NexosException ex = assertThrows(NexosException.class, () -> appointmentService.findById(1L));
        assertEquals("Appointment not found", ex.getMessage());
    }

    @Test
    void findAll_shouldReturnList() {
        AppointmentEntity a = new AppointmentEntity();
        when(appointmentDAO.findAll()).thenReturn(List.of(a));

        List<AppointmentEntity> result = appointmentService.findAll();
        assertEquals(1, result.size());
    }

    @Test
    void save_shouldInsertNewEntity() {
        AppointmentEntity entity = new AppointmentEntity(); 
        AppointmentEntity saved = new AppointmentEntity();
        saved.setAppointmentId(1L);

        when(appointmentDAO.save(entity)).thenReturn(saved);

        AppointmentEntity result = appointmentService.save(entity);
        assertNotNull(result);
        assertEquals(1L, result.getAppointmentId());
    }

    @Test
    void save_shouldUpdateEntity() {
        AppointmentEntity entity = spy(new AppointmentEntity());
        entity.setAppointmentId(1L);
        entity.setName("Test");
        entity.setAction("UPDATE");

        doNothing().when(entity).onUpdate();
        when(appointmentDAO.update("Test", "UPDATE", 1L)).thenReturn(1);

        AppointmentEntity result = appointmentService.save(entity);
        assertEquals("Test", result.getName());
        verify(entity).onUpdate();
        verify(appointmentDAO).update("Test", "UPDATE", 1L);
    }

    @Test
    void deleteByProcedure_shouldSucceedWhenOneRowAffected() {
        when(appointmentDAO.deleteByProcedure(1L, "DEL")).thenReturn(1);
        assertDoesNotThrow(() -> appointmentService.deleteByProcedure(1L, "DEL"));
    }

    @Test
    void deleteByProcedure_shouldThrowWhenOtherThanOneRowAffected() {
        when(appointmentDAO.deleteByProcedure(1L, "DEL")).thenReturn(0);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> appointmentService.deleteByProcedure(1L, "DEL"));
        assertTrue(ex.getMessage().contains("0 rows have been affected"));
    }

    @SuppressWarnings("unchecked")
    @Test
    void findAllFilteredBy_shouldReturnResults() {
        AppointmentEntity filter = new AppointmentEntity();
        when(appointmentDAO.findAll(any(Specification.class))).thenReturn(List.of(new AppointmentEntity()));
        List<AppointmentEntity> result = appointmentService.findAllFilteredBy(filter);
        assertEquals(1, result.size());
    }
}
