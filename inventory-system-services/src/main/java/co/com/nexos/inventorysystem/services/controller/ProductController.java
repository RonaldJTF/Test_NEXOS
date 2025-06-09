package co.com.nexos.inventorysystem.services.controller;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.datatables.mapping.DataTablesInput;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import co.com.nexos.inventorysystem.services.exception.NexosException;
import co.com.nexos.inventorysystem.services.model.entity.ProductEntity;
import co.com.nexos.inventorysystem.services.model.service.ProductService;
import co.com.nexos.inventorysystem.services.model.service.mediator.ManagementMediator;
import co.com.nexos.inventorysystem.services.util.Methods;
import co.com.nexos.inventorysystem.services.util.converter.ParameterConverter;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/product")
public class ProductController {
    private final ProductService productService;
    private final ManagementMediator managementMediator;

    @Operation(
        summary = "Retrieve or list product items",
        description = """
            Retrieves a specific product item by ID or lists product items filtered by parameters.
            Args:
            - id: Optional product ID (if present, retrieves a single item).
            - request: HTTP request containing query parameters for filtering (mapped to ProductEntity).
            Returns: A single product item or a list of items.
            Note:
            - All parameters are optional.
            - The method handles filtering based on any combination of parameters.
        """)
    @GetMapping(value = {"", "/{id}"})
    public ResponseEntity<?> get(@PathVariable(required = false) Long id, HttpServletRequest request) throws NexosException {
        ParameterConverter parameterConverter = new ParameterConverter(ProductEntity.class);
        ProductEntity filter = (ProductEntity) parameterConverter.converter(request.getParameterMap());
        filter.setProductId(id == null ? filter.getProductId() : id);
        return Methods.getResponseAccordingToId(id, productService.findAllFilteredBy(filter));
    }

    @Operation(
        summary = "Create a new product item",
        description = """
            Creates a new product record based on the provided ProductEntity data.
            Args:
            - productEntity: The product data to be created (validated).
            Returns: The created product item with HTTP 201 (Created) status.
        """)
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody ProductEntity productEntity) throws NexosException {
        productService.save(productEntity);
        return new ResponseEntity<>(productService.findById(productEntity.getProductId()), HttpStatus.CREATED);
    }

    @Operation(
        summary = "Update an existing product item",
        description = """
            Updates an product item based on the provided data and ID.
            Args:
            - productEntity: Updated product data (validated).
            - id: ID of the product record to update.
            Returns: The updated product item with HTTP 201 (Created) status.
            Note: If the item does not exist, the data is saved as new using the existing ID.
        """)
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@Valid @RequestBody ProductEntity productEntity, @PathVariable Long id) throws NexosException {
        ProductEntity productDB = productService.findById(id);
        if (productDB != null) {
            productEntity.setProductId(productDB.getProductId());
        }
        productService.save(productEntity);
        return new ResponseEntity<>(productService.findById(productEntity.getProductId()), HttpStatus.CREATED);
    }

    @Operation(
        summary = "Delete a single product item",
        description = """
            Deletes the product item with the specified ID.
            Args:
            - id: ID of the product record to delete.
            Returns: HTTP 204 (No Content) on successful deletion.
        """)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) throws NexosException {
        managementMediator.deleteProduct(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(
        summary = "Delete multiple product items",
        description = """
            Deletes all product items specified by the list of IDs.
            Args:
            - productIds: List of product record IDs to delete.
            Returns: HTTP 204 (No Content) on successful deletion.
        """)
    @DeleteMapping
    public ResponseEntity<?> deleteProducts(@RequestBody List<Long> productIds) throws NexosException {
        managementMediator.deleteProducts(productIds);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @Operation(
        summary = "Get paginated products",
        description = "Returns a paginated list of products using DataTables-style input"
    )
    @PostMapping(value = "/paged")
    public  ResponseEntity<?>  getPagedProducts(@RequestBody DataTablesInput input) {
        return new ResponseEntity<>(productService.findAll(input), HttpStatus.OK);
    }

    @Operation(
        summary = "Get product inventory",
        description = "Returns a limited list of products ordered by stock"
    )
    @GetMapping(value = "/inventory")
    public ResponseEntity<?> getInventory(@RequestParam(required = true) Integer limit, @RequestParam() String sortDirection){
        Pageable pageable = Methods.pageable(1, limit, "stock", sortDirection);
        return new ResponseEntity<>(productService.findAll(pageable).getContent(), HttpStatus.OK);
    }
}
