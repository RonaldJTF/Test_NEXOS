package co.com.nexos.inventorysystem.services.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.com.nexos.inventorysystem.services.exception.NexosException;
import co.com.nexos.inventorysystem.services.model.entity.UserEntity;
import co.com.nexos.inventorysystem.services.model.service.UserService;
import co.com.nexos.inventorysystem.services.util.Methods;
import co.com.nexos.inventorysystem.services.util.converter.ParameterConverter;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/user")
public class UserController{
    private final UserService userService;

    @Operation(
        summary = "Retrieve or list users",
        description = """
            Retrieves a user by ID or lists users filtered by parameters.
            Args:
            - id (optional): User ID. If provided, retrieves a single user; otherwise, performs a filtered search.
            - request: HTTP request containing query parameters for filtering. Parameters should match attributes in UserEntity.
            Returns: A single user or a list of users.
            Notes:
            1. All filtering parameters are optional.
            2. Filtering is based on any combination of parameters that match attributes in UserEntity.
            3. If no parameters match any field in the class, an empty or default result may be returned.
        """)
    @GetMapping(value = {"", "/{id}"})
    public ResponseEntity<?> get(@PathVariable(required = false) Long id, HttpServletRequest request) throws NexosException {
        ParameterConverter parameterConverter = new ParameterConverter(UserEntity.class);
        UserEntity filter = (UserEntity) parameterConverter.converter(request.getParameterMap());
        filter.setUserId(id == null ? filter.getUserId() : id);
        return Methods.getResponseAccordingToId(id, userService.findAllFilteredBy(filter));
    }
}
