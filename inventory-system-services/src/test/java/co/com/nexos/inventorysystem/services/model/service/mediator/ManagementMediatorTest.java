package co.com.nexos.inventorysystem.services.model.service.mediator;

import co.com.nexos.inventorysystem.services.config.security.register.RegisterContext;
import co.com.nexos.inventorysystem.services.exception.NexosException;
import co.com.nexos.inventorysystem.services.model.dto.RegisterDTO;
import co.com.nexos.inventorysystem.services.model.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;

import java.util.List;

import static org.mockito.Mockito.*;

class ManagementMediatorTest {

    private ProductService productService;
    private ManagementMediator managementMediator;

    @BeforeEach
    void setUp() {
        productService = mock(ProductService.class);
        managementMediator = new ManagementMediator(productService);
    }

    @Test
    void deleteProduct_shouldCallProductService() throws NexosException {
        try (MockedStatic<RegisterContext> contextMocked = mockStatic(RegisterContext.class)) {
            RegisterDTO registerDTO = mock(RegisterDTO.class);
            when(registerDTO.getJsonAsString()).thenReturn("mocked-json");
            contextMocked.when(RegisterContext::getRegisterDTO).thenReturn(registerDTO);

            managementMediator.deleteProduct(10L);

            verify(productService).deleteByProcedure(10L, "mocked-json");
        }
    }

    @Test
    void deleteProducts_shouldCallDeleteProductForEachId() throws NexosException {
        try (MockedStatic<RegisterContext> contextMocked = mockStatic(RegisterContext.class)) {
            RegisterDTO registerDTO = mock(RegisterDTO.class);
            when(registerDTO.getJsonAsString()).thenReturn("mocked-json");
            contextMocked.when(RegisterContext::getRegisterDTO).thenReturn(registerDTO);

            List<Long> ids = List.of(1L, 2L, 3L);
            managementMediator.deleteProducts(ids);

            verify(productService, times(1)).deleteByProcedure(1L, "mocked-json");
            verify(productService, times(1)).deleteByProcedure(2L, "mocked-json");
            verify(productService, times(1)).deleteByProcedure(3L, "mocked-json");
        }
    }
}
