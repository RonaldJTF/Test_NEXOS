package co.com.nexos.inventorysystem.services.model.entity;

import java.io.Serializable;
import java.util.Date;

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
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@JacksonNEXOS
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "USERS", schema = "INVENTORY_SYSTEM")
public class UserEntity implements Serializable, Cloneable{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false, length = 10)
    private Long userId;

    @Column(name = "appointment_id", nullable = false, length = 10)
    private Long appointmentId;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "age", length = 3)
    private Integer age;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "hire_date", nullable = false)
    private Date hireDate;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(name = "action", nullable = false)
    private String action;

    @OneToOne
    @JoinColumn(name = "appointment_id", insertable = false, updatable = false)
    private AppointmentEntity appointment;

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
