package com.example.demo.common.entities;

import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@MappedSuperclass
@Getter
@Setter
public class Lifecycle extends BaseEntity {
    protected boolean enabled;
    protected LocalDateTime createdOn;
    protected LocalDateTime deletedOn;

    public void finishLifecycle() {
        this.enabled = false;
        this.deletedOn = LocalDateTime.now();
    }

    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Lifecycle lifecycle = (Lifecycle) o;
        return enabled == lifecycle.enabled && id.equals(lifecycle.id);
    }
}
