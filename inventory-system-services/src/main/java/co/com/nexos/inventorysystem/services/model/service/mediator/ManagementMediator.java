package co.com.nexos.inventorysystem.services.model.service.mediator;

import java.util.List;

import org.springframework.stereotype.Service;

import co.com.nexos.inventorysystem.services.config.security.register.RegisterContext;
import co.com.nexos.inventorysystem.services.exception.NexosException;
import co.com.nexos.inventorysystem.services.model.service.ProductService;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ManagementMediator {
    private final ProductService productService;

    /**
     * Deletes a specific product item using its identifier.
     * The deletion is performed through a procedure defined in the product service.
     *
     * @param productId ID of the product item to be deleted.
     * @throws NexosException if an error occurs during the deletion process.
     */
    public void deleteProduct(Long productId) throws NexosException {
        productService.deleteByProcedure(productId, RegisterContext.getRegisterDTO().getJsonAsString());
    }

    /**
     * Deletes multiple product items whose identifiers are provided in a list.
     *
     * @param productIds List of product item IDs to be deleted.
     * @throws NexosException if an error occurs while deleting any of the product items.
     */
    public void deleteProducts(List<Long> productIds) throws NexosException {
        for (Long id : productIds) {
            deleteProduct(id);
        }
    }
}
