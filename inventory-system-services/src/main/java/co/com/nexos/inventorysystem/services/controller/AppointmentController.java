package co.com.nexos.inventorysystem.services.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import co.com.nexos.inventorysystem.services.exception.NexosException;
import co.com.nexos.inventorysystem.services.model.entity.AppointmentEntity;
import co.com.nexos.inventorysystem.services.model.service.AppointmentService;
import co.com.nexos.inventorysystem.services.util.Methods;
import co.com.nexos.inventorysystem.services.util.converter.ParameterConverter;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;


@RequiredArgsConstructor
@RestController
@RequestMapping("api/appointment")
public class AppointmentController {
    private final AppointmentService appointmentService;

    @Operation(
        summary = "Retrieve or list appointments",
        description = """
            Retrieves an appointment by ID or lists appointments filtered by parameters.
            Args:
            - id (optional): Appointment ID. If provided, retrieves a single appointment; otherwise, performs a filtered search.
            - request: HTTP request containing query parameters for filtering. Parameters should match attributes in AppointmentEntity.
            Returns: A single appointment or a list of appointments.
            Notes:
            1. All filtering parameters are optional.
            2. Filtering is based on any combination of parameters that match attributes in AppointmentEntity.
            3. If no parameters match any field in the class, an empty or default result may be returned.
        """)
    @GetMapping(value = {"", "/{id}"})
    private ResponseEntity<?> get(@PathVariable(required = false) Long id, HttpServletRequest request) throws NexosException {
        ParameterConverter parameterConverter = new ParameterConverter(AppointmentEntity.class);
        AppointmentEntity filter = (AppointmentEntity) parameterConverter.converter(request.getParameterMap());
        filter.setAppointmentId(id == null ? filter.getAppointmentId() : id);
        return Methods.getResponseAccordingToId(id, appointmentService.findAllFilteredBy(filter));
    }
}
