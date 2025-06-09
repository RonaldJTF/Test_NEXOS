package co.com.nexos.inventorysystem.services.model.entity;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import co.com.nexos.inventorysystem.services.config.jackson.JacksonNEXOS;
import co.com.nexos.inventorysystem.services.config.security.register.RegisterContext;
import co.com.nexos.inventorysystem.services.model.dto.RegisterDTO;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@JacksonNEXOS
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "APPOINTMENTS", schema = "INVENTORY_SYSTEM")
public class AppointmentEntity implements Serializable, Cloneable{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointment_id", nullable = false, length = 10)
    private Long appointmentId;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "action", nullable = false)
    private String action;

    @JsonIgnore
    @Transient
    private RegisterDTO registerDTO;

    @PrePersist
    void onCreate() {
        this.registerDTO = RegisterContext.getRegisterDTO();
        this.action = registerDTO.getJsonAsString();
    }

    public void onUpdate() {
        this.registerDTO = RegisterContext.getRegisterDTO();
        this.action = registerDTO.getJsonAsString();
    }
}
