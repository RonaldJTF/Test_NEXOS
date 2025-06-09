package co.com.nexos.inventorysystem.services.model.service.impl;

import co.com.nexos.inventorysystem.services.exception.NexosException;
import co.com.nexos.inventorysystem.services.model.dao.UserDAO;
import co.com.nexos.inventorysystem.services.model.entity.UserEntity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class UserServiceImplTest {

    @Mock
    private UserDAO userDAO;

    @InjectMocks
    private UserServiceImpl userService;

    private UserEntity user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new UserEntity();
        user.setUserId(1L);
        user.setAppointmentId(10L);
        user.setName("Juan Perez");
        user.setAge(30);
        user.setHireDate(new Date());
        user.setAction("U");
    }

    @Test
    void findById_shouldReturnUser() throws NexosException {
        when(userDAO.findById(1L)).thenReturn(Optional.of(user));

        UserEntity result = userService.findById(1L);

        assertNotNull(result);
        assertEquals("Juan Perez", result.getName());
    }

    @Test
    void findById_shouldThrowExceptionWhenUserNotFound() {
        when(userDAO.findById(1L)).thenReturn(Optional.empty());

        NexosException ex = assertThrows(NexosException.class, () -> userService.findById(1L));
        assertEquals("User not found", ex.getMessage());
        assertEquals(404, ex.getCode());
    }

    @Test
    void findAll_shouldReturnUserList() {
        when(userDAO.findAll()).thenReturn(List.of(user));

        List<UserEntity> result = userService.findAll();

        assertEquals(1, result.size());
        assertEquals("Juan Perez", result.get(0).getName());
    }

    @Test
    void save_shouldInsertNewUser() {
        user.setUserId(null);
        when(userDAO.save(user)).thenReturn(user);

        UserEntity result = userService.save(user);

        verify(userDAO).save(user);
        assertNotNull(result);
        assertEquals("Juan Perez", result.getName());
    }

    @Test
    void save_shouldUpdateExistingUser() {
        UserEntity spyUser = spy(user);
        doNothing().when(spyUser).onUpdate();

        when(userDAO.update(
                spyUser.getAppointmentId(),
                spyUser.getName(),
                spyUser.getAge(),
                spyUser.getHireDate(),
                spyUser.getAction(),
                spyUser.getUserId()
        )).thenReturn(1);

        UserEntity result = userService.save(spyUser);

        verify(spyUser).onUpdate();
        verify(userDAO).update(
                spyUser.getAppointmentId(),
                spyUser.getName(),
                spyUser.getAge(),
                spyUser.getHireDate(),
                spyUser.getAction(),
                spyUser.getUserId()
        );
        assertEquals("Juan Perez", result.getName());
    }

    @Test
    void deleteByProcedure_shouldSucceedWhenOneRowAffected() {
        when(userDAO.deleteByProcedure(1L, "DEL")).thenReturn(1);

        assertDoesNotThrow(() -> userService.deleteByProcedure(1L, "DEL"));
        verify(userDAO).deleteByProcedure(1L, "DEL");
    }

    @Test
    void deleteByProcedure_shouldThrowWhenRowsAffectedNotOne() {
        when(userDAO.deleteByProcedure(1L, "DEL")).thenReturn(0);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> userService.deleteByProcedure(1L, "DEL"));
        assertTrue(ex.getMessage().contains("0 rows"));
    }

    @SuppressWarnings("unchecked")
    @Test
    void findAllFilteredBy_shouldReturnFilteredUsers() {
        when(userDAO.findAll(any(Specification.class))).thenReturn(List.of(user));

        List<UserEntity> result = userService.findAllFilteredBy(user);

        assertEquals(1, result.size());
        verify(userDAO).findAll(any(Specification.class));
    }
}
