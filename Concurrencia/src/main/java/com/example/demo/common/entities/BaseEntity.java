package com.example.demo.common.entities;

import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

@MappedSuperclass
@Getter
@Setter
public class BaseEntity {
    @Id
    @UuidGenerator
    protected String id;
}
