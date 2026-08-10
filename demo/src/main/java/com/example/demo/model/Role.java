package com.example.demo.model;

import java.util.Set;

public enum Role {
    
    ROLE_USER(Set.of(
        Permission.STUDENT_READ,
        Permission.DEPARTMENT_READ
    )),
    
    ROLE_ADMIN(Set.of(
        Permission.STUDENT_READ,
        Permission.STUDENT_WRITE,
        Permission.STUDENT_DELETE,
        Permission.DEPARTMENT_READ,
        Permission.DEPARTMENT_WRITE,
        Permission.DEPARTMENT_DELETE
    ));

    private final Set<Permission> permissions;

    Role(Set<Permission> permissions) {
        this.permissions = permissions;
    }

    public Set<Permission> getPermissions() {
        return permissions;
    }
}