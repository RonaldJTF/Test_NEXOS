package co.com.nexos.inventorysystem.services.model.service.impl;

import co.com.nexos.inventorysystem.services.exception.NexosException;
import co.com.nexos.inventorysystem.services.model.dao.ProductDAO;
import co.com.nexos.inventorysystem.services.model.entity.ProductEntity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.datatables.mapping.DataTablesInput;
import org.springframework.data.jpa.datatables.mapping.DataTablesOutput;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class ProductServiceImplTest {

    @Mock
    private ProductDAO productDAO;

    @InjectMocks
    private ProductServiceImpl productService;

    private ProductEntity product;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        product = spy(new ProductEntity());
        product.setProductId(1L);
        product.setName("Laptop");
        product.setStock(10L);
        product.setUserId(100L);
        product.setEntryDate(new Date());
        product.setAction("U");
    }

    @Test
    void findById_shouldReturnEntity() throws NexosException {
        when(productDAO.findById(1L)).thenReturn(Optional.of(product));

        ProductEntity result = productService.findById(1L);

        assertNotNull(result);
        assertEquals("Laptop", result.getName());
    }

    @Test
    void findById_shouldThrowExceptionWhenNotFound() {
        when(productDAO.findById(1L)).thenReturn(Optional.empty());

        NexosException ex = assertThrows(NexosException.class, () -> productService.findById(1L));
        assertEquals("Product not found", ex.getMessage());
        assertEquals(404, ex.getCode());
    }

    @Test
    void findAll_shouldReturnList() {
        when(productDAO.findAll()).thenReturn(List.of(product));

        List<ProductEntity> result = productService.findAll();

        assertEquals(1, result.size());
    }

    @Test
    void save_shouldInsertNewEntity() {
        product.setProductId(null);
        when(productDAO.save(product)).thenReturn(product);

        ProductEntity result = productService.save(product);

        assertNotNull(result);
        assertEquals("Laptop", result.getName());
        verify(productDAO).save(product);
    }

    @Test
    void save_shouldUpdateEntity() {
        doNothing().when(product).onUpdate();
        when(productDAO.update(
            product.getUserId(),
            product.getName(),
            product.getStock(),
            product.getEntryDate(),
            product.getAction(),
            product.getProductId()
        )).thenReturn(1);

        ProductEntity result = productService.save(product);

        verify(productDAO).update(
                product.getUserId(),
                product.getName(),
                product.getStock(),
                product.getEntryDate(),
                product.getAction(),
                product.getProductId()
        );
        assertEquals("Laptop", result.getName());
    }

    @Test
    void deleteByProcedure_shouldSucceedWhenOneRowAffected() {
        when(productDAO.deleteByProcedure(1L, "D")).thenReturn(1);

        assertDoesNotThrow(() -> productService.deleteByProcedure(1L, "D"));
    }

    @Test
    void deleteByProcedure_shouldThrowWhenOtherThanOneRowAffected() {
        when(productDAO.deleteByProcedure(1L, "D")).thenReturn(0);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> productService.deleteByProcedure(1L, "D"));
        assertTrue(ex.getMessage().contains("0 rows"));
    }

    @SuppressWarnings("unchecked")
    @Test
    void findAllFilteredBy_shouldReturnResults() {
        when(productDAO.findAll(any(Specification.class))).thenReturn(List.of(product));

        List<ProductEntity> result = productService.findAllFilteredBy(product);

        assertEquals(1, result.size());
        verify(productDAO).findAll(any(Specification.class));
    }

    @Test
    void findAll_dataTables_shouldReturnResults() {
        DataTablesInput input = new DataTablesInput();
        DataTablesOutput<ProductEntity> output = new DataTablesOutput<>();
        output.setData(List.of(product));

        when(productDAO.findAll(input)).thenReturn(output);

        DataTablesOutput<ProductEntity> result = productService.findAll(input);

        assertEquals(1, result.getData().size());
    }
}
